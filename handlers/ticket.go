package handlers

import (
	"net/http"

	"github.com/Armatorix/smallpaf/model"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

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

type requestAddVoteToTicket struct {
	TicketId uuid.UUID `param:"ticketId" validate:"required"`
	Points   int       `json:"Points" validate:"required"`
}

func (ch *CrudHandler) AddVoteToTicket(c echo.Context) error {
	var req requestAddVoteToTicket
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

	hasRights, err := ch.shouldAddEstimation(uid, req.TicketId)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	vote := &model.Vote{
		UserID:   uid,
		TicketID: req.TicketId,
		Points:   req.Points,
	}
	err = ch.dbClient.WithContext(c.Request().Context()).
		FirstOrCreate(&vote, "ticket_id = ? AND user_id = ?", vote.TicketID, vote.UserID).Error
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}
