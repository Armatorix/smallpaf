package handlers

import (
	"errors"

	"github.com/Armatorix/smallpaf/model"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func (ch *CrudHandler) hasRoomAdminRights(uid uuid.UUID, rid uuid.UUID) (bool, *model.UserRoom, error) {
	ur := model.UserRoom{
		UserID: uid,
		RoomId: rid,
	}
	err := ch.dbClient.First(&ur).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil, nil
		}
		return false, nil, err
	}
	return true, &ur, nil
}

func (ch *CrudHandler) haveAccessToTheTicket(uid uuid.UUID, tid uuid.UUID) (bool, error) {
	res := ch.dbClient.Raw("SELET * FROM user_rooms WHERE room_id = (SELECT room_id FROM tickets WHERE ticket_id = ?) AND user_id = ?", tid, uid)
	if res.Error != nil {
		if errors.Is(res.Error, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, res.Error
	}
	return true, nil
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
