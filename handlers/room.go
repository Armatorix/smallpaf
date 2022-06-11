package handlers

import (
	"net/http"

	"github.com/Armatorix/smallpaf/model"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

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

	hasRights, usersRoom, err := ch.hasRoomAdminRights(uid, req.RoomID)
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

	room.JiraToken = usersRoom.JiraToken
	return c.JSON(http.StatusOK, room)
}

type requestCreateRoom struct {
	Name      string `json:"Name" validate:"required"`
	JiraURL   string `json:"JiraUrl"`
	JiraToken string `json:"JiraToken"`
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
			UserID:    uid,
			RoomId:    room.ID,
			JiraToken: req.JiraToken,
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

type requestPutRoomJiraToken struct {
	RoomID    uuid.UUID `param:"roomId" validate:"required"`
	JiraToken string    `json:"JiraToken"`
}

func (ch *CrudHandler) PutRoomJiraToken(c echo.Context) error {
	var req requestPutRoomJiraToken
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

	usersRoom := model.UserRoom{
		UserID:    uid,
		RoomId:    req.RoomID,
		JiraToken: req.JiraToken,
	}
	err = ch.dbClient.WithContext(c.Request().Context()).
		Model(&usersRoom).
		Where("room_id = ? AND user_id = ?", usersRoom.RoomId, usersRoom.UserID).
		Update("jira_token", usersRoom.JiraToken).Error
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}
