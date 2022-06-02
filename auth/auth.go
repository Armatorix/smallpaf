package auth

import (
	"time"

	"github.com/Armatorix/smallpaf/config"
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
		secretKey:     []byte(cfg.SecretKey),
		signingMethod: jwt.SigningMethodHS256,
	}
}

type Claims struct {
	jwt.RegisteredClaims
	Email string
	UID   uuid.UUID
}

func (a *Authenticator) GenerateJWT(email string) (string, error) {
	c := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "smallpaf-server",
			Audience:  jwt.ClaimStrings{a.audience},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24 * 31)),
			NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Email: email,
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
