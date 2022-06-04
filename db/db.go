package db

import (
	"github.com/Armatorix/smallpaf/config"
	"github.com/Armatorix/smallpaf/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB struct {
	db *gorm.DB
}

func NewClient(cfg config.DB) (*DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.DSN))
	if err != nil {
		return nil, err
	}
	return &DB{db}, nil
}

func (db *DB) Migrate() error {
	if err := db.db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`).Error; err != nil {
		return err
	}
	return db.db.AutoMigrate(&model.User{}, &model.Room{}, &model.Ticket{}, &model.Vote{})
}
