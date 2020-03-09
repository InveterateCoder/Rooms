using System;
using System.Collections.Generic;

namespace Rooms.Models
{
    public struct ActiveRoom
    {
        public ActiveRoom(long roomId)
        {
            users = new List<ActiveUser>();
            messages = new List<InMemoryMessage>();
        }
        public List<ActiveUser> users;
        public byte Online { get => Convert.ToByte(users.Count); }
        public List<InMemoryMessage> messages;
    }
    public struct ActiveUser
    {
        public ActiveUser(long userId, string name, string guid, string connectionId)
        {
            this.userId = userId;
            this.name = name;
            this.guid = guid;
            this.connectionId = connectionId;
        }
        public long userId;
        public string name;
        public string guid;
        public string connectionId;
    }
    public struct InMemoryMessage
    {
        public InMemoryMessage(long roomId, long timeStamp, string senderName,
            string senderIcon, IEnumerable<long> accessIds,
            IEnumerable<string> toNames, string text, bool encrypted)
        {
            this.roomId = roomId;
            this.timeStamp = timeStamp;
            this.accessIds = accessIds;
            this.senderName = senderName;
            this.senderIcon = senderIcon;
            this.toNames = toNames;
            this.text = text;
            this.encrypted = encrypted;
        }
        public long roomId;
        public long timeStamp;
        public IEnumerable<long> accessIds;
        public string senderName;
        public string senderIcon;
        public IEnumerable<string> toNames;
        public string text;
        public bool encrypted;
    }
}