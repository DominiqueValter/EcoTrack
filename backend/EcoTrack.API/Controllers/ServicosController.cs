using EcoTrack.Application.DTOs.Servicos;
using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("servicos")]
public class ServicosController : ControllerBase
{
    private readonly ServicoService _servicoService;

    public ServicosController(ServicoService servicoService)
    {
        _servicoService = servicoService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var servicos = await _servicoService.ListarTodosAsync();
        return Ok(servicos);
    }

    [HttpPost]
    public async Task<IActionResult> Criar(CriarServicoDto dto)
    {
        var servico = await _servicoService.CriarAsync(dto);

        if (servico == null)
        {
            return BadRequest(new { mensagem = "A CategoriaServicoId informada não existe." });
        }

        return Created($"/servicos/{servico.Id}", servico);
    }
}