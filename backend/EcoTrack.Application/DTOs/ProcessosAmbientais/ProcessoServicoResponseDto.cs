using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.DTOs.ProcessosAmbientais;

public class ProcessoServicoResponseDto
{
    public Guid ServicoId { get; set; }
    public string NomeServico { get; set; } = string.Empty;
    public StatusProcesso Status { get; set; }
    public string NomeStatus => Status.ToString();
    public string? Observacao { get; set; }
}