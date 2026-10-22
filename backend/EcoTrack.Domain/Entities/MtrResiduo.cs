using EcoTrack.Domain.Common;

namespace EcoTrack.Domain.Entities;

public class MtrResiduo : BaseEntity
{
    public Guid MtrId { get; set; }
    public Mtr? Mtr { get; set; }

    // Relacionamento opcional com o catálogo de Resíduos
    public Guid? ResiduoId { get; set; }
    public Residuo? Residuo { get; set; }

    public string ResiduoCodDescricao { get; set; } = string.Empty; // ex: "12 01 01 - Lodo de ETE"
    public string? Classe { get; set; }
    public string? DescrInterna { get; set; }
    public string? CodInterno { get; set; }

    public decimal QuantidadeIndicada { get; set; }
    public decimal QuantidadeRecebida { get; set; }
    public string Unidade { get; set; } = "kg"; // kg, t, m³
}