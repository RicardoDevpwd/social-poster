import { useEffect, useState } from "react";
import api from "../api/client";

interface Post {
  id: number;
  text: string;
  status: string;
  scheduled_at: string | null;
  platforms: number[];
}

export default function Scheduled() {
  const [posts, setPosts] = useState<Post[]>([]);

  function load() {
    api.get("/posts/").then(({ data }) => {
      const all: Post[] = data.results ?? data;
      setPosts(all.filter((p) => p.status === "queued"));
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function cancel(id: number) {
    await api.delete(`/posts/${id}/`);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function publishNow(id: number) {
    await api.post(`/posts/${id}/publish/`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Posts Agendados</h1>

      <div className="bg-white rounded-2xl shadow-sm border">
        {posts.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            Nenhum post agendado no momento.
          </p>
        )}
        <table className="w-full text-sm">
          {posts.length > 0 && (
            <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Texto</th>
                <th className="px-5 py-3 text-left">Agendado para</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
          )}
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-5 py-4 text-gray-700 max-w-xs truncate">{post.text}</td>
                <td className="px-5 py-4 text-gray-500">
                  {post.scheduled_at
                    ? new Date(post.scheduled_at).toLocaleString("pt-BR")
                    : "—"}
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  <button
                    onClick={() => publishNow(post.id)}
                    className="text-indigo-600 hover:underline text-xs font-medium"
                  >
                    Publicar agora
                  </button>
                  <button
                    onClick={() => cancel(post.id)}
                    className="text-red-500 hover:underline text-xs font-medium"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
