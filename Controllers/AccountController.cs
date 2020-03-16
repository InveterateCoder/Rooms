using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Rooms.Hubs;
using Rooms.Infrastructure;
using Rooms.Models;

namespace Rooms.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    public class AccountController : ControllerBase
    {
        private readonly Helper Helper;
        private readonly RoomsDBContext _context;
        private readonly State _state;
        private readonly IHubContext<RoomsHub> _hub;
        public AccountController(Helper helper, RoomsDBContext context, State state, IHubContext<RoomsHub> hub)
        {
            Helper = helper;
            _context = context;
            _state = state;
            _hub = hub;
        }
        [HttpPost("change")]
        public async Task<IActionResult> Change([FromBody]UserChangeForm form)
        {
            try
            {
                Identity id = JsonSerializer.Deserialize<Identity>(User.Identity.Name);
                if (id.Guest != null) return Forbid();
                if (!(form.Name?.Length >= 4) && !(form.Password?.Length >= 6))
                    return BadRequest(Errors.EmptyRequest);
                if (form.Name?.Length >= 4 && !Helper.isRightName(form.Name))
                    return BadRequest(Errors.BadName);
                var user = await _context.Users.FindAsync(id.UserId);
                if (user == null) throw new Exception("Invalid Token");
                if (form.Name?.Length >= 4) user.Name = form.Name;
                if (form.Password?.Length >= 6) user.Password = form.Password;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                var connections = _state.ChangeUser(id.UserId, user.Name);
                if (connections.Count() > 0)
                    await _hub.Clients.Clients(connections).SendAsync("usernameChanged", new { id = id.UserId, name = user.Name });
                id.Name = user.Name;
                return Ok(Helper.GetToken(JsonSerializer.Serialize(id)));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [HttpGet("delete")]
        public async Task<IActionResult> Delete()
        {
            try
            {
                Identity id = JsonSerializer.Deserialize<Identity>(User.Identity.Name);
                if (id.Guest != null) return Forbid();
                var user = await _context.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.UserId == id.UserId);
                if (user == null) return BadRequest(Errors.NotRegistered);
                if (user.Room != null)
                {
                    var connectionIds = _state.RemoveRoom(user.Room.RoomId);
                    if (connectionIds != null)
                        await _hub.Clients.Clients(connectionIds).SendAsync("roomDeleted");
                }
                var connections = _state.UserConnections(id.UserId);
                if (connections.Count() > 0)
                    await _hub.Clients.Clients(connections).SendAsync("userRemoved");
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Ok("ok");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [HttpGet("info")]
        public async Task<IActionResult> Info()
        {
            try
            {
                Identity id = JsonSerializer.Deserialize<Identity>(User.Identity.Name);
                if (id.Guest != null) return Ok(id.Name);
                var user = await _context.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.UserId == id.UserId);
                if (user == null) throw new Exception("Invalid Token");
                return Ok(new
                {
                    name = user.Name,
                    room = user.Room == null ? null : new
                    {
                        name = user.Room.Name,
                        description = user.Room.Description,
                        country = user.Room.Country,
                        password = user.Room.Password,
                        limit = user.Room.Limit
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}