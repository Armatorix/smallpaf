package ws

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/Armatorix/smallpaf/auth"
	"github.com/Armatorix/smallpaf/db"
	"github.com/Armatorix/smallpaf/handlers/ws/actions"
	"github.com/gofrs/uuid"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	errRequireAuth = errors.New("require auth")
)

type WebSockerHandler struct {
	dbClient   *db.DB
	authClient *auth.Authenticator
}

func NewWebSockerHandler(dbClient *db.DB, authClient *auth.Authenticator) *WebSockerHandler {
	return &WebSockerHandler{
		dbClient:   dbClient,
		authClient: authClient,
	}
}

type requestRoomWS struct {
	RoomID uuid.UUID `param:"roomId" validate:"required"`
}

func (wsh *WebSockerHandler) WS(c echo.Context) error {
	var req requestRoomWS
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	var msg actions.ActionMessage
	err = conn.ReadJSON(&msg)
	if err != nil {
		return err
	}

	authAction, ok := msg.Action.(*actions.Auth)
	if !ok {
		return errRequireAuth
	}
	claims, err := wsh.authClient.ParseAndValidateJWT(authAction.Token)
	fmt.Println(claims, err)

	// validate user
	// wsh.dbClient.HasRoomAdminRights()

	// validate if user is from the room
	//get roomHub from the handler (or create if not exists)

	// client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	// client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	// go client.writePump()
	// go client.readPump()
	return nil
}
