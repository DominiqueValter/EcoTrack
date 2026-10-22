using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface IDocumentoRepository
{
    Task<List<Documento>> ListarTodosAsync();
    Task<Documento?> BuscarPorIdAsync(Guid id);
    Task<Documento> CriarAsync(Documento documento);
    Task DeletarAsync(Documento documento);
}