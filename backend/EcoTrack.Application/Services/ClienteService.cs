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

    public async Task<List<Cliente>> ListarTodosAsync()
    {
        return await _clienteRepository.ListarTodosAsync();
    }

    public async Task<Cliente> CriarAsync(CriarClienteDto dto)
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

        return await _clienteRepository.CriarAsync(cliente);
    }
}