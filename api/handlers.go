package main

import (
	"api/internal/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
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

func (app *App) getUsersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	users, err := app.users.All()
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = writeJSON(w, http.StatusOK, users)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (app *App) createUserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	body, _ := io.ReadAll(r.Body)
	payload := make(map[string]string)
	json.Unmarshal(body, &payload)

	user := &models.User{
		Name:     payload["name"],
		Email:    payload["email"],
		Document: payload["document"],
		Phone:    payload["phone"],
	}

	err := app.users.Insert(user.Name, user.Email, "password", user.Phone, user.Document)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = writeJSON(w, http.StatusCreated, user)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (app *App) getUserContactsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.FormValue("id")
	if id == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	exists, err := app.users.Exists(userID)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if !exists {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	contacts, err := app.users.Contacts(userID)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = writeJSON(w, http.StatusOK, contacts)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (app *App) createUserContactHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id := r.FormValue("id")
	if id == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	exists, err := app.users.Exists(userID)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if !exists {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	contact := &models.User{
		Name:  r.FormValue("name"),
		Email: r.FormValue("email"),
	}

	err = app.users.InsertContact(userID, contact.Name, contact.Email)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = writeJSON(w, http.StatusCreated, contact)
	if err != nil {
		app.logger.Print(err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}
