interface Props {
  selected: number[];
  onChange: (ids: number[]) => void;
  accounts: { id: number; platform: string; account_name: string }[];
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter / X",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-50 border-pink-300 text-pink-700",
  twitter: "bg-sky-50 border-sky-300 text-sky-700",
  facebook: "bg-blue-50 border-blue-300 text-blue-700",
  linkedin: "bg-indigo-50 border-indigo-300 text-indigo-700",
  tiktok: "bg-gray-50 border-gray-300 text-gray-700",
};

export default function PlatformSelector({ selected, onChange, accounts }: Props) {
  function toggle(id: number) {
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    );
  }

  if (accounts.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        Nenhuma conta social conectada. Vá em{" "}
        <a href="/contas" className="text-indigo-500 underline">
          Contas
        </a>{" "}
        para adicionar.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {accounts.map((acc) => {
        const isSelected = selected.includes(acc.id);
        const colorClass = PLATFORM_COLORS[acc.platform] ?? "bg-gray-50 border-gray-300 text-gray-700";
        return (
          <button
            key={acc.id}
            type="button"
            onClick={() => toggle(acc.id)}
            className={`border rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isSelected ? colorClass + " ring-2 ring-offset-1" : "bg-white border-gray-200 text-gray-400"
            }`}
          >
            {PLATFORM_LABELS[acc.platform] ?? acc.platform}
            {acc.account_name && ` · ${acc.account_name}`}
          </button>
        );
      })}
    </div>
  );
}
