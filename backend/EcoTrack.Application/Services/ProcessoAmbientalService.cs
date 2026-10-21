using EcoTrack.Application.DTOs.ProcessosAmbientais;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Application.Services;

public class ProcessoAmbientalService
{
    private readonly IProcessoAmbientalRepository _processoRepository;
    private readonly IClienteRepository _clienteRepository;

    public ProcessoAmbientalService(
        IProcessoAmbientalRepository processoRepository,
        IClienteRepository clienteRepository)
    {
        _processoRepository = processoRepository;
        _clienteRepository = clienteRepository;
    }

    public async Task<List<ProcessoAmbientalResponseDto>> ListarTodosAsync()
    {
        var processos = await _processoRepository.ListarTodosAsync();
        return processos.Select(MapearParaDto).ToList();
    }

    public async Task<ProcessoAmbientalResponseDto?> BuscarPorIdAsync(Guid id)
    {
        var processo = await _processoRepository.BuscarPorIdAsync(id);
        return processo == null ? null : MapearParaDto(processo);
    }

    public async Task<ProcessoAmbientalResponseDto?> CriarAsync(CriarProcessoAmbientalDto dto)
    {
        // Validar existência do Cliente
        var cliente = await _clienteRepository.BuscarPorIdAsync(dto.ClienteId);
        if (cliente == null || !cliente.Ativo)
        {
            return null;
        }

        var processo = new ProcessoAmbiental
        {
            NumeroProcesso = dto.NumeroProcesso,
            Descricao = dto.Descricao,
            ClienteId = dto.ClienteId,
            Status = StatusProcesso.Cadastrada,
            DataAbertura = DateTime.UtcNow,
            ProcessoServicos = dto.ServicosIds.Select(servicoId => new ProcessoServico
            {
                ServicoId = servicoId,
                Status = StatusProcesso.Cadastrada
            }).ToList()
        };

        var novoProcesso = await _processoRepository.CriarAsync(processo);
        
        // Recarrega do banco para trazer os relacionamentos (Cliente e Nomes dos Serviços)
        var processoCompleto = await _processoRepository.BuscarPorIdAsync(novoProcesso.Id);
        return MapearParaDto(processoCompleto!);
    }

    public async Task<ProcessoAmbientalResponseDto?> AtualizarStatusAsync(Guid id, StatusProcesso novoStatus)
    {
        var processo = await _processoRepository.BuscarPorIdAsync(id);
        if (processo == null)
        {
            return null;
        }

        processo.Status = novoStatus;
        processo.UpdatedAt = DateTime.UtcNow;

        if (novoStatus == StatusProcesso.Emitida || novoStatus == StatusProcesso.Indeferida || novoStatus == StatusProcesso.Cancelada)
        {
            processo.DataConclusao = DateTime.UtcNow;
        }

        await _processoRepository.AtualizarAsync(processo);
        return MapearParaDto(processo);
    }

    private static ProcessoAmbientalResponseDto MapearParaDto(ProcessoAmbiental p)
    {
        return new ProcessoAmbientalResponseDto
        {
            Id = p.Id,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            NumeroProcesso = p.NumeroProcesso,
            Descricao = p.Descricao,
            Status = p.Status,
            DataAbertura = p.DataAbertura,
            DataConclusao = p.DataConclusao,
            ClienteId = p.ClienteId,
            NomeCliente = p.Cliente?.Nome ?? string.Empty,
            Servicos = p.ProcessoServicos.Select(ps => new ProcessoServicoResponseDto
            {
                ServicoId = ps.ServicoId,
                NomeServico = ps.Servico?.Nome ?? string.Empty,
                Status = ps.Status,
                Observacao = ps.Observacao
            }).ToList()
        };
    }
}