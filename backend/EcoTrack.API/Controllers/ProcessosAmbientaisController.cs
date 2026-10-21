using EcoTrack.Application.DTOs.ProcessosAmbientais;
using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("processos-ambientais")]
public class ProcessosAmbientaisController : ControllerBase
{
    private readonly ProcessoAmbientalService _processoService;

    public ProcessosAmbientaisController(ProcessoAmbientalService processoService)
    {
        _processoService = processoService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var processos = await _processoService.ListarTodosAsync();
        return Ok(processos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(Guid id)
    {
        var processo = await _processoService.BuscarPorIdAsync(id);
        if (processo == null)
        {
            return NotFound(new { mensagem = "Processo ambiental não encontrado." });
        }
        return Ok(processo);
    }

    [HttpPost]
    public async Task<IActionResult> Criar(CriarProcessoAmbientalDto dto)
    {
        var processo = await _processoService.CriarAsync(dto);
        if (processo == null)
        {
            return BadRequest(new { mensagem = "Cliente informado é inválido ou está desativado." });
        }
        return Created($"/processos-ambientais/{processo.Id}", processo);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> AtualizarStatus(Guid id, [FromBody] AtualizarStatusProcessoDto dto)
    {
        var processo = await _processoService.AtualizarStatusAsync(id, dto.Status);
        if (processo == null)
        {
            return NotFound(new { mensagem = "Processo ambiental não encontrado." });
        }
        return Ok(processo);
    }
}