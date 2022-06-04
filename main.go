package main

import (
	"log"
	"net/http"

	"github.com/Armatorix/smallpaf/auth"
	"github.com/Armatorix/smallpaf/config"
	"github.com/Armatorix/smallpaf/db"
	"github.com/Armatorix/smallpaf/handlers"
	"github.com/Armatorix/smallpaf/smtp"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type V struct {
	Validator *validator.Validate
}

func (cv *V) Validate(i interface{}) error {
	return cv.Validator.Struct(i)
}

func main() {
	// Configuration
	cfg, err := config.FromEnv()
	if err != nil {
		log.Fatal(err)
	}
	dbClient, err := db.NewClient(cfg.DB)
	if err != nil {
		log.Fatal(err)
	}
	if err = dbClient.Migrate(); err != nil {
		log.Fatal(err)
	}

	authClient := auth.NewAuth(&cfg.Auth)
	authHandler := handlers.NewAuthHandler(
		authClient,
		smtp.NewClient(cfg.Smtp),
		dbClient,
	)

	e := echo.New()
	e.Use(middleware.CORS())

	e.Validator = &V{validator.New()}
	e.GET("/", func(c echo.Context) error {
		return c.JSONBlob(http.StatusOK, []byte(`{"status":"ok"}`))
	})

	auth := e.Group("/auth")
	auth.POST("/token", authHandler.SendAuthJWTToEmail)

	room := e.Group("/room/:roomId", authClient.GetMiddleware())
	room.GET("", func(c echo.Context) error {
		return c.String(http.StatusOK, "XD")
	})

	log.Fatal(e.Start(cfg.Server.Address()))
}
