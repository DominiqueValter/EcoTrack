import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { api } from "../services/api";
import type { Cliente } from "../types";

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    cnpjCpf: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      setLoading(true);
      const response = await api.get<Cliente[]>("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSalvando(true);
      await api.post("/clientes", formData);
      setFormData({
        nome: "",
        cnpjCpf: "",
        email: "",
        telefone: "",
        endereco: "",
      });
      setIsModalOpen(false);
      await carregarClientes();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert(
        "Erro ao cadastrar cliente. Verifique se o CNPJ/CPF já não está em uso.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.cnpjCpf.includes(busca) ||
      c.email.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-emerald-500" />
            Gestão de Clientes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Cadastre e gerencie as empresas e partes atendidas pela consultoria.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-emerald-950/20"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Filtro e Busca */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar cliente por nome, CNPJ/CPF ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Listagem em Tabela */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>Carregando clientes...</span>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="font-medium text-slate-300">
              Nenhum cliente encontrado.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre um novo cliente ou ajuste sua busca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
                  <th className="py-3.5 px-4 font-semibold">
                    Cliente / Razão Social
                  </th>
                  <th className="py-3.5 px-4 font-semibold">CNPJ / CPF</th>
                  <th className="py-3.5 px-4 font-semibold">Contato</th>
                  <th className="py-3.5 px-4 font-semibold">Endereço</th>
                  <th className="py-3.5 px-4 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-100">
                      {cliente.nome}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-xs">
                      {cliente.cnpjCpf}
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {cliente.telefone}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400 max-w-xs truncate">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        {cliente.endereco}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          cliente.ativo
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                            : "bg-rose-950/60 text-rose-400 border border-rose-800/50"
                        }`}
                      >
                        {cliente.ativo ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {cliente.ativo ? "Ativo" : "Inativo"}
                      </span>
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
                <Building2 className="w-5 h-5 text-emerald-500" />
                Cadastrar Novo Cliente
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
                  Nome / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Eco Indústria Ltda."
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  CNPJ / CPF *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 12.345.678/0001-90"
                  value={formData.cnpjCpf}
                  onChange={(e) =>
                    setFormData({ ...formData, cnpjCpf: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    E-mail de Contato *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contato@empresa.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(41) 99999-8888"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Endereço Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
