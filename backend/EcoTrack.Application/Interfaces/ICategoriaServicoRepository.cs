using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface ICategoriaServicoRepository
{
    Task<List<CategoriaServico>> ListarTodasAsync();
    Task<CategoriaServico?> BuscarPorIdAsync(Guid id);
    Task<CategoriaServico> CriarAsync(CategoriaServico categoria);
}