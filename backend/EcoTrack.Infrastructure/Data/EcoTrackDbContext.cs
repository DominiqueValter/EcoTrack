using EcoTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Data;

public class EcoTrackDbContext : DbContext
{
    public EcoTrackDbContext(DbContextOptions<EcoTrackDbContext> options)
        : base(options)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();
}