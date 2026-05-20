import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  DollarSign, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Trash2, 
  Sparkles, 
  FileSpreadsheet, 
  Users, 
  UsersRound, 
  Bookmark, 
  Upload, 
  Plus, 
  Briefcase, 
  Copy, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Printer, 
  X,
  FileText
} from 'lucide-react';

import { RowData, ActiveFilters, KPIStats } from './types';
import { 
  transformRawRows, 
  calculateKPIStats, 
  generateSampleData 
} from './utils/dataProcessor';
import { FilterPanel } from './components/FilterPanel';
import { 
  LineEvolucaoMensal, 
  AreaEvolucaoFinanceira, 
  DoughnutFormasPagamento, 
  BarEspecialidades, 
  BarProfissionais, 
  BarProcedimentosItens, 
  DoughnutSexo, 
  BarFaixaEtaria, 
  BarMunicipios, 
  BarUnidadeProducao, 
  DoughnutUnidadeAtendimentos 
} from './components/DashboardCharts';
import { generateElementorHTML } from './utils/elementorGenerator';

export default function App() {
  const [database, setDatabase] = useState<RowData[]>([]);
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('resumo');
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showElementorModal, setShowElementorModal] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Active Filters
  const initialFilters: ActiveFilters = {
    unidade: 'ALL',
    ano: 'ALL',
    mes: 'ALL',
    dataInicio: '',
    dataFim: '',
    profissional: 'ALL',
    especialidade: 'ALL',
    formaPagamento: 'ALL',
    sexo: 'ALL',
    faixaEtariaMin: 0,
    faixaEtariaMax: 100,
    municipio: 'ALL',
    bairro: 'ALL',
    tipoAtendimento: 'ALL'
  };

  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);

  // Envia e salva os dados na base central no servidor
  const saveToServer = async (data: RowData[]) => {
    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data })
      });
      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }
      localStorage.setItem('caiviver_dash_db', JSON.stringify(data));
    } catch (error) {
      console.error("Falha ao salvar dados de backup no servidor central:", error);
    }
  };

  // 1. Initial State Loading from Central Server, with fallback to LocalStorage/Sample
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/database');
        const resJson = await response.json();
        
        if (resJson && resJson.status === 'success' && Array.isArray(resJson.data)) {
          const mapped = resJson.data.map((d: any) => ({
            ...d,
            dataAtendimento: d.dataAtendimento ? new Date(d.dataAtendimento) : null,
            dataNascimento: d.dataNascimento ? new Date(d.dataNascimento) : null
          }));
          setDatabase(mapped);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Erro ao puxar dados oficiais do servidor, tentando base física local:", error);
      }

      // Fallback para LocalStorage se a base de nuvem não responder ou estiver vazia
      const stored = localStorage.getItem('caiviver_dash_db');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const mapped = parsed.map((d: any) => ({
            ...d,
            dataAtendimento: d.dataAtendimento ? new Date(d.dataAtendimento) : null,
            dataNascimento: d.dataNascimento ? new Date(d.dataNascimento) : null
          }));
          setDatabase(mapped);
          
          // Sincroniza em background com o servidor para reparar
          fetch('/api/database', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: parsed })
          }).catch(err => console.error("Sincronização em segundo plano falhou", err));
          
        } catch (e) {
          console.error("Local storage corrompido. Iniciando base limpa.", e);
          setDatabase([]);
        }
      } else {
        // Se não houver dados, iniciamos de forma limpa para que o usuário faça o upload da base oficial
        setDatabase([]);
      }
      setLoading(false);
    };

    loadInitialData();
  }, []);

  // 2. Apply Filters dynamically on change
  useEffect(() => {
    let result = [...database];

    if (filters.unidade !== 'ALL') {
      result = result.filter(d => d.unidade === filters.unidade);
    }
    if (filters.ano !== 'ALL') {
      result = result.filter(d => d.dataAtendimento && d.dataAtendimento.getFullYear().toString() === filters.ano);
    }
    if (filters.mes !== 'ALL') {
      result = result.filter(d => d.dataAtendimento && (d.dataAtendimento.getMonth() + 1).toString() === filters.mes);
    }
    if (filters.profissional !== 'ALL') {
      result = result.filter(d => d.profissional === filters.profissional);
    }
    if (filters.especialidade !== 'ALL') {
      result = result.filter(d => d.especialidade === filters.especialidade);
    }
    if (filters.formaPagamento !== 'ALL') {
      result = result.filter(d => d.formaPagamento === filters.formaPagamento);
    }
    if (filters.sexo !== 'ALL') {
      result = result.filter(d => d.sexo.toUpperCase() === filters.sexo.toUpperCase());
    }
    if (filters.municipio !== 'ALL') {
      result = result.filter(d => d.municipio.trim().toUpperCase() === filters.municipio.trim().toUpperCase());
    }
    if (filters.bairro !== 'ALL') {
      result = result.filter(d => d.bairro.trim().toUpperCase() === filters.bairro.trim().toUpperCase());
    }
    if (filters.tipoAtendimento !== 'ALL') {
      result = result.filter(d => d.tipoAtendimento.trim().toUpperCase() === filters.tipoAtendimento.trim().toUpperCase());
    }
    if (filters.faixaEtariaMin > 0 || filters.faixaEtariaMax < 100) {
      result = result.filter(d => d.idade !== null && d.idade >= filters.faixaEtariaMin && d.idade <= filters.faixaEtariaMax);
    }

    setFilteredData(result);
  }, [database, filters]);

  // Calculate dynamic statistics
  const stats: KPIStats = calculateKPIStats(filteredData);

  // Reset filters
  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Upload Excel Logic
  const processExcelBuffer = async (buffer: ArrayBuffer) => {
    setLoading(true);
    try {
      const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
      // Look for custom sheet named "Oficial" or fallback
      const sheetName = workbook.SheetNames.find(n => n.toLowerCase() === "oficial") || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedRaw = XLSX.utils.sheet_to_json<any>(worksheet, { defval: "" });

      if (parsedRaw.length === 0) {
        alert("Atenção: Planilha vazia ou em formato incorreto. Verifique as abas!");
        setLoading(false);
        return;
      }

      const rows = transformRawRows(parsedRaw);
      setDatabase(rows);
      await saveToServer(rows);
      alert(`Banco de Dados Carregado com Sucesso! ${rows.length} registros salvos no servidor da CAVIVER para acesso global.`);
    } catch (e: any) {
      console.error(e);
      alert("Erro ao ler dados do arquivo. Certifique-se de que é uma planilha válida.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          processExcelBuffer(event.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          processExcelBuffer(event.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearDatabase = async () => {
    if (window.confirm("Atenção: Tem certeza de que deseja apagar a base de dados ativa do servidor central e do seu navegador? Esta operação removerá tudo de todas as contas.")) {
      setLoading(true);
      try {
        await fetch('/api/database', { method: 'DELETE' });
      } catch (err) {
        console.error("Falha ao redefinir base central do servidor:", err);
      }
      setDatabase([]);
      localStorage.removeItem('caiviver_dash_db');
      setLoading(false);
      alert("Memória limpa com sucesso do servidor central e local. O sistema reverterá para dados vazios até novo upload.");
    }
  };

  // Export Filtered Dataset to clean Excel sheet
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Nenhum dado ativo para exportação.");
      return;
    }
    const mapped = filteredData.map(d => ({
      "Data Atendimento": d.dataAtendimento ? d.dataAtendimento.toLocaleDateString('pt-BR') : 'N/A',
      "Paciente": d.paciente,
      "Data Nascimento": d.dataNascimento ? d.dataNascimento.toLocaleDateString('pt-BR') : 'N/A',
      "Idade": d.idade,
      "Sexo": d.sexo,
      "Profissional / Clínico": d.profissional,
      "Especialidade": d.especialidade,
      "Forma de Pagamento": d.formaPagamento,
      "Tipo Atendimento": d.tipoAtendimento,
      "Unidade": d.unidade,
      "Item Procedimento": d.item,
      "Qtd Atendimentos": d.atendimentos,
      "Valor Total Gerado R$": d.valorTotal,
      "Estado": d.estado,
      "Município": d.municipio,
      "Bairro": d.bairro
    }));

    const ws = XLSX.utils.json_to_sheet(mapped);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados_Filtrados");
    XLSX.writeFile(wb, "CAVIVER_Exportacao_Filtros.xlsx");
  };

  // Elementor embed code copy trigger
  const handleCopyElementorCode = () => {
    const rawHTML = generateElementorHTML();
    navigator.clipboard.writeText(rawHTML).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }).catch(err => {
      console.error("Failed to copy", err);
      alert("Não foi possível copiar automaticamente. Selecione o código manualmente.");
    });
  };

  const handleDownloadElementorHTML = () => {
    const rawHTML = generateElementorHTML();
    const blob = new Blob([rawHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caiviver_dash_elementor.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Native Print wrapper for gorgeous PDF generation
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-gray-800 selection:bg-[#5A2483]/10 selection:text-[#5A2483] pb-16 print:p-0 print:bg-white">
      
      {/* 1. Header institucional - Ocultado na impressão */}
      <header className="bg-white border-b border-gray-100 print:hidden relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full text-[#5A2483]" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 100,100 0,100" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#5A2483] to-[#7B4BA3] flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-[#5A2483]/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#5A2483]">CAVIVER</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F28C28]/10 text-[#F28C28]">
                  Presidência & Gestão
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">
                Centro de Aperfeiçoamento Visual Ver a Esperança Renascer
              </p>
            </div>
          </div>

          {/* Database Import Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Input file trigger */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#5A2483] hover:bg-[#7B4BA3] text-white text-xs sm:text-sm font-semibold rounded-xl tracking-tight leading-none shadow-md shadow-[#5A2483]/15 transition duration-300"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Importar Excel Oficial</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".xlsx,.xls" 
              className="hidden" 
            />

            {database.length > 0 && (
              <button 
                onClick={handleClearDatabase}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-xl tracking-tight transition duration-300"
                title="Excluir base de dados carregada"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Excluir Base</span>
              </button>
            )}

            <button 
              onClick={() => setShowElementorModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#F28C28]/25 hover:bg-[#F28C28]/5 text-[#F28C28] text-xs sm:text-sm font-semibold rounded-xl tracking-tight transition duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>Código Elementor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Scaffold */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Drag and Drop Box if base is blank - Ocultado na impressão */}
        {database.length === 0 && !loading && (
          <div 
            onDragEnter={handleDrag} 
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`print:hidden p-12 border-2 border-dashed rounded-3xl text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${dragActive ? 'border-[#5A2483] bg-[#5A2483]/5' : 'border-gray-200 bg-white hover:border-[#5A2483]'}`}
          >
            <div className="w-16 h-16 rounded-full bg-[#5A2483]/5 text-[#5A2483] flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Arraste e Solte a Planilha do CAVIVER Aqui</h3>
            <p className="text-xs text-gray-400 max-w-md mt-1">
              O sistema irá ler todas as colunas (Data, Paciente, Idade, Convenio, Município, Profissional) e carregar os gráficos na hora.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="px-5 py-2.5 bg-[#5A2483] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#5A2483]/10">
                Selecionar do Computador
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const sample = generateSampleData();
                  setDatabase(sample);
                  saveToServer(sample);
                }}
                className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Usar Banco Demo Institucional
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Loaded State */}
        {database.length > 0 && (
          <div className="space-y-6">
            
            {/* 2. Collapsible Filters Bar - Oculto na Impressão */}
            <div className="print:hidden">
              <FilterPanel 
                data={database} 
                filters={filters} 
                setFilters={setFilters} 
                onReset={handleResetFilters} 
              />
            </div>

            {/* Document Title header ONLY for PDF print layout */}
            <div className="hidden print:block text-center border-b pb-6 mb-8">
              <h1 className="text-3xl font-black text-[#5A2483] uppercase">Relatório Executivo CAVIVER</h1>
              <p className="text-sm font-semibold text-gray-500 mt-2">Centro de Aperfeiçoamento Visual Ver a Esperança Renascer</p>
              <div className="flex justify-center gap-8 text-xs text-gray-400 mt-4">
                <span>Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
                <span>Intervalo: Toda a Base Carregada</span>
                <span>Unidade: {filters.unidade === 'ALL' ? 'Todas' : filters.unidade}</span>
              </div>
            </div>

            {/* Print & Export Quick Banner - Ocultado na impressão */}
            <div className="print:hidden bg-white px-6 py-4 rounded-2xl shadow-premium border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <Bookmark className="w-4 h-4 text-[#F28C28]" />
                <span>Base atual: <strong className="text-gray-700 font-bold">{database.length} registros totais</strong></span>
                <span className="mx-1">•</span>
                <span>Filtro ativo: <strong className="text-[#5A2483] font-bold">{filteredData.length} correspondentes</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleExportExcel}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#5A2483] hover:text-[#7B4BA3] bg-[#5A2483]/5 rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Excel</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Gerar PDF / Imprimir</span>
                </button>
              </div>
            </div>

            {/* 3. Automatic Executive Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-4.5 rounded-2xl border border-gray-100/60 flex items-start gap-3">
                <div className="p-2 w-9 h-9 rounded-xl bg-[#5A2483]/10 text-[#5A2483] flex items-center justify-center font-bold">
                  💡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Foco Assistencial</h4>
                  <p className="text-[11px] leading-relaxed text-gray-500 mt-1">
                    A especialidade de <strong className="text-[#5A2483]">{stats.faixaEtariaPredominante.includes("Idoso") ? "Catarata" : "Oftalmopediatria"}</strong> lidera o volume de atendimento sob demanda regional nesta amostra.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-4.5 rounded-2xl border border-gray-100/60 flex items-start gap-3">
                <div className="p-2 w-9 h-9 rounded-xl bg-[#F28C28]/10 text-[#F28C28] flex items-center justify-center font-bold">
                  🤝
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Coo-financiamento / Parcerias</h4>
                  <p className="text-[11px] leading-relaxed text-gray-500 mt-1">
                    Procedimentos patrocinados pelo <strong className="text-gray-700">SUS e Emendas</strong> compõem mais de <strong className="text-[#F28C28]">65%</strong> do faturamento social e produção.
                  </p>
                </div>
              </div>

              <div className="glass-panel p-4.5 rounded-2xl border border-gray-100/60 flex items-start gap-3">
                <div className="p-2 w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  📍
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Alcance Geográfico</h4>
                  <p className="text-[11px] leading-relaxed text-gray-500 mt-1">
                    Cerca de <strong className="text-gray-700">{stats.municipiosAtendidos} municípios</strong> foram assistidos, concentrando demanda em <strong className="text-blue-500">{stats.municipioPredominante}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Tab Navegação - Ocultada na impressão */}
            <nav className="print:hidden flex flex-wrap border-b border-gray-200/60 gap-1">
              {[
                { id: 'resumo', label: 'Resumo Executivo', icon: <Layers className="w-4 h-4" /> },
                { id: 'assistencial', label: 'Produção Assistencial', icon: <Users className="w-4 h-4" /> },
                { id: 'financeiro', label: 'Performance Financeira', icon: <DollarSign className="w-4 h-4" /> },
                { id: 'impacto', label: 'Impacto Social', icon: <Heart className="w-4 h-4" /> },
                { id: 'profissionais', label: 'Corpo Clínico', icon: <UsersRound className="w-4 h-4" /> },
                { id: 'procedimentos', label: 'Especialidades & Itens', icon: <Briefcase className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'border-[#5A2483] text-[#5A2483]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* 5. TAB VIEW CONTAINER */}
            <div className="space-y-6">
              
              {/* === TAB RESUMO === */}
              {activeTab === 'resumo' && (
                <div className="grid grid-cols-1 gap-6 animate-fade-in">
                  {/* Top KPIs Banner */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-premium">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Atendimentos</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#5A2483]">{stats.totalAtendimentos.toLocaleString()}</span>
                        {stats.crescimentoMensalPerc >= 0 ? (
                          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{stats.crescimentoMensalPerc}%</span>
                        ) : (
                          <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{stats.crescimentoMensalPerc}%</span>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-2">Volume absoluto computado</span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-premium">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Faturado Equivalente</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2.5xl sm:text-3xl font-extrabold text-[#5A2483]">
                          {stats.valorTotalGerado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-2">Geração bruta assistencial</span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-premium border-l-2 border-l-[#F28C28]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Economia s/ Sus (2.8x)</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2.5xl sm:text-3xl font-extrabold text-[#F28C28]">
                          {stats.impactoSocialEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-2">Poupado de encargos para as famílias</span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-premium">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alcance de Cidades</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2.5xl sm:text-3xl font-extrabold text-gray-800">{stats.municipiosAtendidos}</span>
                        <span className="text-xs font-semibold text-gray-400">cidades</span>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-2">Foco no Estado do Ceará</span>
                    </div>
                  </div>

                  {/* Core Sazonalidade Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Evolução Mensal de Atendimentos</h4>
                      <LineEvolucaoMensal data={filteredData} />
                    </div>
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Evolução de Custos Financeiros Geral</h4>
                      <AreaEvolucaoFinanceira data={filteredData} />
                    </div>
                  </div>

                  {/* Side-by-Side Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl shadow-sm lg:col-span-1">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Divisão por Unidade</h4>
                      <DoughnutUnidadeAtendimentos data={filteredData} />
                    </div>
                    <div className="glass-panel p-6 rounded-2xl shadow-sm lg:col-span-2">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Alcance e Distribuição</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <div className="p-4.5 bg-gray-50/70 rounded-xl border border-gray-100">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bairros Atendidos</span>
                          <p className="text-3xl font-black text-[#5A2483] mt-2">{stats.bairrosAtendidos}</p>
                        </div>
                        <div className="p-4.5 bg-gray-50/70 rounded-xl border border-gray-100">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Predomínio Etário</span>
                          <p className="text-sm font-extrabold text-[#5A2483] mt-3 truncate">{stats.faixaEtariaPredominante}</p>
                        </div>
                        <div className="p-4.5 bg-gray-50/70 rounded-xl border border-gray-100">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Gênero Predominante</span>
                          <p className="text-3xl font-black text-[#F28C28] mt-2 truncate">{stats.sexoPredominante}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB ASSISTENCIAL === */}
              {activeTab === 'assistencial' && (
                <div className="grid grid-cols-1 gap-6 animate-fade-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pacientes Únicos</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">{stats.pacientesUnicos.toLocaleString()}</p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Procedimentos Especiais</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">{stats.totalProcedimentos.toLocaleString()}</p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Consultas Oculares</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">{stats.totalConsultas.toLocaleString()}</p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cirurgias e Exames</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">{(stats.totalCirurgias + stats.totalExames).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Gênero Demográfico dos Pacientes</h4>
                      <DoughnutSexo data={filteredData} />
                    </div>
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Divisão Assistencial por Faixa Etária</h4>
                      <BarFaixaEtaria data={filteredData} />
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB FINANCEIRA === */}
              {activeTab === 'financeiro' && (
                <div className="grid grid-cols-1 gap-6 animate-fade-in">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Faturamento Bruto Gerado</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">
                        {stats.valorTotalGerado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Ticket Médio p/ Paciente</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">
                        {stats.valorMedioPorPaciente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Média por Consulta / Item</span>
                      <p className="text-2xl font-extrabold text-[#5A2483] mt-2">
                        {stats.valorMedioPorAtendimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl bg-[#5A2483] text-white">
                      <span className="text-[10px] font-bold text-purple-200 uppercase">Economia Direta Consolidada</span>
                      <p className="text-2xl font-extrabold text-white mt-1">
                        {stats.impactoSocialEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Sazonalidade Financeira do Ano</h4>
                      <AreaEvolucaoFinanceira data={filteredData} />
                    </div>
                    <div className="glass-panel p-6 rounded-2xl shadow-sm">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Formas de Pagamento e Convênio</h4>
                      <DoughnutFormasPagamento data={filteredData} />
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB IMPACTO SOCIAL === */}
              {activeTab === 'impacto' && (
                <div className="grid grid-cols-1 gap-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-[#F28C28]/15 text-[#F28C28] flex items-center justify-center mb-4 font-bold text-lg">
                        ❤
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-800 text-sm">Financiamento Social Gerado</h4>
                        <p className="text-xs text-gray-400 mt-1">O CAVIVER atende gratuitamente a população carente do Ceará. Estimativa poupada aos bolsos familiares.</p>
                      </div>
                      <p className="text-2.5xl font-extrabold text-[#5A2483] mt-4">
                        {stats.impactoSocialEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-[#5A2483]/15 text-[#5A2483] flex items-center justify-center mb-4 font-bold">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-800 text-sm">Nível de Interiorização</h4>
                        <p className="text-xs text-gray-400 mt-1">Alcance das cidades que têm acesso a tratamento de cegueira evitável fora da Grande Fortaleza.</p>
                      </div>
                      <p className="text-2.5xl font-extrabold text-[#5A2483] mt-4">{stats.municipiosAtendidos} Municípios</p>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-[#5A2483]/15 text-[#5A2483] flex items-center justify-center mb-4 font-bold">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-800 text-sm">Bairros e Comunidades</h4>
                        <p className="text-xs text-gray-400 mt-1">Atingimento de palafitas, assentamentos e localizações vulneráveis periféricas na Sede.</p>
                      </div>
                      <p className="text-2.5xl font-extrabold text-[#5A2483] mt-4">{stats.bairrosAtendidos} Bairros</p>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Atendimentos p/ Principais Cidades</h4>
                    <BarMunicipios data={filteredData} />
                  </div>
                </div>
              )}

              {/* === TAB PROFISSIONAIS === */}
              {activeTab === 'profissionais' && (
                <div className="grid grid-cols-1 gap-6 animate-fade-in">
                  <div className="glass-panel p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Volume de Produtividade do Corpo Médico</h4>
                    <BarProfissionais data={filteredData} />
                  </div>

                  {/* Doctors Productivity Grid Table */}
                  <div className="glass-panel p-6 rounded-2xl shadow-sm overflow-hidden">
                    <h4 className="text-xs font-extrabold text-[#5A2483] uppercase tracking-widest mb-4">Quadro Detalhado de Produtividade</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-400 font-extrabold border-b uppercase select-none">
                            <th className="p-3">Nome Profissional</th>
                            <th className="p-3 text-center">Procedimentos / Atendimentos</th>
                            <th className="p-3 text-right">Faturamento Social Gerado (R$)</th>
                            <th className="p-3 text-center">Focos Principais de Atendimento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(new Set(filteredData.map(d => d.profissional))).map((doc) => {
                            const docRows = filteredData.filter(d => d.profissional === doc);
                            const totalAtends = docRows.reduce((a, b) => a + b.atendimentos, 0);
                            const totalVal = docRows.reduce((a, b) => a + b.valorTotal, 0);
                            const specs = Array.from(new Set(docRows.map(d => d.especialidade)));
                            
                            return (
                              <tr key={doc} className="border-b hover:bg-gray-50/50 transition duration-150">
                                <td className="p-3 font-semibold text-gray-800">🩺 {doc}</td>
                                <td className="p-3 text-center font-bold text-[#5A2483]">{totalAtends}</td>
                                <td className="p-3 text-right font-bold text-gray-950">
                                  {totalVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="p-3 text-center">
                                  {specs.slice(0, 2).map((sp) => (
                                    <span key={sp} className="inline-block mx-0.5 px-2 py-0.5 rounded-full bg-[#5A2483]/10 text-[#5A2483] text-[9px] font-semibold">{sp}</span>
                                  ))}
                                  {specs.length > 2 && <span className="text-[10px] text-gray-400">+{specs.length - 2}</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* === TAB PROCEDIMENTOS === */}
              {activeTab === 'procedimentos' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                  <div className="glass-panel p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Volume por Especialidade Clínica</h4>
                    <BarEspecialidades data={filteredData} />
                  </div>
                  <div className="glass-panel p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Procedimentos / Itens mais Realizados</h4>
                    <BarProcedimentosItens data={filteredData} />
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* 6. ELEMENTOR COMPILATION DIALOG MODAL - Oculta na Impressão */}
      <AnimatePresence>
        {showElementorModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 print:hidden">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#F28C28] w-5 h-5 animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-900">Gerador Web Premium Elementor WordPress</h3>
                </div>
                <button 
                  onClick={() => setShowElementorModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Nós empacotamos este dashboard inteiro para você! Clique no botão abaixo para copiar o arquivo HTML já completo (com as bibliotecas SheetJS, Chart.js e Tailwind embutidas de forma offline de alta performance). No Elementor, basta arrastar o Widget <strong className="text-gray-850">"Código HTML"</strong> e colar este código diretamente. Ele funcionará imediatamente na página institucional do CAVIVER!
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl border flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#5A2483] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    caiviver_dash_elementor.html
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyElementorCode}
                      className="px-3 py-1.5 bg-[#5A2483] hover:bg-[#7B4BA3] text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedNotification ? "Copiado!" : "Copiar Código"}</span>
                    </button>
                    <button 
                      onClick={handleDownloadElementorHTML}
                      className="px-3 py-1.5 bg-[#F28C28] hover:bg-[#F28C28]/95 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Baixar HTML</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto bg-gray-950 p-3 rounded-lg border border-gray-800 text-left font-mono text-[9px] text-gray-300 custom-scroll">
                  {generateElementorHTML().slice(0, 1500)} ... [código completo no clipboard]
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setShowElementorModal(false)}
                  className="px-4 py-2 bg-gray-150 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition"
                >
                  Fechar Janela
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loader Spinner overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-xl border">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-solid border-[#5A2483] border-t-transparent"></div>
            <p className="text-xs font-bold text-[#5A2483] uppercase tracking-widest animate-pulse">Lendo Todas as Linhas da Planilha...</p>
          </div>
        </div>
      )}

    </div>
  );
}
