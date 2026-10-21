namespace EcoTrack.Application.DTOs.ProcessosAmbientais;

public class CriarProcessoAmbientalDto
{
    public string NumeroProcesso { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public Guid ClienteId { get; set; }
    
    // Lista de IDs dos serviços selecionados para compor o processo
    public List<Guid> ServicosIds { get; set; } = new();
}