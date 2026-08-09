const BASE = `${import.meta.env.VITE_API_URL || ''}/api/admin`;

async function adminFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const adminAuthApi = {
  login: (body) => adminFetch('/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => adminFetch('/logout', { method: 'POST' }),
  me: () => adminFetch('/me'),
};

export const adminStatsApi = {
  get: () => adminFetch('/stats'),
};

export const adminStudentsApi = {
  getAll: (params = '') => adminFetch(`/students${params}`),
  getById: (id) => adminFetch(`/students/${id}`),
  create: (body) => adminFetch('/students', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => adminFetch(`/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => adminFetch(`/students/${id}`, { method: 'DELETE' }),
  toggle: (id) => adminFetch(`/students/${id}/toggle`, { method: 'PUT' }),
  resetPassword: (id, newPassword) => adminFetch(`/students/${id}/reset-password`, { method: 'PUT', body: JSON.stringify({ newPassword }) }),
};

export const adminCoursesApi = {
  getAll: (params = '') => adminFetch(`/courses${params}`),
  create: (body) => adminFetch('/courses', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => adminFetch(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => adminFetch(`/courses/${id}`, { method: 'DELETE' }),
};

export const adminNotificationsApi = {
  getAll: () => adminFetch('/notifications'),
  send: (body) => adminFetch('/notifications', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id) => adminFetch(`/notifications/${id}`, { method: 'DELETE' }),
};

export const adminAttendanceApi = {
  getAll: (params = '') => adminFetch(`/attendance${params}`),
};

export const adminFeesApi = {
  getAll: () => adminFetch('/fees'),
  addRecord: (studentId, body) => adminFetch(`/fees/${studentId}`, { method: 'POST', body: JSON.stringify(body) }),
};

export const adminResultsApi = {
  getAll: () => adminFetch('/results'),
  add: (body) => adminFetch('/results', { method: 'POST', body: JSON.stringify(body) }),
};

export const adminAssignmentsApi = {
  getAll: () => adminFetch('/assignments'),
  create: (body) => adminFetch('/assignments', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id) => adminFetch(`/assignments/${id}`, { method: 'DELETE' }),
};
