// Cliente HTTP pronto para Spring Boot (substituir mocks futuramente)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${baseURL}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listEvents: () => request('/events'),
  getEvent: (id) => request(`/events/${id}`),
  createTicket: (eventId, data) => request(`/events/${eventId}/tickets`, { method: 'POST', body: data }),
  supportMessage: (data) => request('/support', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data })
};
