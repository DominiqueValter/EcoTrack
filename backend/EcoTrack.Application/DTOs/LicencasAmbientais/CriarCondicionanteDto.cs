namespace EcoTrack.Application.DTOs.LicencasAmbientais;

public class CriarCondicionanteDto
{
    public string Descricao { get; set; } = string.Empty;
    public DateTime? Prazo { get; set; }
    public string? Observacao { get; set; }
}