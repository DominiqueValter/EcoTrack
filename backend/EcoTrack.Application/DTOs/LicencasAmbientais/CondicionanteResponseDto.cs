using EcoTrack.Application.DTOs.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.DTOs.LicencasAmbientais;

public class CondicionanteResponseDto : BaseDto
{
    public string Descricao { get; set; } = string.Empty;
    public DateTime? Prazo { get; set; }
    public StatusCondicionante Status { get; set; }
    public string NomeStatus => Status.ToString();
    public string? Observacao { get; set; }
    public Guid LicencaAmbientalId { get; set; }
}