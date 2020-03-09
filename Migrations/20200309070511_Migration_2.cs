using Microsoft.EntityFrameworkCore.Migrations;

namespace Rooms.Migrations
{
    public partial class Migration_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Encrypted",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "From",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "AccessIdsJson",
                table: "Messages",
                maxLength: 5000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SenderIcon",
                table: "Messages",
                maxLength: 5,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderName",
                table: "Messages",
                maxLength: 34,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessIdsJson",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "SenderIcon",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "SenderName",
                table: "Messages");

            migrationBuilder.AddColumn<bool>(
                name: "Encrypted",
                table: "Messages",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "From",
                table: "Messages",
                type: "varchar(34) CHARACTER SET utf8mb4",
                maxLength: 34,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Messages",
                type: "varchar(5) CHARACTER SET utf8mb4",
                maxLength: 5,
                nullable: false,
                defaultValue: "");
        }
    }
}
