using CsvHelper.Configuration.Attributes;

namespace EcoTrack.Application.DTOs.Mtrs;

public class MtrCsvRowDto
{
    [Name("Nº MTR")] public string NumeroMtr { get; set; } = string.Empty;
    [Name("Tipo Manifesto")] public string? TipoManifesto { get; set; }
    [Name("Responsável Emissão")] public string? ResponsavelEmissao { get; set; }
    [Name("Data de Emissão")] public string? DataEmissao { get; set; }
    [Name("Data de Recebimento")] public string? DataRecebimento { get; set; }
    [Name("Situação")] public string? Situacao { get; set; }

    // Gerador
    [Name("Gerador (Nome)")] public string? GeradorNome { get; set; }
    [Name("Gerador (CNPJ/CPF)")] public string? GeradorCnpj { get; set; }
    [Name("Gerador (Unidade)")] public string? GeradorUnidade { get; set; }

    // Transportador
    [Name("Transportador (Nome)")] public string? TransportadorNome { get; set; }
    [Name("Transportador (CNPJ/CPF)")] public string? TransportadorCnpj { get; set; }
    [Name("Transportador (Unidade)")] public string? TransportadorUnidade { get; set; }
    [Name("Nome Motorista")] public string? NomeMotorista { get; set; }
    [Name("Placa Veículo")] public string? PlacaVeiculo { get; set; }

    // Destinador
    [Name("Destinador (Nome)")] public string? DestinadorNome { get; set; }
    [Name("Destinador (CNPJ/CPF)")] public string? DestinadorCnpj { get; set; }
    [Name("Destinador (Unidade)")] public string? DestinadorUnidade { get; set; }
    [Name("Responsável Recebimento")] public string? ResponsavelRecebimento { get; set; }

    // Resíduo
    [Name("Resíduo Cód/Descrição")] public string ResiduoCodDescricao { get; set; } = string.Empty;
    [Name("Classe")] public string? Classe { get; set; }
    [Name("Descr. interna")] public string? DescrInterna { get; set; }
    [Name("Cód Interno")] public string? CodInterno { get; set; }
    [Name("Quantidade indicada")] public string? QuantidadeIndicada { get; set; }
    [Name("Quantidade recebida")] public string? QuantidadeRecebida { get; set; }
    [Name("Unidade")] public string? Unidade { get; set; }

    // Adicionais
    [Name("Observação Gerador")] public string? ObservacaoGerador { get; set; }
    [Name("Observação Destinador")] public string? ObservacaoDestinador { get; set; }
    [Name("Justificativa")] public string? Justificativa { get; set; }
    [Name("Tem MTR Complementar")] public string? TemMtrComplementar { get; set; }
    [Name("MTR Provisório Nº")] public string? MtrProvisorioNumero { get; set; }
    [Name("Tratamento")] public string? Tratamento { get; set; }
    [Name("CDF Nº")] public string? CdfNumero { get; set; }
}