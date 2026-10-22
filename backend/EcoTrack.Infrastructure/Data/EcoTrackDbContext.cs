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
    public DbSet<LicencaAmbiental> LicencasAmbientais { get; set; }
    public DbSet<Condicionante> Condicionantes { get; set; }
    public DbSet<Documento> Documentos { get; set; }

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

        // ProcessoAmbiental -> LicencaAmbiental (1:N)
        modelBuilder.Entity<LicencaAmbiental>()
            .HasOne(l => l.ProcessoAmbiental)
            .WithMany()
            .HasForeignKey(l => l.ProcessoAmbientalId)
            .OnDelete(DeleteBehavior.Restrict);

        // LicencaAmbiental -> Condicionante (1:N)
        modelBuilder.Entity<Condicionante>()
            .HasOne(c => c.LicencaAmbiental)
            .WithMany(l => l.Condicionantes)
            .HasForeignKey(c => c.LicencaAmbientalId)
            .OnDelete(DeleteBehavior.Cascade);

        // Documento -> Cliente (N:1 opcional)
        modelBuilder.Entity<Documento>()
            .HasOne(d => d.Cliente)
            .WithMany()
            .HasForeignKey(d => d.ClienteId)
            .OnDelete(DeleteBehavior.SetNull);

        // Documento -> ProcessoAmbiental (N:1 opcional)
        modelBuilder.Entity<Documento>()
            .HasOne(d => d.ProcessoAmbiental)
            .WithMany()
            .HasForeignKey(d => d.ProcessoAmbientalId)
            .OnDelete(DeleteBehavior.SetNull);

        // Documento -> LicencaAmbiental (N:1 opcional)
        modelBuilder.Entity<Documento>()
            .HasOne(d => d.LicencaAmbiental)
            .WithMany()
            .HasForeignKey(d => d.LicencaAmbientalId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}