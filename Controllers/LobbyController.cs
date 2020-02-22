using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Rooms.Infrastructure;
using Rooms.Models;

namespace Rooms.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    public class LobbyController : ControllerBase
    {
        private readonly Helper Helper;
        private readonly RoomsDBContext _context;
        private readonly State _state;
        public LobbyController(Helper helper, RoomsDBContext context, State state)
        {
            Helper = helper;
            _context = context;
            _state = state;
        }
        [HttpGet("search/{page:min(1)}/{perpage:min(10)}")]
        public async Task<IActionResult> Search(int page, int perpage,
            [FromQuery] string slug, [FromQuery] string countries)
        {
            try
            {
                string[] cs = countries == null ? null : countries.Split('_');
                foreach (var country in cs)
                    if (!StaticData.CountryCodes.Contains(country))
                        return BadRequest(Errors.BadQuery);
                if (slug != null && char.IsWhiteSpace(slug[0])) return BadRequest(Errors.BadQuery);
                IQueryable<Room> rooms;
                if (string.IsNullOrEmpty(slug)) rooms = _context.Rooms.AsQueryable();
                else rooms = _context.Rooms.Where(r => r.Slug.StartsWith(slug));
                if (cs != null)
                    rooms = rooms.Where(r => cs.Contains(r.Country));
                IQueryable<Room> activeRooms = null;
                if(_state.ActiveRooms.Count > 0) {
                    var activeIds = _state.ActiveRooms.Keys;
                    activeRooms = rooms.Where(r => activeIds.Contains(r.RoomId));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}