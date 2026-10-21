using EcoTrack.Application.DTOs.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.DTOs.ProcessosAmbientais;

public class ProcessoAmbientalResponseDto : BaseDto
{
    public string NumeroProcesso { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public StatusProcesso Status { get; set; }
    public string NomeStatus => Status.ToString();
    public DateTime DataAbertura { get; set; }
    public DateTime? DataConclusao { get; set; }
    
    public Guid ClienteId { get; set; }
    public string NomeCliente { get; set; } = string.Empty;

    public List<ProcessoServicoResponseDto> Servicos { get; set; } = new();
}