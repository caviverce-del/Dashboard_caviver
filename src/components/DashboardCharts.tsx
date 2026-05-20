import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { RowData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Constants for CAVIVER brand colors
const colors = {
  purple: '#5A2483',
  purpleLight: '#7B4BA3',
  orange: '#F28C28',
  yellow: '#F4C542',
  white: '#FFFFFF',
  gray: '#F3F4F6',
  grayDark: '#4B5563',
  chartPalette: [
    '#5A2483', // Roxo Institucional
    '#F28C28', // Laranja Caviver
    '#7B4BA3', // Roxo Secundário
    '#F4C542', // Amarelo Institucional
    '#A855F7', // Magenta/Purple light
    '#3B82F6', // Blue accent
    '#10B981', // Green accent
    '#EC4899', // Pink
  ]
};

interface ChartProps {
  data: RowData[];
}

const datalabelsPlugin = {
  id: 'datalabels',
  afterDatasetsDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.save();
    chart.data.datasets.forEach((dataset: any, i: number) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((element: any, index: number) => {
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

        ctx.fillStyle = '#4B5563'; // Gray dark contrast
        ctx.font = '600 10px Montserrat, sans-serif';
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
          ctx.shadowBlur = 3;
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

// 1. Evolução Mensal de Atendimentos
export const LineEvolucaoMensal: React.FC<ChartProps> = ({ data }) => {
  const monthsMap: Record<string, number> = {};
  
  data.forEach((d) => {
    if (d.dataAtendimento) {
      const label = `${d.dataAtendimento.getFullYear()}-${String(d.dataAtendimento.getMonth() + 1).padStart(2, '0')}`;
      monthsMap[label] = (monthsMap[label] || 0) + d.atendimentos;
    }
  });

  const sortedKeys = Object.keys(monthsMap).sort();
  const labels = sortedKeys.map(k => {
    const [year, month] = k.split('-');
    const monthsName = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${monthsName[parseInt(month) - 1]}/${year.substring(2)}`;
  });
  const values = sortedKeys.map(k => monthsMap[k]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Atendimentos Realizados',
        data: values.length ? values : [0],
        borderColor: colors.purple,
        backgroundColor: 'rgba(90, 36, 131, 0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: colors.orange,
        pointBorderColor: colors.white,
        pointBorderWidth: 2,
        pointRadius: 6,
        borderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { family: 'Montserrat', weight: 500 } }
      },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 13 },
        bodyFont: { family: 'Montserrat', size: 12 },
        padding: 12,
        backgroundColor: 'rgba(25, 10, 40, 0.95)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      x: {
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Line data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 2. Evolução Financeira Mensal (Area/Line)
export const AreaEvolucaoFinanceira: React.FC<ChartProps> = ({ data }) => {
  const monthsMap: Record<string, number> = {};
  
  data.forEach((d) => {
    if (d.dataAtendimento) {
      const label = `${d.dataAtendimento.getFullYear()}-${String(d.dataAtendimento.getMonth() + 1).padStart(2, '0')}`;
      monthsMap[label] = (monthsMap[label] || 0) + d.valorTotal;
    }
  });

  const sortedKeys = Object.keys(monthsMap).sort();
  const labels = sortedKeys.map(k => {
    const [year, month] = k.split('-');
    const monthsName = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${monthsName[parseInt(month) - 1]}/${year.substring(2)}`;
  });
  const values = sortedKeys.map(k => monthsMap[k]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Faturamento Estimado (R$)',
        data: values.length ? values : [0],
        borderColor: colors.orange,
        backgroundColor: 'rgba(242, 140, 40, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: colors.purple,
        pointBorderColor: colors.white,
        pointBorderWidth: 2,
        pointRadius: 5,
        borderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { family: 'Montserrat', weight: 500 } }
      },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 13 },
        bodyFont: { family: 'Montserrat', size: 12 },
        padding: 12,
        backgroundColor: 'rgba(25, 10, 40, 0.95)',
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          font: { family: 'Montserrat', size: 10 },
          callback: (value: any) => 'R$ ' + value.toLocaleString('pt-BR')
        },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      x: {
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Line data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 3. Formas de Pagamento
export const DoughnutFormasPagamento: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.formaPagamento;
    map[val] = (map[val] || 0) + d.atendimentos;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        data: values.length ? values : [0],
        backgroundColor: colors.chartPalette.slice(0, labels.length || 1),
        borderColor: colors.white,
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { family: 'Montserrat', size: 11, weight: 500 } }
      },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    }
  };

  return <div className="h-48 sm:h-64 w-full"><Doughnut data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 4. Produção por Especialidade (horizontal bar)
