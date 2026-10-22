using EcoTrack.Domain.Common;

namespace EcoTrack.Domain.Entities;

public class Mtr : BaseEntity
{
    public string NumeroMtr { get; set; } = string.Empty;
    public string? TipoManifesto { get; set; }
    public string? ResponsavelEmissao { get; set; }
    public DateTime DataEmissao { get; set; }
    public DateTime? DataRecebimento { get; set; }
    public string? Situacao { get; set; }

    // Dados do Gerador
    public Guid ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public string? GeradorNome { get; set; }
    public string? GeradorCnpj { get; set; }
    public string? GeradorUnidade { get; set; }

    // Dados do Transportador
    public string TransportadorNome { get; set; } = string.Empty;
    public string? TransportadorCnpj { get; set; }
    public string? TransportadorUnidade { get; set; }
    public string? NomeMotorista { get; set; }
    public string? PlacaVeiculo { get; set; }

    // Dados do Destinador
    public string DestinadorNome { get; set; } = string.Empty;
    public string? DestinadorCnpj { get; set; }
    public string? DestinadorUnidade { get; set; }
    public string? ResponsavelRecebimento { get; set; }

    // Informações Adicionais
    public string? ObservacaoGerador { get; set; }
    public string? ObservacaoDestinador { get; set; }
    public string? Justificativa { get; set; }
    public bool TemMtrComplementar { get; set; }
    public string? MtrProvisorioNumero { get; set; }
    public string? Tratamento { get; set; }
    public string? CdfNumero { get; set; } // Certificado de Destinação Final

    public ICollection<MtrResiduo> ItensResiduos { get; set; } = new List<MtrResiduo>();
}