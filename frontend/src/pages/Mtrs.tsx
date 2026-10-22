import { useState, useEffect } from "react";
import {
  Truck,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle2,
  FileCheck,
  Package,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { api } from "../services/api";
import type { Cliente } from "../types";

export function Mtrs() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [resultado, setResultado] = useState<{
    mensagem: string;
    total: number;
  } | null>(null);

  // Form & Import State
  const [clienteId, setClienteId] = useState<string>("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  async function carregarClientes() {
    try {
      setLoading(true);
      const res = await api.get<Cliente[]>("/clientes");
      setClientes(res.data);
      if (res.data.length > 0) {
        setClienteId(res.data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function handleImportar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) {
      alert("Selecione um arquivo CSV retornado pelo SINIR/IAT.");
      return;
    }
    if (!clienteId) {
      alert("Selecione o cliente gerador responsável pelos MTRs.");
      return;
    }

    try {
      setSalvando(true);
      setResultado(null);

      const formData = new FormData();
      formData.append("arquivo", arquivo);

      const response = await api.post(
        `/mtrs/importar-csv?clienteId=${clienteId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setResultado({
        mensagem: response.data.mensagem || "Importação realizada com sucesso.",
        total: response.data.totalMtrsImportados || 0,
      });

      setArquivo(null);
    } catch (error: any) {
      console.error("Erro ao importar CSV de MTRs:", error);
      const msg =
        error.response?.data?.mensagem ||
        "Erro ao processar a planilha. Verifique a formatação do CSV.";
      alert(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Truck className="w-7 h-7 text-emerald-500" />
            MTRs & Gestão de Resíduos (SINIR/IAT)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Importação automatizada de Manifestos de Transporte de Resíduos a
            partir de relatórios governamentais.
          </p>
        </div>

        <button
          onClick={() => {
            setResultado(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Importar Planilha SINIR
        </button>
      </div>

      {/* Banners Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Package className="w-4 h-4" />
            Layout Padrão SINIR / IAT
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Suporte nativo ao layout oficial com mapeamento de resíduos, classe
            de periculosidade, gerador, transportador e destinador.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Layers className="w-4 h-4" />
            Processamento em Lote
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Importe centenas de manifestos de uma só vez. As quantidades
            indicadas e recebidas são convertidas em métricas no sistema.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <ArrowUpRight className="w-4 h-4" />
            CDF & Rastreabilidade
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vinculação do número do Certificado de Destinação Final (CDF) e
            tratamento de resíduos industriais e hospitalares.
          </p>
        </div>
      </div>

      {/* Resultado da Última Importação */}
      {resultado && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 flex items-center justify-between text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">{resultado.mensagem}</p>
              <p className="text-xs text-emerald-400/80">
                Total de MTRs inseridos na base do cliente:{" "}
                <strong className="font-mono">{resultado.total}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setResultado(null)}
            className="text-emerald-400/60 hover:text-emerald-300 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Area Central */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-4">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>Carregando dados dos clientes...</span>
          </div>
        ) : (
          <>
            <FileSpreadsheet className="w-16 h-16 text-slate-700 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-200">
              Pronto para importar arquivos de MTR
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Clique no botão "Importar Planilha SINIR" acima, selecione a
              empresa cliente geradora e faça o upload do arquivo{" "}
              <code className="text-emerald-400 font-mono">.csv</code> exportado
              pelo portal do IAT ou SINIR.
            </p>
          </>
        )}
      </div>

      {/* Modal de Importação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/30">
              <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                Importar Relatório de MTRs (SINIR)
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportar} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Cliente Gerador Responsável *
                </label>
                <select
                  required
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.cnpjCpf})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Arquivo CSV do SINIR / IAT *
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950 rounded-xl p-6 text-center transition-colors">
                  <input
                    type="file"
                    accept=".csv"
                    required
                    onChange={(e) =>
                      setArquivo(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                    id="csv-input"
                  />
                  <label
                    htmlFor="csv-input"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <FileCheck className="w-8 h-8 text-emerald-500" />
                    {arquivo ? (
                      <span className="text-sm font-medium text-emerald-400 font-mono">
                        {arquivo.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm text-slate-300 font-medium">
                          Clique para selecionar a planilha (.csv)
                        </span>
                        <span className="text-xs text-slate-500">
                          Relatórios exportados do sistema estadual ou federal
                        </span>
                      </>
                    )}
                  </label>
                </div>
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
                  disabled={salvando || !arquivo}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg"
                >
                  {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                  Processar e Importar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
