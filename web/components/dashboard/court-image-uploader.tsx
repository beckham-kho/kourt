"use client";

import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadedImage {
  url: string;
  uploading: boolean;
}

export default function CourtImageUploader({
  onChange,
}: {
  onChange: (urls: string[]) => void;
}) {
  const [images, setImages] = useState<UploadedImage[]>([]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempIndex = images.length;
    setImages((prev) => [...prev, { url: "", uploading: true }]);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Gagal upload gambar");
        setImages((prev) => prev.filter((_, i) => i !== tempIndex));
        return;
      }

      setImages((prev) => {
        const updated = [...prev];
        updated[tempIndex] = { url: result.data.url, uploading: false };
        onChange(updated.map((img) => img.url).filter(Boolean));
        return updated;
      });
    } catch {
      toast.error("Terjadi kesalahan saat upload");
      setImages((prev) => prev.filter((_, i) => i !== tempIndex));
    } finally {
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onChange(updated.map((img) => img.url).filter(Boolean));
      return updated;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted border"
          >
            {img.uploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                    Utama
                  </span>
                )}
              </>
            )}
          </div>
        ))}

        <label className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted transition-colors">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Tambah</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      </div>
    </div>
  );
}
