using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class CategoriaServicoRepository : ICategoriaServicoRepository
{
    private readonly EcoTrackDbContext _context;

    public CategoriaServicoRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoriaServico>> ListarTodasAsync()
    {
        return await _context.CategoriasServico
            .AsNoTracking()
            .Where(c => c.Ativo)
            .ToListAsync();
    }

    public async Task<CategoriaServico?> BuscarPorIdAsync(Guid id)
    {
        return await _context.CategoriasServico
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<CategoriaServico> CriarAsync(CategoriaServico categoria)
    {
        await _context.CategoriasServico.AddAsync(categoria);
        await _context.SaveChangesAsync();
        return categoria;
    }
}