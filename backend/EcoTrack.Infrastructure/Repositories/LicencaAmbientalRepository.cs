using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class LicencaAmbientalRepository : ILicencaAmbientalRepository
{
    private readonly EcoTrackDbContext _context;

    public LicencaAmbientalRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<LicencaAmbiental>> ListarTodasAsync()
    {
        return await _context.LicencasAmbientais
            .Include(l => l.ProcessoAmbiental)
            .Include(l => l.Condicionantes)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<LicencaAmbiental?> BuscarPorIdAsync(Guid id)
    {
        return await _context.LicencasAmbientais
            .Include(l => l.ProcessoAmbiental)
            .Include(l => l.Condicionantes)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<LicencaAmbiental> CriarAsync(LicencaAmbiental licenca)
    {
        await _context.LicencasAmbientais.AddAsync(licenca);
        await _context.SaveChangesAsync();
        return licenca;
    }

    public async Task<Condicionante?> BuscarCondicionantePorIdAsync(Guid condicionanteId)
    {
        return await _context.Condicionantes
            .FirstOrDefaultAsync(c => c.Id == condicionanteId);
    }

    public async Task AtualizarCondicionanteAsync(Condicionante condicionante)
    {
        _context.Condicionantes.Update(condicionante);
        await _context.SaveChangesAsync();
    }
}