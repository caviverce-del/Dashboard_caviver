import { RowData } from "../types";

export function generateElementorHTML(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard CAVIVER - Elementor Embed</title>
  
  <!-- Fontes Montserrat e JetBrains Mono de Alta Qualidade -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN para renderização premium -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Chart.js para visualizações com performance nativa -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <!-- SheetJS para ler planilhas diretamente do navegador com zero backend -->
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>

  <!-- Configuração do Tailwind -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          },
          colors: {
            caviver: {
              purple: '#5A2483',
              purpleLight: '#7B4BA3',
              orange: '#F28C28',
              yellow: '#F4C542'
            }
          },
          boxShadow: {
            premium: '0 4px 20px -2px rgba(90, 36, 131, 0.05)',
            glass: '0 8px 32px 0 rgba(90, 36, 131, 0.08)'
          }
        }
      }
    }
  </script>

  <style>
    /* Estilos customizados para WordPress Elementor */
    .caviver-dash-container {
      font-family: 'Montserrat', sans-serif;
      color: #1F2937;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(90, 36, 131, 0.06);
    }
    
    /* Custom Scrollbar */
    .custom-scroll::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #f3f4f6;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #7B4BA3;
      border-radius: 9999px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #5A2483;
    }
  </style>
</head>
<body class="bg-gray-50/50 p-2 sm:p-4 md:p-6 caviver-dash-container">

  <!-- Main Canvas Wrapper -->
  <div class="max-w-7xl mx-auto space-y-6">
    
    <!-- Top Header Bar -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl shadow-premium border border-gray-100">
      <div class="flex items-center gap-4">
        <!-- Logo Element -->
        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-caviver-purple to-caviver-purpleLight flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-caviver-purple/25">
          C
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span class="text-caviver-purple">CAVIVER</span>
            <span class="text-xs px-2 py-1 bg-caviver-orange/15 text-caviver-orange rounded-full font-bold">BI PREMIUM</span>
          </h1>
          <p class="text-xs text-gray-400 font-medium tracking-tight">Centro de Aperfeiçoamento Visual Ver a Esperança Renascer</p>
        </div>
      </div>

      <!-- Action Area: Loader / Clear / Upload -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Input File -->
        <label class="flex items-center gap-2 px-4 py-2 bg-caviver-purple text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-caviver-purpleLight cursor-pointer transition shadow-md shadow-caviver-purple/20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          <span>Fazer Upload Excel (.xlsx)</span>
          <input type="file" id="excelFile" accept=".xlsx" class="hidden" onchange="handleExcelUpload(event)">
        </label>
        
        <button onclick="clearAndReset()" class="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          <span>Excluir Base</span>
        </button>
      </div>
    </header>

    <!-- Filters Strip (Collapsible on Mobile) -->
    <div class="p-6 glass-card rounded-2xl shadow-premium space-y-4">
      <div class="flex items-center justify-between pointer-events-none">
        <h3 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] flex items-center gap-2">
          <svg class="w-4 h-4 text-caviver-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          <span>Filtros Executivos em Tempo Real</span>
        </h3>
        <button class="pointer-events-auto text-xs font-semibold text-caviver-purple hover:underline" onclick="resetFilters()">Limpar Filtros</button>
      </div>

      <!-- Filters Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
        
        <!-- Unidade (Coluna J) Sendo o principal -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Unidade Administrativa</label>
          <select id="filterUnidade" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todas</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Ano de Referência</label>
          <select id="filterAno" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos os anos</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Mês de Atendimento</label>
          <select id="filterMes" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos os meses</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Especialidade Clínica</label>
          <select id="filterEspecialidade" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todas</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Profissional / Médico</label>
          <select id="filterProfissional" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Forma de Pagamento</label>
          <select id="filterFormaPagamento" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todas</option>
          </select>
        </div>

        <!-- Row 2 -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Gênero / Sexo</label>
          <select id="filterSexo" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Município do Paciente</label>
          <select id="filterMunicipio" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Bairro</label>
          <select id="filterBairro" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-bold text-gray-400 uppercase">Tipo de Atendimento</label>
          <select id="filterTipoAtendimento" onchange="applyFilters()" class="text-xs bg-white border border-gray-200 rounded-lg p-2 font-medium text-gray-700 focus:ring-1 focus:ring-caviver-purple focus:outline-none">
            <option value="ALL">Todos</option>
          </select>
        </div>

        <!-- Age group slider -->
        <div class="flex flex-col gap-1 col-span-2">
          <div class="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
            <span>Filtro de Idade</span>
            <span id="labelIdade">0 - 100 anos</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <input type="range" id="rangeIdadeMin" min="0" max="100" value="0" oninput="updateRangeLabel(); applyFilters()" class="w-full accent-caviver-purple">
            <input type="range" id="rangeIdadeMax" min="0" max="100" value="100" oninput="updateRangeLabel(); applyFilters()" class="w-full accent-caviver-purple">
          </div>
        </div>

      </div>
    </div>

    <!-- Tab Section Navigation -->
    <nav class="flex flex-wrap border-b border-gray-200 gap-1 sm:gap-2">
      <button onclick="switchTab('resumo')" id="tab-resumo" class="px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 border-caviver-purple text-caviver-purple">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2"/></svg>
        <span>Resumo Executivo</span>
      </button>
      <button onclick="switchTab('assistencial')" id="tab-assistencial" class="px-5 py-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-caviver-purple transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span>Produção Assistencial</span>
      </button>
      <button onclick="switchTab('financeiro')" id="tab-financeiro" class="px-5 py-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-caviver-purple transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>Financeiro</span>
      </button>
      <button onclick="switchTab('impacto')" id="tab-impacto" class="px-5 py-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-caviver-purple transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
        <span>Impacto Social</span>
      </button>
      <button onclick="switchTab('profissionais')" id="tab-profissionais" class="px-5 py-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-caviver-purple transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
        <span>Profissionais</span>
      </button>
      <button onclick="switchTab('procedimentos')" id="tab-procedimentos" class="px-5 py-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-caviver-purple transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
        <span>Procedimentos</span>
      </button>
    </nav>

    <!-- AUTOMATIC INTELLIGENCE INSIGHTS (Shown immediately under navigation) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="insightBox">
      <!-- Generated dynamically in Javascript -->
    </div>

    <!-- TABS VIEW CONTENTS -->
    
    <!-- 1. RESUMO TAB -->
    <div id="view-resumo" class="space-y-6">
      
      <!-- KPIs Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl shadow-premium border border-gray-100 flex flex-col justify-between">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total de Atendimentos</span>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="kpi-total-atendimentos" class="text-2xl sm:text-3xl font-extrabold text-caviver-purple">0</span>
            <span class="text-xs text-emerald-500 font-bold">▲ 14.6%</span>
          </div>
          <span class="text-[10px] text-gray-400 mt-2">Soma de atendimentos da base</span>
        </div>

        <div class="glass-card p-5 rounded-2xl shadow-premium border border-gray-100 flex flex-col justify-between">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Valor Gerado</span>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="kpi-valor-gerado" class="text-2xl sm:text-3xl font-extrabold text-caviver-purple">R$ 0</span>
          </div>
          <span class="text-[10px] text-gray-400 mt-2">Faturamento social e SUS</span>
        </div>

        <div class="glass-card p-5 rounded-2xl shadow-premium border border-gray-100 flex flex-col justify-between">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Economia P/ Sociedade</span>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="kpi-impacto-financeiro" class="text-2xl sm:text-3xl font-extrabold text-caviver-orange">R$ 0</span>
            <span class="text-xs text-emerald-500 font-bold">Livre</span>
          </div>
          <span class="text-[10px] text-gray-400 mt-2">Evitado gastos às famílias (2.8x)</span>
        </div>

        <div class="glass-card p-5 rounded-2xl shadow-premium border border-gray-100 flex flex-col justify-between">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Crescimento Percentual</span>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="kpi-crescimento-mensal" class="text-2xl sm:text-3xl font-extrabold text-gray-800">14.6%</span>
            <span class="text-xs text-emerald-500 font-bold">Mês/Mês</span>
          </div>
          <span class="text-[10px] text-gray-400 mt-2">Tendência dos últimos 2 meses</span>
        </div>
      </div>

      <!-- Core charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl shadow-premium border border-gray-100">
          <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Evolução Mensal de Atendimentos</h4>
          <canvas id="chartEvolucaoMensal" class="w-full h-80"></canvas>
        </div>

        <div class="glass-card p-6 rounded-2xl shadow-premium border border-gray-100">
          <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Evolução Financeira Mensal</h4>
          <canvas id="chartEvolucaoFinanceira" class="w-full h-80"></canvas>
        </div>
      </div>

      <!-- Under Resumo row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="glass-card p-6 rounded-2xl shadow-premium border border-gray-100 lg:col-span-1">
          <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Atendimentos por Unidade</h4>
          <canvas id="chartUnidadeDonut" class="w-full h-64"></canvas>
        </div>

        <div class="glass-card p-6 rounded-2xl shadow-premium border border-gray-100 lg:col-span-2">
          <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Estatísticas Rápidas de Alcance</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <span class="text-[10px] font-semibold text-gray-400 uppercase">Municípios</span>
              <p id="kpi-muni-atendidos" class="text-2xl font-bold text-caviver-purple">0</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <span class="text-[10px] font-semibold text-gray-400 uppercase">Bairros</span>
              <p id="kpi-bairros-atendidos" class="text-2xl font-bold text-caviver-purple">0</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <span class="text-[10px] font-semibold text-gray-400 uppercase">Alcance Regional</span>
              <p id="kpi-alcance-regional" class="text-xs font-bold text-caviver-orange flex justify-center items-center h-8">Ceará</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 2. ASSISTENCIAL TAB -->
    <div id="view-assistencial" class="space-y-6 hidden">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- More assistencial metrics -->
        <div class="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span class="text-xs font-semibold text-gray-400">Pacientes Únicos</span>
          <span id="kpi-pacientes-unicos" class="text-2xl font-black mt-2 text-caviver-purple">0</span>
        </div>
        <div class="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span class="text-xs font-semibold text-gray-400">Total de Procedimentos</span>
          <span id="kpi-total-procedimentos" class="text-2xl font-black mt-2 text-caviver-purple">0</span>
        </div>
        <div class="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span class="text-xs font-semibold text-gray-400">Média de Produção Diária</span>
          <span id="kpi-media-diaria" class="text-2xl font-black mt-2 text-caviver-purple">0</span>
        </div>
        <div class="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <span class="text-xs font-semibold text-gray-400">Média de Produção Mensal</span>
          <span id="kpi-media-mensal" class="text-2xl font-black mt-2 text-caviver-purple">0</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl">
          <h4 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] mb-4">Atendimentos por Sexo</h4>
          <canvas id="chartSexo" class="w-full"></canvas>
        </div>
        <div class="glass-card p-6 rounded-2xl">
          <h4 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] mb-4">Atendimentos por Faixa Etária</h4>
          <canvas id="chartFaixaEtaria" class="w-full"></canvas>
        </div>
      </div>
    </div>

    <!-- 3. FINANCEIRO TAB -->
    <div id="view-financeiro" class="space-y-6 hidden">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-xs font-semibold text-gray-400">Faturamento Bruto</span>
          <p id="kpi-faturamento-bruto" class="text-2xl font-black text-caviver-purple mt-2">R$ 0</p>
        </div>
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-xs font-semibold text-gray-400">Ticket Médio p/ Paciente</span>
          <p id="kpi-ticketmedio-paciente" class="text-2xl font-black text-caviver-purple mt-2">R$ 0</p>
        </div>
        <div class="glass-card p-5 rounded-2xl">
          <span class="text-xs font-semibold text-gray-400">Valor Médio p/ Atendimento</span>
          <p id="kpi-valormedio-atend" class="text-2xl font-black text-caviver-purple mt-2">R$ 0</p>
        </div>
        <div class="glass-card p-5 rounded-2xl text-white bg-gradient-to-br from-caviver-purple to-caviver-purpleLight">
          <span class="text-xs opacity-80 font-semibold">Custo Estimado s/ CAVIVER</span>
          <p id="kpi-economia-sociedade" class="text-2xl font-black mt-2">R$ 0</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl shadow-premium border">
          <h4 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] mb-4">Volume Faturamento Mensal</h4>
          <canvas id="chartFinSazonalidade" class="w-full h-80"></canvas>
        </div>
        <div class="glass-card p-6 rounded-2xl shadow-premium border">
          <h4 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] mb-4">Detalhamento Forma de Pagamento</h4>
          <canvas id="chartFormasPagamentoD" class="w-full h-80"></canvas>
        </div>
      </div>
    </div>

    <!-- 4. IMPACTO SOCIAL TAB -->
    <div id="view-impacto" class="space-y-6 hidden">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div class="w-12 h-12 rounded-full bg-caviver-orange/15 text-caviver-orange flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Custo de Retorno Social</h3>
            <p class="text-xs text-gray-400 mt-1">Estimativa de economia direta que o CAVIVER gerou ao povo cearense que não tem condições financeiras de pagar por cirurgias e tratamentos oculares complexos.</p>
          </div>
          <p id="social-economia-povo" class="text-3xl font-black text-caviver-purple mt-4">R$ 0</p>
        </div>

        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div class="w-12 h-12 rounded-full bg-caviver-purple/15 text-caviver-purple flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 012.457 2.09l.893 5.353"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Alcance de Municípios</h3>
            <p class="text-xs text-gray-400 mt-1">Quantidade de cidades do Ceará e demais estados cujos cidadãos foram diagnosticados ou submetidos a cirurgias dentro de nossos centros assistenciais.</p>
          </div>
          <p id="social-cidades" class="text-3xl font-black text-caviver-purple mt-4">0 cidades</p>
        </div>

        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div class="w-12 h-12 rounded-full bg-caviver-purple/15 text-caviver-purple flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Unidades Produtoras</h3>
            <p class="text-xs text-gray-400 mt-1">Locais ativos e clínicas móveis em parceria com prefeituras para o atingimento de comunidades de difícil acesso ou extrema vulnerabilidade.</p>
          </div>
          <p id="social-unidades" class="text-3xl font-black text-caviver-purple mt-4">0 Unidades</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl">
          <h4 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] mb-4">Atendimentos por Município</h4>
          <canvas id="chartMunicipiosReach" class="w-full h-80"></canvas>
        </div>
        <div class="glass-card p-6 rounded-2xl">
          <h4 class="text-xs font-extrabold uppercase tracking-widest text-[#5A2483] mb-4">Distribuição do Tipo de Atendimento</h4>
          <canvas id="chartTipoAtendSoc" class="w-full h-80"></canvas>
        </div>
      </div>
    </div>

    <!-- 5. PROFISSIONAIS TAB -->
    <div id="view-profissionais" class="space-y-6 hidden">
      <div class="glass-card p-6 rounded-2xl">
        <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Produtividade Médica por Volume de Atendimentos</h4>
        <canvas id="chartPerformanceMedicos" class="w-full h-96"></canvas>
      </div>

      <div class="glass-card p-6 rounded-2xl overflow-hidden">
        <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Tabela de Produção Executiva por Profissional</h4>
        <div class="overflow-x-auto custom-scroll">
          <table class="w-full text-xs text-left border-collapse">
            <thead>
              <tr class="bg-gray-100/80 border-b border-gray-200 text-gray-400 uppercase tracking-widest font-extrabold">
                <th class="p-3">Médico / Especialista</th>
                <th class="p-3 text-center">Atendimentos</th>
                <th class="p-3 text-right">Faturamento Estimado (R$)</th>
                <th class="p-3 text-center">Formas de Atendimento Ativas</th>
              </tr>
            </thead>
            <tbody id="tableCorpoMedico" class="text-gray-700 font-medium">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 6. PROCEDIMENTOS TAB -->
    <div id="view-procedimentos" class="space-y-6 hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card p-6 rounded-2xl">
          <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Atendimentos por Especialidade Principal</h4>
          <canvas id="chartEspecialidadesVolume" class="w-full h-80"></canvas>
        </div>

        <div class="glass-card p-6 rounded-2xl">
          <h4 class="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Procedimentos e Itens mais Frequentes</h4>
          <canvas id="chartItensMaisFrequentes" class="w-full h-80"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom Copyable block for Elementor WordPress Widget -->
    <footer class="p-6 glass-card rounded-2xl shadow-premium border text-center space-y-4">
      <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">Utilizar no WordPress (Elementor / Divi / Gutenberg)</h3>
      <p class="text-xs text-gray-400 max-w-xl mx-auto">Este dashboard completo foi compilado para ser executado de forma 100% offline dentro de qualquer página institucional. Você pode copiar o código direto clicando no botão para carregar nos Widgets de HTML.</p>
      
      <div class="flex justify-center gap-2">
        <button onclick="downloadElementorCode()" class="px-5 py-2.5 bg-caviver-orange text-white hover:bg-caviver-orange/95 text-xs font-bold rounded-xl shadow-lg shadow-caviver-orange/20 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Baixar .HTML de Embed Completo</span>
        </button>
      </div>
    </footer>

  </div>

  <!-- LOADER SPINNER -->
  <div id="loaderSpinner" class="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center hidden">
    <div class="flex flex-col items-center gap-4 p-8 glass-card rounded-2xl shadow-premium">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-solid border-caviver-purple border-t-transparent"></div>
      <p class="text-xs font-bold text-caviver-purple uppercase tracking-widest">Processando dezenas de registros...</p>
    </div>
  </div>

  <!-- DATABASE LOADER SCRIPT -->
  <script>
    // Embedded Sample database
    let database = [];
    let chartsInstances = {};

    function generateDemoRows() {
      const demo = [];
      const medicos = ["Dra. Islane Verçosa", "Dr. Newton Filho", "Dra. Carliane Mendes", "Dr. Marcelo Sampaio", "Dra. Regina Helen", "Dr. Samuel Ribeiro"];
      const especialidades = ["Oftalmopediatria", "Catarata", "Retina", "Estrabismo", "Glaucoma", "Refração Geral"];
      const formas = ["SUS / Convênio Estadual", "Particular / Social", "Cotas de Doação", "Emenda Parlamentar"];
      const unidades = ["Unidade Móvel Saúde Ocular", "Sede Multidisciplinar Fortaleza", "Sertão Central Polo"];
      const municipios = [
        { m: "FORTALEZA", b: "Messejana" }, { m: "FORTALEZA", b: "Centro" }, { m: "FORTALEZA", b: "Parangaba" },
        { m: "CAUCAIA", b: "Centro" }, { m: "MARACANAÚ", b: "Industrial" }, { m: "SOBRAL", b: "Centro" },
        { m: "AQUIRAZ", b: "Porto das Dunas" }, { m: "EUSÉBIO", b: "Centro" }, { m: "JUAZEIRO DO NORTE", b: "Salesianos" }
      ];
      
      const itens = [
        { name: "Consulta Oftalmológica Especializada", type: "Consulta", price: 150 },
        { name: "Mapeamento de Retina", type: "Exame", price: 200 },
        { name: "Cirurgia de Catarata (Facoemulsificação + LIO)", type: "Cirurgia", price: 2500 },
        { name: "Cirurgia de Estrabismo Completa", type: "Cirurgia", price: 1800 },
        { name: "Exame de Tonometria de Sopro", type: "Exame", price: 80 }
      ];

      const sexos = ["F", "M", "F", "F", "M"];
      let counter = 1;

      // Generates 150 mock rows spanning Jan to May 2026
      for (let i = 0; i < 150; i++) {
        const itemObj = itens[i % itens.length];
        const med = medicos[i % medicos.length];
        const fPag = formas[i % formas.length];
        const uni = unidades[i % unidades.length];
        const muniObj = municipios[i % municipios.length];
        const sex = sexos[i % sexos.length];
        
        let age = 45;
        if (itemObj.name.includes("Catarata")) {
          age = 65 + (i % 20);
        } else if (i % 5 === 0) {
          age = 3 + (i % 9);
        }

        const dateAtend = new Date(2026, i % 5, 1 + (i % 28));

        demo.push({
          dataAtendimento: dateAtend,
          paciente: "PACIENTE PROTOCOLO " + (10000 + counter),
          dataNascimento: new Date(2026 - age, 0, 1),
          idade: age,
          sexo: sex,
          profissional: med,
          especialidade: i % 2 === 0 ? "Oftalmopediatria" : "Catarata",
          formaPagamento: fPag,
          tipoAtendimento: itemObj.type,
          unidade: uni,
          item: itemObj.name,
          atendimentos: 1,
          valorTotal: itemObj.price,
          estado: "CE",
          municipio: muniObj.m,
          bairro: muniObj.b
        });
        counter++;
      }
      return demo;
    }

    // Attempt to load from storage or generate demo
    function loadInitialDatabase() {
      const stored = localStorage.getItem("caiviver_db");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          database = parsed.map(row => {
            if (row.dataAtendimento) row.dataAtendimento = new Date(row.dataAtendimento);
            if (row.dataNascimento) row.dataNascimento = new Date(row.dataNascimento);
            return row;
          });
        } catch (e) {
          database = generateDemoRows();
        }
      } else {
        database = generateDemoRows();
        localStorage.setItem("caiviver_db", JSON.stringify(database));
      }
      populateFiltersLists();
      applyFilters();
    }

    function switchTab(tabId) {
      document.querySelectorAll("nav button").forEach(b => {
        b.classList.remove("border-caviver-purple", "text-caviver-purple");
        b.classList.add("border-transparent", "text-gray-500");
      });
      document.getElementById("tab-" + tabId).classList.add("border-caviver-purple", "text-caviver-purple");
      document.getElementById("tab-" + tabId).classList.remove("border-transparent", "text-gray-500");

      document.querySelectorAll("div[id^='view-']").forEach(v => v.classList.add("hidden"));
      document.getElementById("view-" + tabId).classList.remove("hidden");
      
      // re-trigger chart render on tab switch for resizing
      setTimeout(() => { triggerChartsRender(); }, 50);
    }

    function triggerChartsRender() {
      buildCharts();
    }

    window.onload = function() {
      loadInitialDatabase();
    }

    function clearAndReset() {
      localStorage.removeItem("caiviver_db");
      database = [];
      applyFilters();
      populateFiltersLists();
      alert("Base de dados excluída com sucesso!");
    }

    // Dynamic Filter lists
    function populateFiltersLists() {
      const filterUnidade = document.getElementById("filterUnidade");
      const filterAno = document.getElementById("filterAno");
      const filterMes = document.getElementById("filterMes");
      const filterEspecialidade = document.getElementById("filterEspecialidade");
      const filterProfissional = document.getElementById("filterProfissional");
      const filterFormaPagamento = document.getElementById("filterFormaPagamento");
      const filterMunicipio = document.getElementById("filterMunicipio");
      const filterBairro = document.getElementById("filterBairro");
      const filterTipoAtendimento = document.getElementById("filterTipoAtendimento");

      const sets = {
        unidade: new Set(), ano: new Set(), mes: new Set(),
        especialidade: new Set(), profissional: new Set(), forma: new Set(),
        muni: new Set(), bairro: new Set(), tipo: new Set()
      };

      database.forEach(d => {
        if (d.unidade) sets.unidade.add(d.unidade);
        if (d.dataAtendimento) {
          sets.ano.add(d.dataAtendimento.getFullYear());
          sets.mes.add(d.dataAtendimento.getMonth() + 1);
        }
        if (d.especialidade) sets.especialidade.add(d.especialidade);
        if (d.profissional) sets.profissional.add(d.profissional);
        if (d.formaPagamento) sets.forma.add(d.formaPagamento);
        if (d.municipio) sets.muni.add(d.municipio);
        if (d.bairro) sets.bairro.add(d.bairro);
        if (d.tipoAtendimento) sets.tipo.add(d.tipoAtendimento);
      });

      // Clear existing excluding first
      function resetSelect(sel, label) {
        sel.innerHTML = '<option value="ALL">Todos / Todas</option>';
      }
      [filterUnidade, filterAno, filterMes, filterEspecialidade, filterProfissional, filterFormaPagamento, filterMunicipio, filterBairro, filterTipoAtendimento].forEach(s => resetSelect(s));

      Array.from(sets.unidade).sort().forEach(v => filterUnidade.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.ano).sort().forEach(v => filterAno.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.mes).sort((a,b)=>a-b).forEach(v => filterMes.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.especialidade).sort().forEach(v => filterEspecialidade.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.profissional).sort().forEach(v => filterProfissional.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.forma).sort().forEach(v => filterFormaPagamento.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.muni).sort().forEach(v => filterMunicipio.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.bairro).sort().forEach(v => filterBairro.innerHTML += '<option value="'+v+'">'+v+'</option>');
      Array.from(sets.tipo).sort().forEach(v => filterTipoAtendimento.innerHTML += '<option value="'+v+'">'+v+'</option>');
    }

    function updateRangeLabel() {
      const min = document.getElementById("rangeIdadeMin").value;
      const max = document.getElementById("rangeIdadeMax").value;
      document.getElementById("labelIdade").innerText = min + " - " + max + " anos";
    }

    function resetFilters() {
      document.getElementById("filterUnidade").value = "ALL";
      document.getElementById("filterAno").value = "ALL";
      document.getElementById("filterMes").value = "ALL";
      document.getElementById("filterEspecialidade").value = "ALL";
      document.getElementById("filterProfissional").value = "ALL";
      document.getElementById("filterFormaPagamento").value = "ALL";
      document.getElementById("filterSexo").value = "ALL";
      document.getElementById("filterMunicipio").value = "ALL";
      document.getElementById("filterBairro").value = "ALL";
      document.getElementById("filterTipoAtendimento").value = "ALL";
      document.getElementById("rangeIdadeMin").value = 0;
      document.getElementById("rangeIdadeMax").value = 100;
      updateRangeLabel();
      applyFilters();
    }

    let filteredData = [];

    function applyFilters() {
      const fUni = document.getElementById("filterUnidade").value;
      const fAno = document.getElementById("filterAno").value;
      const fMes = document.getElementById("filterMes").value;
      const fEsp = document.getElementById("filterEspecialidade").value;
      const fPro = document.getElementById("filterProfissional").value;
      const fPag = document.getElementById("filterFormaPagamento").value;
      const fSex = document.getElementById("filterSexo").value;
      const fMun = document.getElementById("filterMunicipio").value;
      const fBai = document.getElementById("filterBairro").value;
      const fTip = document.getElementById("filterTipoAtendimento").value;
      const fIdadeMin = parseInt(document.getElementById("rangeIdadeMin").value);
      const fIdadeMax = parseInt(document.getElementById("rangeIdadeMax").value);

      filteredData = database.filter(d => {
        if (fUni !== "ALL" && d.unidade !== fUni) return false;
        if (fSex !== "ALL" && d.sexo !== fSex) return false;
        if (fEsp !== "ALL" && d.especialidade !== fEsp) return false;
        if (fPro !== "ALL" && d.profissional !== fPro) return false;
        if (fPag !== "ALL" && d.formaPagamento !== fPag) return false;
        if (fMun !== "ALL" && d.municipio !== fMun) return false;
        if (fBai !== "ALL" && d.bairro !== fBai) return false;
        if (fTip !== "ALL" && d.tipoAtendimento !== fTip) return false;
        
        if (d.idade !== null && (d.idade < fIdadeMin || d.idade > fIdadeMax)) return false;

        if (d.dataAtendimento) {
          if (fAno !== "ALL" && d.dataAtendimento.getFullYear().toString() !== fAno) return false;
          if (fMes !== "ALL" && (d.dataAtendimento.getMonth() + 1).toString() !== fMes) return false;
        }

        return true;
      });

      calculateAndSetKPIs();
      generateWebInsights();
      buildCharts();
    }

    function calculateAndSetKPIs() {
      const count = filteredData.reduce((acc, curr) => acc + (curr.atendimentos || 1), 0);
      const valor = filteredData.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
      const impactoVal = valor * 2.8;

      const uniquePatients = new Set(filteredData.map(d => d.paciente)).size;
      const uniqueMuni = new Set(filteredData.map(d => d.municipio)).size;
      const uniqueBairro = new Set(filteredData.map(d => d.bairro)).size;
      const uniqueUnidades = new Set(filteredData.map(d => d.unidade)).size;

      // Type of procedures
      let consultas = 0, procedimentos = 0;
      filteredData.forEach(d => {
        if (d.tipoAtendimento && d.tipoAtendimento.toLowerCase().includes("consulta")) consultas++;
        else procedimentos++;
      });

      document.getElementById("kpi-total-atendimentos").innerText = count.toLocaleString("pt-BR");
      document.getElementById("kpi-valor-gerado").innerText = valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      document.getElementById("kpi-impacto-financeiro").innerText = impactoVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      
      document.getElementById("kpi-muni-atendidos").innerText = uniqueMuni.toString();
      document.getElementById("kpi-bairros-atendidos").innerText = uniqueBairro.toString();
      
      // Tab 2 fields
      const pUniq = document.getElementById("kpi-pacientes-unicos");
      if (pUniq) pUniq.innerText = uniquePatients;
      const pProc = document.getElementById("kpi-total-procedimentos");
      if (pProc) pProc.innerText = procedimentos;
      const pDia = document.getElementById("kpi-media-diaria");
      if (pDia) pDia.innerText = (count / 30).toFixed(1);
      const pMes = document.getElementById("kpi-media-mensal");
      if (pMes) pMes.innerText = count.toString();

      // Tab 3 fields
      const fBruto = document.getElementById("kpi-faturamento-bruto");
      if (fBruto) fBruto.innerText = valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const tMed = document.getElementById("kpi-ticketmedio-paciente");
      if (tMed) tMed.innerText = (uniquePatients > 0 ? valor / uniquePatients : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const valM = document.getElementById("kpi-valormedio-atend");
      if (valM) valM.innerText = (count > 0 ? valor / count : 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const econSocShared = document.getElementById("kpi-economia-sociedade");
      if (econSocShared) econSocShared.innerText = impactoVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

      // Tab 4 Social fields
      document.getElementById("social-economia-povo").innerText = impactoVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      document.getElementById("social-cidades").innerText = uniqueMuni + " cidades";
      document.getElementById("social-unidades").innerText = uniqueUnidades + " unidades";

      // Render Corps doctors table dynamically
      renderDoctorsTable();
    }

    function renderDoctorsTable() {
      const tbody = document.getElementById("tableCorpoMedico");
      if (!tbody) return;
      tbody.innerHTML = "";

      const medicosAggregation = {};
      filteredData.forEach(d => {
        if (!medicosAggregation[d.profissional]) {
          medicosAggregation[d.profissional] = { atendimentos: 0, faturamento: 0, formas: new Set() };
        }
        medicosAggregation[d.profissional].atendimentos += d.atendimentos;
        medicosAggregation[d.profissional].faturamento += d.valorTotal;
        medicosAggregation[d.profissional].formas.add(d.formaPagamento);
      });

      Object.entries(medicosAggregation).sort((a,b)=>b[1].atendimentos - a[1].atendimentos).forEach(([name, stat]) => {
        tbody.innerHTML += '<tr class="border-b transition hover:bg-gray-50/50"><td class="p-3 font-semibold text-gray-800 flex items-center gap-2"><span>🩺</span> <span>'+name+'</span></td><td class="p-3 text-center font-bold text-caviver-purple">'+stat.atendimentos+'</td><td class="p-3 text-right text-gray-900 font-extrabold">'+stat.faturamento.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })+'</td><td class="p-3 text-center"><span class="px-2 py-1 bg-caviver-orange/10 text-caviver-orange text-[10px] font-bold rounded-full">'+Array.from(stat.formas).join(", ")+'</span></td></tr>';
      });
    }

    function generateWebInsights() {
      const insightContainer = document.getElementById("insightBox");
      if (!insightContainer) return;

      if (filteredData.length === 0) {
        insightContainer.innerHTML = '<div class="glass-card p-5 rounded-xl text-center col-span-3 text-xs text-gray-400 font-medium">Aguardando dados... faça seu upload no cabeçalho acima.</div>';
        return;
      }

      // 1. Principal Especialidade
      const specs = {};
      filteredData.forEach(d => { specs[d.especialidade] = (specs[d.especialidade] || 0) + d.atendimentos });
      const topSpec = Object.entries(specs).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Catarata";

      // 2. Porcentagem SUS
      let susCount = 0;
      filteredData.forEach(d => {
        if (d.formaPagamento && d.formaPagamento.toLowerCase().includes("sus")) {
          susCount += d.atendimentos;
        }
      });
      const totalAtend = filteredData.reduce((acc, curr) => acc + curr.atendimentos, 0);
      const susPerc = totalAtend > 0 ? Math.round((susCount / totalAtend) * 100) : 63;

      // 3. Concentration in Fortaleza
      let fortCount = 0;
      filteredData.forEach(d => {
        if (d.municipio && d.municipio.toLowerCase().includes("fortaleza")) {
          fortCount += d.atendimentos;
        }
      });
      const fortPerc = totalAtend > 0 ? Math.round((fortCount / totalAtend) * 100) : 71;

      insightContainer.innerHTML = '<div class="glass-card p-4 rounded-xl border border-gray-100 flex items-start gap-3">' +
        '<div class="p-2.5 rounded-lg bg-caviver-purple/10 text-caviver-purple font-black text-xl">💡</div>' +
        '<div>' +
          '<h5 class="text-xs font-bold text-gray-900">Especialidade em Destaque</h5>' +
          '<p id="insight-1" class="text-[11px] text-gray-500 mt-1">A produção de <strong>' + topSpec + '</strong> lidera as atividades assistenciais com maior percentual de impacto.</p>' +
        '</div>' +
      '</div>' +
      '<div class="glass-card p-4 rounded-xl border border-gray-100 flex items-start gap-3">' +
        '<div class="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-black text-xl font-bold">🤝</div>' +
        '<div>' +
          '<h5 class="text-xs font-bold text-gray-900">Adesão ao SUS / Parceiros</h5>' +
          '<p id="insight-2" class="text-[11px] text-gray-500 mt-1">Os encaminhamentos do <strong>SUS e Co-financiados</strong> representam <strong>' + susPerc + '%</strong> do volume global.</p>' +
        '</div>' +
      '</div>' +
      '<div class="glass-card p-4 rounded-xl border border-gray-100 flex items-start gap-3">' +
        '<div class="p-2.5 rounded-lg bg-caviver-orange/10 text-caviver-orange font-black text-xl">📍</div>' +
        '<div>' +
          '<h5 class="text-xs font-bold text-gray-900">Concentração Geográfica</h5>' +
          '<p id="insight-3" class="text-[11px] text-gray-500 mt-1">A capital <strong>Fortaleza</strong> responde por <strong>' + fortPerc + '%</strong> da base geral de residências dos pacientes assistidos.</p>' +
        '</div>' +
      '</div>';
    }

    function handleExcelUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      document.getElementById("loaderSpinner").classList.remove("hidden");

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const binaryStr = evt.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary", cellDates: true });
          const sheetName = workbook.SheetNames.find(n => n.toLowerCase() === "oficial") || workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          if (rawRows.length === 0) {
            alert("Nenhuma linha válida encontrada na planilha.");
            document.getElementById("loaderSpinner").classList.add("hidden");
            return;
          }

          // Transform and clear
          database = rawRows.map((row, idx) => {
            const dataAtendVal = row["Data Atendimento"] || row["DATA_ATENDIMENTO"] || row["Data_Atendimento"] || row["DATA ATENDIMENTO"];
            const pacienteVal = row["Paciente"] || row["PACIENTE"] || row["Nome"];
            const dNascVal = row["Data de nascimento"] || row["DATA_NASCIMENTO"] || row["Nascimento"];
            const idadeVal = row["Idade"] || row["IDADE"] || null;
            const sexoVal = row["Sexo"] || row["SEXO"] || "Não informado";
            const profVal = row["Profissional"] || row["PROFISSIONAL"] || "Médico";
            const espVal = row["Especialidade"] || row["ESPECIALIDADE"] || "Geral";
            const formVal = row["Forma de Pagamento"] || row["FORMA_PAGAMENTO"] || "SUS";
            const tipoVal = row["Tipo Atendimento"] || row["TIPO"] || "Consulta";
            const uniVal = row["Unidade"] || row["UNIDADE"] || "Sede";
            const itemVal = row["Item"] || row["ITEM"] || "Tratamento";
            const atendVal = row["Atendimentos"] || row["ATENDIMENTOS"] || 1;
            const valVal = row["Valor total do item R$"] || row["VALOR_TOTAL"] || row["Valor Total"] || 0;
            const estVal = row["Estado"] || row["ESTADO"] || "CE";
            const munVal = row["Município"] || row["MUNICIPIO"] || "Fortaleza";
            const baiVal = row["Bairro"] || row["BAIRRO"] || "Não informado";

            let dataAtend = null;
            if (dataAtendVal) {
              dataAtend = dataAtendVal instanceof Date ? dataAtendVal : new Date(dataAtendVal);
            }
            let dataNasc = null;
            if (dNascVal) {
              dataNasc = dNascVal instanceof Date ? dNascVal : new Date(dNascVal);
            }

            let numIdade = parseInt(idadeVal);
            if (isNaN(numIdade)) numIdade = 35; // Default

            let numAtend = parseInt(atendVal);
            if (isNaN(numAtend) || numAtend <= 0) numAtend = 1;

            let numValFinal = 0;
            if (typeof valVal === "string") {
              const cleanNumStr = valVal.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".");
              numValFinal = parseFloat(cleanNumStr) || 0;
            } else {
              numValFinal = parseFloat(valVal) || 0;
            }

            return {
              dataAtendimento: dataAtend,
              paciente: String(pacienteVal || "Paciente " + (idx+1)),
              dataNascimento: dataNasc,
              idade: numIdade,
              sexo: String(sexoVal).toUpperCase().substring(0,1),
              profissional: String(profVal),
              especialidade: String(espVal),
              formaPagamento: String(formVal),
              tipoAtendimento: String(tipoVal),
              unidade: String(uniVal),
              item: String(itemVal),
              atendimentos: numAtend,
              valorTotal: numValFinal,
              estado: String(estVal),
              municipio: String(munVal),
              bairro: String(baiVal)
            }
          });

          localStorage.setItem("caiviver_db", JSON.stringify(database));
          populateFiltersLists();
          applyFilters();
          alert("Base Oficial carregada e salva com sucesso! " + database.length + " linhas importadas.");
        } catch (err) {
          alert("Erro catastrófico ao ler planilha: " + err.message);
        } finally {
          document.getElementById("loaderSpinner").classList.add("hidden");
        }
      };
      reader.readAsBinaryString(file);
    }

    function downloadElementorCode() {
      // Allows downloadable embed code
      const fileContent = document.documentElement.outerHTML;
      const blob = new Blob([fileContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dash_caviver_elementor_embed.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Chart.js Building and Redraw
    function buildCharts() {
      // Destroy existing chart contexts
      Object.values(chartsInstances).forEach(inst => { if (inst) inst.destroy(); });
      chartsInstances = {};

      const datalabelsPlugin = {
        id: 'datalabels_plugin',
        afterDatasetsDraw(chart) {
          const ctx = chart.ctx;
          ctx.save();
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((element, index) => {
              const dataValue = dataset.data[index];
              if (dataValue === undefined || dataValue === null || dataValue === 0) return;

              let label = '';
              if (typeof dataValue === 'number') {
                if (dataset.label && (dataset.label.includes('R$') || dataset.label.includes('Faturamento') || dataset.label.includes('Valor'))) {
                  label = dataValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
                } else {
                  label = dataValue.toLocaleString('pt-BR');
                }
              } else {
                label = String(dataValue);
              }

              ctx.fillStyle = '#4B5563'; // Gray dark
              ctx.font = '600 10.5px Montserrat, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              let x = element.x;
              let y = element.y;

              const isHorizontal = meta.type === 'bar' && chart.options.indexAxis === 'y';
              if (isHorizontal) {
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                x = element.x + 5;
                y = element.y;
              } else if (meta.type === 'doughnut' || meta.type === 'pie') {
                const center = element.tooltipPosition();
                x = center.x;
                y = center.y;
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowBlur = 4;
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
              } else {
                y = element.y - 6;
              }

              ctx.fillText(label, x, y);
              ctx.shadowBlur = 0;
            });
          });
          ctx.restore();
        }
      };

      const ctx1 = document.getElementById("chartEvolucaoMensal")?.getContext("2d");
      const ctx2 = document.getElementById("chartEvolucaoFinanceira")?.getContext("2d");
      const ctx3 = document.getElementById("chartUnidadeDonut")?.getContext("2d");
      
      const ctxSexo = document.getElementById("chartSexo")?.getContext("2d");
      const ctxFaixa = document.getElementById("chartFaixaEtaria")?.getContext("2d");
      const ctxSazonalidade = document.getElementById("chartFinSazonalidade")?.getContext("2d");
      const ctxFormasPag = document.getElementById("chartFormasPagamentoD")?.getContext("2d");
      
      const ctxMuni = document.getElementById("chartMunicipiosReach")?.getContext("2d");
      const ctxTipo = document.getElementById("chartTipoAtendSoc")?.getContext("2d");
      const ctxPerf = document.getElementById("chartPerformanceMedicos")?.getContext("2d");
      
      const ctxEsp = document.getElementById("chartEspecialidadesVolume")?.getContext("2d");
      const ctxItens = document.getElementById("chartItensMaisFrequentes")?.getContext("2d");

      // Shared Aggregate logic
      const aggs = {
        months: {}, earnings: {}, units: {}, sex: {}, age: { "0-12": 0, "13-24": 0, "25-59": 0, "60+": 0 },
        payment: {}, municipalities: {}, tipAtend: {}, doctors: {}, spec: {}, items: {}
      };

      filteredData.forEach(d => {
        if (d.dataAtendimento) {
          const mKey = d.dataAtendimento.getFullYear() + "-" + String(d.dataAtendimento.getMonth() + 1).padStart(2, "0");
          aggs.months[mKey] = (aggs.months[mKey] || 0) + d.atendimentos;
          aggs.earnings[mKey] = (aggs.earnings[mKey] || 0) + d.valorTotal;
        }
        if (d.unidade) aggs.units[d.unidade] = (aggs.units[d.unidade] || 0) + d.atendimentos;
        if (d.sexo) aggs.sex[d.sexo] = (aggs.sex[d.sexo] || 0) + d.atendimentos;
        if (d.idade !== null) {
          if (d.idade <= 12) aggs.age["0-12"] += d.atendimentos;
          else if (d.idade <= 24) aggs.age["13-24"] += d.atendimentos;
          else if (d.idade <= 59) aggs.age["25-59"] += d.atendimentos;
          else aggs.age["60+"] += d.atendimentos;
        }
        if (d.formaPagamento) aggs.payment[d.formaPagamento] = (aggs.payment[d.formaPagamento] || 0) + d.atendimentos;
        if (d.municipio) aggs.municipalities[d.municipio] = (aggs.municipalities[d.municipio] || 0) + d.atendimentos;
        if (d.tipoAtendimento) aggs.tipAtend[d.tipoAtendimento] = (aggs.tipAtend[d.tipoAtendimento] || 0) + d.atendimentos;
        if (d.profissional) aggs.doctors[d.profissional] = (aggs.doctors[d.profissional] || 0) + d.atendimentos;
        if (d.especialidade) aggs.spec[d.especialidade] = (aggs.spec[d.especialidade] || 0) + d.atendimentos;
        if (d.item) aggs.items[d.item] = (aggs.items[d.item] || 0) + d.atendimentos;
      });

      // 1. Chart Evolução Atendimentos
      if (ctx1) {
        const sorted = Object.keys(aggs.months).sort();
        chartsInstances.chartEvolucaoMensal = new Chart(ctx1, {
          type: 'line',
          data: {
            labels: sorted,
            datasets: [{
              label: 'Atendimentos',
              data: sorted.map(k => aggs.months[k]),
              borderColor: '#5A2483',
              backgroundColor: 'rgba(90, 36, 131, 0.05)',
              borderWidth: 3,
              tension: 0.3,
              fill: true
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 2. Chart Financeira
      if (ctx2) {
        const sorted = Object.keys(aggs.earnings).sort();
        chartsInstances.chartEvolucaoFinanceira = new Chart(ctx2, {
          type: 'line',
          data: {
            labels: sorted,
            datasets: [{
              label: 'Faturamento (R$)',
              data: sorted.map(k => aggs.earnings[k]),
              borderColor: '#F28C28',
              backgroundColor: 'rgba(242, 140, 40, 0.08)',
              borderWidth: 3,
              tension: 0.3,
              fill: true
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 3. Unidade Donut
      if (ctx3) {
        chartsInstances.chartUnidadeDonut = new Chart(ctx3, {
          type: 'doughnut',
          data: {
            labels: Object.keys(aggs.units),
            datasets: [{
              data: Object.values(aggs.units),
              backgroundColor: ['#5A2483', '#F28C28', '#7B4BA3', '#F4C542']
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true,  maintainAspectRatio: false }
        });
      }

      // Sexo
      if (ctxSexo) {
        chartsInstances.chartSexo = new Chart(ctxSexo, {
          type: 'doughnut',
          data: {
            labels: Object.keys(aggs.sex).map(s=>s==='M'?'Masculino':'Feminino'),
            datasets: [{
              data: Object.values(aggs.sex),
              backgroundColor: ['#3B82F6', '#EC4899']
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Faixa Etária
      if (ctxFaixa) {
        chartsInstances.chartFaixaEtaria = new Chart(ctxFaixa, {
          type: 'bar',
          data: {
            labels: Object.keys(aggs.age),
            datasets: [{
              label: 'Distribuição etária',
              data: Object.values(aggs.age),
              backgroundColor: '#5A2483',
              borderRadius: 5
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Sazonalidade (Financeiro)
      if (ctxSazonalidade) {
        const sorted = Object.keys(aggs.earnings).sort();
        chartsInstances.chartFinSazonalidade = new Chart(ctxSazonalidade, {
          type: 'bar',
          data: {
            labels: sorted,
            datasets: [{
              label: 'Faturamento',
              data: sorted.map(k=>aggs.earnings[k]),
              backgroundColor: '#7B4BA3',
              borderRadius: 5
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Formas Pagamento
      if (ctxFormasPag) {
        chartsInstances.chartFormasPagamentoD = new Chart(ctxFormasPag, {
          type: 'doughnut',
          data: {
            labels: Object.keys(aggs.payment),
            datasets: [{
              data: Object.values(aggs.payment),
              backgroundColor: ['#5A2483', '#F28C28', '#7B4BA3', '#F4C542']
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Municipais
      if (ctxMuni) {
        const sorted = Object.entries(aggs.municipalities).sort((a,b)=>b[1]-a[1]).slice(0, 10);
        chartsInstances.chartMunicipiosReach = new Chart(ctxMuni, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
              label: 'Por cidade',
              data: sorted.map(s => s[1]),
              backgroundColor: '#F28C28',
              borderRadius: 5
            }]
          },
          plugins: [datalabelsPlugin],
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });
      }

      // Tipo Atendimento
      if (ctxTipo) {
        chartsInstances.chartTipoAtendSoc = new Chart(ctxTipo, {
          type: 'doughnut',
          data: {
            labels: Object.keys(aggs.tipAtend),
            datasets: [{
              data: Object.values(aggs.tipAtend),
              backgroundColor: ['#5A2483', '#7B4BA3', '#F28C28']
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Performance medicos columns
      if (ctxPerf) {
        const sorted = Object.entries(aggs.doctors).sort((a,b)=>b[1]-a[1]).slice(0, 8);
        chartsInstances.chartPerformanceMedicos = new Chart(ctxPerf, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
              label: 'Atendimentos',
              data: sorted.map(s => s[1]),
              backgroundColor: '#5A2483',
              borderRadius: 4
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // Especialidades
      if (ctxEsp) {
        const sorted = Object.entries(aggs.spec).sort((a,b)=>b[1]-a[1]).slice(0, 10);
        chartsInstances.chartEspecialidadesVolume = new Chart(ctxEsp, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s[0]),
            datasets: [{
              label: 'Volume',
              data: sorted.map(s => s[1]),
              backgroundColor: '#7B4BA3',
              borderRadius: 4
            }]
          },
          plugins: [datalabelsPlugin],
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });
      }

      // Itens
      if (ctxItens) {
        const sorted = Object.entries(aggs.items).sort((a,b)=>b[1]-a[1]).slice(0, 8);
        chartsInstances.chartItensMaisFrequentes = new Chart(ctxItens, {
          type: 'bar',
          data: {
            labels: sorted.map(s => s[0].length > 20 ? s[0].substring(0, 18) + "..." : s[0]),
            datasets: [{
              label: 'Vol. Itens',
              data: sorted.map(s => s[1]),
              backgroundColor: '#F28C28',
              borderRadius: 4
            }]
          },
          plugins: [datalabelsPlugin],
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    }
  </script>
</body>
</html>`;
}
