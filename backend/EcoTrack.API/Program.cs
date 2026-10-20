using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

using EcoTrack.Application.Interfaces;
using EcoTrack.Application.Services;
using EcoTrack.Infrastructure.Repositories;
using EcoTrack.Application.DTOs.Clientes;

var builder = WebApplication.CreateBuilder(args);

// Banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<EcoTrackDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ClienteService>();

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/clientes", async (ClienteService clienteService) =>
{
    var clientes = await clienteService.ListarTodosAsync();

    return Results.Ok(clientes);
});

app.MapPost("/clientes", async (
    CriarClienteDto dto,
    ClienteService clienteService) =>
{
    var cliente = await clienteService.CriarAsync(dto);

    return Results.Created($"/clientes/{cliente.Id}", cliente);
});

app.Run();