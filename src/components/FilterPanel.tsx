import React from 'react';
import { RowData, ActiveFilters } from '../types';

interface FilterPanelProps {
  data: RowData[];
  filters: ActiveFilters;
  setFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ data, filters, setFilters, onReset }) => {
  // Harvest unique values from dynamic database
  const uniqueUnidades = Array.from(new Set<string>(data.map(d => d.unidade).filter(Boolean))).sort();
  const uniqueAnos = Array.from(new Set<string>(data.filter(d => d.dataAtendimento).map(d => d.dataAtendimento!.getFullYear().toString()))).sort();
  const uniqueMeses = Array.from(new Set<string>(data.filter(d => d.dataAtendimento).map(d => (d.dataAtendimento!.getMonth() + 1).toString()))).sort((a, b) => parseInt(a) - parseInt(b));
  const uniqueDocs = Array.from(new Set<string>(data.map(d => d.profissional).filter(Boolean))).sort();
  const uniqueSpecs = Array.from(new Set<string>(data.map(d => d.especialidade).filter(Boolean))).sort();
  const uniquePagamentos = Array.from(new Set<string>(data.map(d => d.formaPagamento).filter(Boolean))).sort();
  const uniqueMunicipios = Array.from(new Set<string>(data.map(d => d.municipio).filter(Boolean))).sort();
  const uniqueBairros = Array.from(new Set<string>(data.map(d => d.bairro).filter(Boolean))).sort();
  const uniqueTipos = Array.from(new Set<string>(data.map(d => d.tipoAtendimento).filter(Boolean))).sort();

  const handleSelectChange = (field: keyof ActiveFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRangeChange = (field: 'faixaEtariaMin' | 'faixaEtariaMax', val: number) => {
    setFilters(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const getMonthName = (m: string) => {
    const list = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const idx = parseInt(m) - 1;
    return list[idx] || m;
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300">
      <div className="flex items-center justify-between pointer-events-none mb-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-pulse"></span>
          Filtros Inteligentes de Negócios
        </h3>
        <button 
          onClick={onReset} 
          className="pointer-events-auto text-xs font-bold text-[#5A2483] hover:text-[#7B4BA3] underline transition"
        >
          Limpar Todos os Filtros
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
        
        {/* Unidade (Coluna J) - PRINCIPAL FILTRO */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Unidade Administrativa</label>
          <select 
            value={filters.unidade} 
            onChange={(e) => handleSelectChange('unidade', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todas as Unidades</option>
            {uniqueUnidades.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Ano */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Ano de Atendimento</label>
          <select 
            value={filters.ano} 
            onChange={(e) => handleSelectChange('ano', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos os anos</option>
            {uniqueAnos.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Mês */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Mês de Referência</label>
          <select 
            value={filters.mes} 
            onChange={(e) => handleSelectChange('mes', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos os meses</option>
            {uniqueMeses.map((val) => (
              <option key={val} value={val}>{getMonthName(val)}</option>
            ))}
          </select>
        </div>

        {/* Especialidade */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Especialidade Clínica</label>
          <select 
            value={filters.especialidade} 
            onChange={(e) => handleSelectChange('especialidade', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todas</option>
            {uniqueSpecs.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Médico / Profissional */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Profissional / Médico</label>
          <select 
            value={filters.profissional} 
            onChange={(e) => handleSelectChange('profissional', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos</option>
            {uniqueDocs.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Forma Pagamento */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Forma de Pagamento</label>
          <select 
            value={filters.formaPagamento} 
            onChange={(e) => handleSelectChange('formaPagamento', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todas as Formas</option>
            {uniquePagamentos.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Sexo */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Gênero / Sexo</label>
          <select 
            value={filters.sexo} 
            onChange={(e) => handleSelectChange('sexo', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos</option>
            <option value="FEMININO">Feminino</option>
            <option value="MASCULINO">Masculino</option>
            <option value="NÃO INFORMADO">Não Informado</option>
          </select>
        </div>

        {/* Município */}
        <div className="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Município do Paciente</label>
          <select 
            value={filters.municipio} 
            onChange={(e) => handleSelectChange('municipio', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos os Municípios</option>
            {uniqueMunicipios.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Bairro */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Bairro</label>
          <select 
            value={filters.bairro}
            onChange={(e) => handleSelectChange('bairro', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos os Bairros</option>
            {uniqueBairros.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Tipo Atendimento */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Atendimento</label>
          <select 
            value={filters.tipoAtendimento} 
            onChange={(e) => handleSelectChange('tipoAtendimento', e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg p-2 font-semibold text-gray-700 focus:ring-1 focus:ring-[#5A2483] focus:outline-none transition"
          >
            <option value="ALL">Todos os Tipos</option>
            {uniqueTipos.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Faixa Etária Slider */}
        <div className="flex flex-col gap-1 col-span-2 select-none">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
            <span>Faixa Etária Pacientes</span>
            <span className="font-mono text-xs text-[#5A2483] font-bold">
              {filters.faixaEtariaMin} - {filters.faixaEtariaMax} anos
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
            <div className="flex flex-col w-full">
              <span className="text-[8px] text-gray-400 font-bold uppercase">Mín</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={filters.faixaEtariaMin}
                onChange={(e) => handleRangeChange('faixaEtariaMin', parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5A2483]"
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="text-[8px] text-gray-400 font-bold uppercase">Máx</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={filters.faixaEtariaMax}
                onChange={(e) => handleRangeChange('faixaEtariaMax', parseInt(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5A2483]"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
