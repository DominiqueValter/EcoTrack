using EcoTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EcoTrack.Infrastructure.Data;

public class EcoTrackDbContext : DbContext
{
    public EcoTrackDbContext(DbContextOptions<EcoTrackDbContext> options) : base(options) { }

    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<CategoriaServico> CategoriasServico { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<ProcessoAmbiental> ProcessosAmbientais { get; set; }
    public DbSet<ProcessoServico> ProcessosServicos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Categoria -> Servico (1:N)
        modelBuilder.Entity<Servico>()
            .HasOne(s => s.CategoriaServico)
            .WithMany(c => c.Servicos)
            .HasForeignKey(s => s.CategoriaServicoId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cliente -> ProcessoAmbiental (1:N)
        modelBuilder.Entity<ProcessoAmbiental>()
            .HasOne(p => p.Cliente)
            .WithMany()
            .HasForeignKey(p => p.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProcessoAmbiental -> ProcessoServico (1:N)
        modelBuilder.Entity<ProcessoServico>()
            .HasOne(ps => ps.ProcessoAmbiental)
            .WithMany(p => p.ProcessoServicos)
            .HasForeignKey(ps => ps.ProcessoAmbientalId)
            .OnDelete(DeleteBehavior.Cascade);

        // Servico -> ProcessoServico (1:N)
        modelBuilder.Entity<ProcessoServico>()
            .HasOne(ps => ps.Servico)
            .WithMany()
            .HasForeignKey(ps => ps.ServicoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}