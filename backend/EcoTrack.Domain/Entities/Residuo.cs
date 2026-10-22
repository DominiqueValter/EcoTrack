using EcoTrack.Domain.Common;
using EcoTrack.Domain.Enums;

namespace EcoTrack.Domain.Entities;

public class Residuo : BaseEntity
{
    public string CodigoIbama { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public ClasseResiduo Classe { get; set; } = ClasseResiduo.ClasseIIA_NaoInerte;
    public EstadoFisicoResiduo EstadoFisico { get; set; } = EstadoFisicoResiduo.Solido;
}