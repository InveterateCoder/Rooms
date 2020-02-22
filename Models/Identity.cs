namespace Rooms.Models
{
    public class Identity
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Guest { get; set; } = null;
    }
}