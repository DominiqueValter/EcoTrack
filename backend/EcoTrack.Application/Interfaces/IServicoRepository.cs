using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface IServicoRepository
{
    Task<List<Servico>> ListarTodosAsync();
    Task<Servico?> BuscarPorIdAsync(Guid id);
    Task<Servico> CriarAsync(Servico servico);
}