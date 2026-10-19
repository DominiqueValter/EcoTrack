using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Data;

public class EcoTrackDbContext : DbContext
{
    public EcoTrackDbContext(DbContextOptions<EcoTrackDbContext> options)
        : base(options)
    {
    }
}