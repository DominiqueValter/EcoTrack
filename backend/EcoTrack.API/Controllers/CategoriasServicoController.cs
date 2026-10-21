using EcoTrack.Application.DTOs.CategoriasServico;
using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("categorias-servico")]
public class CategoriasServicoController : ControllerBase
{
    private readonly CategoriaServicoService _categoriaService;

    public CategoriasServicoController(CategoriaServicoService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodas()
    {
        var categorias = await _categoriaService.ListarTodasAsync();
        return Ok(categorias);
    }

    [HttpPost]
    public async Task<IActionResult> Criar(CriarCategoriaServicoDto dto)
    {
        var categoria = await _categoriaService.CriarAsync(dto);
        return Created($"/categorias-servico/{categoria.Id}", categoria);
    }
}