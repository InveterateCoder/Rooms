using System.Collections.Generic;

namespace Rooms.Models
{
    public class State
    {
        private readonly Dictionary<long, ActiveRoom> _activeRooms = new Dictionary<long, ActiveRoom>();
        private readonly Dictionary<string, long> _activeUsers = new Dictionary<string, long>();
        public int ActiveRoomsCount
        {
            get
            {
                lock (_activeRooms)
                    return _activeRooms.Count;
            }
        }
        public IEnumerable<long> ActiveRoomsKeys
        {
            get
            {
                lock (_activeRooms)
                    return _activeRooms.Keys;
            }
        }
        public ActiveRoom GetRoom(long roomId)
        {
            lock(_activeRooms)
                return _activeRooms[roomId];
        }
        public ActiveRoom ConnectUser(long userId, string guid, string name, string icon, string connectionId, long roomId)
        {
            ActiveRoom room;
            lock (_activeRooms)
            {
                if (_activeRooms.ContainsKey(roomId))
                    room = _activeRooms[roomId];
                else
                {
                    room = new ActiveRoom();
                    _activeRooms[roomId] = room;
                }
                room.AddUser(connectionId, name, icon, userId, guid);
            }
            _activeUsers[connectionId] = roomId;
            return room;
        }
        public UsersRoom DisconnectUser(string connectionId)
        {
            UsersRoom data = new UsersRoom()
            {
                room = null,
                removed = false
            };
            lock (_activeRooms)
            {
                if(!_activeUsers.ContainsKey(connectionId)) return data;
                data.room = _activeRooms[_activeUsers[connectionId]];
                var user = data.room.UserByConnectionId(connectionId);
                if (user.RemoveConnection(connectionId) == 0)
                    if (data.room.RemoveUser(user) == 0)
                    {
                        _activeRooms.Remove(_activeUsers[connectionId]);
                        _activeUsers.Remove(connectionId);
                        data.removed = true;
                    }
            }
            _activeUsers.Remove(connectionId);
            return data;
        }
    }
    public struct UsersRoom
    {
        public ActiveRoom room;
        public bool removed;
    }
}