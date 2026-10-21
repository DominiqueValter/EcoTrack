using EcoTrack.Domain.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Domain.Entities;

public class ProcessoServico : BaseEntity
{
    public Guid ProcessoAmbientalId { get; set; }
    public ProcessoAmbiental? ProcessoAmbiental { get; set; }

    public Guid ServicoId { get; set; }
    public Servico? Servico { get; set; }

    public StatusProcesso Status { get; set; } = StatusProcesso.Cadastrada;
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public string? Observacao { get; set; }
}