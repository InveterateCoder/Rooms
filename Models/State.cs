using System;
using System.Collections.Generic;
using System.Linq;

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
        public long GetRoomId(string connectionId) =>
            _activeUsers[connectionId];
        public ActiveRoom GetRoom(string connectionId) =>
            GetRoom(_activeUsers[connectionId]);
        public ActiveRoom GetRoom(long roomId)
        {
            lock (_activeRooms)
                return _activeRooms[roomId];
        }
        public string[] UserConnections(long userId)
        {
            lock (_activeRooms)
                return _activeRooms.Where(p => p.Value.User(userId, null) != null).SelectMany(p => p.Value.ConnectionsByUser(userId)).ToArray();
        }
        public string[] ChangeUser(long userId, string name = null, string icon = null)
        {
            List<string> connectionIds = new List<string>();
            lock (_activeRooms)
            {
                foreach (var (_, room) in _activeRooms)
                {
                    var user = room.User(userId, null);
                    if (user != null)
                    {
                        user.name = name ?? user.name;
                        user.icon = icon ?? user.icon;
                        connectionIds.AddRange(room.GetConnections());
                    }
                }
            }
            return connectionIds.ToArray();
        }
        public string[] Connections(long roomId)
        {
            lock (_activeRooms)
            {
                if (_activeRooms.ContainsKey(roomId))
                    return _activeRooms[roomId].GetConnections();
                else return null;
            }
        }
        public IEnumerable<RoomsMsg> GetOlderMsgs(long userId, string guid, long time, string connectionId)
        {
            lock (_activeRooms)
            {
                if (!_activeUsers.ContainsKey(connectionId)) return null;
                var room = _activeRooms[_activeUsers[connectionId]];
                lock (room)
                {
                    Func<InMemoryMessage, bool> filter;
                    if (userId > 0) filter = m => (m.accessIds == null || m.accessIds.Contains(userId)) && m.timeStamp < time;
                    else if (guid != null) filter = m => m.accessIds == null && m.timeStamp < time;
                    else throw new ArgumentNullException("At least one identifier must be provided.");
                    return room.GetMessages(true).Where(filter).Select(m => new RoomsMsg
                    {
                        Icon = m.senderIcon,
                        Secret = m.accessIds != null,
                        Sender = m.senderName,
                        Text = m.text,
                        Time = m.timeStamp
                    });
                }
            }
        }
        public string[] RemoveRoom(long roomId)
        {
            ActiveRoom room = null;
            lock (_activeRooms)
            {
                if (_activeRooms.ContainsKey(roomId))
                {
                    room = _activeRooms[roomId];
                    lock (_activeUsers)
                    {
                        var users = _activeUsers.Where(u => u.Value == roomId);
                        foreach (var user in users)
                            _activeUsers.Remove(user.Key);
                    }
                }
                _activeRooms.Remove(roomId);
            }
            return room?.GetConnections();
        }
        public UserMsg SendMessage(string connectionId, string message, long[] accessIds)
        {
            var roomId = _activeUsers[connectionId];
            ActiveRoom room;
            lock (_activeRooms) room = _activeRooms[roomId];
            var msg = room.AddMessage(roomId, connectionId, message, accessIds);
            return new UserMsg
            {
                connectionIds = room.GetConnections(connectionId: connectionId, ids: accessIds),
                message = new RoomsMsg
                {
                    Time = msg.timeStamp,
                    Icon = msg.senderIcon,
                    Secret = accessIds != null,
                    Sender = msg.senderName,
                    Text = msg.text
                },
                room = room
            };
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
                    room = new ActiveRoom(roomId);
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
                lock (_activeUsers)
                    if (!_activeUsers.ContainsKey(connectionId)) return data;
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
    public struct UserMsg
    {
        public string[] connectionIds;
        public RoomsMsg message;
        public ActiveRoom room;
    }
}