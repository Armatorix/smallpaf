package db

import (
	"github.com/Armatorix/smallpaf/config"
	"github.com/Armatorix/smallpaf/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB struct {
	*gorm.DB
}

func NewClient(cfg config.DB) (*DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DSN))
	if err != nil {
		return nil, err
	}
	return &DB{db}, nil
}

func (db *DB) Migrate() error {
	// FIXME: dummy fix for migrations to not run multiple times
	if db.Exec(`SELECT * FROM users LIMIT 1`).Error != nil {
		if err := db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).Error; err != nil {
			return err
		}
		db.AutoMigrate(&model.User{}, &model.Room{}, &model.Ticket{}, &model.Vote{})
	}

	if !db.Migrator().HasColumn(&model.UserRoom{}, "JiraToken") {
		return db.Migrator().AddColumn(&model.UserRoom{}, "JiraToken")
	}
	return nil
}
