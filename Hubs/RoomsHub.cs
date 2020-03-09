using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Rooms.Models;

namespace Rooms.Hubs
{
    [Authorize]
    public class RoomsHub : Hub
    {
        private RoomsDBContext _context;
        private State _state;
        private Identity _id;
        public RoomsHub(RoomsDBContext context, State state)
        {
            _context = context;
            _state = state;
        }
        public override Task OnConnectedAsync()
        {
            _id = JsonSerializer.Deserialize<Identity>(Context.User.Identity.Name);
            return Task.CompletedTask;
        }
        
    }
}