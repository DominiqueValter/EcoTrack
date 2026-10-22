using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Interfaces;

public interface ILicencaAmbientalRepository
{
    Task<List<LicencaAmbiental>> ListarTodasAsync();
    Task<LicencaAmbiental?> BuscarPorIdAsync(Guid id);
    Task<LicencaAmbiental> CriarAsync(LicencaAmbiental licenca);
    Task<Condicionante?> BuscarCondicionantePorIdAsync(Guid condicionanteId);
    Task AtualizarCondicionanteAsync(Condicionante condicionante);
}