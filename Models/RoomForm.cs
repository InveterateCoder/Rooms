using System.ComponentModel.DataAnnotations;

namespace Rooms.Models
{
    public class RoomForm
    {
        [Required, StringLength(34, MinimumLength=4)]
        public string Name {get;set;}
        [MaxLength(200)]
        public string Description {get;set;}
        [Required, StringLength(2, MinimumLength=2)]
        public string Country {get;set;}
        [StringLength(16, MinimumLength=6)]
        public string Password {get;set;}
        [Required, Range(2, 50)]
        public byte Limit {get;set;}
    }
}