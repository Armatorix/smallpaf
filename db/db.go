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
	return db.db.AutoMigrate(&model.Room{})
}
