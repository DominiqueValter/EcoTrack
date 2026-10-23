using System.Text;
using EcoTrack.Application.Interfaces;
using EcoTrack.Application.Services;
using EcoTrack.Infrastructure.Data;
using EcoTrack.Infrastructure.Repositories;
using EcoTrack.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
builder.Services.AddScoped<TokenService>();

// Configuração de CORS para permitir comunicação com o Front-end React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuração de Autenticação JWT e Autorização
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "EcoTrack_Chave_Super_Secreta_Desenvolvimento_2026!";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// OpenAPI & Controllers
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

// Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Aplicar politica de CORS
app.UseCors("AllowReactApp");

// Middlewares de Segurança (A ordem é fundamental: Authentication -> Authorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();