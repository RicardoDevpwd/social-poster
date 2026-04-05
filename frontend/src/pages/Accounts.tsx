import { useEffect, useState } from "react";
import api from "../api/client";

interface SocialAccount {
  id: number;
  platform: string;
  account_name: string;
  is_active: boolean;
  created_at: string;
}

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "Twitter / X" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
];

const emptyForm = {
  platform: "instagram",
  account_name: "",
  access_token: "",
  token_secret: "",
  extra_data: "{}",
};

export default function Accounts() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  function load() {
    api.get("/social/accounts/").then(({ data }) => {
      setAccounts(data.results ?? data);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      let extra = {};
      try {
        extra = JSON.parse(form.extra_data);
      } catch {
        setError("extra_data deve ser um JSON válido. Ex: {}");
        return;
      }
      await api.post("/social/accounts/", { ...form, extra_data: extra });
      setForm(emptyForm);
      setAdding(false);
      load();
    } catch {
      setError("Erro ao adicionar conta. Verifique os dados.");
    }
  }

  async function remove(id: number) {
    await api.delete(`/social/accounts/${id}/`);
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contas Sociais</h1>
        <button
          onClick={() => setAdding(!adding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
        >
          {adding ? "Cancelar" : "+ Conectar conta"}
        </button>
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border p-6 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-700">Nova conta</h2>
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            {PLATFORMS.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome da conta (ex: @meuperfil)"
            value={form.account_name}
            onChange={(e) => setForm({ ...form, account_name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Access Token"
            value={form.access_token}
            onChange={(e) => setForm({ ...form, access_token: e.target.value })}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono"
          />
          <input
            type="text"
            placeholder="Token Secret (Twitter)"
            value={form.token_secret}
            onChange={(e) => setForm({ ...form, token_secret: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono"
          />
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Extra Data (JSON) — ex: {`{"page_id":"123"}`}
            </label>
            <textarea
              value={form.extra_data}
              onChange={(e) => setForm({ ...form, extra_data: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Salvar conta
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border divide-y">
        {accounts.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Nenhuma conta conectada ainda.
          </p>
        )}
        {accounts.map((acc) => (
          <div key={acc.id} className="flex items-center gap-4 px-5 py-4">
            <div
              className={`w-2 h-2 rounded-full ${
                acc.is_active ? "bg-green-400" : "bg-gray-300"
              }`}
            />
            <div className="flex-1">
              <p className="font-medium text-sm capitalize">{acc.platform}</p>
              <p className="text-xs text-gray-400">{acc.account_name || "Sem nome"}</p>
            </div>
            <button
              onClick={() => remove(acc.id)}
              className="text-red-400 hover:text-red-600 text-xs"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
