import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

interface Post {
  id: number;
  text: string;
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  queued: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  queued: "Agendado",
  published: "Publicado",
  failed: "Falhou",
};

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [counts, setCounts] = useState({ published: 0, queued: 0, failed: 0 });

  useEffect(() => {
    api.get("/posts/").then(({ data }) => {
      const results: Post[] = data.results ?? data;
      setPosts(results.slice(0, 5));
      setCounts({
        published: results.filter((p) => p.status === "published").length,
        queued: results.filter((p) => p.status === "queued").length,
        failed: results.filter((p) => p.status === "failed").length,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Publicados", value: counts.published, color: "bg-green-50 border-green-200" },
          { label: "Agendados", value: counts.queued, color: "bg-yellow-50 border-yellow-200" },
          { label: "Falhas", value: counts.failed, color: "bg-red-50 border-red-200" },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border p-5 ${card.color}`}>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Posts Recentes</h2>
        <Link to="/novo-post" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
          + Novo Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border divide-y">
        {posts.length === 0 && (
          <p className="text-gray-400 text-center py-8">Nenhum post ainda.</p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-4 px-5 py-4">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[post.status]}`}
            >
              {statusLabels[post.status]}
            </span>
            <p className="flex-1 text-sm text-gray-700 truncate">{post.text}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
