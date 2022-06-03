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
	webAddress    string
}

func NewClient(cfg config.Smtp) *Client {
	return &Client{
		clientEmail:   cfg.From,
		clientAddress: cfg.Address(),
		auth:          smtp.PlainAuth("", cfg.From, cfg.Password, cfg.Host),
		webAddress:    "http://localhost:3000",
	}
}

func (c *Client) SendAuthLink(to, token string) error {
	return c.SendMessage(to, fmt.Sprintf(`From: <SmallPaf %s>
To: %s
Subject: %s
Cc:
Content-Type: text/html


<div style="overflow:auto; max-width:1000px; text-align: center;">
<h1>Welcome in SmallPAF!</h1><br>
Open the link to start using the App with your email: <a href="%s/new-room?token=%s">link</a><br>
<b>DON'T SHARE IT WITH ANYONE!</b><br>
<img style="width: 500px;" src="https://cdn-images-1.medium.com/max/720/1*jH-WgGhgWB8zSzpnQXrVYA.png" alt="Planning meme"><br><br>
</div>

`, c.clientEmail, to, "SmallPAF auth link", c.webAddress, token),
	)
}

func (c *Client) SendMessage(to, msg string) error {
	msgByte := []byte(msg)

	// Send actual message
	return smtp.SendMail(
		c.clientAddress,
		c.auth,
		c.clientEmail,
		[]string{to},
		msgByte,
	)
}
