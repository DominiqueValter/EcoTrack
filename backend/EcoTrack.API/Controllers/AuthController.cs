using EcoTrack.Application.DTOs.Auth;
using EcoTrack.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;

    public AuthController(TokenService tokenService)
    {
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDto request)
    {
        // Validação mock para simulação imediata do fluxo de autenticação
        if (request.Email == "admin@ecotrack.com.br" && request.Senha == "123456")
        {
            var authResult = _tokenService.GerarToken(
                id: Guid.NewGuid().ToString(),
                nome: "Dominique Valter",
                email: request.Email,
                role: "Administrador"
            );

            return Ok(authResult);
        }

        return Unauthorized(new { mensagem = "E-mail ou senha inválidos." });
    }
}