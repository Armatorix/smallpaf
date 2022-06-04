package handlers

import (
	"log"

	"github.com/Armatorix/smallpaf/auth"
	"github.com/Armatorix/smallpaf/db"
	"github.com/Armatorix/smallpaf/model"
	"github.com/Armatorix/smallpaf/smtp"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	authClient *auth.Authenticator
	smtpClient *smtp.Client
	dbClient   *db.DB
}

func NewAuthHandler(ac *auth.Authenticator, sc *smtp.Client, dc *db.DB) *AuthHandler {
	return &AuthHandler{
		authClient: ac,
		smtpClient: sc,
		dbClient:   dc,
	}
}

type requestAuthCreate struct {
	Email string `json:"Email" validate:"email,required"`
}

func (ah *AuthHandler) SendAuthJWTToEmail(c echo.Context) error {
	var req requestAuthCreate
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := c.Validate(req); err != nil {
		return err
	}

	var user model.User
	err := ah.dbClient.
		WithContext(c.Request().Context()).
		FirstOrCreate(&user, model.User{Email: req.Email}).
		Error
	if err != nil {
		return err
	}

	token, err := ah.authClient.GenerateJWT(&user)
	if err != nil {
		return err
	}

	err = ah.smtpClient.SendAuthLink(req.Email, token)
	if err != nil {
		log.Println(err)
	}
	return err
}
