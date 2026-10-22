using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Documentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "text", nullable: false),
                    Extensao = table.Column<string>(type: "text", nullable: false),
                    TamanhoBytes = table.Column<long>(type: "bigint", nullable: false),
                    DropboxPath = table.Column<string>(type: "text", nullable: false),
                    DropboxFileId = table.Column<string>(type: "text", nullable: true),
                    DataUpload = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClienteId = table.Column<Guid>(type: "uuid", nullable: true),
                    ProcessoAmbientalId = table.Column<Guid>(type: "uuid", nullable: true),
                    LicencaAmbientalId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Documentos_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Documentos_LicencasAmbientais_LicencaAmbientalId",
                        column: x => x.LicencaAmbientalId,
                        principalTable: "LicencasAmbientais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Documentos_ProcessosAmbientais_ProcessoAmbientalId",
                        column: x => x.ProcessoAmbientalId,
                        principalTable: "ProcessosAmbientais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Documentos_ClienteId",
                table: "Documentos",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Documentos_LicencaAmbientalId",
                table: "Documentos",
                column: "LicencaAmbientalId");

            migrationBuilder.CreateIndex(
                name: "IX_Documentos_ProcessoAmbientalId",
                table: "Documentos",
                column: "ProcessoAmbientalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Documentos");
        }
    }
}
