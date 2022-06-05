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
	crudHandler := handlers.NewCrudHandler(dbClient)

	e := echo.New()
	e.Use(
		middleware.Recover(),
		middleware.CORS(),
		middleware.Logger(),
	)

	e.Validator = &V{validator.New()}
	api := e.Group("/api/v1")
	api.GET("/healthcheck", func(c echo.Context) error {
		return c.JSONBlob(http.StatusOK, []byte(`{"status":"ok"}`))
	})

	// static for react
	e.Static("", "react")
	// e.Any("*", func(c echo.Context) error { return c.File("react/index.html") })

	api.GET("/user", crudHandler.GetUser, authClient.GetMiddleware())

	auth := api.Group("/auth")
	auth.POST("/token", authHandler.SendAuthJWTToEmail)

	rooms := api.Group("/rooms", authClient.GetMiddleware())
	rooms.POST("", crudHandler.CreateRoom)

	room := rooms.Group("/:roomId")
	room.GET("", crudHandler.GetRoom)
	room.PUT("/user", crudHandler.AddUserToRoom)
	room.POST("/tickets", crudHandler.CreateTicketInRoom)
	room.PUT("/tickets/:ticketId/votes", crudHandler.AddVoteToTicket)

	log.Fatal(e.Start(cfg.Server.Address()))
}
