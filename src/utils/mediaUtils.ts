/**
 * Utilitário para converter links de compartilhamento do Google Drive 
 * em links compatíveis com <iframe> (preview) ou exibição direta.
 */
export const formatDriveEmbedUrl = (url: string): string => {
  if (!url || !url.includes('drive.google.com')) {
    return url;
  }

  try {
    // 1. Caso comum: https://drive.google.com/file/d/ID/view?usp=sharing
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,50})/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }

    // 2. Caso com parâmetro ID: https://drive.google.com/open?id=ID
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('id');
    if (id) {
      return `https://drive.google.com/file/d/${id}/preview`;
    }

    return url;
  } catch (e) {
    return url;
  }
};

/**
 * Retorna a URL otimizada para visualização direta (High Res)
 * Agora usa o proxy do servidor para evitar bloqueios de CORS/Redirecionamento.
 */
export const formatDriveImageUrl = (url: string): string => {
  if (!url) return url;
  
  if (!url.includes('drive.google.com')) {
    return url;
  }

  try {
    const idRegex = /(?:\/file\/d\/|id=|d\/|open\?id=)([a-zA-Z0-9_-]{25,50})/;
    const match = url.match(idRegex);
    const id = match ? match[1] : null;

    if (id) {
       // Usamos o backend rodando na porta 3000 como proxy
       // sz=w2000 para alta resolução no preview
       return `/api/proxy-image?id=${id}&sz=w2000`;
    }
    return url;
  } catch (e) {
    return url;
  }
};

/**
 * Retorna a URL da miniatura de um arquivo do Google Drive usando o PROXY do servidor.
 * Resolve problemas de "Visualização Offline" forçando o servidor a baixar a thumb.
 */
export const getDriveThumbnailUrl = (urlOrId: string, size: string = 'w600'): string | null => {
  if (!urlOrId) return null;
  
  let id = urlOrId;

  // Se for uma URL completa, extrai o ID
  if (urlOrId.includes('drive.google.com')) {
    try {
      const idRegex = /(?:\/file\/d\/|id=|d\/|open\?id=)([a-zA-Z0-9_-]{25,50})/;
      const match = urlOrId.match(idRegex);
      id = match ? match[1] : urlOrId;
    } catch (e) {
      return null;
    }
  }

  // Se chegamos aqui e temos algo que parece um ID (não é uma URL com slash etc)
  if (id && !id.includes('/')) {
    const sizeClean = size.replace('w', '').replace('h', '');
    return `/api/proxy-image?id=${id}&sz=w${sizeClean}`;
  }
  
  return null;
};
