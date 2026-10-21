using EcoTrack.Domain.Common;

namespace EcoTrack.Domain.Entities;

public class Servico : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Ativo { get; set; } = true;

    // Relacionamento com CategoriaServico (Chave Estrangeira)
    public Guid CategoriaServicoId { get; set; }
    public CategoriaServico? CategoriaServico { get; set; }
}