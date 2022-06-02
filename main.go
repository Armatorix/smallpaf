package main

import (
	"log"
	"net/http"

	"github.com/Armatorix/smallpaf/auth"
	"github.com/Armatorix/smallpaf/config"
	"github.com/Armatorix/smallpaf/smtp"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type V struct {
	Validator *validator.Validate
}

func (cv *V) Validate(i interface{}) error {
	return cv.Validator.Struct(i)
}

type requestAuthCreate struct {
	Email string `json:"email"`
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

	e.Validator = &V{validator.New()}
	e.GET("/", func(c echo.Context) error {
		return c.JSONBlob(http.StatusOK, []byte(`{"status":"ok"}`))
	})
	auth := e.Group("/auth")
	auth.POST("/token", func(c echo.Context) error {
		var req requestAuthCreate
		if err := c.Bind(&req); err != nil {
			log.Println(err)
			return err
		}

		if err := c.Validate(req); err != nil {
			log.Println(err)
			return err
		}

		token, err := authClient.GenerateJWT("XDDDDD")
		if err != nil {
			log.Println(err)
			return err
		}

		err = smtpClient.SendAuthLink(req.Email, "http://localhost:8080/room/:roomId?token="+token)
		if err != nil {
			log.Println(err)
		}
		return err
	})

	room := e.Group("/room/:roomId", authClient.GetMiddleware())
	room.GET("", func(c echo.Context) error {
		return c.String(http.StatusOK, "XD")
	})

	log.Fatal(e.Start(cfg.Server.Address()))
}
