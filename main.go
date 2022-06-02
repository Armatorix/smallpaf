package main

import (
	"log"
	"net/http"

	"github.com/Armatorix/smallpaf/auth"
	"github.com/Armatorix/smallpaf/config"
	"github.com/Armatorix/smallpaf/smtp"
	"github.com/labstack/echo/v4"
)

type requestAuthCreate struct {
	Email string
}

type respondAuthCreacte struct {
	JWT string
}

func main() {
	// Configuration
	cfg, err := config.FromEnv()
	if err != nil {
		log.Fatal(err)
	}

	smtpClient := smtp.NewClient(cfg.Smtp)
	authClient := auth.NewAuth(&cfg.Auth)
	e := echo.New()

	e.GET("/", func(c echo.Context) error {
		return c.JSONBlob(http.StatusOK, []byte(`{"status":"ok"}`))
	})
	auth := e.Group("/auth")
	auth.POST("/token", func(c echo.Context) error {
		token, err := authClient.GenerateJWT("XDDDDD")
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, respondAuthCreacte{
			JWT: token,
		})
	})

	room := e.Group("/room/:roomId", authClient.GetMiddleware())
	room.GET("", func(c echo.Context) error {
		return c.String(http.StatusOK, "XD")
	})
	// unused
	log.Println(smtpClient)

	log.Fatal(e.Start(cfg.Server.Address()))
}
