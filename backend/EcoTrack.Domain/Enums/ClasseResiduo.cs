namespace EcoTrack.Domain.Enums;

public enum ClasseResiduo
{
    ClasseI_Perigoso = 1,      // Inflamável, corrosivo, reativo, tóxico, patogênico
    ClasseIIA_NaoInerte = 2,  // Biodegradável, combustibilidade, solubilidade em água
    ClasseIIB_Inerte = 3      // Entulho da construção civil, tijolos, rochas
}