import { useState, useEffect } from "react";
import {
  FolderOpen,
  Upload,
  Search,
  FileText,
  Trash2,
  Building2,
  Award,
  X,
  Loader2,
  HardDrive,
  File,
  FileCheck,
  Calendar,
} from "lucide-react";
import { api } from "../services/api";
import type {
  Documento,
  Cliente,
  ProcessoAmbiental,
  LicencaAmbiental,
} from "../types";

export function Documentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [processos, setProcessos] = useState<ProcessoAmbiental[]>([]);
  const [licencas, setLicencas] = useState<LicencaAmbiental[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Form & Upload State
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [clienteId, setClienteId] = useState<string>("");
  const [processoAmbientalId, setProcessoAmbientalId] = useState<string>("");
  const [licencaAmbientalId, setLicencaAmbientalId] = useState<string>("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const [resDocs, resClientes, resProc, resLic] = await Promise.all([
        api.get<Documento[]>("/documentos"),
        api.get<Cliente[]>("/clientes"),
        api.get<ProcessoAmbiental[]>("/processos-ambientais"),
        api.get<LicencaAmbiental[]>("/licencas-ambientais"),
      ]);

      setDocumentos(resDocs.data);
      setClientes(resClientes.data);
      setProcessos(resProc.data);
      setLicencas(resLic.data);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) {
      alert("Selecione um arquivo para envio.");
      return;
    }

    try {
      setSalvando(true);
      const formData = new FormData();
      formData.append("arquivo", arquivo);

      if (clienteId) formData.append("clienteId", clienteId);
      if (processoAmbientalId)
        formData.append("processoAmbientalId", processoAmbientalId);
      if (licencaAmbientalId)
        formData.append("licencaAmbientalId", licencaAmbientalId);

      await api.post("/documentos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset
      setArquivo(null);
      setClienteId("");
      setProcessoAmbientalId("");
      setLicencaAmbientalId("");
      setIsModalOpen(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao enviar documento:", error);
      alert("Falha ao realizar upload do documento.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id: string, nome: string) {
    if (
      !confirm(
        `Deseja realmente excluir o documento "${nome}"? O arquivo também será removido do Dropbox.`,
      )
    ) {
      return;
    }

    try {
      await api.delete(`/documentos/${id}`);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      alert("Erro ao excluir o documento.");
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  const documentosFiltrados = documentos.filter(
    (d) =>
      d.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (d.nomeCliente &&
        d.nomeCliente.toLowerCase().includes(busca.toLowerCase())) ||
      (d.numeroProcesso &&
        d.numeroProcesso.toLowerCase().includes(busca.toLowerCase())) ||
      (d.numeroLicenca &&
        d.numeroLicenca.toLowerCase().includes(busca.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-emerald-500" />
            Documentos & Armazenamento (Dropbox)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Repositório central de arquivos digitais sincronizado na nuvem.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
        >
          <Upload className="w-5 h-5" />
          Upload de Documento
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar documento por nome, cliente, processo ou licença..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Tabela de Documentos */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>Carregando repositório...</span>
          </div>
        ) : documentosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <HardDrive className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="font-medium text-slate-300">
              Nenhum documento encontrado.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Envie o primeiro PDF ou laudo técnico para o Dropbox.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold">Nome do Arquivo</th>
                  <th className="py-3.5 px-4 font-semibold">Vínculo</th>
                  <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                  <th className="py-3.5 px-4 font-semibold">Data Upload</th>
                  <th className="py-3.5 px-4 font-semibold">Dropbox Path</th>
                  <th className="py-3.5 px-4 font-semibold text-center">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {documentosFiltrados.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block truncate max-w-xs">
                            {doc.nome}
                          </span>
                          <span className="text-xs text-slate-500 uppercase">
                            {doc.extensao}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 space-y-1 text-xs">
                      {doc.nomeCliente && (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {doc.nomeCliente}
                        </div>
                      )}
                      {doc.numeroProcesso && (
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                          <File className="w-3.5 h-3.5 text-slate-500" />
                          Proc: {doc.numeroProcesso}
                        </div>
                      )}
                      {doc.numeroLicenca && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                          <Award className="w-3.5 h-3.5 text-emerald-500" />
                          Lic: {doc.numeroLicenca}
                        </div>
                      )}
                      {!doc.nomeCliente &&
                        !doc.numeroProcesso &&
                        !doc.numeroLicenca && (
                          <span className="text-slate-500 italic">
                            Sem vínculo direto
                          </span>
                        )}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-400">
                      {formatBytes(doc.tamanhoBytes)}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(doc.dataUpload).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 font-mono max-w-xs truncate">
                      {doc.dropboxPath}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDeletar(doc.id, doc.nome)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Excluir arquivo do banco e do Dropbox"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/30">
              <h2 className="font-semibold text-slate-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-500" />
                Upload de Documento
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* Dropzone de Arquivo */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Arquivo (PDF, Docx, Imagem) *
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950 rounded-xl p-6 text-center transition-colors">
                  <input
                    type="file"
                    required
                    onChange={(e) =>
                      setArquivo(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
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
                          Clique para escolher o arquivo
                        </span>
                        <span className="text-xs text-slate-500">
                          Arquivos até 50MB para integração com Dropbox
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Vínculos Opcionais */}
              <div className="space-y-3 pt-2 border-t border-slate-800/60">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Vínculo do Arquivo (Opcional)
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Cliente
                  </label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Selecione um Cliente --</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Processo Ambiental
                    </label>
                    <select
                      value={processoAmbientalId}
                      onChange={(e) => setProcessoAmbientalId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Processo --</option>
                      {processos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.numeroProcesso}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Licença Ambiental
                    </label>
                    <select
                      value={licencaAmbientalId}
                      onChange={(e) => setLicencaAmbientalId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Licença --</option>
                      {licencas.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.numero}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  Enviar para Dropbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
