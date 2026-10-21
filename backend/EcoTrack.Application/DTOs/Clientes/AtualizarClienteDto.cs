namespace EcoTrack.Application.DTOs.Clientes;

public class AtualizarClienteDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Ceo { get; set; } = string.Empty;
    public string RepresentanteLegal { get; set; } = string.Empty;
}