using EcoTrack.Application.DTOs.Documentos;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Services;

public class DocumentoService
{
    private readonly IDocumentoRepository _documentoRepository;
    private readonly IDropboxService _dropboxService;

    public DocumentoService(
        IDocumentoRepository documentoRepository,
        IDropboxService dropboxService)
    {
        _documentoRepository = documentoRepository;
        _dropboxService = dropboxService;
    }

    public async Task<List<DocumentoResponseDto>> ListarTodosAsync()
    {
        var documentos = await _documentoRepository.ListarTodosAsync();
        return documentos.Select(MapearParaDto).ToList();
    }

    public async Task<DocumentoResponseDto?> BuscarPorIdAsync(Guid id)
    {
        var documento = await _documentoRepository.BuscarPorIdAsync(id);
        return documento == null ? null : MapearParaDto(documento);
    }

    public async Task<DocumentoResponseDto?> UploadAsync(UploadDocumentoDto dto)
    {
        if (dto.Arquivo == null || dto.Arquivo.Length == 0)
        {
            return null;
        }

        var extensao = Path.GetExtension(dto.Arquivo.FileName).ToLowerInvariant();
        var nomeArquivoUnico = $"{Guid.NewGuid()}_{dto.Arquivo.FileName}";
        var pastaDropbox = "/EcoTrack/Documentos";

        if (dto.ClienteId.HasValue)
        {
            pastaDropbox = $"/EcoTrack/Clientes/{dto.ClienteId}";
        }

        using var stream = dto.Arquivo.OpenReadStream();
        var (dropboxPath, fileId) = await _dropboxService.UploadFileAsync(stream, nomeArquivoUnico, pastaDropbox);

        var documento = new Documento
        {
            Nome = dto.Arquivo.FileName,
            Extensao = extensao,
            TamanhoBytes = dto.Arquivo.Length,
            DropboxPath = dropboxPath,
            DropboxFileId = fileId,
            DataUpload = DateTime.UtcNow,
            ClienteId = dto.ClienteId,
            ProcessoAmbientalId = dto.ProcessoAmbientalId,
            LicencaAmbientalId = dto.LicencaAmbientalId
        };

        var novoDocumento = await _documentoRepository.CriarAsync(documento);
        var documentoCompleto = await _documentoRepository.BuscarPorIdAsync(novoDocumento.Id);

        return MapearParaDto(documentoCompleto!);
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var documento = await _documentoRepository.BuscarPorIdAsync(id);
        if (documento == null)
        {
            return false;
        }

        await _dropboxService.DeleteFileAsync(documento.DropboxPath);
        await _documentoRepository.DeletarAsync(documento);
        return true;
    }

    private static DocumentoResponseDto MapearParaDto(Documento d)
    {
        return new DocumentoResponseDto
        {
            Id = d.Id,
            CreatedAt = d.CreatedAt,
            UpdatedAt = d.UpdatedAt,
            Nome = d.Nome,
            Extensao = d.Extensao,
            TamanhoBytes = d.TamanhoBytes,
            DropboxPath = d.DropboxPath,
            DropboxFileId = d.DropboxFileId,
            DataUpload = d.DataUpload,
            ClienteId = d.ClienteId,
            NomeCliente = d.Cliente?.Nome,
            ProcessoAmbientalId = d.ProcessoAmbientalId,
            NumeroProcesso = d.ProcessoAmbiental?.NumeroProcesso,
            LicencaAmbientalId = d.LicencaAmbientalId,
            NumeroLicenca = d.LicencaAmbiental?.Numero
        };
    }
}