using EcoTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<EcoTrackDbContext>(options =>
    options.UseNpgsql(connectionString));

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

// Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Health check do banco
app.MapGet("/health/database", async (EcoTrackDbContext db) =>
{
    try
    {
        await db.Database.OpenConnectionAsync();
        await db.Database.CloseConnectionAsync();

        return Results.Ok(new
        {
            database = "connected"
        });
    }
    catch
    {
        return Results.Problem(
            title: "Database connection failed",
            statusCode: 500);
    }
});

app.Run();