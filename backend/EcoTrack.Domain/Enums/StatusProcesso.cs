namespace EcoTrack.Domain.Enums;

public enum StatusProcesso
{
    Cadastrada = 1,
    AguardandoPagamento = 2,
    EmAnalise = 3,
    AguardandoComplementacao = 4,
    AguardandoVistoria = 5,
    Emitida = 6,
    Indeferida = 7,
    Cancelada = 8
}