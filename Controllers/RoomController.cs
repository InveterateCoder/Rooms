using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rooms.Infrastructure;
using Rooms.Models;

namespace Rooms.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class RoomController : ControllerBase
    {
        private readonly Helper Helper;
        private readonly RoomsDBContext _context;
        public RoomController(Helper helper, RoomsDBContext context)
        {
            Helper = helper;
            _context = context;
        }
        [HttpPost("change")]
        public async Task<IActionResult> Change([FromBody]RoomForm form)
        {
            try
            {
                Identity id = JsonSerializer.Deserialize<Identity>(User.Identity.Name);
                if (id.Guest != null) return Forbid();
                if (!Helper.isRighGrouptName(form.Name)) return BadRequest(Errors.BadName);
                var room = await _context.Rooms.FirstOrDefaultAsync(r => r.UserId == id.UserId);
                var slug = Helper.Slugify(form.Name);
                if (room == null)
                {
                    if (await _context.Rooms.AnyAsync(r => r.Slug == slug))
                        return BadRequest(Errors.RoomNameExist);
                    await _context.Rooms.AddAsync(new Room
                    {
                        Name = form.Name,
                        Slug = slug,
                        Description = form.Description,
                        Country = form.Country,
                        Password = form.Password,
                        Limit = form.Limit,
                        UserId = id.UserId
                    });
                }
                else
                {
                    if (room.Slug != slug && await _context.Rooms.AnyAsync(r => r.Slug == slug))
                        return BadRequest(Errors.RoomNameExist);
                    room.Name = form.Name;
                    room.Slug = slug;
                    room.Description = form.Description;
                    room.Country = form.Country;
                    room.Password = form.Password;
                    room.Limit = form.Limit;
                    _context.Rooms.Update(room);
                }
                await _context.SaveChangesAsync();
                return Ok("ok");
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
                var room = await _context.Rooms.FirstOrDefaultAsync(r => r.UserId == id.UserId);
                if (room == null) return BadRequest(Errors.NoRoom);
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();
                return Ok("ok");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}