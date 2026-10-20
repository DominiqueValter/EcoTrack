using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly EcoTrackDbContext _context;

    public ClienteRepository(EcoTrackDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cliente>> ListarTodosAsync()
    {
        return await _context.Clientes
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Cliente> CriarAsync(Cliente cliente)
    {
        await _context.Clientes.AddAsync(cliente);
        await _context.SaveChangesAsync();

        return cliente;
    }
}