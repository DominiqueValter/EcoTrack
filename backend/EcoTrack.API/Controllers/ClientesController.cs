using EcoTrack.Application.DTOs.Clientes;
using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("clientes")]
public class ClientesController : ControllerBase
{
    private readonly ClienteService _clienteService;

    public ClientesController(ClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var clientes = await _clienteService.ListarTodosAsync();

        return Ok(clientes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(Guid id)
    {
        var cliente = await _clienteService.BuscarPorIdAsync(id);

        if (cliente == null)
        {
            return NotFound(new { mensagem = "Cliente não encontrado." });
        }

        return Ok(cliente);
    }
    [HttpPost]
    public async Task<IActionResult> Criar(CriarClienteDto dto)
    {
        var cliente = await _clienteService.CriarAsync(dto);

        return Created($"/clientes/{cliente.Id}", cliente);
    }
}