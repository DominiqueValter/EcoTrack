using EcoTrack.Domain.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Domain.Entities;

public class ProcessoAmbiental : BaseEntity
{
    public string NumeroProcesso { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public StatusProcesso Status { get; set; } = StatusProcesso.Cadastrada;
    public DateTime DataAbertura { get; set; } = DateTime.UtcNow;
    public DateTime? DataConclusao { get; set; }

    // Relacionamento com Cliente
    public Guid ClienteId { get; set; }
    public Cliente? Cliente { get; set; }

    // Relacionamento N:N com Serviços do processo
    public ICollection<ProcessoServico> ProcessoServicos { get; set; } = new List<ProcessoServico>();
}