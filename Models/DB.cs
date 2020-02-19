using System;
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
        public DbSet<RegQueueEntity> RegQueue {get;set;}
        protected override void OnModelCreating(ModelBuilder modelBuilder){
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<Room>()
                .HasIndex(r => r.Slug)
                .IsUnique();
            modelBuilder.Entity<RegQueueEntity>()
                .HasIndex(e => e.Key)
                .IsUnique();
        }
    }
    public class User
    {
        public long UserId {get;set;}
        [Required, MaxLength(320)]
        public string Email {get;set;}
        [Required, MaxLength(34)]
        public string Name {get;set;}
        [Required, MaxLength(16)]
        public string Password {get;set;}
        public Room Room {get;set;}
    }
    public class Room
    {
        public long RoomId {get;set;}
        [Required, MaxLength(2)]
        public string Country {get;set;}
        [Required, MaxLength(40)]
        public string Name {get;set;}
        [Required, MaxLength(40)]
        public string Slug {get;set;}
        [MaxLength(200)]
        public string Description {get;set;}
        [MaxLength(16)]
        public string Password {get;set;}
        [Required]
        public byte Limit {get;set;}
        public List<Message> Messages {get;set;}
    }
    public class Message
    {
        public long MessageId {get;set;}
        [Required]
        public long TimeStamp {get;set;}
        [Required]
        public User User {get;set;}
        [Required, MaxLength(40)]
        public string From {get;set;}
        [Required, MaxLength(5)]
        public string Icon {get;set;}
        public List<User> To {get;set;}
        public string ToNamesJson {get;set;}
        [Required, MaxLength(10000)]
        public string Text {get;set;}
        [Required]
        public bool Encrypted {get;set;}
    }
    public class RegQueueEntity
    {
        public int Id {get;set;}
        [Required]
        public long Date {get;set;}
        [Required, MaxLength(10)]
        public string Key {get;set;}
        [Required, MaxLength(40)]
        public string Name {get;set;}
        [Required, MaxLength(320)]
        public string Email {get;set;}
        [MaxLength(16)]
        public string Password {get;set;}
    }
}