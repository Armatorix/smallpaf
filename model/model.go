package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID    uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Email string    `gorm:"unique"`
	Rooms []Room    `gorm:"many2many:user_rooms;"`
	Votes []Vote
}

type Room struct {
	gorm.Model
	ID         uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	Name       string
	JiraUrl    string
	Tickets    []Ticket
	UserEmails []string `gorm:"-"`
}

type Ticket struct {
	gorm.Model
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	RoomId      uuid.UUID
	UserId      uuid.UUID
	JiraID      string
	Description string
	Revealed    bool
	TotalVoted  int `gorm:"-"`
	Votes       []Vote
}

func (t *Ticket) AfterFind(tx *gorm.DB) (err error) {
	err = tx.Raw("SELECT COUNT(*) FROM votes WHERE ticket_id = ?", t.ID).
		Scan(&t.TotalVoted).Error
	if err != nil {
		return err
	}
	if t.Revealed {
		return tx.Find(&t.Votes, "ticket_id = ?", t.ID).Error
	}
	return nil
}

type Vote struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	UserID   uuid.UUID `gorm:"index:idx_one_vote_per_ticket,unique"`
	TicketID uuid.UUID `gorm:"index:idx_one_vote_per_ticket,unique"`
	Points   int
}

type UserRoom struct {
	UserID    uuid.UUID
	RoomId    uuid.UUID
	JiraToken string
}
