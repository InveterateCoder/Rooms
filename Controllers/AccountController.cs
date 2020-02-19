using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Rooms.Infrastructure;
using Rooms.Models;

namespace Rooms.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class AccountController : ControllerBase
    {
        private readonly Helper Helper;
        private readonly RoomsDBContext _context;
        public AccountController(Helper helper, RoomsDBContext context)
        {
            Helper = helper;
            _context = context;
        }
        [HttpPost("change")]
        public async Task<IActionResult> Change([FromBody]UserChangeForm form)
        {
            try
            {
                Identity id = JsonSerializer.Deserialize<Identity>(User.Identity.Name);
                if(id.Guest != null) return Forbid();
                if (!(form.Name?.Length >= 4) && !(form.Password?.Length >= 6))
                    return BadRequest(Errors.EmptyRequest);
                if (form.Name?.Length >= 4 && !Helper.isRightName(form.Name))
                    return BadRequest(Errors.BadName);
                var user = await _context.Users.FindAsync(id.UserId);
                if (user == null) throw new Exception("Invalid Token");
                if(form.Name?.Length >= 4) user.Name = form.Name;
                if(form.Password?.Length >= 6) user.Password = form.Password;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                id.UserId = user.UserId;
                id.Name = user.Name;
                return Ok(Helper.GetToken(JsonSerializer.Serialize(id)));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        public IActionResult Delete()
        {

        }
        public IActionResult Info()
        {

        }
    }
}