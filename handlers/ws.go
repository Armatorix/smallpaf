package handlers

import (
	"fmt"

	"github.com/Armatorix/smallpaf/db"
	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

type WebSockerHandler struct {
	dbClient *db.DB
}

func NewWebSockerHandler(dbClient *db.DB) *WebSockerHandler {
	return &WebSockerHandler{
		dbClient: dbClient,
	}
}
func (wsh *WebSockerHandler) WS(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()
		for {
			// Write
			err := websocket.Message.Send(ws, "Hello, Client!")
			if err != nil {
				c.Logger().Error(err)
			}

			// Read
			msg := ""
			err = websocket.Message.Receive(ws, &msg)
			if err != nil {
				c.Logger().Error(err)
			}
			fmt.Printf("%s\n", msg)
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}
