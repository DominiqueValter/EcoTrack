export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Cliente extends BaseEntity {
  nome: string;
  cnpjCpf: string;
  email: string;
  telefone: string;
  endereco: string;
  ativo: boolean;
}

export interface CategoriaServico extends BaseEntity {
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface Servico extends BaseEntity {
  nome: string;
  descricao?: string;
  ativo: boolean;
  categoriaServicoId: string;
  nomeCategoria?: string;
}

export interface ProcessoAmbiental extends BaseEntity {
  numeroProcesso: string;
  orgaoAmbiental: string;
  descricao?: string;
  dataAbertura: string;
  status: number;
  nomeStatus: string;
  clienteId: string;
  nomeCliente: string;
}

export interface Condicionante extends BaseEntity {
  descricao: string;
  prazo?: string | null;
  status: number;
  nomeStatus: string;
  observacao?: string;
  licencaAmbientalId: string;
}

export interface LicencaAmbiental extends BaseEntity {
  numero: string;
  tipo: number;
  nomeTipo: string;
  orgaoAmbiental: string;
  dataEmissao: string;
  dataValidade: string;
  status: number;
  nomeStatus: string;
  observacoes?: string;
  processoAmbientalId: string;
  numeroProcesso: string;
  condicionantes: Condicionante[];
}

export interface Documento extends BaseEntity {
  nome: string;
  extensao: string;
  tamanhoBytes: number;
  dropboxPath: string;
  dropboxFileId?: string;
  dataUpload: string;
  clienteId?: string;
  nomeCliente?: string;
  processoAmbientalId?: string;
  numeroProcesso?: string;
  licencaAmbientalId?: string;
  numeroLicenca?: string;
}

export interface MtrResiduo extends BaseEntity {
  mtrId: string;
  residuoCodDescricao: string;
  classe?: string;
  descrInterna?: string;
  codInterno?: string;
  quantidadeIndicada: number;
  quantidadeRecebida: number;
  unidade: string;
}

export interface Mtr extends BaseEntity {
  numeroMtr: string;
  tipoManifesto?: string;
  responsavelEmissao?: string;
  dataEmissao: string;
  dataRecebimento?: string | null;
  situacao?: string;
  clienteId: string;
  geradorNome?: string;
  geradorCnpj?: string;
  transportadorNome: string;
  transportadorCnpj?: string;
  destinadorNome: string;
  destinadorCnpj?: string;
  tratamento?: string;
  cdfNumero?: string;
  itensResiduos: MtrResiduo[];
}
