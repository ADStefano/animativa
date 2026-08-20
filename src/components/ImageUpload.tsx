import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle, 
  Loader2, 
  Link as LinkIcon,
  RefreshCw,
  Eye
} from "lucide-react";
import { validateImageFile, fileToDataUrl, uploadToStorage, StorageUploadResult } from "../lib/storage";

interface ImageUploadProps {
  label?: string;
  helperText?: string;
  currentImageUrl?: string | null;
  bucket?: "avatars" | "iniciativas" | "eventos" | "animativa" | "parceiros";
  folder?: string;
  customFileName?: string;
  shape?: "square" | "circle" | "banner" | "rectangle";
  aspectRatio?: string; // e.g. "aspect-video", "aspect-square", "aspect-[3/1]"
  onImageUploaded: (url: string, path?: string) => void;
  onImageRemoved?: () => void;
  allowDirectUrlInput?: boolean;
  className?: string;
  required?: boolean;
}

export default function ImageUpload({
  label,
  helperText = "PNG, JPG, WebP ou GIF até 5MB",
  currentImageUrl,
  bucket = "iniciativas",
  folder = "",
  customFileName,
  shape = "rectangle",
  aspectRatio = "aspect-video",
  onImageUploaded,
  onImageRemoved,
  allowDirectUrlInput = true,
  className = "",
  required = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState("");

  // Atualiza preview se a prop externa mudar
  React.useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || "Arquivo inválido");
      return;
    }

    try {
      setIsUploading(true);
      
      // Preview local imediato
      const localPreview = await fileToDataUrl(file);
      setPreviewUrl(localPreview);

      // Upload para o Supabase Storage
      const result: StorageUploadResult = await uploadToStorage(
        bucket,
        file,
        folder,
        customFileName
      );

      if (result.error) {
        setErrorMsg(result.error);
        return;
      }

      setPreviewUrl(result.url);
      onImageUploaded(result.url, result.path);
    } catch (err: any) {
      console.error("Erro no processamento do upload:", err);
      setErrorMsg(err?.message || "Erro ao carregar a imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  const handleDirectUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    setPreviewUrl(directUrl.trim());
    onImageUploaded(directUrl.trim());
    setShowUrlInput(false);
    setDirectUrl("");
  };

  // Determina as classes visuais baseadas no formato escolhido
  const getContainerShape = () => {
    if (shape === "circle") {
      return "w-32 h-32 rounded-full";
    }
    if (shape === "banner") {
      return `w-full h-48 rounded-[2rem]`;
    }
    return `w-full ${aspectRatio} rounded-[2rem]`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-brand-orange" />
            {label}
            {required && <span className="text-red-400">*</span>}
          </label>

          {allowDirectUrlInput && (
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[10px] font-bold uppercase tracking-wider text-brand-blue hover:text-white transition-colors flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              {showUrlInput ? "Usar arquivo" : "Inserir URL"}
            </button>
          )}
        </div>
      )}

      {/* Input de URL direta (Opcional) */}
      <AnimatePresence>
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand-orange"
              />
              <button
                type="button"
                onClick={handleDirectUrlApply}
                className="px-4 py-2.5 bg-brand-orange hover:bg-white hover:text-brand-purple rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Área de Drop / Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative ${getContainerShape()} border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden group ${
          isDragging
            ? "border-brand-orange bg-brand-orange/10 scale-[1.01]"
            : previewUrl
            ? "border-white/20 bg-black/40"
            : "border-white/10 bg-white/[0.02] hover:border-brand-orange/40 hover:bg-white/[0.04]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={handleInputChange}
          className="hidden"
        />

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <span className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 transition-all">
                <RefreshCw className="w-3 h-3" />
                Trocar Foto
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500/80 hover:bg-red-500 rounded-xl text-white transition-all shadow-lg cursor-pointer"
                title="Remover foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none p-2">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-brand-orange group-hover:border-brand-orange/30 group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">
                Clique para enviar <span className="text-white/40 font-normal">ou arraste a foto</span>
              </p>
              <p className="text-[10px] text-white/40 mt-0.5">{helperText}</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Processando imagem...
            </span>
          </div>
        )}
      </div>

      {/* Mensagem de Erro */}
      {errorMsg && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium ml-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
