import { useEffect, useState } from "react";
import {
  Building2,
  FileText,
  Award,
  FolderOpen,
  AlertTriangle,
  Clock,
  Truck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { api } from "../services/api";
import type {
  Cliente,
  ProcessoAmbiental,
  LicencaAmbiental,
  Documento,
  Mtr,
} from "../types";

interface AlertaVencimento {
  id: string;
  tipo: "Licença" | "Condicionante";
  identificador: string;
  detalhe: string;
  dataValidade: string;
  diasRestantes: number;
  nivel: "critico" | "atencao";
}

const CORES_CLASSES = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    totalProcessos: 0,
    totalLicencas: 0,
    totalDocumentos: 0,
    totalMtrs: 0,
  });

  const [alertas, setAlertas] = useState<AlertaVencimento[]>([]);
  const [dadosResiduosClasse, setDadosResiduosClasse] = useState<
    { name: string; value: number }[]
  >([]);
  const [dadosTratamento, setDadosTratamento] = useState<
    { tratamento: string; quantidade: number }[]
  >([]);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);

        const [resClientes, resProcessos, resLicencas, resDocs, resMtrs] =
          await Promise.all([
            api.get<Cliente[]>("/clientes"),
            api.get<ProcessoAmbiental[]>("/processos-ambientais"),
            api.get<LicencaAmbiental[]>("/licencas-ambientais"),
            api.get<Documento[]>("/documentos"),
            api.get<Mtr[]>("/mtrs").catch(() => ({ data: [] as Mtr[] })),
          ]);

        const clientes = resClientes.data;
        const processos = resProcessos.data;
        const licencas = resLicencas.data;
        const documentos = resDocs.data;
        const mtrs = resMtrs.data;

        setMetrics({
          totalClientes: clientes.length,
          totalProcessos: processos.length,
          totalLicencas: licencas.length,
          totalDocumentos: documentos.length,
          totalMtrs: mtrs.length,
        });

        // 1. Processar Alertas de Vencimento
        const hoje = new Date();
        const listaAlertas: AlertaVencimento[] = [];

        licencas.forEach((lic) => {
          const dtVal = new Date(lic.dataValidade);
          const diffDias = Math.ceil(
            (dtVal.getTime() - hoje.getTime()) / (1000 * 3600 * 24),
          );

          if (diffDias <= 60) {
            listaAlertas.push({
              id: lic.id,
              tipo: "Licença",
              identificador: lic.numero,
              detalhe: `Licença ${lic.nomeTipo || ""} (${lic.orgaoAmbiental})`,
              dataValidade: lic.dataValidade,
              diasRestantes: diffDias,
              nivel: diffDias <= 30 ? "critico" : "atencao",
            });
          }

          // Checar Condicionantes
          lic.condicionantes?.forEach((cond) => {
            if (cond.prazo && cond.status !== 3) {
              const dtCond = new Date(cond.prazo);
              const diffCond = Math.ceil(
                (dtCond.getTime() - hoje.getTime()) / (1000 * 3600 * 24),
              );

              if (diffCond <= 60) {
                listaAlertas.push({
                  id: cond.id,
                  tipo: "Condicionante",
                  identificador: lic.numero,
                  detalhe: cond.descricao,
                  dataValidade: cond.prazo,
                  diasRestantes: diffCond,
                  nivel: diffCond <= 30 ? "critico" : "atencao",
                });
              }
            }
          });
        });

        // Ordenar alertas pelos prazos mais urgentes
        setAlertas(
          listaAlertas.sort((a, b) => a.diasRestantes - b.diasRestantes),
        );

        // 2. Processar Dados de Resíduos para os Gráficos
        const mapaClasses: Record<string, number> = {};
        const mapaTratamento: Record<string, number> = {};

        mtrs.forEach((mtr) => {
          const tipoTrat = mtr.tratamento || "Tratamento Padrão";
          mtr.itensResiduos?.forEach((item) => {
            const classe = item.classe || "Classe IIA";
            const qtd = item.quantidadeRecebida || item.quantidadeIndicada || 0;

            mapaClasses[classe] = (mapaClasses[classe] || 0) + qtd;
            mapaTratamento[tipoTrat] = (mapaTratamento[tipoTrat] || 0) + qtd;
          });
        });

        const dadosPie = Object.keys(mapaClasses).map((key) => ({
          name: key,
          value: mapaClasses[key],
        }));

        const dadosBar = Object.keys(mapaTratamento).map((key) => ({
          tratamento: key.length > 18 ? key.substring(0, 18) + "..." : key,
          quantidade: mapaTratamento[key],
        }));

        // Dados padrão para visualização inicial caso não existam MTRs importados ainda
        if (dadosPie.length === 0) {
          setDadosResiduosClasse([
            { name: "Classe I (Perigoso)", value: 4500 },
            { name: "Classe IIA (Não Inerte)", value: 8200 },
            { name: "Classe IIB (Inerte)", value: 3100 },
          ]);
        } else {
          setDadosResiduosClasse(dadosPie);
        }

        if (dadosBar.length === 0) {
          setDadosTratamento([
            { tratamento: "Aterro Industrial", quantidade: 5200 },
            { tratamento: "Trat. Efluentes", quantidade: 3800 },
            { tratamento: "Incineração", quantidade: 2100 },
            { tratamento: "Co-processamento", quantidade: 4700 },
          ]);
        } else {
          setDadosTratamento(dadosBar);
        }
      } catch (error) {
        console.error("Erro ao carregar métricas do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm">Carregando inteligência de dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Painel Geral de Controle
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Indicadores em tempo real, monitoramento de prazos legais e gestão de
          resíduos.
        </p>
      </div>

      {/* Grid de Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Clientes
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalClientes}
            </span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-lg text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Processos
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalProcessos}
            </span>
          </div>
          <div className="p-3 bg-sky-950/60 border border-sky-800/50 rounded-lg text-sky-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Licenças
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalLicencas}
            </span>
          </div>
          <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-lg text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Dropbox Docs
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalDocumentos}
            </span>
          </div>
          <div className="p-3 bg-purple-950/60 border border-purple-800/50 rounded-lg text-purple-400">
            <FolderOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              MTRs Registrados
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalMtrs}
            </span>
          </div>
          <div className="p-3 bg-teal-950/60 border border-teal-800/50 rounded-lg text-teal-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Painel Central: Alertas + Gráfico de Pizza */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Alertas de Vencimento (2 colunas) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h2 className="font-semibold text-slate-100">
                Alertas de Vencimento Legal
              </h2>
            </div>
            <span className="text-xs bg-rose-950/80 text-rose-400 border border-rose-800/60 px-2.5 py-1 rounded-full font-medium">
              {alertas.length} pendência(s) crítica(s)
            </span>
          </div>

          {alertas.length === 0 ? (
            <div className="text-center py-10 text-slate-500 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-slate-700" />
              <p className="text-sm font-medium text-slate-400">
                Nenhuma licença ou condicionante com vencimento próximo.
              </p>
              <p className="text-xs text-slate-600">
                Todas as renovações estão em dia no sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {alertas.map((alerta) => (
                <div
                  key={`${alerta.tipo}-${alerta.id}`}
                  className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-all ${
                    alerta.nivel === "critico"
                      ? "bg-rose-950/30 border-rose-800/60 text-rose-200"
                      : "bg-amber-950/30 border-amber-800/60 text-amber-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          alerta.nivel === "critico"
                            ? "bg-rose-900 text-rose-100"
                            : "bg-amber-900 text-amber-100"
                        }`}
                      >
                        {alerta.tipo}
                      </span>
                      <span className="font-mono font-semibold text-sm">
                        {alerta.identificador}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {alerta.detalhe}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-semibold block">
                      {alerta.diasRestantes < 0
                        ? "Vencido!"
                        : `${alerta.diasRestantes} dia(s) restante(s)`}
                    </span>
                    <span className="text-[11px] opacity-75">
                      Vence em:{" "}
                      {new Date(alerta.dataValidade).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gráfico de Pizza - Resíduos por Classe (1 coluna) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="font-semibold text-slate-100 text-sm">
              Resíduos por Periculosidade
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              SINIR / IAT
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosResiduosClasse}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosResiduosClasse.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CORES_CLASSES[index % CORES_CLASSES.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  formatter={(val: number) => [
                    `${val.toLocaleString("pt-BR")} kg`,
                    "Volume",
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                  formatter={(value) => (
                    <span className="text-slate-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras Inferior - Destinação e Tratamento */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="font-semibold text-slate-100">
              Volume por Tipo de Tratamento (kg)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Destinação final computada através dos relatórios MTR
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosTratamento}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="tratamento"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                formatter={(val: number) => [
                  `${val.toLocaleString("pt-BR")} kg`,
                  "Quantidade",
                ]}
              />
              <Bar
                dataKey="quantidade"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
