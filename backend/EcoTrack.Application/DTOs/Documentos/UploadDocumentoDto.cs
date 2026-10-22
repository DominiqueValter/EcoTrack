using Microsoft.AspNetCore.Http;

namespace EcoTrack.Application.DTOs.Documentos;

public class UploadDocumentoDto
{
    public IFormFile Arquivo { get; set; } = null!;
    public Guid? ClienteId { get; set; }
    public Guid? ProcessoAmbientalId { get; set; }
    public Guid? LicencaAmbientalId { get; set; }
}