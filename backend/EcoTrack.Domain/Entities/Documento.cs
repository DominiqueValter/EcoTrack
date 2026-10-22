using EcoTrack.Domain.Common;

namespace EcoTrack.Domain.Entities;

public class Documento : BaseEntity
{
    public string Nome { get; set; } = string.Empty;
    public string Extensao { get; set; } = string.Empty; // ex: .pdf, .docx, .png
    public long TamanhoBytes { get; set; }
    public string DropboxPath { get; set; } = string.Empty; // Caminho no Dropbox ex: /Clientes/SuperSuco/LO.pdf
    public string? DropboxFileId { get; set; } // ID retornado pelo Dropbox
    public DateTime DataUpload { get; set; } = DateTime.UtcNow;

    // Relacionamentos Opcionais (o documento pode pertencer a um Cliente, Processo ou Licença)
    public Guid? ClienteId { get; set; }
    public Cliente? Cliente { get; set; }

    public Guid? ProcessoAmbientalId { get; set; }
    public ProcessoAmbiental? ProcessoAmbiental { get; set; }

    public Guid? LicencaAmbientalId { get; set; }
    public LicencaAmbiental? LicencaAmbiental { get; set; }
}