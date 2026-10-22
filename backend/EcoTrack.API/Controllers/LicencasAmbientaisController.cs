using EcoTrack.Application.DTOs.LicencasAmbientais;
using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("licencas-ambientais")]
public class LicencasAmbientaisController : ControllerBase
{
    private readonly LicencaAmbientalService _licencaService;

    public LicencasAmbientaisController(LicencaAmbientalService licencaService)
    {
        _licencaService = licencaService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodas()
    {
        var licencas = await _licencaService.ListarTodasAsync();
        return Ok(licencas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(Guid id)
    {
        var licenca = await _licencaService.BuscarPorIdAsync(id);
        if (licenca == null)
        {
            return NotFound(new { mensagem = "Licença ambiental não encontrada." });
        }
        return Ok(licenca);
    }

    [HttpPost]
    public async Task<IActionResult> Criar(CriarLicencaAmbientalDto dto)
    {
        var licenca = await _licencaService.CriarAsync(dto);
        if (licenca == null)
        {
            return BadRequest(new { mensagem = "O ProcessoAmbientalId informado não existe." });
        }
        return Created($"/licencas-ambientais/{licenca.Id}", licenca);
    }

    [HttpPatch("condicionantes/{id}/status")]
    public async Task<IActionResult> AtualizarStatusCondicionante(Guid id, [FromBody] AtualizarStatusCondicionanteDto dto)
    {
        var sucesso = await _licencaService.AtualizarStatusCondicionanteAsync(id, dto.Status);
        if (!sucesso)
        {
            return NotFound(new { mensagem = "Condicionante não encontrada." });
        }
        return NoContent();
    }
}