package actions

import (
	"encoding/json"
	"errors"
	"reflect"
)

var (
	errMissingActionType = errors.New("missing action type")

	actions = map[string]Action{
		actionAuth: &Auth{},
	}
)

type Action interface {
	Name() string
}

type actionMessage struct {
	Type string
	Data json.RawMessage
}
type ActionMessage struct {
	Action Action
}

func (am *ActionMessage) UnmarshalJSON(b []byte) error {
	var amInner actionMessage
	err := json.Unmarshal(b, &amInner)
	if err != nil {
		return err
	}

	action, ok := actions[amInner.Type]
	if !ok {
		return errMissingActionType
	}

	actionType := reflect.TypeOf(action)
	newActionPtr := reflect.New(actionType.Elem()).Interface().(Action)
	_ = json.Unmarshal(amInner.Data, newActionPtr)
	am.Action = newActionPtr

	return nil
}
