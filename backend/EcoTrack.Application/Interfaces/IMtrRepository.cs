using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface IMtrRepository
{
    Task AdicionarVariosAsync(IEnumerable<Mtr> mtrs);
    Task<List<Mtr>> ListarTodosAsync();
    Task<Mtr?> BuscarPorIdAsync(Guid id);
}