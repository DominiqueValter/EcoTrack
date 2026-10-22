using EcoTrack.Application.DTOs.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.DTOs.LicencasAmbientais;

public class LicencaAmbientalResponseDto : BaseDto
{
    public string Numero { get; set; } = string.Empty;
    public TipoLicenca Tipo { get; set; }
    public string NomeTipo => Tipo.ToString();
    public string OrgaoAmbiental { get; set; } = string.Empty;
    public DateTime DataEmissao { get; set; }
    public DateTime DataValidade { get; set; }
    public StatusLicenca Status { get; set; }
    public string NomeStatus => Status.ToString();
    public string? Observacoes { get; set; }

    public Guid ProcessoAmbientalId { get; set; }
    public string NumeroProcesso { get; set; } = string.Empty;

    public List<CondicionanteResponseDto> Condicionantes { get; set; } = new();
}