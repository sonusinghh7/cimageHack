/**
 * CimageConnect API Client
 * Centralized fetch wrapper that talks to the Express backend.
 * All requests include credentials (cookies) for JWT auth.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let onUnauthorized = null;

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

async function request(method, path, body = null, signal = null) {
  const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(signal && { signal }),
  };

  if (body && !(body instanceof FormData)) {
    options.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    delete options.headers['Content-Type']; // Let browser set multipart boundary
    options.body = body;
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  // Auto-refresh on 401 TOKEN_EXPIRED
  if (res.status === 401) {
    const data = await res.clone().json().catch(() => ({}));
    if (data.code === 'TOKEN_EXPIRED') {
      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshRes.ok) {
          // Retry original request
          return request(method, path, body, signal);
        }
      } catch {}
    }
    // Could not refresh — trigger logout
    if (onUnauthorized) onUnauthorized();
    throw new Error(data.message || 'Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  get: (path, signal) => request('GET', path, null, signal),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData),
};

// ---- Auth ----
export const authApi = {
  login: (studentId, password) => api.post('/auth/login', { studentId, password }),
  logout: () => api.post('/auth/logout'),
  me: (signal) => api.get('/auth/me', signal),
};

// ---- Student ----
export const studentApi = {
  getProfile: () => api.get('/student/profile'),
  changePassword: (currentPassword, newPassword) =>
    api.put('/student/change-password', { currentPassword, newPassword }),
};

// ---- Feature APIs ----
export const courseApi = {
  getAll: (signal) => api.get('/courses', signal),
};

export const attendanceApi = {
  get: (signal) => api.get('/attendance', signal),
};

export const assignmentApi = {
  getAll: (signal) => api.get('/assignments', signal),
  submit: (id, formData) => api.upload(`/assignments/${id}/submit`, formData),
};

export const resultApi = {
  getAll: (signal) => api.get('/results', signal),
};

export const feeApi = {
  get: (signal) => api.get('/fee', signal),
};

export const timetableApi = {
  get: (signal) => api.get('/timetable', signal),
};

export const admitCardApi = {
  get: (signal) => api.get('/admitcard', signal),
};
