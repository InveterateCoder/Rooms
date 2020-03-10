using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Rooms.Models;

namespace Rooms.Hubs
{
    [Authorize]
    public class RoomsHub : Hub
    {
        private RoomsDBContext _context;
        private State _state;
        public RoomsHub(RoomsDBContext context, State state)
        {
            _context = context;
            _state = state;
        }
        public async Task<RoomInfo> Enter(string slug, string icon, string password)
        {
            if(icon != "man" && icon != "woman" && icon != "user") throw new HubException("wrong icon name");
            Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
            return await Task.Run(() =>
            {
                var room = _context.Rooms.Include(r => r.Messages).FirstOrDefault(r => r.Slug == slug);
                if (room == null) return null;
                if (room.UserId != id.UserId && room.Password != password) return new RoomInfo();
                ActiveRoom active = null;
                if (!_state.ActiveRooms.ContainsKey(room.RoomId))
                {
                    active = new ActiveRoom();
                    _state.ActiveRooms[room.RoomId] = active;
                }
                else active = _state.ActiveRooms[room.RoomId];
                var count = room.Messages.Count();
                List<RoomsMsg> messages = new List<RoomsMsg>();
                RoomInfo info = new RoomInfo() {
                    Flag = room.Country,
                    Name = room.Name
                };
                if (count > 0)
                {
                    var filtered = room.Messages.Where(m => m.AccessIdsJson == null ||
                        (id.UserId != 0 && m.AccessIds.Contains(id.UserId)))
                        .OrderByDescending(m => m.TimeStamp);
                    if (filtered.Count() > 30) info.MoreMessages = true;
                    else info.MoreMessages = false;
                    messages.AddRange(filtered.Take(30)
                        .Select(m => new RoomsMsg
                        {
                            Icon = m.SenderIcon,
                            Sender = m.SenderName,
                            Time = m.TimeStamp,
                            Text = m.Text,
                            Secret = m.AccessIdsJson != null
                        }));
                }
                if (active.messages.Count() > 0)
                    messages.AddRange(active.messages.OrderByDescending(m => m.timeStamp).Select(m => new RoomsMsg
                    {
                        Icon = m.senderIcon,
                        Sender = m.senderName,
                        Time = m.timeStamp,
                        Text = m.text,
                        Secret = m.accessIds != null
                    }));
                var me = active.users.FirstOrDefault(u => (u.userId != 0 && id.UserId == u.userId) || (u.guid != null && u.guid == id.Guest));
                if (me != null)
                    me.connectionIds.Add(Context.ConnectionId);
                else active.users.Add(new ActiveUser(id.UserId, icon, id.Name, id.Guest, Context.ConnectionId));
                _state.ActiveUsers[Context.ConnectionId] = room.RoomId;
                info.Users = active.users.Where(u => (id.UserId != 0 && u.userId != id.UserId) ||
                    (id.Guest != null && id.Guest != u.guid)).Select(u => new RoomsUser { Id = u.userId,
                    Name = u.name, Guid = u.guid, Icon = u.icon });
                info.Messages = messages;
                return info;
            });
        }
    }
}