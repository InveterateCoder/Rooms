using System.Collections.Concurrent;
namespace Rooms.Models
{
    public class State
    {
        public readonly ConcurrentDictionary<long, ActiveRoom> ActiveRooms;
        public State()
        {
            ActiveRooms = new ConcurrentDictionary<long, ActiveRoom>();
        }
    }
}