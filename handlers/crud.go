package handlers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/Armatorix/smallpaf/db"
	"github.com/Armatorix/smallpaf/model"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

var (
	errUserTokenMissing = fmt.Errorf("failed to get user token")
	errUserClaimMissing = fmt.Errorf("failed to get user claims")
	errUserUIDMissing   = fmt.Errorf("failed to get user uid")
)

type CrudHandler struct {
	dbClient *db.DB
}

func NewCrudHandler(dbClient *db.DB) *CrudHandler {
	return &CrudHandler{
		dbClient: dbClient,
	}
}

func (ch *CrudHandler) GetUser(c echo.Context) error {
	uid, err := getUID(c)
	if err != nil {
		return err
	}

	var user model.User
	err = ch.dbClient.
		Preload("Rooms").
		WithContext(c.Request().Context()).
		Find(&user, "id = ?", uid).Error
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}

type requestGetRoom struct {
	RoomID uuid.UUID `param:"roomId" validate:"required"`
}

func (ch *CrudHandler) GetRoom(c echo.Context) error {
	var req requestGetRoom
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	uid, err := getUID(c)
	if err != nil {
		return err
	}

	hasRights, err := ch.hasRoomAdminRights(uid, req.RoomID)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	var room model.Room
	err = ch.dbClient.
		Preload("Tickets").
		WithContext(c.Request().Context()).
		Find(&room, "id = ?", req.RoomID).Error
	if err != nil {
		return err
	}
	err = ch.dbClient.
		Raw("SELECT email FROM users WHERE id IN (SELECT user_id as id FROM user_rooms WHERE room_id = ?)", room.ID).
		Pluck("email", &room.UserEmails).Error
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, room)
}

type requestCreateRoom struct {
	Name    string `json:"Name" validate:"required"`
	JiraURL string `json:"JiraUrl"`
}

func (ch *CrudHandler) CreateRoom(c echo.Context) error {
	var req requestCreateRoom
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	uid, err := getUID(c)
	if err != nil {
		return err
	}
	room := model.Room{
		Name:    req.Name,
		JiraUrl: req.JiraURL,
	}
	err = ch.dbClient.Transaction(func(tx *gorm.DB) error {
		err = tx.Create(&room).Error
		if err != nil {
			return err
		}
		userRoom := model.UserRoom{
			UserID: uid,
			RoomId: room.ID,
		}
		return tx.Create(&userRoom).Error
	})
	if err != nil {
		return err
	}
	room.Tickets = make([]model.Ticket, 0)
	room.UserEmails = make([]string, 0)
	return c.JSON(http.StatusCreated, room)
}

func getUID(c echo.Context) (uuid.UUID, error) {
	token, ok := c.Get("user").(*jwt.Token)
	if !ok {
		return uuid.Nil, errUserTokenMissing
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return uuid.Nil, errUserClaimMissing
	}
	uid, ok := claims["uid"].(string)
	if !ok {
		return uuid.Nil, errUserUIDMissing
	}
	return uuid.Parse(uid)
}

type requestAddUserToRoom struct {
	UserEmail string    `json:"Email" validate:"email,required"`
	RoomID    uuid.UUID `param:"roomId" validate:"required"`
}

func (ch *CrudHandler) AddUserToRoom(c echo.Context) error {
	var req requestAddUserToRoom
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	uid, err := getUID(c)
	if err != nil {
		return err
	}

	hasRights, err := ch.hasRoomAdminRights(uid, req.RoomID)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	newUser := model.User{Email: req.UserEmail}
	err = ch.dbClient.WithContext(c.Request().Context()).
		FirstOrCreate(&newUser, "email = ?", newUser.Email).Error
	if err != nil {
		return err
	}

	err = ch.dbClient.WithContext(c.Request().Context()).
		Create(&model.UserRoom{
			UserID: newUser.ID,
			RoomId: req.RoomID,
		}).Error
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

type requestCreateTicketInRoom struct {
	JiraID      string    `json:"JiraID" validate:"required"`
	Description string    `json:"Description"`
	RoomID      uuid.UUID `param:"roomId" validate:"required"`
}

func (ch *CrudHandler) CreateTicketInRoom(c echo.Context) error {
	var req requestCreateTicketInRoom
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	uid, err := getUID(c)
	if err != nil {
		return err
	}

	hasRights, err := ch.hasRoomAdminRights(uid, req.RoomID)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	ticket := &model.Ticket{
		RoomId:      req.RoomID,
		UserId:      uid,
		JiraID:      req.JiraID,
		Description: req.Description,
	}
	err = ch.dbClient.WithContext(c.Request().Context()).
		Create(&ticket).Error
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, ticket)
}

func (ch *CrudHandler) hasRoomAdminRights(uid uuid.UUID, rid uuid.UUID) (bool, error) {
	ur := model.UserRoom{
		UserID: uid,
		RoomId: rid,
	}
	err := ch.dbClient.First(&ur).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}
