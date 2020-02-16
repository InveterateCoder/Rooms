using Microsoft.EntityFrameworkCore.Migrations;

namespace Rooms.Migrations
{
    public partial class Secondary : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Messages");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                maxLength: 16,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(16) CHARACTER SET utf8mb4",
                oldMaxLength: 16,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(40) CHARACTER SET utf8mb4",
                oldMaxLength: 40,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                maxLength: 320,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(320) CHARACTER SET utf8mb4",
                oldMaxLength: 320,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Rooms",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(40) CHARACTER SET utf8mb4",
                oldMaxLength: 40,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Rooms",
                maxLength: 2,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(2) CHARACTER SET utf8mb4",
                oldMaxLength: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Rooms",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Messages",
                maxLength: 10000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext CHARACTER SET utf8mb4",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "Messages",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(5) CHARACTER SET utf8mb4",
                oldMaxLength: 5,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "User",
                table: "Messages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_Slug",
                table: "Rooms",
                column: "Slug",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Rooms_Slug",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "User",
                table: "Messages");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Users",
                type: "varchar(16) CHARACTER SET utf8mb4",
                maxLength: 16,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 16);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Users",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 40);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "varchar(320) CHARACTER SET utf8mb4",
                maxLength: 320,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 320);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "varchar(40) CHARACTER SET utf8mb4",
                maxLength: 40,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 40);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Rooms",
                type: "varchar(2) CHARACTER SET utf8mb4",
                maxLength: 2,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Messages",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 10000);

            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "Messages",
                type: "varchar(5) CHARACTER SET utf8mb4",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 5);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Messages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
