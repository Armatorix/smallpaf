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
	JiraToken  string   `gorm:"-"`
}

type Ticket struct {
	gorm.Model
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	RoomId      uuid.UUID
	UserId      uuid.UUID
	JiraID      string
	Description string
	Revealed    bool
	JiraPoints  int
	Votes       []Vote `gorm:"constraint:OnDelete:CASCADE;"`
}

func (t *Ticket) AfterFind(tx *gorm.DB) (err error) {
	err = tx.Find(&t.Votes, "ticket_id = ?", t.ID).Error
	if err != nil {
		return err
	}
	for i, vote := range t.Votes {
		user := User{
			ID: vote.UserID,
		}
		err := tx.Find(&user).Error
		if err != nil {
			return err
		}
		t.Votes[i].UserEmail = user.Email
	}
	if !t.Revealed {
		for i := range t.Votes {
			t.Votes[i].Points = 0
		}
	}
	return nil
}

type Vote struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
	UserID    uuid.UUID `gorm:"index:idx_one_vote_per_ticket,unique"`
	TicketID  uuid.UUID `gorm:"index:idx_one_vote_per_ticket,unique"`
	Points    int
	UserEmail string `gorm:"-"`
}

type UserRoom struct {
	UserID    uuid.UUID
	RoomId    uuid.UUID
	JiraToken string
}
