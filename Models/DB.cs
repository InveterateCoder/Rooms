using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Rooms.Models
{
    public class RoomsDBContext : DbContext {
        public RoomsDBContext(DbContextOptions<RoomsDBContext> opts) : base(opts) {}
        public DbSet<User> Users {get;set;}
        public DbSet<Room> Rooms {get;set;}
        public DbSet<Message> Messages {get;set;}
    }
    public class User
    {
        public int UserId {get;set;}
        [MaxLength(320)]
        public string Email {get;set;}
        [MaxLength(40)]
        public string Name {get;set;}
        [MaxLength(16)]
        public string Password {get;set;}
        public Room Room {get;set;}
    }
    public class Room
    {
        public int RoomId {get;set;}
        [MaxLength(2)]
        public string Country {get;set;}
        [MaxLength(40)]
        public string Name {get;set;}
        [MaxLength(200)]
        public string Description {get;set;}
        [MaxLength(16)]
        public string Password {get;set;}
        public byte MaxUsers {get;set;}
        public List<Message> Messages {get;set;}
    }
    public class Message
    {
        public int MessageId {get;set;}
        public long TimeStamp {get;set;}
        public int UserId {get;set;}
        [MaxLength(5)]
        public string Icon {get;set;}
        public List<User> To {get;set;}
        public string ToJson {get;set;}
        public string Text {get;set;}
        public bool Encrypted {get;set;}
    }
}