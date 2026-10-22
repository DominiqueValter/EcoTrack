using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class MtrRepository : IMtrRepository
{
    private readonly EcoTrackDbContext _context;

    public MtrRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task AdicionarVariosAsync(IEnumerable<Mtr> mtrs)
    {
        await _context.Mtrs.AddRangeAsync(mtrs);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Mtr>> ListarTodosAsync()
    {
        return await _context.Mtrs
            .Include(m => m.Cliente)
            .Include(m => m.ItensResiduos)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Mtr?> BuscarPorIdAsync(Guid id)
    {
        return await _context.Mtrs
            .Include(m => m.Cliente)
            .Include(m => m.ItensResiduos)
            .FirstOrDefaultAsync(m => m.Id == id);
    }
}