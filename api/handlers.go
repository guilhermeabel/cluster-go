package main

import (
	"fmt"
	"net/http"
)

func (app *App) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	js := `{"status": "available", "environment": %q, "version": %q}`
	js = fmt.Sprintf(js, app.env.appEnv, version)

	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(js))
}

func (app *App) echoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	word := getRandomWord()
	app.sendMessageToSQS(app.sqsClient, app.env.sqsQueue, word)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "` + word + `"}`))
}
