package ws

import (
	"sync"

	"github.com/google/uuid"
)

type RoomHub struct {
	rooms map[uuid.UUID]*Room
	sync.RWMutex
}

func newRoomHub() *RoomHub {
	return &RoomHub{
		rooms: make(map[uuid.UUID]*Room),
	}
}

func (rh *RoomHub) GetRoom(roomId uuid.UUID) *Room {
	rh.RLock()
	defer rh.RUnlock()
	room, ok := rh.rooms[roomId]
	if !ok {
		rh.Lock()
		defer rh.Unlock()
		room = newRoom(roomId)
		go room.run()
		rh.rooms[roomId] = room
	}
	return room
}
