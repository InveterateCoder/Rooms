using System.ComponentModel.DataAnnotations;

namespace Rooms.Models
{
    public class SignInForm
    {
        [Required, StringLength(320, MinimumLength=6)]
        public string Email {get;set;}
        [Required, StringLength(16, MinimumLength=6)]
        public string Password {get;set;}
    }
}