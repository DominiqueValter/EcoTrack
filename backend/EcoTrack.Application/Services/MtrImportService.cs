using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using EcoTrack.Application.DTOs.Mtrs;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace EcoTrack.Application.Services;

public class MtrImportService
{
    private readonly IClienteRepository _clienteRepository;
    private readonly IMtrRepository _mtrRepository;

    public MtrImportService(IClienteRepository clienteRepository, IMtrRepository mtrRepository)
    {
        _clienteRepository = clienteRepository;
        _mtrRepository = mtrRepository;
    }

    public async Task<int> ImportarCsvAsync(IFormFile file, Guid clienteIdPadrao)
    {
        using var reader = new StreamReader(file.OpenReadStream());
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            Delimiter = ",", // Relatórios do SINIR/IAT utilizam ponto e vírgula
            HasHeaderRecord = true,
            MissingFieldFound = null,
            HeaderValidated = null
        };

        using var csv = new CsvReader(reader, config);
        var registros = csv.GetRecords<MtrCsvRowDto>().ToList();

        var mtrsParaInserir = new List<Mtr>();

        foreach (var row in registros)
        {
            if (string.IsNullOrWhiteSpace(row.NumeroMtr)) continue;

            DateTime.TryParse(row.DataEmissao, out var dtEmissao);
            DateTime.TryParse(row.DataRecebimento, out var dtRecebimento);
            decimal.TryParse(row.QuantidadeIndicada, NumberStyles.Any, CultureInfo.InvariantCulture, out var qtdIndicada);
            decimal.TryParse(row.QuantidadeRecebida, NumberStyles.Any, CultureInfo.InvariantCulture, out var qtdRecebida);

            var mtr = new Mtr
            {
                NumeroMtr = row.NumeroMtr,
                TipoManifesto = row.TipoManifesto,
                ResponsavelEmissao = row.ResponsavelEmissao,
                DataEmissao = DateTime.SpecifyKind(dtEmissao, DateTimeKind.Utc),
                DataRecebimento = dtRecebimento != DateTime.MinValue ? DateTime.SpecifyKind(dtRecebimento, DateTimeKind.Utc) : null,
                Situacao = row.Situacao,
                ClienteId = clienteIdPadrao,
                GeradorNome = row.GeradorNome,
                GeradorCnpj = row.GeradorCnpj,
                GeradorUnidade = row.GeradorUnidade,
                TransportadorNome = row.TransportadorNome ?? "Não informado",
                TransportadorCnpj = row.TransportadorCnpj,
                TransportadorUnidade = row.TransportadorUnidade,
                NomeMotorista = row.NomeMotorista,
                PlacaVeiculo = row.PlacaVeiculo,
                DestinadorNome = row.DestinadorNome ?? "Não informado",
                DestinadorCnpj = row.DestinadorCnpj,
                DestinadorUnidade = row.DestinadorUnidade,
                ResponsavelRecebimento = row.ResponsavelRecebimento,
                ObservacaoGerador = row.ObservacaoGerador,
                ObservacaoDestinador = row.ObservacaoDestinador,
                Justificativa = row.Justificativa,
                TemMtrComplementar = row.TemMtrComplementar?.ToLower() == "sim",
                MtrProvisorioNumero = row.MtrProvisorioNumero,
                Tratamento = row.Tratamento,
                CdfNumero = row.CdfNumero,
                ItensResiduos = new List<MtrResiduo>
                {
                    new MtrResiduo
                    {
                        ResiduoCodDescricao = row.ResiduoCodDescricao,
                        Classe = row.Classe,
                        DescrInterna = row.DescrInterna,
                        CodInterno = row.CodInterno,
                        QuantidadeIndicada = qtdIndicada,
                        QuantidadeRecebida = qtdRecebida,
                        Unidade = string.IsNullOrWhiteSpace(row.Unidade) ? "kg" : row.Unidade
                    }
                }
            };

            mtrsParaInserir.Add(mtr);
        }

        if (mtrsParaInserir.Any())
        {
            await _mtrRepository.AdicionarVariosAsync(mtrsParaInserir);
        }

        return mtrsParaInserir.Count;
    }
}