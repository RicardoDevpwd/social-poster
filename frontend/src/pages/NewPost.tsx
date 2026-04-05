import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PlatformSelector from "../components/PlatformSelector";
import ImageUpload from "../components/ImageUpload";
import DateTimePicker from "../components/DateTimePicker";

interface SocialAccount {
  id: number;
  platform: string;
  account_name: string;
  is_active: boolean;
}

export default function NewPost() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/social/accounts/").then(({ data }) => {
      const list: SocialAccount[] = data.results ?? data;
      setAccounts(list.filter((a) => a.is_active));
    });
  }, []);

  async function submit(publishNow: boolean) {
    if (!text.trim()) {
      setError("O texto do post não pode estar vazio.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);
    selectedPlatforms.forEach((id) => formData.append("platforms", String(id)));

    try {
      if (publishNow) {
        const { data } = await api.post("/posts/", formData);
        await api.post(`/posts/${data.id}/publish/`);
      } else {
        if (!scheduledAt) {
          setError("Selecione uma data/hora para agendar.");
          return;
        }
        formData.append("scheduled_at", new Date(scheduledAt).toISOString());
        await api.post("/posts/", formData);
      }
      navigate("/");
    } catch (err) {
      setError("Erro ao criar post. Verifique os dados e tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Novo Post</h1>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            maxLength={2200}
            placeholder="O que você quer publicar?"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{text.length}/2200</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
          <ImageUpload onChange={setImage} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publicar em
          </label>
          <PlatformSelector
            accounts={accounts}
            selected={selectedPlatforms}
            onChange={setSelectedPlatforms}
          />
        </div>

        <DateTimePicker value={scheduledAt} onChange={setScheduledAt} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Publicando..." : "Publicar agora"}
          </button>
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={loading}
            className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50 disabled:opacity-50 transition-colors"
          >
            {loading ? "Agendando..." : "Agendar"}
          </button>
        </div>
      </div>
    </div>
  );
}
