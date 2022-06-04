package handlers

import (
	"net/http"

	"github.com/Armatorix/smallpaf/db"
	"github.com/Armatorix/smallpaf/model"
	"github.com/labstack/echo/v4"
)

type CrudHandler struct {
	dbClinet *db.DB
}

func NewCrudHandler(dbClient *db.DB) *CrudHandler {
	return &CrudHandler{
		dbClinet: dbClient,
	}
}

type requestCreateRoom struct {
	Name    string `json:"name", required`
	JiraURL string `json:"jira_url"`
}

func (ch *CrudHandler) CreateRoom(c echo.Context) error {
	var req requestCreateRoom
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	room := model.Room{
		Name:    req.Name,
		JiraUrl: req.JiraURL,
	}
	err := ch.dbClinet.
		Create(&room).Error
	if err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, room)
}
