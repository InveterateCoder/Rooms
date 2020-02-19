using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Rooms.Infrastructure
{
    public class Helper
    {
        private readonly Settings _settings;
        public Helper(IOptions<Settings> settings)
        {
            _settings = settings.Value;
        }
        public Settings Settings { get => _settings; }
        public string GetToken(string user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_settings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]{
                    new Claim(ClaimTypes.Name, user)
                }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                            SecurityAlgorithms.HmacSha256Signature)
            };
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
        public async Task<bool> SendMail(string to, string content)
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
        public bool isRightName(string name)
        {
            if (new Regex(@"^\s+").IsMatch(name) || new Regex(@"\s+$").IsMatch(name))
                return false;
            return true;
        }
    }
}