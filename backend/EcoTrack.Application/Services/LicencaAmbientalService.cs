using EcoTrack.Application.DTOs.LicencasAmbientais;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.Services;

public class LicencaAmbientalService
{
    private readonly ILicencaAmbientalRepository _licencaRepository;
    private readonly IProcessoAmbientalRepository _processoRepository;

    public LicencaAmbientalService(
        ILicencaAmbientalRepository licencaRepository,
        IProcessoAmbientalRepository processoRepository)
    {
        _licencaRepository = licencaRepository;
        _processoRepository = processoRepository;
    }

    public async Task<List<LicencaAmbientalResponseDto>> ListarTodasAsync()
    {
        var licencas = await _licencaRepository.ListarTodasAsync();
        return licencas.Select(MapearParaDto).ToList();
    }

    public async Task<LicencaAmbientalResponseDto?> BuscarPorIdAsync(Guid id)
    {
        var licenca = await _licencaRepository.BuscarPorIdAsync(id);
        return licenca == null ? null : MapearParaDto(licenca);
    }

    public async Task<LicencaAmbientalResponseDto?> CriarAsync(CriarLicencaAmbientalDto dto)
    {
        var processo = await _processoRepository.BuscarPorIdAsync(dto.ProcessoAmbientalId);
        if (processo == null)
        {
            return null;
        }

        var licenca = new LicencaAmbiental
        {
            Numero = dto.Numero,
            Tipo = dto.Tipo,
            OrgaoAmbiental = dto.OrgaoAmbiental,
            DataEmissao = DateTime.SpecifyKind(dto.DataEmissao, DateTimeKind.Utc),
            DataValidade = DateTime.SpecifyKind(dto.DataValidade, DateTimeKind.Utc),
            Status = StatusLicenca.Vigente,
            Observacoes = dto.Observacoes,
            ProcessoAmbientalId = dto.ProcessoAmbientalId,
            Condicionantes = dto.Condicionantes.Select(c => new Condicionante
            {
                Descricao = c.Descricao,
                Prazo = c.Prazo.HasValue ? DateTime.SpecifyKind(c.Prazo.Value, DateTimeKind.Utc) : null,
                Observacao = c.Observacao,
                Status = StatusCondicionante.Pendente
            }).ToList()
        };

        var novaLicenca = await _licencaRepository.CriarAsync(licenca);
        var licencaCompleta = await _licencaRepository.BuscarPorIdAsync(novaLicenca.Id);
        return MapearParaDto(licencaCompleta!);
    }

    public async Task<bool> AtualizarStatusCondicionanteAsync(Guid condicionanteId, StatusCondicionante novoStatus)
    {
        var condicionante = await _licencaRepository.BuscarCondicionantePorIdAsync(condicionanteId);
        if (condicionante == null)
        {
            return false;
        }

        condicionante.Status = novoStatus;
        condicionante.UpdatedAt = DateTime.UtcNow;

        await _licencaRepository.AtualizarCondicionanteAsync(condicionante);
        return true;
    }

    private static LicencaAmbientalResponseDto MapearParaDto(LicencaAmbiental l)
    {
        return new LicencaAmbientalResponseDto
        {
            Id = l.Id,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt,
            Numero = l.Numero,
            Tipo = l.Tipo,
            OrgaoAmbiental = l.OrgaoAmbiental,
            DataEmissao = l.DataEmissao,
            DataValidade = l.DataValidade,
            Status = l.Status,
            Observacoes = l.Observacoes,
            ProcessoAmbientalId = l.ProcessoAmbientalId,
            NumeroProcesso = l.ProcessoAmbiental?.NumeroProcesso ?? string.Empty,
            Condicionantes = l.Condicionantes.Select(c => new CondicionanteResponseDto
            {
                Id = c.Id,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                Descricao = c.Descricao,
                Prazo = c.Prazo,
                Status = c.Status,
                Observacao = c.Observacao,
                LicencaAmbientalId = c.LicencaAmbientalId
            }).ToList()
        };
    }
}