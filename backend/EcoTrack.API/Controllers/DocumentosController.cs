using EcoTrack.Application.DTOs.Documentos;
using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("documentos")]
public class DocumentosController : ControllerBase
{
    private readonly DocumentoService _documentoService;

    public DocumentosController(DocumentoService documentoService)
    {
        _documentoService = documentoService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var documentos = await _documentoService.ListarTodosAsync();
        return Ok(documentos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorId(Guid id)
    {
        var documento = await _documentoService.BuscarPorIdAsync(id);
        if (documento == null)
        {
            return NotFound(new { mensagem = "Documento não encontrado." });
        }
        return Ok(documento);
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] UploadDocumentoDto dto)
    {
        var documento = await _documentoService.UploadAsync(dto);
        if (documento == null)
        {
            return BadRequest(new { mensagem = "Nenhum arquivo válido foi enviado." });
        }
        return Created($"/documentos/{documento.Id}", documento);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var sucesso = await _documentoService.DeletarAsync(id);
        if (!sucesso)
        {
            return NotFound(new { mensagem = "Documento não encontrado." });
        }
        return NoContent();
    }
}