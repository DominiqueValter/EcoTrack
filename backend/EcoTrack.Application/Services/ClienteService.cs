using EcoTrack.Application.DTOs.Clientes;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Services;

public class ClienteService
{
    private readonly IClienteRepository _clienteRepository;

    public ClienteService(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public async Task<List<ClienteResponseDto>> ListarTodosAsync()
    {
        var clientes = await _clienteRepository.ListarTodosAsync();
        return clientes.Select(MapearParaDto).ToList();
    }

    public async Task<ClienteResponseDto?> BuscarPorIdAsync(Guid id)
    {
        var cliente = await _clienteRepository.BuscarPorIdAsync(id);
        return cliente == null ? null : MapearParaDto(cliente);
    }

    public async Task<ClienteResponseDto> CriarAsync(CriarClienteDto dto)
    {
        var cliente = new Cliente
        {
            Nome = dto.Nome,
            Cnpj = dto.Cnpj,
            Email = dto.Email,
            Telefone = dto.Telefone,
            Cep = dto.Cep,
            Endereco = dto.Endereco,
            Cidade = dto.Cidade,
            Estado = dto.Estado,
            Ceo = dto.Ceo,
            RepresentanteLegal = dto.RepresentanteLegal
        };

        var novoCliente = await _clienteRepository.CriarAsync(cliente);
        return MapearParaDto(novoCliente);
    }

    public async Task<ClienteResponseDto?> AtualizarAsync(Guid id, AtualizarClienteDto dto)
    {
        var cliente = await _clienteRepository.BuscarPorIdAsync(id);

        if (cliente == null)
        {
            return null;
        }

        cliente.Nome = dto.Nome;
        cliente.Email = dto.Email;
        cliente.Telefone = dto.Telefone;
        cliente.Cep = dto.Cep;
        cliente.Endereco = dto.Endereco;
        cliente.Cidade = dto.Cidade;
        cliente.Estado = dto.Estado;
        cliente.Ceo = dto.Ceo;
        cliente.RepresentanteLegal = dto.RepresentanteLegal;
        cliente.UpdatedAt = DateTime.UtcNow;

        var clienteAtualizado = await _clienteRepository.AtualizarAsync(cliente);
        return MapearParaDto(clienteAtualizado);
    }

    public async Task<bool> DesativarAsync(Guid id)
    {
        var cliente = await _clienteRepository.BuscarPorIdAsync(id);

        if (cliente == null)
        {
            return false;
        }

        cliente.Ativo = false;
        cliente.UpdatedAt = DateTime.UtcNow;

        await _clienteRepository.AtualizarAsync(cliente);
        return true;
    }

    // Método auxiliar de mapeamento
    private static ClienteResponseDto MapearParaDto(Cliente cliente)
    {
        return new ClienteResponseDto
        {
            Id = cliente.Id,
            CreatedAt = cliente.CreatedAt,
            UpdatedAt = cliente.UpdatedAt,
            Nome = cliente.Nome,
            Cnpj = cliente.Cnpj,
            Email = cliente.Email,
            Telefone = cliente.Telefone,
            Cep = cliente.Cep,
            Endereco = cliente.Endereco,
            Cidade = cliente.Cidade,
            Estado = cliente.Estado,
            Ceo = cliente.Ceo,
            RepresentanteLegal = cliente.RepresentanteLegal,
            Ativo = cliente.Ativo
        };
    }
}