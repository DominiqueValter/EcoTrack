using EcoTrack.Domain.Common;

namespace EcoTrack.Domain.Entities;

public class Cliente : BaseEntity
{
    public string Nome { get; set; } = string.Empty;

    public string Cnpj { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Telefone { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;

    public string Endereco { get; set; } = string.Empty;

    public string Cidade { get; set; } = string.Empty;

    public string Estado { get; set; } = string.Empty;
    public string Ceo { get; set; } = string.Empty;

    public string RepresentanteLegal { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;
}