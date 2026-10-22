using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class DocumentoRepository : IDocumentoRepository
{
    private readonly EcoTrackDbContext _context;

    public DocumentoRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<Documento>> ListarTodosAsync()
    {
        return await _context.Documentos
            .Include(d => d.Cliente)
            .Include(d => d.ProcessoAmbiental)
            .Include(d => d.LicencaAmbiental)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Documento?> BuscarPorIdAsync(Guid id)
    {
        return await _context.Documentos
            .Include(d => d.Cliente)
            .Include(d => d.ProcessoAmbiental)
            .Include(d => d.LicencaAmbiental)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Documento> CriarAsync(Documento documento)
    {
        await _context.Documentos.AddAsync(documento);
        await _context.SaveChangesAsync();
        return documento;
    }

    public async Task DeletarAsync(Documento documento)
    {
        _context.Documentos.Remove(documento);
        await _context.SaveChangesAsync();
    }
}