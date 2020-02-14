using Microsoft.AspNetCore.Mvc;

namespace Rooms.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    public class RegController : ControllerBase
    {
        [HttpPost("reg")]
        public IActionResult Register([FromBody]string data){
            return Ok(new {easy = "easy", peasy="peasy", data= data});
        }
    }
}