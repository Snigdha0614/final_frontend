// Centralized API client for TalentTrade

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || '/api'
).replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('talenttrade_token');

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: 'Be' + 'arer ' + token } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (
    options.body &&
    typeof options.body === 'object' &&
    !(options.body instanceof FormData)
  ) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('text/html')) {
    throw new Error(
      'The API returned a webpage instead of data. Check VITE_API_BASE_URL.'
    );
  }

  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      (typeof data === 'string' && data) ||
      'Request failed';

    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: credentials }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: data }),

  getMe: () => request('/auth/me'),

  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams();

    if (params.category) query.append('category', params.category);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return request(`/services${qs ? `?${qs}` : ''}`);
  },

  getServiceById: (id) => request(`/services/${id}`),

  getCategories: () => request('/services/categories'),

  createService: (data) =>
    request('/services', { method: 'POST', body: data }),

  updateService: (id, data) =>
    request(`/services/${id}`, { method: 'PUT', body: data }),

  deleteService: (id) =>
    request(`/services/${id}`, { method: 'DELETE' }),

  // Freelancers & Profile
  getFreelancers: (search) =>
    request(
      `/freelancers${search ? `?search=${encodeURIComponent(search)}` : ''}`
    ),

  getFreelancerById: (id) => request(`/freelancers/${id}`),

  getUserById: (id) => request(`/users/${id}`),

  updateProfile: (data) =>
    request('/profile', { method: 'PUT', body: data }),

  addSkill: (data) =>
    request('/profile/skills', { method: 'POST', body: data }),

  deleteSkill: (id) =>
    request(`/profile/skills/${id}`, { method: 'DELETE' }),

  addCertification: (data) =>
    request('/profile/certifications', { method: 'POST', body: data }),

  deleteCertification: (id) =>
    request(`/profile/certifications/${id}`, { method: 'DELETE' }),

  addPortfolioItem: (data) =>
    request('/profile/portfolio', { method: 'POST', body: data }),

  deletePortfolioItem: (id) =>
    request(`/profile/portfolio/${id}`, { method: 'DELETE' }),

  // Projects
  getProjects: (params = {}) => {
    const query = new URLSearchParams();

    if (params.category) query.append('category', params.category);
    if (params.budgetType) query.append('budgetType', params.budgetType);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return request(`/projects${qs ? `?${qs}` : ''}`);
  },

  getProjectById: (id) => request(`/projects/${id}`),

  createProject: (data) =>
    request('/projects', { method: 'POST', body: data }),

  submitProposal: (projectId, data) =>
    request(`/projects/${projectId}/proposals`, {
      method: 'POST',
      body: data
    }),

  getProjectProposals: (projectId) =>
    request(`/projects/${projectId}/proposals`),

  acceptProposal: (projectId, proposalId) =>
    request(`/projects/${projectId}/proposals/${proposalId}/accept`, {
      method: 'POST'
    }),

  rejectProposal: (projectId, proposalId) =>
    request(`/projects/${projectId}/proposals/${proposalId}/reject`, {
      method: 'POST'
    }),

  // Skill Exchanges
  getExchanges: (params = {}) => {
    const query = new URLSearchParams();

    if (params.status) query.append('status', params.status);
    if (params.type) query.append('type', params.type);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return request(`/exchanges${qs ? `?${qs}` : ''}`);
  },

  getMyExchanges: () => request('/exchanges/my'),

  getExchangeById: (id) => request(`/exchanges/${id}`),

  createExchange: (data) =>
    request('/exchanges', { method: 'POST', body: data }),

  submitCounterOffer: (id, data) =>
    request(`/exchanges/${id}/counter`, { method: 'POST', body: data }),

  getCounterOffers: (id) => request(`/exchanges/${id}/counters`),

  acceptExchange: (id) =>
    request(`/exchanges/${id}/accept`, { method: 'POST' }),

  rejectExchange: (id) =>
    request(`/exchanges/${id}/reject`, { method: 'POST' }),

  completeExchange: (id) =>
    request(`/exchanges/${id}/complete`, { method: 'POST' }),

  // Workspaces
  getUserWorkspaces: () => request('/workspaces'),

  getWorkspaceById: (id) => request(`/workspaces/${id}`),

  orderServiceDirect: (serviceId) =>
    request(`/workspaces/order-service/${serviceId}`, { method: 'POST' }),

  getWorkspaceTasks: (id) => request(`/workspaces/${id}/tasks`),

  createWorkspaceTask: (id, data) =>
    request(`/workspaces/${id}/tasks`, { method: 'POST', body: data }),

  updateTaskStatus: (taskId, status) =>
    request(`/workspaces/tasks/${taskId}/status`, {
      method: 'PUT',
      body: { status }
    }),

  getWorkspaceMessages: (id) => request(`/workspaces/${id}/messages`),

  sendWorkspaceMessage: (id, data) =>
    request(`/workspaces/${id}/messages`, { method: 'POST', body: data }),

  getWorkspaceSubmissions: (id) =>
    request(`/workspaces/${id}/submissions`),

  submitWork: (id, data) =>
    request(`/workspaces/${id}/submissions`, { method: 'POST', body: data }),

  reviewSubmission: (id, subId, data) =>
    request(`/workspaces/${id}/submissions/${subId}/review`, {
      method: 'POST',
      body: data
    }),

  updateProgress: (id, progressPercent) =>
    request(`/workspaces/${id}/progress`, {
      method: 'PUT',
      body: { progressPercent }
    }),

  // Wallet
  getWallet: () => request('/wallet'),

  getTransactions: () => request('/wallet/transactions'),

  depositFunds: (data) =>
    request('/wallet/deposit', { method: 'POST', body: data }),

  withdrawFunds: (data) =>
    request('/wallet/withdraw', { method: 'POST', body: data }),

  // Reviews
  getReviewsForUser: (userId) => request(`/reviews/user/${userId}`),

  getReviewsForService: (serviceId) =>
    request(`/reviews/service/${serviceId}`),

  createReview: (data) =>
    request('/reviews', { method: 'POST', body: data }),

  // Disputes
  getMyDisputes: () => request('/disputes/my'),

  getAllDisputes: () => request('/disputes/admin'),

  createDispute: (data) =>
    request('/disputes', { method: 'POST', body: data }),

  resolveDispute: (id, data) =>
    request(`/disputes/${id}/resolve`, { method: 'POST', body: data }),

  // Notifications
  getNotifications: () => request('/notifications'),

  getUnreadNotificationCount: () =>
    request('/notifications/unread-count'),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }),

  markAllNotificationsRead: () =>
    request('/notifications/read-all', { method: 'PUT' }),

  // Wishlist
  getWishlist: () => request('/wishlist'),

  toggleServiceWishlist: (serviceId) =>
    request(`/wishlist/service/${serviceId}`, { method: 'POST' }),

  toggleProjectWishlist: (projectId) =>
    request(`/wishlist/project/${projectId}`, { method: 'POST' }),

  // Admin
  getAdminStats: () => request('/admin/stats'),

  getAdminUsers: () => request('/admin/users'),

  toggleUserStatus: (id) =>
    request(`/admin/users/${id}/toggle-status`, { method: 'PUT' }),

  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role?role=${encodeURIComponent(role)}`, {
      method: 'PUT'
    }),

  getAdminServices: () => request('/admin/services'),

  toggleServiceStatus: (id) =>
    request(`/admin/services/${id}/toggle-status`, { method: 'PUT' }),

  getAdminProjects: () => request('/admin/projects'),

  getAdminExchanges: () => request('/admin/exchanges'),

  // File Upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return request('/upload', {
      method: 'POST',
      body: formData
    }).then((upload) => {
      if (!upload?.url) {
        throw new Error('The upload response did not contain a file URL.');
      }

      return {
        ...upload,
        url: new URL(
          upload.url,
          `${BASE_URL.startsWith('http')
            ? BASE_URL
            : window.location.origin + BASE_URL}/`
        ).href
      };
    });
  }
};
