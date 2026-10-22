using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.DTOs.LicencasAmbientais;

public class CriarLicencaAmbientalDto
{
    public string Numero { get; set; } = string.Empty;
    public TipoLicenca Tipo { get; set; }
    public string OrgaoAmbiental { get; set; } = string.Empty;
    public DateTime DataEmissao { get; set; }
    public DateTime DataValidade { get; set; }
    public string? Observacoes { get; set; }
    public Guid ProcessoAmbientalId { get; set; }

    public List<CriarCondicionanteDto> Condicionantes { get; set; } = new();
}