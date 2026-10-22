using EcoTrack.Application.DTOs.Common;

namespace EcoTrack.Application.DTOs.Documentos;

public class DocumentoResponseDto : BaseDto
{
    public string Nome { get; set; } = string.Empty;
    public string Extensao { get; set; } = string.Empty;
    public long TamanhoBytes { get; set; }
    public string DropboxPath { get; set; } = string.Empty;
    public string? DropboxFileId { get; set; }
    public DateTime DataUpload { get; set; }

    public Guid? ClienteId { get; set; }
    public string? NomeCliente { get; set; }

    public Guid? ProcessoAmbientalId { get; set; }
    public string? NumeroProcesso { get; set; }

    public Guid? LicencaAmbientalId { get; set; }
    public string? NumeroLicenca { get; set; }
}