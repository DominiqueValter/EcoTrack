using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMtrSinirFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Mtrs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NumeroMtr = table.Column<string>(type: "text", nullable: false),
                    TipoManifesto = table.Column<string>(type: "text", nullable: true),
                    ResponsavelEmissao = table.Column<string>(type: "text", nullable: true),
                    DataEmissao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataRecebimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Situacao = table.Column<string>(type: "text", nullable: true),
                    ClienteId = table.Column<Guid>(type: "uuid", nullable: false),
                    GeradorNome = table.Column<string>(type: "text", nullable: true),
                    GeradorCnpj = table.Column<string>(type: "text", nullable: true),
                    GeradorUnidade = table.Column<string>(type: "text", nullable: true),
                    TransportadorNome = table.Column<string>(type: "text", nullable: false),
                    TransportadorCnpj = table.Column<string>(type: "text", nullable: true),
                    TransportadorUnidade = table.Column<string>(type: "text", nullable: true),
                    NomeMotorista = table.Column<string>(type: "text", nullable: true),
                    PlacaVeiculo = table.Column<string>(type: "text", nullable: true),
                    DestinadorNome = table.Column<string>(type: "text", nullable: false),
                    DestinadorCnpj = table.Column<string>(type: "text", nullable: true),
                    DestinadorUnidade = table.Column<string>(type: "text", nullable: true),
                    ResponsavelRecebimento = table.Column<string>(type: "text", nullable: true),
                    ObservacaoGerador = table.Column<string>(type: "text", nullable: true),
                    ObservacaoDestinador = table.Column<string>(type: "text", nullable: true),
                    Justificativa = table.Column<string>(type: "text", nullable: true),
                    TemMtrComplementar = table.Column<bool>(type: "boolean", nullable: false),
                    MtrProvisorioNumero = table.Column<string>(type: "text", nullable: true),
                    Tratamento = table.Column<string>(type: "text", nullable: true),
                    CdfNumero = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mtrs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mtrs_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Residuos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CodigoIbama = table.Column<string>(type: "text", nullable: false),
                    Descricao = table.Column<string>(type: "text", nullable: false),
                    Classe = table.Column<int>(type: "integer", nullable: false),
                    EstadoFisico = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Residuos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MtrResiduos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MtrId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResiduoId = table.Column<Guid>(type: "uuid", nullable: true),
                    ResiduoCodDescricao = table.Column<string>(type: "text", nullable: false),
                    Classe = table.Column<string>(type: "text", nullable: true),
                    DescrInterna = table.Column<string>(type: "text", nullable: true),
                    CodInterno = table.Column<string>(type: "text", nullable: true),
                    QuantidadeIndicada = table.Column<decimal>(type: "numeric", nullable: false),
                    QuantidadeRecebida = table.Column<decimal>(type: "numeric", nullable: false),
                    Unidade = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MtrResiduos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MtrResiduos_Mtrs_MtrId",
                        column: x => x.MtrId,
                        principalTable: "Mtrs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MtrResiduos_Residuos_ResiduoId",
                        column: x => x.ResiduoId,
                        principalTable: "Residuos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MtrResiduos_MtrId",
                table: "MtrResiduos",
                column: "MtrId");

            migrationBuilder.CreateIndex(
                name: "IX_MtrResiduos_ResiduoId",
                table: "MtrResiduos",
                column: "ResiduoId");

            migrationBuilder.CreateIndex(
                name: "IX_Mtrs_ClienteId",
                table: "Mtrs",
                column: "ClienteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MtrResiduos");

            migrationBuilder.DropTable(
                name: "Mtrs");

            migrationBuilder.DropTable(
                name: "Residuos");
        }
    }
}
