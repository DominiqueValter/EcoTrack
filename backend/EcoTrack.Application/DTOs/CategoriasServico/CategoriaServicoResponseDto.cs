using EcoTrack.Application.DTOs.Common;

namespace EcoTrack.Application.DTOs.CategoriasServico;

public class CategoriaServicoResponseDto : BaseDto
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Ativo { get; set; }
}