package config

import (
	"fmt"

	"github.com/caarlos0/env/v6"
)

type Smtp struct {
	From     string `env:"SMTP_FROM,required"`
	Password string `env:"SMTP_PASSWORD,required"`
	Host     string `env:"SMTP_HOST,required"`
	Port     int    `env:"SMTP_PORT" envDefault:"587"`
}

func (s *Smtp) Address() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}

type Server struct {
	Port int `env:"PORT" envDefault:"8080"`
}

func (s *Server) Address() string {
	return fmt.Sprintf(":%d", s.Port)
}

type Config struct {
	Smtp   Smtp
	Server Server
}

func FromEnv() (*Config, error) {
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		return nil, fmt.Errorf("env parsing: %w", err)
	}
	return cfg, nil
}
