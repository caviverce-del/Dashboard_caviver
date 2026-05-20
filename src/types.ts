export interface RowData {
  dataAtendimento: Date | null;
  paciente: string;
  dataNascimento: Date | null;
  idade: number | null;
  sexo: string;
  profissional: string;
  especialidade: string;
  formaPagamento: string;
  tipoAtendimento: string;
  unidade: string;
  item: string;
  atendimentos: number;
  valorTotal: number;
  estado: string;
  municipio: string;
  bairro: string;
}

export interface RawRow {
  "Data Atendimento"?: any;
  "Paciente"?: any;
  "Data de nascimento"?: any;
  "Idade"?: any;
  "Sexo"?: any;
  "Profissional"?: any;
  "Especialidade"?: any;
  "Forma de Pagamento"?: any;
  "Tipo Atendimento"?: any;
  "Unidade"?: any;
  "Item"?: any;
  "Atendimentos"?: any;
  "Valor total do item R$"?: any;
  "Estado"?: any;
  "Município"?: any;
  "Bairro"?: any;
  [key: string]: any;
}

export interface KPIStats {
  totalAtendimentos: number;
  pacientesUnicos: number;
  totalProcedimentos: number;
  totalConsultas: number;
  totalExames: number;
  totalCirurgias: number;
  mediaDiaria: number;
  mediaMensal: number;
  valorTotalGerado: number;
  ticketMedio: number;
  valorMedioPorAtendimento: number;
  valorMedioPorPaciente: number;
  crescimentoMensalPerc: number;
  impactoSocialEstimado: number;
  municipiosAtendidos: number;
  bairrosAtendidos: number;
  sexoPredominante: string;
  faixaEtariaPredominante: string;
  municipioPredominante: string;
  alcanceRegional: string;
}

export interface FilterOptions {
  unidade: string[];
  ano: string[];
  mes: string[];
  profissional: string[];
  especialidade: string[];
  formaPagamento: string[];
  sexo: string[];
  faixaEtariaMin: number;
  faixaEtariaMax: number;
  municipio: string[];
  bairro: string[];
  tipoAtendimento: string[];
}

export interface ActiveFilters {
  unidade: string;
  ano: string;
  mes: string;
  dataInicio: string;
  dataFim: string;
  profissional: string;
  especialidade: string;
  formaPagamento: string;
  sexo: string;
  faixaEtariaMin: number;
  faixaEtariaMax: number;
  municipio: string;
  bairro: string;
  tipoAtendimento: string;
}
