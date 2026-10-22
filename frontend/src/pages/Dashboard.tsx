import { useEffect, useState } from "react";
import { Building2, FileText, Award, FolderOpen } from "lucide-react";
import { api } from "../services/api";
import type {
  Cliente,
  ProcessoAmbiental,
  LicencaAmbiental,
  Documento,
} from "../types";

export function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    totalProcessos: 0,
    totalLicencas: 0,
    totalDocumentos: 0,
  });

  useEffect(() => {
    async function carregarMetricas() {
      try {
        const [c, p, l, d] = await Promise.all([
          api.get<Cliente[]>("/clientes"),
          api.get<ProcessoAmbiental[]>("/processos-ambientais"),
          api.get<LicencaAmbiental[]>("/licencas-ambientais"),
          api.get<Documento[]>("/documentos"),
        ]);

        setMetrics({
          totalClientes: c.data.length,
          totalProcessos: p.data.length,
          totalLicencas: l.data.length,
          totalDocumentos: d.data.length,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }
    carregarMetricas();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Visão Geral do Sistema
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Acompanhamento dos clientes, licenças e operações da consultoria.
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Clientes Ativos
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalClientes}
            </span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-lg text-emerald-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Processos em Trâmite
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalProcessos}
            </span>
          </div>
          <div className="p-3 bg-sky-950/60 border border-sky-800/50 rounded-lg text-sky-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Licenças Emitidas
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalLicencas}
            </span>
          </div>
          <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-lg text-amber-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              Documentos no Dropbox
            </span>
            <span className="text-2xl font-bold text-slate-100 mt-1 block">
              {metrics.totalDocumentos}
            </span>
          </div>
          <div className="p-3 bg-purple-950/60 border border-purple-800/50 rounded-lg text-purple-400">
            <FolderOpen className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
