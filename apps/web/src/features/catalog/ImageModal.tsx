import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada: ${alt}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.15s ease" }}
      onClick={onClose}
    >
      <div
        className="relative inline-flex max-w-[calc(100vw-2rem)] sm:max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.15s ease" }}
      >
        <img
          src={src}
          alt={alt}
          className="block max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <button
          onClick={onClose}
          aria-label="Cerrar imagen"
          className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>,
    document.body,
  );
}
