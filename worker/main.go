package main

import (
	"context"
	"flag"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

type EnvironmentVariables struct {
	appName         string
	appEnv          string
	appVersion      string
	messagesToFetch int
	waitTime        int
	messageTimeout  time.Duration
	sqsQueue        string
	sqsRegion       string
	sleepTime       time.Duration
}

type App struct {
	env       *EnvironmentVariables
	logger    *log.Logger
	sqsClient *sqs.Client
}

func main() {
	environment := &EnvironmentVariables{
		appName:         "WORKER-SERVICE",
		appEnv:          "development",
		appVersion:      "1.0.0",
		waitTime:        10,
		messageTimeout:  20 * time.Second,
		messagesToFetch: 1,
		sqsQueue:        os.Getenv("AWS_SQS_QUEUE_URL"),
		sqsRegion:       os.Getenv("AWS_REGION"),
		sleepTime:       1 * time.Second,
	}

	flag.StringVar(&environment.appEnv, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(environment.sqsRegion))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	sqsClient := sqs.NewFromConfig(cfg)

	logger := log.New(log.Writer(), environment.appName+": ", log.LstdFlags)

	app := &App{
		env:       environment,
		logger:    logger,
		sqsClient: sqsClient,
	}

	app.logger.Printf("Initializing in %s env, fetching messages.", app.env.appEnv)

	for {
		err := app.fetchAndProcessMessages(sqsClient)
		if err != nil {
			log.Printf("error fetching messages: %v", err)
		}

		time.Sleep(5 * time.Second)
	}
}

func (app *App) fetchAndProcessMessages(client *sqs.Client) error {
	resp, err := client.ReceiveMessage(context.TODO(), &sqs.ReceiveMessageInput{
		QueueUrl:            aws.String(app.env.sqsQueue),
		MaxNumberOfMessages: int32(app.env.messagesToFetch),
		WaitTimeSeconds:     int32(app.env.waitTime),
		VisibilityTimeout:   int32(app.env.messageTimeout.Seconds()),
	})

	if err != nil {
		app.logger.Printf("Failed to receive messages: %v\n", err)
		return err
	}

	for _, message := range resp.Messages {
		app.logger.Printf("Processing message: %s\n\n", *message.Body)

		err := app.processMessage(message.Body)
		if err != nil {
			app.logger.Printf("Failed to process message: %v\n", err)
			continue
		}

		_, err = client.DeleteMessage(context.TODO(), &sqs.DeleteMessageInput{
			QueueUrl:      aws.String(app.env.sqsQueue),
			ReceiptHandle: message.ReceiptHandle,
		})
		if err != nil {
			app.logger.Printf("Failed to delete message: %v\n", err)
		}

		time.Sleep(app.env.sleepTime)
	}

	return nil
}

func (app *App) processMessage(message *string) error {
	app.logger.Printf("Doing work on message: %s\n", *message)

	return nil
}
