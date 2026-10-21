using EcoTrack.Application.DTOs.Common;

namespace EcoTrack.Application.DTOs.Servicos;

public class ServicoResponseDto : BaseDto
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Ativo { get; set; }
    public Guid CategoriaServicoId { get; set; }
    public string NomeCategoriaServico { get; set; } = string.Empty;
}