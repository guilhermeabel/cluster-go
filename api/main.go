package main

import (
	"context"
	"flag"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"golang.org/x/exp/rand"
)

const version = "1.0.0"
const appName = "API-SERVICE"

type appConfig struct {
	port int
	env  string
}

type App struct {
	config appConfig
	logger *log.Logger
	sqs    *SqsConfig
}

type SqsConfig struct {
	sqsClient *sqs.Client
	queueUrl  string
}

func main() {

	var cfg appConfig

	flag.IntVar(&cfg.port, "port", 9002, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.Parse()

	awsCfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(os.Getenv("AWS_REGION")))
	if err != nil {
		log.Fatalf("unable to load AWS SDK config, %v", err)
	}

	sqsClient := sqs.NewFromConfig(awsCfg)

	logger := log.New(log.Writer(), appName+": ", log.LstdFlags)

	app := &App{
		config: cfg,
		logger: logger,
		sqs: &SqsConfig{
			sqsClient: sqsClient,
			queueUrl:  os.Getenv("AWS_SQS_QUEUE_URL"),
		},
	}

	app.logger.Printf("Initializing, port: %d", app.config.port)

	err = app.NewServer().ListenAndServe()

	if err != nil {
		app.logger.Fatal(err)
	}
}

func getRandomWord() string {
	words := []string{
		"apple",
		"banana",
		"cherry",
		"date",
		"elderberry",
		"fig",
		"grape",
		"honeydew",
		"kiwi",
		"lemon",
		"mango",
		"nectarine",
		"orange",
		"pear",
		"quince",
		"raspberry",
		"strawberry",
		"tangerine",
		"ugli",
		"vanilla",
		"watermelon",
		"ximenia",
		"yuzu",
		"zucchini",
	}
	return words[getRandomNumber(0, len(words)-1)]
}

func getRandomNumber(min, max int) int {
	return min + rand.Intn(max-min)
}
