package handlers

import (
	"net/http"
	"strings"

	"github.com/Armatorix/smallpaf/jira"
	"github.com/Armatorix/smallpaf/model"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
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

	hasRights, _, err := ch.hasRoomAdminRights(uid, req.RoomID)
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

type requestImportTickets struct {
	FilterId int       `json:"FilterId" validate:"required"`
	RoomID   uuid.UUID `param:"roomId" validate:"required"`
}

func (ch *CrudHandler) ImportTickets(c echo.Context) error {
	var req requestImportTickets
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

	email, err := getEmail(c)
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
	room := model.Room{ID: req.RoomID}
	err = ch.dbClient.First(&room).Error
	if err != nil {
		return err
	}

	jiraClient, err := jira.NewClient(email, usersRoom.JiraToken, room.JiraUrl)
	if err != nil {
		return err
	}

	currentTickets := []model.Ticket{}
	err = ch.dbClient.Find(&currentTickets, "room_id = ?", req.RoomID).Error
	if err != nil {
		return err
	}
	currentTicketsMap := createTicketsJiraIDsLowerOccMap(currentTickets)
	tickets, err := jiraClient.ImportTicketsByFilter(req.FilterId)
	if err != nil {
		return err
	}
	newTickets := make([]model.Ticket, 0, len(tickets))
	for _, t := range tickets {
		if !currentTicketsMap[strings.ToLower(t.Key)] {
			newTickets = append(newTickets, model.Ticket{
				RoomId:      req.RoomID,
				UserId:      uid,
				JiraID:      t.Key,
				Description: t.Fields.Summary,
				Revealed:    false,
				JiraPoints:  0,
				TotalVoted:  0,
			})
		}
	}

	if len(newTickets) == 0 {
		return c.NoContent(http.StatusNoContent)
	}
	err = ch.dbClient.WithContext(c.Request().Context()).
		Create(&newTickets).Error
	if err != nil {
		return err
	}

	return c.NoContent(http.StatusCreated)
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

	hasRights, err := ch.haveAccessToTheTicket(uid, req.TicketId)
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
	if vote.Points != req.Points {
		vote.Points = req.Points
		err = ch.dbClient.WithContext(c.Request().Context()).
			Model(&vote).
			Where("ticket_id = ? AND user_id = ?", req.TicketId, vote.UserID).
			Update("points", vote.Points).Error
		if err != nil {
			return err
		}
	}

	return c.NoContent(http.StatusOK)
}

type requestRevealTicket struct {
	TicketId uuid.UUID `param:"ticketId" validate:"required"`
}

func (ch *CrudHandler) RevealTicket(c echo.Context) error {
	var req requestRevealTicket
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

	hasRights, err := ch.haveAccessToTheTicket(uid, req.TicketId)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	ticket := model.Ticket{
		ID: req.TicketId,
	}
	err = ch.dbClient.Model(&ticket).Update("revealed", true).Error
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

type requestResetVoting struct {
	TicketId uuid.UUID `param:"ticketId" validate:"required"`
}

func (ch *CrudHandler) ResetVoting(c echo.Context) error {
	var req requestResetVoting
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

	hasRights, err := ch.haveAccessToTheTicket(uid, req.TicketId)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	err = ch.dbClient.Transaction(func(tx *gorm.DB) error {
		vote := model.Vote{TicketID: req.TicketId}
		err = tx.Unscoped().
			Where("ticket_id = ?", req.TicketId).
			Delete(&vote).Error
		if err != nil {
			return err
		}
		ticket := model.Ticket{ID: req.TicketId}
		return tx.Model(&ticket).Updates(map[string]any{
			"revealed":    false,
			"jira_points": 0,
		}).Error

	})
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

type requestApplyVotingToJira struct {
	TicketId uuid.UUID `param:"ticketId" validate:"required"`
	RoomID   uuid.UUID `param:"roomId" validate:"required"`
	Points   int       `json:"Points"`
}

func (ch *CrudHandler) ApplyVotingToJira(c echo.Context) error {
	var req requestApplyVotingToJira
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
	email, err := getEmail(c)
	if err != nil {
		return err
	}

	hasRights, err := ch.haveAccessToTheTicket(uid, req.TicketId)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}

	hasRights, usersRoom, err := ch.hasRoomAdminRights(uid, req.RoomID)
	if err != nil {
		return err
	}
	if !hasRights {
		return c.NoContent(http.StatusUnauthorized)
	}
	room := model.Room{ID: req.RoomID}
	err = ch.dbClient.First(&room).Error
	if err != nil {
		return err
	}
	ticket := model.Ticket{ID: req.TicketId}
	err = ch.dbClient.First(&ticket).Error
	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	jiraClient, err := jira.NewClient(email, usersRoom.JiraToken, room.JiraUrl)
	if err != nil {
		return err
	}
	err = jiraClient.SetTicketPoints(ticket.JiraID, req.Points)
	if err != nil {
		return err
	}

	err = ch.dbClient.Model(&ticket).Update("jira_points", req.Points).Error
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}
