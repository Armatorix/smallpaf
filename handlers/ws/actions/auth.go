package actions

const actionAuth = "auth"

type Auth struct {
	Token string
}

func (a *Auth) Name() string {
	return actionAuth
}
