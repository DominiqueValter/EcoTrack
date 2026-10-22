import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Building2,
  Calendar,
  Landmark,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileSearch,
} from "lucide-react";
import { api } from "../services/api";
import type { ProcessoAmbiental, Cliente } from "../types";

export function Processos() {
  const [processos, setProcessos] = useState<ProcessoAmbiental[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    numeroProcesso: "",
    orgaoAmbiental: "IAT",
    descricao: "",
    dataAbertura: new Date().toISOString().split("T")[0],
    clienteId: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const [resProcessos, resClientes] = await Promise.all([
        api.get<ProcessoAmbiental[]>("/processos-ambientais"),
        api.get<Cliente[]>("/clientes"),
      ]);
      setProcessos(resProcessos.data);
      setClientes(resClientes.data);

      if (resClientes.data.length > 0) {
        setFormData((prev) => ({ ...prev, clienteId: resClientes.data[0].id }));
      }
    } catch (error) {
      console.error("Erro ao carregar dados dos processos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.clienteId) {
      alert("Selecione um cliente válido.");
      return;
    }

    try {
      setSalvando(true);
      await api.post("/processos-ambientais", {
        ...formData,
        dataAbertura: new Date(formData.dataAbertura).toISOString(),
      });

      setFormData({
        numeroProcesso: "",
        orgaoAmbiental: "IAT",
        descricao: "",
        dataAbertura: new Date().toISOString().split("T")[0],
        clienteId: clientes[0]?.id || "",
      });
      setIsModalOpen(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao cadastrar processo:", error);
      alert("Erro ao cadastrar processo ambiental.");
    } finally {
      setSalvando(false);
    }
  }

  const processosFiltrados = processos.filter(
    (p) =>
      p.numeroProcesso.toLowerCase().includes(busca.toLowerCase()) ||
      p.nomeCliente.toLowerCase().includes(busca.toLowerCase()) ||
      p.orgaoAmbiental.toLowerCase().includes(busca.toLowerCase()),
  );

  function getBadgeStatus(status: number, nomeStatus: string) {
    switch (status) {
      case 1: // EmAnálise
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-400 border border-amber-800/50">
            <Clock className="w-3 h-3" />
            {nomeStatus || "Em Análise"}
          </span>
        );
      case 2: // AguardandoDocumentos
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-950/60 text-sky-400 border border-sky-800/50">
            <AlertCircle className="w-3 h-3" />
            {nomeStatus || "Aguardando Docs"}
          </span>
        );
      case 3: // Deferido
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" />
            {nomeStatus || "Deferido"}
          </span>
        );
      case 4: // Indeferido
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/60 text-rose-400 border border-rose-800/50">
            <XCircle className="w-3 h-3" />
            {nomeStatus || "Indeferido"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
            {nomeStatus || "Em Andamento"}
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-emerald-500" />
            Processos Ambientais
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Acompanhamento do trâmite administrativo de licenciamento e
            autorizações.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
        >
          <Plus className="w-5 h-5" />
          Novo Processo
        </button>
      </div>

      {/* Filtro e Busca */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por Nº do Processo, Cliente ou Órgão Ambiental..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Listagem */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>Carregando processos...</span>
          </div>
        ) : processosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileSearch className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="font-medium text-slate-300">
              Nenhum processo encontrado.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre um novo processo ou ajuste os filtros.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold">Nº do Processo</th>
                  <th className="py-3.5 px-4 font-semibold">Cliente</th>
                  <th className="py-3.5 px-4 font-semibold">Órgão Ambiental</th>
                  <th className="py-3.5 px-4 font-semibold">Data Abertura</th>
                  <th className="py-3.5 px-4 font-semibold text-center">
                    Trâmite
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {processosFiltrados.map((processo) => (
                  <tr
                    key={processo.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-medium text-emerald-400">
                      {processo.numeroProcesso}
                    </td>
                    <td className="py-4 px-4 text-slate-200 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        {processo.nomeCliente}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs bg-slate-800 px-2.5 py-1 rounded text-slate-300 font-medium">
                        <Landmark className="w-3.5 h-3.5 text-slate-400" />
                        {processo.orgaoAmbiental}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(processo.dataAbertura).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getBadgeStatus(processo.status, processo.nomeStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/30">
              <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Cadastrar Processo Ambiental
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Cliente Vinculado *
                </label>
                <select
                  required
                  value={formData.clienteId}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteId: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} ({cliente.cnpjCpf})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nº do Processo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 18.234.890-1"
                    value={formData.numeroProcesso}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroProcesso: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Órgão Ambiental *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: IAT, IBAMA, CETESB"
                    value={formData.orgaoAmbiental}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orgaoAmbiental: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Data de Abertura *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dataAbertura}
                  onChange={(e) =>
                    setFormData({ ...formData, dataAbertura: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Descrição / Objetivo do Processo
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Solicitação de Licença de Operação para ETE industrial"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar Processo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
