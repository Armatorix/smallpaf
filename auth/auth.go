package auth

import (
	"time"

	"github.com/Armatorix/smallpaf/config"
	"github.com/Armatorix/smallpaf/model"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Authenticator struct {
	secretKey     []byte
	audience      string
	signingMethod jwt.SigningMethod
}

func NewAuth(cfg *config.Auth) *Authenticator {
	return &Authenticator{
		audience:      "typical-user",
		secretKey:     []byte(cfg.SecretKey),
		signingMethod: jwt.SigningMethodHS256,
	}
}

type Claims struct {
	jwt.RegisteredClaims
	Email          string    `json:"email"`
	Uid            uuid.UUID `json:"uid"`
	AdditionalInfo string    `json:"additional_info"`
}

func (a *Authenticator) GenerateJWT(user *model.User) (string, error) {
	c := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "smallpaf-server",
			Audience:  jwt.ClaimStrings{a.audience},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 31)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Email:          user.Email,
		Uid:            user.ID,
		AdditionalInfo: "what are you looking for?",
	}

	token := jwt.NewWithClaims(a.signingMethod, c)
	return token.SignedString(a.secretKey)
}

func (a *Authenticator) GetMiddleware() echo.MiddlewareFunc {
	return middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey:    a.secretKey,
		SigningMethod: a.signingMethod.Alg(),
	})
}