export const BarEspecialidades: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.especialidade;
    map[val] = (map[val] || 0) + d.atendimentos;
  });

  const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const labels = sortedEntries.map(e => e[0]);
  const values = sortedEntries.map(e => e[1]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Atendimentos',
        data: values.length ? values : [0],
        backgroundColor: 'rgba(90, 36, 131, 0.85)',
        hoverBackgroundColor: colors.purple,
        borderColor: colors.purple,
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      y: {
        ticks: { font: { family: 'Montserrat', size: 11, weight: 600 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Bar data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 5. Ranking de Profissionais (vertical columns)
export const BarProfissionais: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.profissional;
    map[val] = (map[val] || 0) + d.atendimentos;
  });

  const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = sortedEntries.map(e => e[0].replace("Dr. ", "").replace("Dra. ", ""));
  const values = sortedEntries.map(e => e[1]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Produção Assistencial',
        data: values.length ? values : [0],
        backgroundColor: 'rgba(242, 140, 40, 0.85)',
        hoverBackgroundColor: colors.orange,
        borderColor: colors.orange,
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      x: {
        ticks: { 
          font: { family: 'Montserrat', size: 10, weight: 600 },
          maxRotation: 30,
          minRotation: 15
        },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Bar data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 6. Procedimentos / Itens Mais Realizados
export const BarProcedimentosItens: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.item;
    map[val] = (map[val] || 0) + d.atendimentos;
  });

  const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const labels = sortedEntries.map(e => {
    const original = e[0];
    return original.length > 30 ? original.substring(0, 28) + '...' : original;
  });
  const values = sortedEntries.map(e => e[1]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Quantidade',
        data: values.length ? values : [0],
        backgroundColor: colors.purpleLight,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      y: {
        ticks: { font: { family: 'Montserrat', size: 10, weight: 600 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Bar data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 7. Atendimentos por Sexo
export const DoughnutSexo: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    let sex = "Não Informado";
    if (d.sexo.startsWith("M")) sex = "Masculino";
    else if (d.sexo.startsWith("F")) sex = "Feminino";
    map[sex] = (map[sex] || 0) + d.atendimentos;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  const chartColors = labels.map(l => l === "Feminino" ? '#EC4899' : l === "Masculino" ? '#3B82F6' : '#9CA3AF');

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        data: values.length ? values : [0],
        backgroundColor: chartColors,
        borderColor: colors.white,
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { family: 'Montserrat', size: 11, weight: 500 } }
      }
    }
  };

  return <div className="h-44 sm:h-56 w-full"><Doughnut data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 8. Faixa Etária (columns)
export const BarFaixaEtaria: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {
    "Infantil (0-12)": 0,
    "Jovem (13-24)": 0,
    "Adulto (25-59)": 0,
    "Idoso (60+)": 0,
    "Não informado": 0
  };

  data.forEach((d) => {
    if (d.idade === null) {
      map["Não informado"] += d.atendimentos;
    } else if (d.idade <= 12) {
      map["Infantil (0-12)"] += d.atendimentos;
    } else if (d.idade <= 24) {
      map["Jovem (13-24)"] += d.atendimentos;
    } else if (d.idade <= 59) {
      map["Adulto (25-59)"] += d.atendimentos;
    } else {
      map["Idoso (60+)"] += d.atendimentos;
    }
  });

  const labels = Object.keys(map).filter(k => map[k] > 0);
  const values = labels.map(l => map[l]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Atendimentos',
        data: values.length ? values : [0],
        backgroundColor: [
          '#60A5FA', // Infantil light blue
          '#34D399', // Jovem teal-emerald
          '#F59E0B', // Adulto amber
          '#8B5CF6', // Idoso violet
          '#9CA3AF'  // Cinza
        ].slice(0, labels.length),
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      x: {
        ticks: { font: { family: 'Montserrat', size: 11, weight: 500 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Bar data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 9. Municípios Atendidos (horizontal or vertical bars)
export const BarMunicipios: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.municipio.trim().toUpperCase();
    if (val !== "NÃO INFORMADO") {
      map[val] = (map[val] || 0) + d.atendimentos;
    }
  });

  const sortedEntries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const labels = sortedEntries.map(e => e[0].split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "));
  const values = sortedEntries.map(e => e[1]);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Atendimentos',
        data: values.length ? values : [0],
        backgroundColor: colors.chartPalette.slice(3, 3 + labels.length),
        borderRadius: 4,
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      y: {
        ticks: { font: { family: 'Montserrat', size: 11, weight: 600 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Bar data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 10. Produção por Unidade (vertical Columns)
export const BarUnidadeProducao: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.unidade;
    map[val] = (map[val] || 0) + d.atendimentos;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        label: 'Produção por Unidade',
        data: values.length ? values : [0],
        backgroundColor: 'rgba(90, 36, 131, 0.75)',
        hoverBackgroundColor: colors.purple,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleFont: { family: 'Montserrat', size: 12 },
        bodyFont: { family: 'Montserrat', size: 12 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Montserrat', size: 11 } },
        grid: { color: 'rgba(0,0,0,0.03)' }
      },
      x: {
        ticks: { font: { family: 'Montserrat', size: 11, weight: 500 } },
        grid: { display: false }
      }
    }
  };

  return <div className="h-64 sm:h-80 w-full"><Bar data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};

// 11/12. Atendimentos Coluna J (Unidade) (Doughnut)
export const DoughnutUnidadeAtendimentos: React.FC<ChartProps> = ({ data }) => {
  const map: Record<string, number> = {};
  data.forEach((d) => {
    const val = d.unidade;
    map[val] = (map[val] || 0) + d.atendimentos;
  });

  const labels = Object.keys(map);
  const values = Object.values(map);

  const chartData = {
    labels: labels.length ? labels : ["Sem dados"],
    datasets: [
      {
        data: values.length ? values : [0],
        backgroundColor: colors.chartPalette.slice(2, 2 + labels.length),
        borderColor: colors.white,
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { font: { family: 'Montserrat', size: 11, weight: 500 } }
      }
    }
  };

  return <div className="h-48 sm:h-64 w-full"><Doughnut data={chartData} options={options} plugins={[datalabelsPlugin]} /></div>;
};
