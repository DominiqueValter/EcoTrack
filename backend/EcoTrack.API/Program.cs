using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

using EcoTrack.Application.Interfaces;
using EcoTrack.Infrastructure.Repositories;
using EcoTrack.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<EcoTrackDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ClienteService>();

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