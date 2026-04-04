import { useEffect, useState } from "react";

import {
  getClientes,
  getProdutos,
  getServicos,
  getAgendamentos,
  getFinanceiro,
} from "../../storage";

import { Filters } from "../../components/dashboard/Filters";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import { MainChart } from "../../components/dashboard/MainChart";
import { DonutChart } from "../../components/dashboard/DonutChart";
import { TopList } from "../../components/dashboard/TopList";

export default function Dashboard() {
  const [filtro, setFiltro] = useState(30);
  const [tipo, setTipo] = useState<
    "agendamentos" | "financeiro" | "servicos"
  >("agendamentos");
  const [stats, setStats] = useState({
    clientes: 0,
    servicos: 0,
    produtos: 0,
    agendamentos: 0,
  });
  const [topClientes, setTopClientes] = useState<any[]>([]);
  const [topServicos, setTopServicos] = useState<any[]>([]);
  const [line, setLine] = useState<any>({
    series: [],
    options: {},
  });
  const [pie, setPie] = useState<any>({
    series: [],
    options: {},
  });
  const formatarDataLocal = (dataStr: string | Date) => {
    const d = new Date(dataStr);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };
  const filtrarPeriodo = (dataStr: string, dias: number) => {
    const data = new Date(dataStr);
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() - dias);
    return data >= limite && data <= hoje;
  };
  const getModoAgrupamento = () => {
    if (filtro <= 30) return "dia";
    if (filtro <= 120) return "semana";
    return "mes";
  };
  const carregarDados = async () => {
    const [clientes, produtos, servicos, agendamentos, financeiro] =
      await Promise.all([
        getClientes(),
        getProdutos(),
        getServicos(),
        getAgendamentos(),
        getFinanceiro(),
      ]);
    const filtrados = agendamentos.filter((a: any) => {
      if (!a.data) return false;
      return filtrarPeriodo(a.data, filtro);
    });
    setStats({
      clientes: clientes.length,
      servicos: servicos.length,
      produtos: produtos.length,
      agendamentos: filtrados.length,
    });
    const modo = getModoAgrupamento();
    let labels: string[] = [];
    let valores: number[] = [];

    if (tipo !== "servicos") {
      const grupos: Record<string, number> = {};
      const processar = (dataStr: string, valor: number) => {
        const d = new Date(dataStr);
        if (isNaN(d.getTime())) return;

        let chave = "";
        if (modo === "dia") chave = formatarDataLocal(d);
        if (modo === "semana") {
          const inicioSemana = new Date(d);
          const dia = d.getDay();
          const diff = d.getDate() - (dia === 0 ? 6 : dia - 1);
          inicioSemana.setDate(diff);
          chave = formatarDataLocal(inicioSemana);
        }
        if (modo === "mes") {
          const ano = d.getFullYear();
          const mes = String(d.getMonth() + 1).padStart(2, "0");
          chave = `${ano}-${mes}`;
        }

        grupos[chave] = (grupos[chave] || 0) + valor;
      };
      if (tipo === "agendamentos") {
        filtrados.forEach((a: any) => processar(a.data, 1));
      }
      if (tipo === "financeiro") {
        const entradas: Record<string, number> = {};
        const saidas: Record<string, number> = {};
        financeiro.forEach((f: any) => {
          if (!filtrarPeriodo(f.data, filtro)) return;
          const d = new Date(f.data);
          let chave = "";
          if (modo === "dia") chave = formatarDataLocal(f.data);
          if (modo === "semana") {
            const inicioSemana = new Date(d);
            const dia = d.getDay();
            const diff = d.getDate() - (dia === 0 ? 6 : dia - 1);
            inicioSemana.setDate(diff);
            chave = formatarDataLocal(inicioSemana);
          }
          if (modo === "mes") {
            const ano = d.getFullYear();
            const mes = String(d.getMonth() + 1).padStart(2, "0");
            chave = `${ano}-${mes}`;
          }
          if (f.tipo === "entrada") {
            entradas[chave] = (entradas[chave] || 0) + Number(f.valor);
          } else {
            saidas[chave] = (saidas[chave] || 0) + Number(f.valor);
          }
        });
        const todasChaves = Array.from(
          new Set([...Object.keys(entradas), ...Object.keys(saidas)])
        ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        labels = todasChaves;
        const valoresEntrada = labels.map((k) => entradas[k] || 0);
        const valoresSaida = labels.map((k) => saidas[k] || 0);
        const valoresLucro = labels.map(
          (k) => (entradas[k] || 0) - (saidas[k] || 0)
        );
        setLine({
          series: [
            { name: "Entradas", data: valoresEntrada },
            { name: "Saídas", data: valoresSaida },
            { name: "Lucro", data: valoresLucro },
          ],
          options: {
            chart: {
              type: "area",
              toolbar: { show: false },
            },
            dataLabels: { enabled: false },
            stroke: {
              curve: "smooth",
              width: [2, 2, 4],
            },
            xaxis: {
              categories: labels,
              labels: {
                formatter: (val: string) => {
                  const d = new Date(val + "T00:00:00");

                  const dia = String(d.getDate()).padStart(2, "0");
                  const mes = String(d.getMonth() + 1).padStart(2, "0");
                  const ano = d.getFullYear();

                  return `${dia}-${mes}-${ano}`;
                },
              },
            },
            colors: [
              "#3b82f6",
              "#ef4444",
              "#22c55e",
            ],
            fill: {
              type: "solid",
              opacity: 0,
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: (val: number) => `R$ ${val}`,
              },
            },
          },
        });
        return;
      }
      const ordenado = Object.entries(grupos)
        .filter(([chave]) => !!chave)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

      labels = ordenado.map(([data]) => data);
      valores = ordenado.map(([, valor]) => valor);
    }

    if (tipo === "servicos") {
      const map: any = {};

      filtrados.forEach((a: any) => {
        const nome = a.servico?.nome || "N/A";
        map[nome] = (map[nome] || 0) + 1;
      });

      labels = Object.keys(map);
      valores = Object.values(map);
    }

    if (tipo === "agendamentos" || tipo === "servicos") {
      setLine({
        series: [
          {
            name:
              tipo === "servicos"
                ? "Serviços"
                : "Agendamentos",
            data: valores,
          },
        ],
        options: {
          chart: {
            type: tipo === "servicos" ? "bar" : "area",
            toolbar: { show: false },
          },
          dataLabels: { enabled: false },
          stroke: {
            curve: "smooth",
            width: tipo === "servicos" ? 0 : 3,
          },
          plotOptions:
            tipo === "servicos"
              ? {
                bar: {
                  borderRadius: 8,
                  columnWidth: "45%",

                  colors: {
                    backgroundBarOpacity: 0,
                  },
                },
              }
              : {},
          xaxis: {
            categories: labels,
            labels: {
              formatter: (val: string) => {
                if (tipo === "servicos") {
                  return val;
                }
                const d = new Date(val + "T00:00:00");
                if (isNaN(d.getTime())) return val; 
                const dia = String(d.getDate()).padStart(2, "0");
                const mes = String(d.getMonth() + 1).padStart(2, "0");
                const ano = d.getFullYear();
                return `${dia}-${mes}-${ano}`;
              },
            },
          },
          colors: ["#4f46e5"],
          fill:
            tipo === "servicos"
              ? {
                type: "gradient",
                gradient: {
                  shade: "dark",
                  opacityFrom: 0.7,
                  opacityTo: 0.2,
                },
              }
              : {
                type: "gradient",
                gradient: {
                  opacityFrom: 0.35,
                  opacityTo: 0.05,
                },
              },
        },
      });
    }

    const mapClientes: any = {};
    filtrados.forEach((a: any) => {
      const nome = a.cliente?.nome || "N/A";
      mapClientes[nome] = (mapClientes[nome] || 0) + 1;
    });
    setTopClientes(
      Object.entries(mapClientes)
        .map(([nome, total]) => ({ nome, total }))
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 5)
    );

    const mapServicos: any = {};
    filtrados.forEach((a: any) => {
      const nome = a.servico?.nome || "N/A";
      mapServicos[nome] = (mapServicos[nome] || 0) + 1;
    });
    const top5 = Object.entries(mapServicos)
      .map(([nome, total]) => ({ nome, total }))
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 5);
    setTopServicos(top5);
    setPie({
      series: top5.map((t) => t.total),
      options: {
        labels: top5.map((t) => t.nome),
        chart: {
          type: "donut",
          toolbar: { show: false },
        },
        colors: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#3b82f6",
          "#a855f7",
        ],
        legend: {
          show: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "75%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "13px",
                  color: "#9ca3af",
                  offsetY: 20,
                },
                value: {
                  show: true,
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "#111827",
                  offsetY: -10,
                },
                total: {
                  show: true,
                  label: "Total",
                  fontSize: "12px",
                  color: "#9ca3af",
                  formatter: () => {
                    const total = top5.reduce(
                      (acc: number, i: any) => acc + i.total,
                      0
                    );
                    return `${total} (100%)`;
                  },
                },
              },
            },
          },
        },
        tooltip: {
          y: {
            formatter: (val: number, opts: any) => {
              const globals = opts?.w?.globals;
              if (!globals) return `${val}`;

              const label = globals.labels?.[opts.seriesIndex] || "N/A";
              const total = globals.seriesTotals?.reduce((a: number, b: number) => a + b, 0) || 1;
              const percent = ((val / total) * 100).toFixed(1);
              return `${label}: ${val} (${percent}%)`;
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    carregarDados();
  }, [filtro, tipo]);

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen rounded-[20px]">
      <Filters
        filtro={filtro}
        setFiltro={setFiltro}
        tipo={tipo}
        setTipo={setTipo}
      />
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MainChart tipo={tipo} line={line} />
        <DonutChart
          pie={pie}
          data={topServicos}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TopList title="Clientes mais ativos" data={topClientes} />
        <TopList title="Top Serviços" data={topServicos} />
      </div>
    </div>
  );
}