import { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  Landmark,
} from "lucide-react";
import { api } from "../services/api";
import type { LicencaAmbiental, ProcessoAmbiental } from "../types";

export function Licencas() {
  const [licencas, setLicencas] = useState<LicencaAmbiental[]>([]);
  const [processos, setProcessos] = useState<ProcessoAmbiental[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [expandedLicencaId, setExpandedLicencaId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    numero: "",
    tipo: 3, // Default: LO (Licença de Operação)
    orgaoAmbiental: "IAT",
    dataEmissao: new Date().toISOString().split("T")[0],
    dataValidade: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    observacoes: "",
    processoAmbientalId: "",
    condicionantes: [{ descricao: "", prazo: "", observacao: "" }],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const [resLicencas, resProcessos] = await Promise.all([
        api.get<LicencaAmbiental[]>("/licencas-ambientais"),
        api.get<ProcessoAmbiental[]>("/processos-ambientais"),
      ]);
      setLicencas(resLicencas.data);
      setProcessos(resProcessos.data);

      if (resProcessos.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          processoAmbientalId: resProcessos.data[0].id,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar licenças:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleCondicionanteStatus(
    condicionanteId: string,
    currentStatus: number,
  ) {
    const novoStatus = currentStatus === 3 ? 1 : 3; // Alterna entre Concluída (3) e Pendente (1)
    try {
      await api.patch(
        `/licencas-ambientais/condicionantes/${condicionanteId}/status`,
        {
          status: novoStatus,
        },
      );
      await carregarDados();
    } catch (error) {
      console.error("Erro ao atualizar status da condicionante:", error);
      alert("Não foi possível atualizar a condicionante.");
    }
  }

  function handleAddCondicionanteField() {
    setFormData({
      ...formData,
      condicionantes: [
        ...formData.condicionantes,
        { descricao: "", prazo: "", observacao: "" },
      ],
    });
  }

  function handleRemoveCondicionanteField(index: number) {
    const novas = formData.condicionantes.filter((_, i) => i !== index);
    setFormData({ ...formData, condicionantes: novas });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.processoAmbientalId) {
      alert("Selecione um processo ambiental válido.");
      return;
    }

    try {
      setSalvando(true);
      const payload = {
        ...formData,
        tipo: Number(formData.tipo),
        dataEmissao: new Date(formData.dataEmissao).toISOString(),
        dataValidade: new Date(formData.dataValidade).toISOString(),
        condicionantes: formData.condicionantes
          .filter((c) => c.descricao.trim() !== "")
          .map((c) => ({
            descricao: c.descricao,
            prazo: c.prazo ? new Date(c.prazo).toISOString() : null,
            observacao: c.observacao,
          })),
      };

      await api.post("/licencas-ambientais", payload);

      setFormData({
        numero: "",
        tipo: 3,
        orgaoAmbiental: "IAT",
        dataEmissao: new Date().toISOString().split("T")[0],
        dataValidade: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        observacoes: "",
        processoAmbientalId: processos[0]?.id || "",
        condicionantes: [{ descricao: "", prazo: "", observacao: "" }],
      });
      setIsModalOpen(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao cadastrar licença:", error);
      alert("Erro ao cadastrar licença ambiental.");
    } finally {
      setSalvando(false);
    }
  }

  const licencasFiltradas = licencas.filter(
    (l) =>
      l.numero.toLowerCase().includes(busca.toLowerCase()) ||
      l.numeroProcesso.toLowerCase().includes(busca.toLowerCase()) ||
      l.orgaoAmbiental.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-7 h-7 text-emerald-500" />
            Licenças Ambientais & Condicionantes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestão do ciclo de vida das licenças emitidas e cumprimento de
            condicionantes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
        >
          <Plus className="w-5 h-5" />
          Nova Licença
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por Nº da Licença, Processo ou Órgão..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Cards de Licenças */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <span>Carregando licenças...</span>
        </div>
      ) : licencasFiltradas.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl text-center py-16 text-slate-400">
          <Award className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-medium text-slate-300">
            Nenhuma licença cadastrada.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre uma nova licença vinculada a um processo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {licencasFiltradas.map((licenca) => {
            const isExpanded = expandedLicencaId === licenca.id;
            const concluidas = licenca.condicionantes.filter(
              (c) => c.status === 3,
            ).length;
            const totalCondicionantes = licenca.condicionantes.length;

            return (
              <div
                key={licenca.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all duration-200"
              >
                {/* Header do Card */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-emerald-400">
                        {licenca.numero}
                      </span>
                      <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {licenca.nomeTipo || "Licença"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        Processo:{" "}
                        <strong className="text-slate-200 font-mono">
                          {licenca.numeroProcesso}
                        </strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5 text-slate-500" />
                        Órgão:{" "}
                        <strong className="text-slate-200">
                          {licenca.orgaoAmbiental}
                        </strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Validade:{" "}
                        <strong className="text-slate-200">
                          {new Date(licenca.dataValidade).toLocaleDateString(
                            "pt-BR",
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">
                        Condicionantes
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {concluidas} / {totalCondicionantes}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          concluídas
                        </span>
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedLicencaId(isExpanded ? null : licenca.id)
                      }
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {isExpanded ? "Ocultar" : "Ver Condicionantes"}
                    </button>
                  </div>
                </div>

                {/* Lista de Condicionantes Expansível */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/50 p-5 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      Checklist de Condicionantes
                    </h3>

                    {licenca.condicionantes.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        Nenhuma condicionante cadastrada para esta licença.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {licenca.condicionantes.map((cond) => {
                          const isConcluida = cond.status === 3;
                          return (
                            <div
                              key={cond.id}
                              onClick={() =>
                                handleToggleCondicionanteStatus(
                                  cond.id,
                                  cond.status,
                                )
                              }
                              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                                isConcluida
                                  ? "bg-slate-900/40 border-slate-800/60 opacity-70"
                                  : "bg-slate-900 border-slate-800 hover:border-emerald-500/50"
                              }`}
                            >
                              <button
                                className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                  isConcluida
                                    ? "bg-emerald-600 border-emerald-500 text-white"
                                    : "border-slate-600 text-transparent hover:border-emerald-500"
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>

                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm ${isConcluida ? "line-through text-slate-500" : "text-slate-200"}`}
                                >
                                  {cond.descricao}
                                </p>
                                {cond.prazo && (
                                  <span className="inline-flex items-center gap-1 text-xs text-amber-400 mt-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Prazo:{" "}
                                    {new Date(cond.prazo).toLocaleDateString(
                                      "pt-BR",
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/30">
              <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500" />
                Cadastrar Licença Ambiental
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Processo Ambiental *
                </label>
                <select
                  required
                  value={formData.processoAmbientalId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      processoAmbientalId: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {processos.map((p) => (
                    <option key={p.id} value={p.id}>
                      Processo nº {p.numeroProcesso} - {p.nomeCliente}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nº da Licença *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: LO-8594/2026"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Tipo de Licença *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, tipo: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>LP - Licença Prévia</option>
                    <option value={2}>LI - Licença de Instalação</option>
                    <option value={3}>LO - Licença de Operação</option>
                    <option value={4}>LAS - Licença Simplificada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Órgão Ambiental *
                  </label>
                  <input
                    type="text"
                    required
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Data de Emissão *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dataEmissao}
                    onChange={(e) =>
                      setFormData({ ...formData, dataEmissao: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Data de Validade *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dataValidade}
                    onChange={(e) =>
                      setFormData({ ...formData, dataValidade: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Condicionantes Dinâmicas */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Condicionantes Iniciais
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCondicionanteField}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Condicionante
                  </button>
                </div>

                {formData.condicionantes.map((cond, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Descrição da condicionante..."
                        value={cond.descricao}
                        onChange={(e) => {
                          const copy = [...formData.condicionantes];
                          copy[index].descricao = e.target.value;
                          setFormData({ ...formData, condicionantes: copy });
                        }}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                      {formData.condicionantes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCondicionanteField(index)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar Licença
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
