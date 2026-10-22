using EcoTrack.Domain.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Domain.Entities;

public class LicencaAmbiental : BaseEntity
{
    public string Numero { get; set; } = string.Empty;
    public TipoLicenca Tipo { get; set; } = TipoLicenca.LO;
    public string OrgaoAmbiental { get; set; } = string.Empty; // ex: IAT, IBAMA, CETESB
    public DateTime DataEmissao { get; set; }
    public DateTime DataValidade { get; set; }
    public StatusLicenca Status { get; set; } = StatusLicenca.Vigente;
    public string? Observacoes { get; set; }

    // Relacionamento com ProcessoAmbiental
    public Guid ProcessoAmbientalId { get; set; }
    public ProcessoAmbiental? ProcessoAmbiental { get; set; }

    // Relacionamento com Condicionantes (1:N)
    public ICollection<Condicionante> Condicionantes { get; set; } = new List<Condicionante>();
}