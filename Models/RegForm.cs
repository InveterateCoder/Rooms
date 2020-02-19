using System.ComponentModel.DataAnnotations;

namespace Rooms.Models
{
    public class RegForm
    {
        [Required, StringLength(34, MinimumLength=4)]
        public string Name {get;set;}
        [Required, StringLength(320, MinimumLength=6), EmailAddress]
        public string Email {get;set;}
        [Required, StringLength(16, MinimumLength=6), DataType(DataType.Password)]
        public string Password {get;set;}
    }
}