using System.Collections.Concurrent;
namespace Rooms.Models
{
    public class State
    {
        public readonly ConcurrentDictionary<long, ActiveRoom> ActiveRooms;
        public readonly ConcurrentDictionary<string, long> ActiveUsers;
        public State()
        {
            ActiveRooms = new ConcurrentDictionary<long, ActiveRoom>();
            ActiveUsers = new ConcurrentDictionary<string, long>();
        }
    }
}