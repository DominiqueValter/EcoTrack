using EcoTrack.Domain.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Domain.Entities;

public class Condicionante : BaseEntity
{
    public string Descricao { get; set; } = string.Empty;
    public DateTime? Prazo { get; set; }
    public StatusCondicionante Status { get; set; } = StatusCondicionante.Pendente;
    public string? Observacao { get; set; }

    // Relacionamento com LicencaAmbiental
    public Guid LicencaAmbientalId { get; set; }
    public LicencaAmbiental? LicencaAmbiental { get; set; }
}