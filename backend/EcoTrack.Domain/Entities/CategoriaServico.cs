using EcoTrack.Domain.Common;

namespace EcoTrack.Domain.Entities;

public class CategoriaServico : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public bool Ativo { get; set; } = true;

    // Propriedade de navegação do Entity Framework (1 Categoria : N Serviços)
    public ICollection<Servico> Servicos { get; set; } = new List<Servico>();
}