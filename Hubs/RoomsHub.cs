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
        public async Task<long> SendMessage(string message, long[] accessIds)
        {
            try
            {
                return await Task.Run(async () =>
                {
                    Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                    IEnumerable<long> ids = null;
                    if(accessIds != null && id.UserId > 0)
                        ids = accessIds.Append(id.UserId);
                    var data = _state.SendMessage(Context.ConnectionId, message, ids?.ToArray());
                    await Clients.Clients(data.connectionIds).SendAsync("recieveMessage", data.message);
                    return data.message.Time;
                });
            }
            catch
            {
                return 0;
            }
        }
        public async Task<ReturnSignal<RoomInfo>> Enter(string slug, string icon, string password)
        {
            try
            {
                if (icon != "man" && icon != "woman" && icon != "user") throw new HubException("Wrong icon name");
                Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                return await Task.Run(async () =>
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
                    var activemsgs = active.GetMessages(true);
                    if (activemsgs.Count() > 0)
                    {
                        Func<InMemoryMessage, bool> filter;
                        if (id.UserId > 0) filter = m => m.accessIds == null || m.accessIds.Contains(id.UserId);
                        else if (id.Guest != null) filter = m => m.accessIds == null;
                        else throw new HubException("Couldn't read neither id nor guid.");
                        messages.AddRange(activemsgs.Where(filter).Select(m => new RoomsMsg
                        {
                            Icon = m.senderIcon,
                            Sender = m.senderName,
                            Time = m.timeStamp,
                            Text = m.text,
                            Secret = m.accessIds != null
                        }));
                    }
                    info.Users = active.Users(id.UserId, id.Guest).Select(u => new RoomsUser
                    {
                        Id = u.userId,
                        Name = u.name,
                        Guid = u.guid,
                        Icon = u.icon
                    });
                    info.Messages = messages;
                    if (active.GetOpenConnections(id.UserId, id.Guest) <= 1)
                        await Clients.Clients(active.GetConnections(id.UserId, id.Guest))
                            .SendAsync("addUser", new RoomsUser { Id = id.UserId, Guid = id.Guest, Icon = icon, Name = id.Name });
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
                Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                await Task.Run(async () =>
                {
                    var data = _state.DisconnectUser(Context.ConnectionId);
                    if (!data.removed)
                    {
                        if (data.room.User(id.UserId, id.Guest) == null)
                            await Clients.Clients(data.room.GetConnections()).SendAsync("removeUser",
                                new RoomsUser { Id = id.UserId, Guid = id.Guest, Icon = null, Name = id.Name });
                    }
                    else
                    {
                        //TODO SAVE in DATABASE
                    }
                });
            }
            catch { };
        }
    }
}