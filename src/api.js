const API_BASE = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('jalgaon_airline_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Airports & Distance
  async getAirports() {
    const res = await fetch(`${API_BASE}/airports`);
    return res.json();
  },

  async calculateDistance(source, destination) {
    const res = await fetch(`${API_BASE}/calculate-distance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, destination })
    });
    return res.json();
  },

  // Pricing & System Config
  async getPricingConfig() {
    const res = await fetch(`${API_BASE}/pricing/config`);
    return res.json();
  },

  async updatePricingConfig(configData) {
    const res = await fetch(`${API_BASE}/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(configData)
    });
    return res.json();
  },

  async getPricingPreview(previewParams) {
    const res = await fetch(`${API_BASE}/pricing/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(previewParams)
    });
    return res.json();
  },

  // Admin Flights
  async getAdminFlights() {
    const res = await fetch(`${API_BASE}/admin/flights`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async addFlight(flightData) {
    const res = await fetch(`${API_BASE}/admin/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(flightData)
    });
    return res.json();
  },

  async updateFlight(id, flightData) {
    const res = await fetch(`${API_BASE}/admin/flights/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(flightData)
    });
    return res.json();
  },

  async updateFlightStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/flights/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async applyAiPrice(id, recommendedPrice) {
    const res = await fetch(`${API_BASE}/admin/flights/${id}/apply-ai-price`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ recommendedPrice })
    });
    return res.json();
  },

  async deleteFlight(id) {
    const res = await fetch(`${API_BASE}/admin/flights/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAdminBookings() {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAdminTickets() {
    const res = await fetch(`${API_BASE}/admin/tickets`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // AI & Advanced Analytics
  async getAiPricingRecommendations() {
    const res = await fetch(`${API_BASE}/admin/ai/pricing-recommendations`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAiDemandForecast() {
    const res = await fetch(`${API_BASE}/admin/ai/demand-forecast`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getRevenueAnalytics(period = 'all') {
    const res = await fetch(`${API_BASE}/admin/analytics/revenue?period=${period}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getSustainabilityAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics/sustainability`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAiOperationalInsights() {
    const res = await fetch(`${API_BASE}/admin/ai/operational-insights`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async askAiAssistant(query) {
    const res = await fetch(`${API_BASE}/admin/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async getCombinedFlightAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics/flights-combined`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // User Flights & Booking
  async searchFlights({ from, to, date, passengers }) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    if (passengers) params.append('passengers', passengers);

    const res = await fetch(`${API_BASE}/flights/search?${params.toString()}`);
    return res.json();
  },

  async getFlight(id) {
    const res = await fetch(`${API_BASE}/flights/${id}`);
    return res.json();
  },

  async createBooking(flightId, passengers) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ flightId, passengers })
    });
    return res.json();
  },

  async getMyBookings() {
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getMyTickets() {
    const res = await fetch(`${API_BASE}/tickets/my`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getTicket(id) {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  }
};
