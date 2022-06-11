package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

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
	staticPath := "/app/public"
	err = filepath.Walk(staticPath,
		func(path string, _ os.FileInfo, _ error) error {
			routePath := path[len(staticPath):]
			e.GET(routePath, func(c echo.Context) error {
				return c.File(path)
			})
			return nil
		})
	if err != nil {
		log.Fatal(err)
	}
	e.Any("*", func(c echo.Context) error {
		return c.File("/app/public/index.html")
	})

	api.GET("/user", crudHandler.GetUser, authClient.GetMiddleware())

	auth := api.Group("/auth")
	auth.POST("/token", authHandler.SendAuthJWTToEmail)

	rooms := api.Group("/rooms", authClient.GetMiddleware())
	rooms.POST("", crudHandler.CreateRoom)

	room := rooms.Group("/:roomId")
	room.GET("", crudHandler.GetRoom)
	room.PUT("/jira-token", crudHandler.PutRoomJiraToken)
	room.PUT("/user", crudHandler.AddUserToRoom)

	tickets := room.Group("/tickets")
	tickets.POST("", crudHandler.CreateTicketInRoom)
	tickets.POST("/import", crudHandler.ImportTickets)

	ticket := room.Group("/:ticketId")
	ticket.PUT("/votes", crudHandler.AddVoteToTicket)
	ticket.POST("/reveal", crudHandler.RevealTicket)
	ticket.POST("/reset", crudHandler.ResetVoting)
	ticket.POST("/jira-apply", crudHandler.ApplyVotingToJira)

	log.Fatal(e.Start(cfg.Server.Address()))
}
