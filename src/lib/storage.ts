import { supabase } from "./supabase";

export const BUCKET_NAMES = ["avatars", "iniciativas", "eventos", "animativa", "parceiros"] as const;
export type StorageBucket = typeof BUCKET_NAMES[number];

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface StorageUploadResult {
  url: string;
  path: string;
  error?: string | null;
  isFallback?: boolean;
}

export interface StorageTestResult {
  bucket: string;
  status: "ok" | "not_found" | "error";
  message: string;
}

/**
 * Valida o tipo MIME e o tamanho do arquivo
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "Nenhum arquivo selecionado." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Formato de imagem inválido (${file.type || 'desconhecido'}). Envie JPG, PNG, WebP ou GIF.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `O arquivo tem ${sizeMb}MB. O tamanho máximo permitido é 5MB.`,
    };
  }

  return { valid: true };
}

/**
 * Converte um arquivo para Base64 / DataURL para fallback ou preview imediato
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Otimiza e redimensiona levemente uma imagem antes do upload
 */
export async function optimizeImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<Blob> {
  // Arquivos SVG ou GIF não são passados pelo canvas para manter vetor ou animação
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(blob || file);
        },
        file.type === "image/png" ? "image/png" : "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Sanitiza o nome do arquivo para evitar caracteres especiais no path do Storage
 */
function sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase();
}

/**
 * Faz o upload genérico para um bucket no Supabase Storage
 */
export async function uploadToStorage(
  bucket: "avatars" | "iniciativas" | "eventos" | "animativa" | "parceiros",
  file: File,
  folder = "",
  customFileName?: string
): Promise<StorageUploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { url: "", path: "", error: validation.error };
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const baseName = customFileName 
    ? sanitizeFileName(customFileName)
    : `${Date.now()}_${uniqueId}`;
  
  const fileName = baseName.endsWith(`.${fileExt}`) ? baseName : `${baseName}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  try {
    // 1. Otimiza a imagem
    const optimizedBlob = await optimizeImage(file);

    // 2. Tenta fazer upload no bucket do Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, optimizedBlob, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.warn(`Supabase Storage (${bucket}) upload notice:`, error.message);
      
      // Fallback gracioso para DataURL se o bucket não estiver provisionado na console do Supabase
      const dataUrl = await fileToDataUrl(file);
      return {
        url: dataUrl,
        path: filePath,
        error: null,
        isFallback: true,
      };
    }

    // 3. Obter a URL pública do arquivo
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      error: null,
      isFallback: false,
    };
  } catch (err: any) {
    console.error("Erro inesperado no upload para o Supabase Storage:", err);
    try {
      const dataUrl = await fileToDataUrl(file);
      return {
        url: dataUrl,
        path: filePath,
        error: null,
        isFallback: true,
      };
    } catch {
      return {
        url: "",
        path: "",
        error: err?.message || "Falha ao processar e enviar a imagem.",
      };
    }
  }
}

/**
 * Upload de Foto de Perfil
 */
export async function uploadProfilePhoto(
  file: File,
  userId: string | number
): Promise<StorageUploadResult> {
  return uploadToStorage("avatars", file, `user_${userId}`, `avatar_${Date.now()}`);
}

/**
 * Upload de Foto de Iniciativa / Projeto
 */
export async function uploadInitiativePhoto(
  file: File,
  initiativeNameOrId: string | number = "nova"
): Promise<StorageUploadResult> {
  const folder = `iniciativa_${sanitizeFileName(String(initiativeNameOrId))}`;
  return uploadToStorage("iniciativas", file, folder, `cover_${Date.now()}`);
}

/**
 * Upload de Foto de Evento
 */
export async function uploadEventPhoto(
  file: File,
  eventTitleOrId: string | number = "novo"
): Promise<StorageUploadResult> {
  const folder = `evento_${sanitizeFileName(String(eventTitleOrId))}`;
  return uploadToStorage("eventos", file, folder, `banner_${Date.now()}`);
}

/**
 * Upload de Fotos Institucionais da Animativa
 */
export async function uploadAnimativaPhoto(
  file: File,
  category = "galeria"
): Promise<StorageUploadResult> {
  return uploadToStorage("animativa", file, category, `${category}_${Date.now()}`);
}

/**
 * Upload de Logo de Parceiro
 */
export async function uploadPartnerLogo(
  file: File,
  partnerName = "parceiro"
): Promise<StorageUploadResult> {
  return uploadToStorage("parceiros", file, "logos", `${sanitizeFileName(partnerName)}_${Date.now()}`);
}

/**
 * Diagnóstico de conexão com os Buckets do Supabase Storage
 */
export async function testStorageBuckets(): Promise<{
  bucket: string;
  status: "ok" | "not_found" | "error";
  message: string;
}[]> {
  const bucketsToCheck = ["avatars", "iniciativas", "eventos", "animativa", "parceiros"];
  const results: { bucket: string; status: "ok" | "not_found" | "error"; message: string }[] = [];

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      return bucketsToCheck.map((b) => ({
        bucket: b,
        status: "error",
        message: error.message,
      }));
    }

    const existingNames = new Set(buckets?.map((b) => b.name) || []);

    for (const b of bucketsToCheck) {
      if (existingNames.has(b)) {
        results.push({ bucket: b, status: "ok", message: "Bucket ativo e configurado" });
      } else {
        results.push({
          bucket: b,
          status: "not_found",
          message: "Bucket não encontrado (fallback ativo)",
        });
      }
    }
  } catch (err: any) {
    return bucketsToCheck.map((b) => ({
      bucket: b,
      status: "error",
      message: err?.message || "Erro ao listar buckets",
    }));
  }

  return results;
}
