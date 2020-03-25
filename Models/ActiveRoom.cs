using System;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;

namespace Rooms.Models
{
    public class ActiveRoom
    {
        private readonly ConcurrentDictionary<long, ActiveUser> _registered_users = new ConcurrentDictionary<long, ActiveUser>();
        private readonly ConcurrentDictionary<string, ActiveUser> _guest_users = new ConcurrentDictionary<string, ActiveUser>();
        private readonly SortedList<long, InMemoryMessage> _messages = new SortedList<long, InMemoryMessage>();
        public byte Online { get => Convert.ToByte(_registered_users.Count() + _guest_users.Count()); }
        public readonly long roomId;
        public ActiveRoom(long roomId) => this.roomId = roomId;
        public void AddUser(string connectionId, string name, string icon, long id, string guid)
        {
            var user = new ActiveUser(icon, name);
            if (id != 0) _registered_users.GetOrAdd(id, user).AddConnection(connectionId);
            else if (guid != null) _guest_users.GetOrAdd(guid, user).AddConnection(connectionId);
            else throw new ArgumentException("Either id or guid must be provided.");
        }
        public byte RemoveUser(ActiveUser user)
        {
            var key = _registered_users.FirstOrDefault(p => p.Value == user).Key;
            if (key != 0)
                _registered_users.Remove(key, out _);
            else
            {
                var guid = _guest_users.FirstOrDefault(p => p.Value == user).Key;
                if (guid != null)
                    _guest_users.Remove(guid, out _);
            }
            return Online;
        }
        public ActiveUser UserByConnectionId(string connectionId) =>
            _registered_users.Values.Concat(_guest_users.Values).First(u => u.ContainsConnection(connectionId));
        public int GetOpenConnections(long id, string guid)
        {
            if (id != 0) return _registered_users[id].connectionIds.Count();
            else if (guid != null) return _guest_users[guid].connectionIds.Count();
            else throw new ArgumentException("Either id or guid must be provided.");
        }
        public string[] GetConnections(long userId = 0, string guid = null, string connectionId = null, long[] ids = null)
        {
            if (userId != 0) return _registered_users.Where(p => p.Key != userId)
               .SelectMany(p => p.Value.connectionIds).Concat(_guest_users.Values.SelectMany(u => u.connectionIds)).ToArray();
            else if (guid != null) return _registered_users.Values.SelectMany(u => u.connectionIds).Concat(_guest_users
                .Where(p => p.Key != guid).SelectMany(p => p.Value.connectionIds)).ToArray();
            else if (connectionId != null)
            {
                if (ids != null)
                    return _registered_users.Where(p => ids.Contains(p.Key))
                        .SelectMany(p => p.Value.connectionIds).Where(id => id != connectionId).ToArray();
                else
                    return _registered_users.Values.Concat(_guest_users.Values)
                        .SelectMany(u => u.connectionIds).Where(id => id != connectionId).ToArray();
            }
            else return _registered_users.Values.Concat(_guest_users.Values).SelectMany(u => u.connectionIds).ToArray();
        }
        public IEnumerable<string> GetUserConnectionsById(long userId) =>
            _registered_users.GetValueOrDefault(userId)?.connectionIds;
        public IEnumerable<RoomsUser> Users(long id = 0, string guid = null)
        {
            if (id != 0) return _registered_users.Where(p => p.Key != id).Select(p => new RoomsUser
            {
                Id = p.Key,
                Name = p.Value.name,
                Guid = null,
                Icon = p.Value.icon
            }).Concat(_guest_users.Select(p => new RoomsUser
            {
                Id = 0,
                Name = p.Value.name,
                Guid = p.Key,
                Icon = p.Value.icon
            }));
            else if (guid != null) return _registered_users.Select(p => new RoomsUser
            {
                Id = p.Key,
                Name = p.Value.name,
                Guid = null,
                Icon = p.Value.icon
            }).Concat(_guest_users.Where(p => p.Key != guid).Select(p => new RoomsUser
            {
                Id = 0,
                Name = p.Value.name,
                Guid = p.Key,
                Icon = p.Value.icon
            }));
            else throw new ArgumentException("Either id or guid must be provided.");
        }
        public ActiveUser User(long id, string guid)
        {
            if (id != 0) return _registered_users.GetValueOrDefault(id);
            else if (guid != null) return _guest_users.GetValueOrDefault(guid);
            else throw new ArgumentException("Either id or guid must be provided.");
        }
        public int MsgCount
        {
            get
            {
                lock (_messages)
                    return _messages.Count();
            }
        }
        public InMemoryMessage AddMessage(long roomId, string connectionId, string message, long[] accessIds)
        {
            var time = DateTime.UtcNow.Ticks;
            ActiveUser user = UserByConnectionId(connectionId);
            var msg = new InMemoryMessage(roomId, time, user.name, user.icon, accessIds, message);
            lock (_messages) _messages.Add(time, msg);
            return msg;
        }
        public IEnumerable<RoomsMsg> GetMessages(long id, string guid)
        {
            lock (_messages)
            {
                IEnumerable<InMemoryMessage> msgs;
                if (id != 0) msgs = _messages.Values.Reverse().Where(m => m.accessIds == null || m.accessIds.Contains(id));
                else if (guid != null) msgs = _messages.Values.Reverse().Where(m => m.accessIds == null);
                else throw new ArgumentException("Either id or guid must be provided.");
                return msgs.Select(m => new RoomsMsg
                {
                    Icon = m.senderIcon,
                    Secret = m.accessIds != null,
                    Sender = m.senderName,
                    Text = m.text,
                    Time = m.timeStamp
                });
            }
        }
        public List<Message> DumpMessages()
        {
            List<Message> result = new List<Message>();
            lock (_messages)
            {
                foreach (var m in _messages.Values)
                {
                    result.Add(new Message
                    {
                        AccessIds = m.accessIds,
                        RoomId = m.roomId,
                        SenderIcon = m.senderIcon,
                        SenderName = m.senderName,
                        Text = m.text,
                        TimeStamp = m.timeStamp
                    });
                }
                _messages.Clear();
            }
            return result;
        }
    }
    public class ActiveUser
    {
        public List<string> connectionIds;
        public string icon;
        public string name;
        public ActiveUser(string icon, string name)
        {
            this.icon = icon;
            this.name = name;
            this.connectionIds = new List<string>();
        }
        public void AddConnection(string connectionId)
        {
            lock (connectionIds)
                connectionIds.Add(connectionId);
        }
        public int RemoveConnection(string connectionId)
        {
            lock (connectionIds)
            {
                connectionIds.Remove(connectionId);
                return connectionIds.Count();
            }
        }
        public bool ContainsConnection(string connectionId)
        {
            lock (connectionIds)
                return connectionIds.Contains(connectionId);
        }
    }
    public class InMemoryMessage
    {
        public InMemoryMessage(long roomId, long timeStamp, string senderName,
            string senderIcon, IEnumerable<long> accessIds, string text)
        {
            this.roomId = roomId;
            this.timeStamp = timeStamp;
            this.accessIds = accessIds;
            this.senderName = senderName;
            this.senderIcon = senderIcon;
            this.text = text;
        }
        public long roomId;
        public long timeStamp;
        public IEnumerable<long> accessIds;
        public string senderName;
        public string senderIcon;
        public string text;
    }
}