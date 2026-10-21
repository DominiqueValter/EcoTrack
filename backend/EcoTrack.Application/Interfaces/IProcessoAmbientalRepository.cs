using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface IProcessoAmbientalRepository
{
    Task<List<ProcessoAmbiental>> ListarTodosAsync();
    Task<ProcessoAmbiental?> BuscarPorIdAsync(Guid id);
    Task<ProcessoAmbiental> CriarAsync(ProcessoAmbiental processo);
    Task<ProcessoAmbiental> AtualizarAsync(ProcessoAmbiental processo);
}