using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class ProcessoAmbientalRepository : IProcessoAmbientalRepository
{
    private readonly EcoTrackDbContext _context;

    public ProcessoAmbientalRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProcessoAmbiental>> ListarTodosAsync()
    {
        return await _context.ProcessosAmbientais
            .Include(p => p.Cliente)
            .Include(p => p.ProcessoServicos)
                .ThenInclude(ps => ps.Servico)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ProcessoAmbiental?> BuscarPorIdAsync(Guid id)
    {
        return await _context.ProcessosAmbientais
            .Include(p => p.Cliente)
            .Include(p => p.ProcessoServicos)
                .ThenInclude(ps => ps.Servico)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<ProcessoAmbiental> CriarAsync(ProcessoAmbiental processo)
    {
        await _context.ProcessosAmbientais.AddAsync(processo);
        await _context.SaveChangesAsync();
        return processo;
    }

    public async Task<ProcessoAmbiental> AtualizarAsync(ProcessoAmbiental processo)
    {
        _context.ProcessosAmbientais.Update(processo);
        await _context.SaveChangesAsync();
        return processo;
    }
}