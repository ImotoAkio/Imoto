const API_BASE = '/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Resolves a raw image URL (local path or Drive URL) into a displayable URL.
 * Automatically handles Google Drive URLs via proxy.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Se for um link do Drive ou ID (25+ caracteres alfanuméricos)
  const driveMatch = url.match(/[-\w]{25,}/);
  if (url.includes('drive.google.com') || url.includes('docs.google.com') || (driveMatch && !url.includes('/'))) {
    const id = driveMatch ? driveMatch[0] : url;
    return `${API_BASE}/proxy-image?id=${id}`;
  }

  // Se já for um path de upload local
  return url;
}

export async function fetchMembers() {
  try {
    const res = await fetch(`${API_BASE}/members`);
    return await res.json();
  } catch (error) {
    console.warn('Erro ao buscar API Local:', error);
    return [];
  }
}

export async function fetchMemberById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/members/${id}`);
    if (!res.ok) throw new Error('Falha ao buscar membro');
    return await res.json();
  } catch (error) {
    console.error('Erro ao buscar membro por ID:', error);
    return null;
  }
}

export async function createMember(data: any) {
  try {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao criar:', error);
    throw error;
  }
}

export async function updateMember(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Falha HTTP: ' + res.status);
    return await res.json();
  } catch (error) {
    console.error('Falha ao atualizar:', error);
    throw error;
  }
}

export async function connectMember(id: string, relationType: 'parent' | 'spouse', targetId: string) {
  try {
    const res = await fetch(`${API_BASE}/members/${id}/connect`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ relationType, targetId })
    });
    if (!res.ok) throw new Error('Falha HTTP: ' + res.status);
    return await res.json();
  } catch (error) {
    console.error('Falha ao conectar:', error);
    throw error;
  }
}

export async function disconnectMember(id: string, relationType: 'parent' | 'spouse', targetId: string) {
  try {
    const res = await fetch(`${API_BASE}/members/${id}/disconnect`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ relationType, targetId })
    });
    if (!res.ok) throw new Error('Falha HTTP: ' + res.status);
    return await res.json();
  } catch (error) {
    console.error('Falha ao desconectar:', error);
    throw error;
  }
}

export async function deleteMember(id: string) {
  try {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao deletar:', error);
    throw error;
  }
}

export async function fetchArtifacts() {
  try {
    const res = await fetch(`${API_BASE}/artifacts`);
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createArtifact(data: any) {
  try {
    const res = await fetch(`${API_BASE}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao criar artefato:', error);
    throw error;
  }
}

export async function updateArtifact(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/artifacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao atualizar artefato:', error);
    throw error;
  }
}

export async function deleteArtifact(id: string) {
  try {
    const res = await fetch(`${API_BASE}/artifacts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao deletar artefato:', error);
    throw error;
  }
}

export async function fetchStories() {
  try {
    const res = await fetch(`${API_BASE}/stories`);
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function fetchEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`);
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function createEvent(data: any) {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao criar evento:', error);
    throw error;
  }
}

export async function updateEvent(id: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao atualizar evento:', error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (error) {
    console.error('Falha ao deletar evento:', error);
    throw error;
  }
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`🚀 Iniciando upload de: ${file.name} (${file.size} bytes)...`);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: headers, // Não definir Content-Type manualmente para FormData!
      body: formData,
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Falha no upload (Status: ${res.status})`);
    }
    
    const data = await res.json();
    console.log('✅ Upload concluído com sucesso:', data.url);
    return data;
  } catch (error) {
    console.error('❌ Erro crítico no upload helper:', error);
    throw error;
  }
}

// --- Auth API ---
export async function login(data: any) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao fazer login');
  return json;
}

export async function register(data: any) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao cadastrar');
  return json;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao solicitar recuperação');
  return json;
}

export async function resetPassword(data: any) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao redefinir senha');
  return json;
}

// --- Admin API ---
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Erro ao buscar usuários');
  return await res.json();
}

export async function updateUserStatus(id: string, status: 'APPROVED' | 'REJECTED') {
  const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao atualizar status');
  return json;
}
