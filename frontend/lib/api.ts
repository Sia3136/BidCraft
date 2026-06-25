const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle No Content
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any, options?: RequestInit) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' }),
};

// Strong-typed endpoints
export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  googleLogin: (data: any) => api.post('/auth/google', data),
  me: () => api.get('/auth/me'),
  sendVerification: () => api.post('/auth/send-verification', {}),
  verifyEmail: (code: string) => api.post('/auth/verify-email', { code }),
};

export const profileApi = {
  getOwn: () => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
  getPublic: (id: string) => api.get(`/users/${id}`),
  submitKyc: (data: { document_type: string; document_url: string; pan_number: string; bank_account_number: string; bank_ifsc: string }) => api.post('/profile/kyc', data),
};

export const listingsApi = {
  list: (params?: string) => api.get(`/listings${params ? `?${params}` : ''}`),
  get: (id: string) => api.get(`/listings/${id}`),
  create: (data: any) => api.post('/listings', data),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
};

export const auctionsApi = {
  list: (params?: string) => api.get(`/auctions${params ? `?${params}` : ''}`),
  get: (id: string) => api.get(`/auctions/${id}`),
  create: (data: any) => api.post('/auctions', data),
  placeBid: (id: string, bidAmount: number) => api.post(`/auctions/${id}/bids`, { bid_amount: bidAmount }),
  cancel: (id: string) => api.put(`/auctions/${id}/cancel`, {}),
};

export const ordersApi = {
  create: (listingId: number) => api.post('/orders', { listing_id: listingId }),
  list: (params?: string) => api.get(`/orders${params ? `?${params}` : ''}`),
  get: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export const followsApi = {
  follow: (sellerId: string) => api.post(`/users/${sellerId}/follow`, {}),
  unfollow: (sellerId: string) => api.delete(`/users/${sellerId}/follow`),
  getFollowers: (sellerId: string) => api.get(`/users/${sellerId}/followers`),
  getFollowing: () => api.get('/me/following'),
};



export const paymentsApi = {
  createOrder: (orderId: number) => api.post('/payments/create-order', { order_id: orderId }),
  createSetupOrder: () => api.post('/payments/create-setup-order', {}),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; order_id: number }) =>
    api.post('/payments/verify', data),
  saveCard: (razorpayPaymentId: string) => api.post('/payments/save-card', { razorpay_payment_id: razorpayPaymentId }),
};

export const wishlistApi = {
  list: () => api.get('/wishlist'),
  add: (listingId: string) => api.post(`/wishlist/${listingId}`, {}),
  remove: (listingId: string) => api.delete(`/wishlist/${listingId}`),
};

export const notificationsApi = {
  list: () => api.get('/notifications'),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`, {}),
  markAllRead: () => api.patch('/notifications/read-all', {}),
};

export const adminApi = {
  getDisputes: () => api.get('/admin/disputes'),
  resolveDispute: (id: string, resolution: string, action: 'refund' | 'release' | 'dismiss') => 
    api.patch(`/admin/disputes/${id}/resolve`, { resolution, action }),
};

