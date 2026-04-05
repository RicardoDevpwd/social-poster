import { useRef, useState } from "react";

interface Props {
  onChange: (file: File | null) => void;
}

export default function ImageUpload({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File | null) {
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0] ?? null);
  }

  function remove() {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <p className="text-gray-400 text-sm">
            Arraste uma imagem ou{" "}
            <span className="text-indigo-500 font-medium">clique para selecionar</span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>
      ) : (
        <div className="relative w-fit">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-xl border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={remove}
            className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
}
