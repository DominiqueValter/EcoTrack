using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class ServicoRepository : IServicoRepository
{
    private readonly EcoTrackDbContext _context;

    public ServicoRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<Servico>> ListarTodosAsync()
    {
        return await _context.Servicos
            .Include(s => s.CategoriaServico) // Carrega os dados da Categoria vinculada
            .AsNoTracking()
            .Where(s => s.Ativo)
            .ToListAsync();
    }

    public async Task<Servico?> BuscarPorIdAsync(Guid id)
    {
        return await _context.Servicos
            .Include(s => s.CategoriaServico)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Servico> CriarAsync(Servico servico)
    {
        await _context.Servicos.AddAsync(servico);
        await _context.SaveChangesAsync();
        return servico;
    }
}