using System;
using System.Collections.Generic;
using System.Linq;

namespace Rooms.Models
{
    public class ActiveRoom
    {
        private readonly List<ActiveUser> _users = new List<ActiveUser>();
        private readonly List<InMemoryMessage> _messages = new List<InMemoryMessage>();
        public byte Online { get => Convert.ToByte(_users.Count); }
        public void AddUser(string connectionId, string name, string icon, long id, string guid)
        {
            Func<ActiveUser, bool> filter;
            if (id != 0) filter = u => u.userId == id;
            else if (!string.IsNullOrEmpty(guid)) filter = u => u.guid == guid;
            else throw new ArgumentException("Wrong credentials");
            lock (_users)
            {
                var user = _users.FirstOrDefault(filter);
                if (user != null)
                    user.AddConnection(connectionId);
                else _users.Add(new ActiveUser(id, icon, name, guid, connectionId));
            }
        }
        public int RemoveUser(ActiveUser user)
        {
            lock (_users)
            {
                _users.Remove(user);
                return _users.Count();
            }
        }
        public ActiveUser UserByConnectionId(string connectionId)
        {
            lock (_users)
                return _users.First(u => u.ContainsConnection(connectionId));
        }
        public int GetOpenConnections(long id, string guid)
        {
            Func<ActiveUser, bool> filter;
            if (id > 0) filter = u => u.userId == id;
            else if (guid != null) filter = u => u.guid == guid;
            else throw new ArgumentException("Either id or guid must be provided");
            lock (_users) return _users.First(filter).connectionIds.Count();
        }
        public IEnumerable<ActiveUser> Users(long id = 0, string guid = null)
        {
            Func<ActiveUser, bool> filter;
            if (id != 0) filter = u => u.userId != id;
            else if (!string.IsNullOrEmpty(guid)) filter = u => u.guid != guid;
            else return _users;
            lock (_users) return _users.Where(filter);
        }
        public ActiveUser User(long id, string guid)
        {
            Func<ActiveUser, bool> filter;
            if (id != 0) filter = u => u.userId == id;
            else if (!string.IsNullOrEmpty(guid)) filter = u => u.guid == guid;
            else throw new ArgumentException("Either id or guid must be provided.");
            lock (_users) return _users.FirstOrDefault(filter);
        }
        public IEnumerable<InMemoryMessage> Messages
        {
            get
            {
                lock (_messages)
                    return _messages.OrderByDescending(m => m.timeStamp);
            }
        }
        public string[] GetConnections(long userId = 0, string guid = null, string connectionId = null)
        {
            lock (_users)
            {
                if (userId != 0)
                    return _users.Where(u => u.userId != userId).SelectMany(u => u.connectionIds).ToArray();
                else if (guid != null)
                    return _users.Where(u => u.guid != guid).SelectMany(u => u.connectionIds).ToArray();
                else if (connectionId != null)
                    return _users.SelectMany(u => u.connectionIds).Where(id => id != connectionId).ToArray();
                else
                    return _users.SelectMany(u => u.connectionIds).ToArray();
            }
        }
    }
    public class ActiveUser
    {
        public List<string> connectionIds;
        public long userId;
        public string icon;
        public string name;
        public string guid;
        public ActiveUser(long userId, string icon, string name, string guid, string connectionId)
        {
            this.userId = userId;
            this.icon = icon;
            this.name = name;
            this.guid = guid;
            this.connectionIds = new List<string>();
            connectionIds.Add(connectionId);
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