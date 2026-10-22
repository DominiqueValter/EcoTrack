using EcoTrack.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EcoTrack.API.Controllers;

[ApiController]
[Route("mtrs")]
public class MtrsController : ControllerBase
{
    private readonly MtrImportService _mtrImportService;

    public MtrsController(MtrImportService mtrImportService)
    {
        _mtrImportService = mtrImportService;
    }

    [HttpPost("importar-csv")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportarCsv(IFormFile arquivo, [FromQuery] Guid clienteId)
    {
        if (arquivo == null || arquivo.Length == 0)
        {
            return BadRequest(new { mensagem = "Nenhum arquivo CSV válido foi enviado." });
        }

        var quantidadeImportada = await _mtrImportService.ImportarCsvAsync(arquivo, clienteId);

        if (quantidadeImportada == null)
        {
            return BadRequest(new { mensagem = "O clienteId informado não existe ou está inativo." });
        }

        return Ok(new
        {
            mensagem = "Importação realizada com sucesso.",
            totalMtrsImportados = quantidadeImportada
        });
    }
}