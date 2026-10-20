using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface IClienteRepository
{
    Task<List<Cliente>> ListarTodosAsync();

    Task<Cliente> CriarAsync(Cliente cliente);
}