package main

import (
	"log"
	"net/http"

	"github.com/Armatorix/smallpaf/config"
	"github.com/labstack/echo/v4"
)

func main() {
	// Configuration
	cfg, err := config.FromEnv()
	if err != nil {
		log.Fatal(err)
	}
	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(cfg.Server.Address()))
}
