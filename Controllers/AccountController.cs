using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private readonly RoomsDBContext _context;
        public AccountController(RoomsDBContext context)
        {
            _context = context;
        }
        [HttpPost("change")]
        public Task<IActionResult> Change([FromBody]UserChangeForm form)
        {
            try
            {
                long id;
                if(!long.TryParse(User.Identity.Name, out id))
                    return Forbid();
                
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}