package handlers

import (
	"fmt"
	"net/http"

	"github.com/Armatorix/smallpaf/db"
	"github.com/Armatorix/smallpaf/model"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
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
		Preload("Votes").
		WithContext(c.Request().Context()).
		Find(&user, "id = ?", uid).Error
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
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

	hasRights, _, err := ch.hasRoomAdminRights(uid, req.RoomID)
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
