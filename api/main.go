package main

import (
	"context"
	"log"
	"os"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"golang.org/x/exp/rand"
)

const version = "1.0.0"
const appName = "API-SERVICE"

type EnvironmentVariables struct {
	appName         string
	appEnv          string
	appVersion      string
	appPort         int
	messagesToFetch int
	waitTime        int
	messageTimeout  time.Duration
	sqsQueue        string
	sqsRegion       string
}

type App struct {
	env        *EnvironmentVariables
	logger     *log.Logger
	sqsClient  *sqs.Client
	mu         sync.Mutex
	lastAccess map[string]time.Time
}

func main() {
	environment := &EnvironmentVariables{
		appName:         "API-SERVICE",
		appEnv:          "development",
		appPort:         9002,
		appVersion:      "1.0.0",
		waitTime:        10,
		messageTimeout:  20 * time.Second,
		messagesToFetch: 1,
		sqsQueue:        os.Getenv("AWS_SQS_QUEUE_URL"),
		sqsRegion:       os.Getenv("AWS_REGION"),
	}

	awsCfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(environment.sqsRegion))
	if err != nil {
		log.Fatalf("unable to load AWS SDK config, %v", err)
	}

	sqsClient := sqs.NewFromConfig(awsCfg)
	lastAccess := make(map[string]time.Time)

	logger := log.New(log.Writer(), "\n"+appName+": ", log.LstdFlags)

	app := &App{
		env:        environment,
		logger:     logger,
		sqsClient:  sqsClient,
		lastAccess: lastAccess,
	}

	app.logger.Printf("Initializing, port: %d", app.env.appPort)

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
