using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

using EcoTrack.Application.Interfaces;
using EcoTrack.Infrastructure.Repositories;
using EcoTrack.Infrastructure.Services;
using EcoTrack.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<EcoTrackDbContext>(options =>
    options.UseNpgsql(connectionString));

// Repositórios
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ICategoriaServicoRepository, CategoriaServicoRepository>();
builder.Services.AddScoped<IServicoRepository, ServicoRepository>();
builder.Services.AddScoped<IProcessoAmbientalRepository, ProcessoAmbientalRepository>();
builder.Services.AddScoped<ILicencaAmbientalRepository, LicencaAmbientalRepository>();
builder.Services.AddScoped<IDocumentoRepository, DocumentoRepository>();
builder.Services.AddScoped<IMtrRepository, MtrRepository>();

// Serviços
builder.Services.AddScoped<ClienteService>();
builder.Services.AddScoped<CategoriaServicoService>();
builder.Services.AddScoped<ServicoService>();
builder.Services.AddScoped<ProcessoAmbientalService>();
builder.Services.AddScoped<LicencaAmbientalService>();
builder.Services.AddScoped<IDropboxService, DropboxService>();
builder.Services.AddScoped<DocumentoService>();
builder.Services.AddScoped<MtrImportService>();

// OpenAPI
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

// Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();