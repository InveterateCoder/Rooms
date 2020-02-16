using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Rooms.Migrations
{
    public partial class Third : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RegQueue",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Key = table.Column<string>(maxLength: 10, nullable: false),
                    Name = table.Column<string>(maxLength: 40, nullable: false),
                    Email = table.Column<string>(maxLength: 320, nullable: false),
                    Password = table.Column<string>(maxLength: 16, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegQueue", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegQueue_Key",
                table: "RegQueue",
                column: "Key",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegQueue");
        }
    }
}
