package main

import (
	"log"
	"net/smtp"

	"github.com/Armatorix/smallpaf/config"
)

func main() {
	// Configuration
	cfg, err := config.FromEnv()
	if err != nil {
		log.Fatal(err)
	}
	to := "sokolwojtek1@gmail.com"

	message := []byte(
		"From: " + cfg.Smtp.From + "\n" +
			"To: " + to + "\n" +
			"Subject: WHERE IS MY GOLD ? XD\n" +
			"My super secret message. XDD\n\n",
	)

	log.Println(cfg)
	// Send actual message
	err = smtp.SendMail(cfg.Smtp.Address(),
		smtp.PlainAuth("", cfg.Smtp.From, cfg.Smtp.Password, cfg.Smtp.Host),
		cfg.Smtp.From,
		[]string{to},
		message)
	if err != nil {
		log.Fatal(err)
	}
}
