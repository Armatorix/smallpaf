package handlers

import (
	"fmt"
	"log"
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
	dbClinet *db.DB
}

func NewCrudHandler(dbClient *db.DB) *CrudHandler {
	return &CrudHandler{
		dbClinet: dbClient,
	}
}

func (ch *CrudHandler) GetAll(c echo.Context) error {
	uid, err := getUID(c)
	if err != nil {
		return err
	}

	var user model.User
	err = ch.dbClinet.
		Preload("Rooms").
		Preload("Tickets").
		Preload("Votes").
		WithContext(c.Request().Context()).
		Find(&user, "id = ?", uid).Error
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, user)
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
	err = ch.dbClinet.Transaction(func(tx *gorm.DB) error {
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
	log.Println(room)
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
