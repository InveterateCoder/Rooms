using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Rooms.Models;
using Microsoft.AspNetCore.Http;
using Rooms.Infrastructure;

namespace Rooms.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public class RegController : ControllerBase
    {
        private readonly Settings _settings;
        private readonly RoomsDBContext _context;
        public RegController(IOptions<Settings> settings, RoomsDBContext context){
            _settings = settings.Value;
            _context = context;
        }
        [HttpPost("reg")]
        public async Task<IActionResult> Register([FromBody]RegForm data){
            try{
                if(_context.Users.FirstOrDefault(u => u.Name == data.Name) != null)
                    throw new Exception(Errors.NameTaken);
                if(_context.Users.FirstOrDefault(u => u.Email == data.Email) != null)
                    throw new Exception(Errors.EmailTaken);
                string key

                //TODO
                //TODO
                //TODO unique key generation and saving
                //TODO
                //TODO don't forget to check on existent entries and delete expired ones

                await _context.RegQueue.AddAsync(new RegQueueEntity{
                    Key = key,
                    Name = data.Name,
                    Email = data.Email,
                    Password = data.Password
                });
                await _context.SaveChangesAsync();
            }
            catch(Exception ex){
                return BadRequest(new {error = ex.Message});
            }
            return Ok();
        }
        
        private string GetToken(string id){
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_settings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.Name, id)
                }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                            SecurityAlgorithms.HmacSha256Signature)
            };
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
    }
}