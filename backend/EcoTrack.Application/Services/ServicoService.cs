using EcoTrack.Application.DTOs.Servicos;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Services;

public class ServicoService
{
    private readonly IServicoRepository _servicoRepository;
    private readonly ICategoriaServicoRepository _categoriaRepository;

    public ServicoService(
        IServicoRepository servicoRepository,
        ICategoriaServicoRepository categoriaRepository)
    {
        _servicoRepository = servicoRepository;
        _categoriaRepository = categoriaRepository;
    }

    public async Task<List<ServicoResponseDto>> ListarTodosAsync()
    {
        var servicos = await _servicoRepository.ListarTodosAsync();
        return servicos.Select(s => new ServicoResponseDto
        {
            Id = s.Id,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt,
            Nome = s.Nome,
            Descricao = s.Descricao,
            Ativo = s.Ativo,
            CategoriaServicoId = s.CategoriaServicoId,
            NomeCategoriaServico = s.CategoriaServico?.Nome ?? string.Empty
        }).ToList();
    }

    public async Task<ServicoResponseDto?> CriarAsync(CriarServicoDto dto)
    {
        // Valida se a categoria informada realmente existe no banco
        var categoriaExiste = await _categoriaRepository.BuscarPorIdAsync(dto.CategoriaServicoId);
        if (categoriaExiste == null)
        {
            return null;
        }

        var servico = new Servico
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao,
            CategoriaServicoId = dto.CategoriaServicoId
        };

        var novoServico = await _servicoRepository.CriarAsync(servico);

        return new ServicoResponseDto
        {
            Id = novoServico.Id,
            CreatedAt = novoServico.CreatedAt,
            UpdatedAt = novoServico.UpdatedAt,
            Nome = novoServico.Nome,
            Descricao = novoServico.Descricao,
            Ativo = novoServico.Ativo,
            CategoriaServicoId = novoServico.CategoriaServicoId,
            NomeCategoriaServico = categoriaExiste.Nome
        };
    }
}