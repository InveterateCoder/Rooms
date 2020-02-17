using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        
        private bool isRightName(string name)
        {
            Regex reg = new Regex(@"^[\p{L}\d.\- ]+$");
            if (!reg.IsMatch(name)) return false;
            if (name[^1] == ' ' || name[^1] == '-') return false;
            if (name[0] == '.' || name[0] == ' ' || name[0] == '-') return false;
            bool verify(string marks)
            {
                for (var i = marks.Length - 1; i >= 0; i--)
                {
                    switch (marks[i])
                    {
                        case '.':
                            if (i > 0) return false;
                            break;
                        case '-':
                            if ((i > 0 && marks[i - 1] != ' ') || (i > 1 && marks[i - 2] == '-'))
                                return false;
                            break;
                        case ' ':
                            if (i > 0 && marks[i - 1] == ' ') return false;
                            break;
                        default: return false;
                    }
                }
                return true;
            }
            var marks = "";
            for (var i = name.Length - 1; i >= 0; i--)
            {
                var cchar = name[i];
                if (cchar == '.' || cchar == ' ' || cchar == '-')
                    marks = cchar + marks;
                else
                {
                    if (marks.Length > 0)
                    {
                        var ret = verify(marks);
                        if (!ret) return ret;
                        else marks = "";
                    }
                }
            }
            return true;
        }
    }
}