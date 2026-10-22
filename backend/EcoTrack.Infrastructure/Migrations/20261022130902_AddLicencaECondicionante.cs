using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLicencaECondicionante : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LicencasAmbientais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Numero = table.Column<string>(type: "text", nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    OrgaoAmbiental = table.Column<string>(type: "text", nullable: false),
                    DataEmissao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataValidade = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Observacoes = table.Column<string>(type: "text", nullable: true),
                    ProcessoAmbientalId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicencasAmbientais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicencasAmbientais_ProcessosAmbientais_ProcessoAmbientalId",
                        column: x => x.ProcessoAmbientalId,
                        principalTable: "ProcessosAmbientais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Condicionantes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Descricao = table.Column<string>(type: "text", nullable: false),
                    Prazo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Observacao = table.Column<string>(type: "text", nullable: true),
                    LicencaAmbientalId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Condicionantes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Condicionantes_LicencasAmbientais_LicencaAmbientalId",
                        column: x => x.LicencaAmbientalId,
                        principalTable: "LicencasAmbientais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Condicionantes_LicencaAmbientalId",
                table: "Condicionantes",
                column: "LicencaAmbientalId");

            migrationBuilder.CreateIndex(
                name: "IX_LicencasAmbientais_ProcessoAmbientalId",
                table: "LicencasAmbientais",
                column: "ProcessoAmbientalId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Condicionantes");

            migrationBuilder.DropTable(
                name: "LicencasAmbientais");
        }
    }
}
