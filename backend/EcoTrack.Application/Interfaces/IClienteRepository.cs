using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface IClienteRepository
{
    Task<List<Cliente>> ListarTodosAsync();

    Task<Cliente?> BuscarPorIdAsync(Guid id);
    Task<Cliente> CriarAsync(Cliente cliente);
    Task<Cliente> AtualizarAsync(Cliente cliente);
}