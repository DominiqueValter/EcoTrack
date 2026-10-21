namespace EcoTrack.Application.DTOs.Servicos;

public class CriarServicoDto
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public Guid CategoriaServicoId { get; set; }
}