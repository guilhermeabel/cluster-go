package main

import (
	"api/internal/models"
	"context"
	"database/sql"
	"flag"
	"fmt"
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
	users      *models.UserModel
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

	dsn := flag.String("dsn", os.Getenv("MYSQL_USER")+":"+os.Getenv("MYSQL_PASSWORD")+"@tcp("+os.Getenv("MYSQL_HOST")+":"+os.Getenv("MYSQL_PORT")+")/"+os.Getenv("MYSQL_DATABASE")+"?parseTime=true", "MySQL data source name")
	flag.Parse()

	fmt.Printf("DSN: %s\n", *dsn)

	db, err := openDB(*dsn)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	app := &App{
		env:        environment,
		logger:     logger,
		sqsClient:  sqsClient,
		lastAccess: lastAccess,
		users:      &models.UserModel{DB: db},
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

func openDB(dsn string) (*sql.DB, error) {
	var err error

	for i := 0; i < 5; i++ {
		db, err := sql.Open("mysql", dsn)
		if err != nil {
			return nil, err
		}

		err = db.Ping()
		if err == nil {
			return db, nil
		}

		db.Close()
		time.Sleep(time.Second)
	}

	return nil, fmt.Errorf("cannot connect to database: %v", err)
}
