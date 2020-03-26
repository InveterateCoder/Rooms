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
        public async Task<IEnumerable<RoomsMsg>> GetMessages(long oldestMsgTime, int count)
        {

            return await Task.Run(async () =>
                {
                    Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                    List<RoomsMsg> messages = new List<RoomsMsg>();
                    messages.AddRange(_state.GetOlderMsgs(id.UserId, id.Guest, oldestMsgTime, Context.ConnectionId));
                    if (messages.Count < count)
                    {
                        var roomId = _state.GetRoomId(Context.ConnectionId);
                        var room = await _context.Rooms.Include(r => r.Messages).FirstAsync(r => r.RoomId == roomId);
                        messages.InsertRange(0, room.Messages.Where(m =>
                            m.TimeStamp < oldestMsgTime &&
                            (m.AccessIdsJson == null || (id.UserId != 0 && m.AccessIds.Contains(id.UserId))))
                            .OrderByDescending(m => m.TimeStamp).Select(m => new RoomsMsg
                            {
                                Icon = m.SenderIcon,
                                Secret = m.AccessIdsJson != null,
                                Sender = m.SenderName,
                                Text = m.Text,
                                Time = m.TimeStamp
                            }).Take(count - messages.Count));
                    }
                    else if (messages.Count > count)
                        return messages.Take(count);
                    return messages;
                });
        }
        public async Task<long> SendMessage(string message, long[] accessIds)
        {
            return await Task.Run(async () =>
                {
                    Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                    IEnumerable<long> ids = null;
                    if (accessIds != null && id.UserId > 0)
                        ids = accessIds.Append(id.UserId);
                    var data = _state.SendMessage(Context.ConnectionId, message, ids?.ToArray());
                    if (data.connectionIds.Length > 0)
                        await Clients.Clients(data.connectionIds).SendAsync("recieveMessage", data.message);
                    if (data.room.MsgCount > 50) await SaveRoom(data.room);
                    return data.message.Time;
                });
        }
        public async Task ChangeIcon(string icon)
        {
            if (icon != "user" && icon != "man" && icon != "woman")
                Context.Abort();
            else
            {
                await Task.Run(async () =>
                {
                    Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                    var connectionIds = _state.ChangeUser(id.UserId, icon: icon);
                    if (connectionIds.Length > 0)
                        await Clients.Clients(connectionIds).SendAsync("iconChanged", new { id = id.UserId, icon = icon });
                });
            }
        }
        public async Task ChangeLanguage(string lang)
        {
            await Task.Run(async () =>
            {
                Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
                if (id.UserId != 0)
                {
                    var connectionIds = _state.UserConnections(id.UserId);
                    if (connectionIds.Length > 0)
                        await Clients.Clients(connectionIds).SendAsync("langChanged", lang);
                }
            });
        }
        public async Task<ReturnSignal<RoomInfo>> Enter(string slug, string icon, string password, int msgsCount)
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
                    ActiveRoom active = _state.ConnectUser(id.UserId, id.Guest, id.Name, icon, Context.ConnectionId, room.RoomId, room.Limit);
                    if (active == null) return new ReturnSignal<RoomInfo> { Code = "limit" };
                    RoomInfo info = new RoomInfo()
                    {
                        MyId = id.UserId,
                        Flag = room.Country,
                        Name = room.Name
                    };
                    List<RoomsMsg> messages = new List<RoomsMsg>();
                    if (active.MsgCount > 0)
                    {
                        Func<InMemoryMessage, bool> filter;
                        if (id.UserId > 0) filter = m => m.accessIds == null || m.accessIds.Contains(id.UserId);
                        else if (id.Guest != null) filter = m => m.accessIds == null;
                        else throw new HubException("Couldn't read neither id nor guid.");
                        messages.AddRange(active.GetMessages(id.UserId, id.Guest));
                    }
                    var remnant = msgsCount - active.MsgCount;
                    if (remnant > 0 && room.Messages.Count() > 0)
                    {
                        var filtered = room.Messages.Where(m => m.AccessIdsJson == null ||
                            (id.UserId != 0 && m.AccessIds.Contains(id.UserId)))
                            .OrderByDescending(m => m.TimeStamp);
                        messages.AddRange(filtered.Take(remnant)
                            .Select(m => new RoomsMsg
                            {
                                Icon = m.SenderIcon,
                                Sender = m.SenderName,
                                Time = m.TimeStamp,
                                Text = m.Text,
                                Secret = m.AccessIdsJson != null
                            }));
                    }
                    info.Users = active.Users(id.UserId, id.Guest);
                    info.Messages = messages;
                    if (active.GetOpenConnections(id.UserId, id.Guest) <= 1)
                    {
                        var connectionIds = active.GetConnections(id.UserId, id.Guest);
                        if (connectionIds.Length > 0)
                            await Clients.Clients(connectionIds)
                                .SendAsync("addUser", new RoomsUser { Id = id.UserId, Guid = id.Guest, Icon = icon, Name = id.Name });
                    }
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
            Identity id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
            await Task.Run(async () =>
            {
                var data = _state.DisconnectUser(Context.ConnectionId);
                if (data.room != null)
                {
                    if (!data.removed)
                    {
                        if (data.room.User(id.UserId, id.Guest) == null)
                        {
                            var connectionIds = data.room.GetConnections();
                            if (connectionIds.Length > 0)
                                await Clients.Clients(connectionIds).SendAsync("removeUser",
                                    new RoomsUser { Id = id.UserId, Guid = id.Guest, Icon = null, Name = id.Name });
                        }
                    }
                    else await SaveRoom(data.room);
                }
            });
            await base.OnDisconnectedAsync(exception);
        }
        private async Task SaveRoom(ActiveRoom room)
        {
            var messages = room.DumpMessages();
            if (messages.Count > 0)
            {
                await _context.Messages.AddRangeAsync(messages);
                await _context.SaveChangesAsync();
            }
        }
    }
}