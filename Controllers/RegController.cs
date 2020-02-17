using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Rooms.Models;
using Microsoft.AspNetCore.Http;
using Rooms.Infrastructure;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.ComponentModel.DataAnnotations;

namespace Rooms.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class RegController : ControllerBase
    {
        private readonly Settings _settings;
        private readonly RoomsDBContext _context;
        public RegController(IOptions<Settings> settings, RoomsDBContext context)
        {
            _settings = settings.Value;
            _context = context;
        }
        [HttpPost("reg")]
        public async Task<IActionResult> Register([FromBody]RegForm data)
        {
            try
            {
                if (_context.Users.FirstOrDefault(u => u.Email == data.Email) != null)
                    return BadRequest(Errors.EmailTaken);
                var limit = DateTime.UtcNow.Subtract(new TimeSpan(1, 0, 0)).Ticks;
                var range = _context.RegQueue.Where(e => e.Date < limit);
                _context.RegQueue.RemoveRange(range);
                var rand = new Random();
                string key;
                do key = rand.Next(100000000, 999999999).ToString();
                while (_context.RegQueue.FirstOrDefault(e => e.Key == key) != null);
                await _context.RegQueue.AddAsync(new RegQueueEntity
                {
                    Key = key,
                    Date = DateTime.UtcNow.Ticks,
                    Name = data.Name,
                    Email = data.Email,
                    Password = data.Password
                });
                await _context.SaveChangesAsync();
                string content = $"Hello {data.Name}. Please follow the link to confirm your email addresss.\n{_settings.EmailConfirmAddr + key}";
                if (!await SendMail(data.Email, content))
                    throw new Exception("Failed to send a confirmation email.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

            return Ok();
        }
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromBody]string key)
        {
            try
            {
                var entity = _context.RegQueue.FirstOrDefault(e => e.Key == key);
                if (entity == null) return BadRequest(Errors.ConfEmailNotFound);
                if (_context.Users.FirstOrDefault(u => u.Email == entity.Email) != null)
                    return BadRequest(Errors.EmailTaken);
                var user = await _context.Users.AddAsync(new Models.User
                {
                    Name = entity.Name,
                    Email = entity.Email,
                    Password = entity.Password,
                    Room = null
                });
                _context.RegQueue.Remove(entity);
                await _context.SaveChangesAsync();
                return Ok(GetToken(user.Entity.UserId.ToString()));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [HttpPost("sign/user")]
        public IActionResult SignIn([FromBody] SignInForm form)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == form.Email);
                if (user == null || user.Password != form.Password)
                    return BadRequest(Errors.EmailOrPassInc);
                return Ok(GetToken(user.UserId.ToString()));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [HttpGet("sign/guest")]
        public IActionResult SignInGuest([Required, StringLength(40, MinimumLength = 4)]string name)
            => Ok(GetToken("g_" + name));

        private string GetToken(string id)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_settings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.Name, id)
                }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                            SecurityAlgorithms.HmacSha256Signature)
            };
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
        private async Task<bool> SendMail(string to, string content)
        {
            var msg = new SendGridMessage();
            msg.SetFrom(new EmailAddress("inveterate.coder@outlook.com", "Rooms"));
            msg.AddTo(to);
            msg.SetSubject("Confirm your Email");
            msg.AddContent(MimeType.Text, content);
            var client = new SendGridClient(_settings.SGKey);
            var response = await client.SendEmailAsync(msg);
            if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
                return true;
            else return false;
        }
    }
}