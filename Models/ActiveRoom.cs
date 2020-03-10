using System;
using System.Collections.Generic;

namespace Rooms.Models
{
    public class ActiveRoom
    {
        public ActiveRoom()
        {
            users = new List<ActiveUser>();
            messages = new List<InMemoryMessage>();
        }
        public List<ActiveUser> users;
        public byte Online { get => Convert.ToByte(users.Count); }
        public List<InMemoryMessage> messages;
    }
    public class ActiveUser
    {
        public ActiveUser(long userId, string icon, string name, string guid, string connectionId)
        {
            this.userId = userId;
            this.icon = icon;
            this.name = name;
            this.guid = guid;
            this.connectionIds = new List<string>();
            connectionIds.Add(connectionId);
        }
        public long userId;
        public string icon;
        public string name;
        public string guid;
        public List<string> connectionIds;
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