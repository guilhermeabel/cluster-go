package main

import (
	"fmt"
	"net/http"
	"time"
)

func (app *App) NewServer() *http.Server {
	router := app.loadRoutes(http.NewServeMux())

	middlewareChain := NewChain(
		app.recoverPanic,
		app.logRequest,
		app.secureHeaders,
		app.enableCors,
	)

	return &http.Server{
		Addr:         fmt.Sprintf(":%d", app.config.port),
		Handler:      middlewareChain(router),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
}

func (app *App) loadRoutes(mux *http.ServeMux) http.HandlerFunc {
	mux.HandleFunc("/v1/healthcheck", app.healthcheckHandler)
	mux.HandleFunc("/v1/echo", app.echoHandler)
	mux.HandleFunc("/v1/ping", app.pingHandler)

	return mux.ServeHTTP
}

type Middleware func(http.HandlerFunc) http.HandlerFunc

func NewChain(middlewares ...Middleware) Middleware {
	return func(handler http.HandlerFunc) http.HandlerFunc {
		for _, middleware := range middlewares {
			handler = middleware(handler)
		}
		return handler
	}
}
