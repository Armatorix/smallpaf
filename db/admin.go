package db

import (
	"errors"

	"github.com/Armatorix/smallpaf/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (db *DB) HasRoomAdminRights(uid uuid.UUID, rid uuid.UUID) (bool, *model.UserRoom, error) {
	ur := model.UserRoom{
		UserID: uid,
		RoomId: rid,
	}
	err := db.First(&ur, "user_id = ? AND room_id = ?", uid, rid).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil, nil
		}
		return false, nil, err
	}
	return true, &ur, nil
}
