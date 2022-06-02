package smtp

import (
	"fmt"
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

func (c *Client) SendAuthLink(to, link string) error {
	return c.SendMessage(to, "SmallPAF auth link", link)
}

func (c *Client) SendMessage(to, subject, msg string) error {
	msgByte := []byte(
		fmt.Sprintf(`From: <SmallPaf %s>
To: %s
Subject: %s
Cc:
Content-Type: text/html

<body>%s<body>


`, c.clientEmail, to, subject, msg),
	)
	fmt.Println(string(msgByte))

	// Send actual message
	return smtp.SendMail(
		c.clientAddress,
		c.auth,
		c.clientEmail,
		[]string{to},
		msgByte,
	)
}
