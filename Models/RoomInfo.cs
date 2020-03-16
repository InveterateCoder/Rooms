using System.Collections.Generic;

namespace Rooms.Models
{
    public class RoomInfo
    {
        public long MyId { get; set; }
        public string Flag { get; set; }
        public string Name { get; set; }
        public IEnumerable<RoomsUser> Users { get; set; }
        public IEnumerable<RoomsMsg> Messages { get; set; }
        public bool MoreMessages { get; set; }
    }
}