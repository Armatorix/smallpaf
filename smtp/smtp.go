package smtp

import (
	"net/smtp"

	"github.com/Armatorix/smallpaf/config"
)

type Client struct {
	clientEmail   string
	clientAddress string
	auth          smtp.Auth
}

func NewClient(cfg config.Smtp) *Client {
	return &Client{
		clientEmail:   cfg.From,
		clientAddress: cfg.Address(),
		auth:          smtp.PlainAuth("", cfg.From, cfg.Password, cfg.Host),
	}
}

func (c *Client) SendMessage(to, subject, msg string) error {
	msgByte := []byte(
		"From: " + c.clientEmail + "\n" +
			"To: " + to + "\n" +
			"Subject: WHERE IS MY GOLD ? XD\n" +
			"My super secret message. XDD\n\n",
	)

	// Send actual message
	return smtp.SendMail(
		c.clientAddress,
		c.auth,
		c.clientEmail,
		[]string{to},
		msgByte,
	)
}
