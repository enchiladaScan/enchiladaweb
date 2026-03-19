/** Convierte fileId -> URL embebible */
export function driveViewUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`;
}

/** Thumbnail rápido (Google aplica compresión) */
export function driveThumbUrl(fileId, width = 1200) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${width}`;
}

/** Carga JSON con control de errores (sin cache dura para ver cambios de inmediato) */
export async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${path}`);
  return await res.json();
}

/** Orden natural por nombre (001.jpg < 010.jpg) */
export function sortByName(a, b) {
  return a.name?.localeCompare?.(b.name, undefined, { numeric: true, sensitivity: "base" }) ?? 0;
}

/** Normaliza images.json */
export function normalizeChapterJson(data) {
  if (Array.isArray(data)) {
    const pages = data.map((url) => {
      const name = (url.split("/").pop() || "").split("?")[0] || "page";
      return { url, name };
    });
    return { title: "", chapter: "", base: "url", pages };
  }
  if (data && Array.isArray(data.pages)) return data; // extendido
  throw new Error("Formato de images.json no reconocido");
}
