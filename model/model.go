package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID      uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Email   string    `gorm:"unique"`
	Rooms   []Room    `gorm:"many2many:user_rooms;"`
	Tickets []Ticket
	Votes   []Vote
}

type Room struct {
	gorm.Model
	ID      uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Name    string
	JiraUrl string
	Tickets []Ticket
}

type Ticket struct {
	gorm.Model
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	RoomId      uuid.UUID
	UserId      uuid.UUID
	JiraID      string
	Description string
	Votes       []Vote
}

type Vote struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	UserID   uuid.UUID
	TicketID uuid.UUID
	Points   int
}

type UserRoom struct {
	UserID uuid.UUID
	RoomId uuid.UUID
}
