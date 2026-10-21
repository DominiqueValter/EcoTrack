using EcoTrack.Application.DTOs.CategoriasServico;
using EcoTrack.Application.Interfaces;
using EcoTrack.Domain.Entities;

namespace EcoTrack.Application.Services;

public class CategoriaServicoService
{
    private readonly ICategoriaServicoRepository _repository;

    public CategoriaServicoService(ICategoriaServicoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CategoriaServicoResponseDto>> ListarTodasAsync()
    {
        var categorias = await _repository.ListarTodasAsync();
        return categorias.Select(c => new CategoriaServicoResponseDto
        {
            Id = c.Id,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt,
            Nome = c.Nome,
            Descricao = c.Descricao,
            Ativo = c.Ativo
        }).ToList();
    }

    public async Task<CategoriaServicoResponseDto> CriarAsync(CriarCategoriaServicoDto dto)
    {
        var categoria = new CategoriaServico
        {
            Nome = dto.Nome,
            Descricao = dto.Descricao
        };

        var novaCategoria = await _repository.CriarAsync(categoria);

        return new CategoriaServicoResponseDto
        {
            Id = novaCategoria.Id,
            CreatedAt = novaCategoria.CreatedAt,
            UpdatedAt = novaCategoria.UpdatedAt,
            Nome = novaCategoria.Nome,
            Descricao = novaCategoria.Descricao,
            Ativo = novaCategoria.Ativo
        };
    }
}