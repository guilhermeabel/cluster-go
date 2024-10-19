package main

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

func (app *App) sendMessageToSQS(client *sqs.Client, queueUrl string, messageBody string) error {
	deduplicationId := strconv.FormatInt(time.Now().UnixNano(), 10)
	app.logger.Printf("Deduplication ID: %s", deduplicationId)

	input := &sqs.SendMessageInput{
		MessageBody:            aws.String(messageBody),
		MessageGroupId:         aws.String("messageGroup1"),
		QueueUrl:               aws.String(queueUrl),
		MessageDeduplicationId: aws.String(deduplicationId),
	}

	app.logger.Println("Sending message to SQS")

	output, err := client.SendMessage(context.TODO(), input)
	if err != nil {
		app.logger.Println(err)
		return err
	}

	app.logger.Println("Message sent to SQS")
	fmt.Println("Message ID:", *output.MessageId)

	fmt.Println("Message sent successfully!")
	return nil
}
