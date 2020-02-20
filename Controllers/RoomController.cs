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
                var user = await _context.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.UserId == id.UserId);
                if (user == null) return BadRequest(Errors.NotRegistered);
                
                if (user.Room == null)
                    await _context.Rooms.AddAsync(new Room
                    {
                        Name = form.Name,
                        Slug = Helper.Slugify(form.Name),
                        Description = form.Description,
                        Country = form.Country,
                        Password = form.Password,
                        Limit = form.Limit,
                        UserId = user.UserId
                    });
                else
                {
                    user.Room.Name = form.Name;
                    user.Room.Slug = Helper.Slugify(form.Name);
                    user.Room.Description = form.Description;
                    user.Room.Country = form.Country;
                    user.Room.Password = form.Password;
                    user.Room.Limit = form.Limit;
                    _context.Rooms.Update(user.Room);
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
                var user = await _context.Users.Include(u => u.Room).FirstOrDefaultAsync(u => u.UserId == id.UserId);
                if (user == null) return BadRequest(Errors.NotRegistered);
                if (user.Room == null) return BadRequest(Errors.NoRoom);
                _context.Rooms.Remove(user.Room);
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