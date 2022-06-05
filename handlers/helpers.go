package handlers

import (
	"errors"

	"github.com/Armatorix/smallpaf/model"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

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
