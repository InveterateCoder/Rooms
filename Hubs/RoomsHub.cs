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
        public async Task<ReturnSignal<RoomInfo>> Enter(string slug, string icon, string password)
        {
            try
            {
                if (icon != "man" && icon != "woman" && icon != "user") throw new HubException("Wrong icon name");
                Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                return await Task.Run(() =>
                {
                    var room = _context.Rooms.Include(r => r.Messages).FirstOrDefault(r => r.Slug == slug);
                    if (room == null) return new ReturnSignal<RoomInfo> { Code = "noroom" };
                    if (room.UserId != id.UserId && room.Password != password) return new ReturnSignal<RoomInfo> { Code = "password" };
                    ActiveRoom active = _state.ConnectUser(id.UserId, id.Guest, id.Name, icon, Context.ConnectionId, room.RoomId);
                    RoomInfo info = new RoomInfo()
                    {
                        Flag = room.Country,
                        Name = room.Name
                    };
                    List<RoomsMsg> messages = new List<RoomsMsg>();
                    if (room.Messages.Count() > 0)
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
                    var activemsgs = active.Messages;
                    if (activemsgs.Count() > 0)
                        messages.AddRange(activemsgs.Select(m => new RoomsMsg
                        {
                            Icon = m.senderIcon,
                            Sender = m.senderName,
                            Time = m.timeStamp,
                            Text = m.text,
                            Secret = m.accessIds != null
                        }));
                    info.Users = active.Users(id.UserId, id.Guest).Select(u => new RoomsUser
                    {
                        Id = u.userId,
                        Name = u.name,
                        Guid = u.guid,
                        Icon = u.icon
                    });
                    info.Messages = messages;
                    return new ReturnSignal<RoomInfo>
                    {
                        Code = "ok",
                        Payload = info
                    };
                });
            }
            catch (Exception ex)
            {
                return new ReturnSignal<RoomInfo> { Code = ex.Message };
            }
        }
        public async override Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                await Task.Run(() =>
                {
                    var room = _state.DisconnectUser(Context.ConnectionId);
                    if (room != null)
                    {
                        //TODO SAVE in DATABASE
                    }
                });
            }
            catch { };
        }
    }
}