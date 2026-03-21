import axios from 'axios';

const API_HOST = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const API_PREFIX = '/api';

const clientWithPrefix = axios.create({
  baseURL: `${API_HOST}${API_PREFIX}`,
});

const clientRoot = axios.create({
  baseURL: API_HOST,
});

const attachInterceptors = (instance) => {
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error('API Error:', err.message, err.response?.data || '');
      throw err;
    }
  );
};

attachInterceptors(clientWithPrefix);
attachInterceptors(clientRoot);

let preferredClient = clientWithPrefix;
let fallbackAttempted = false;
const LOCAL_KEY = 'wasteEntries';
const LOCAL_ID_KEY = 'wasteEntriesNextId';

const readLocalEntries = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocalEntries = (entries) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
};

const getNextId = () => {
  const raw = localStorage.getItem(LOCAL_ID_KEY);
  const next = raw ? Number(raw) : 1;
  localStorage.setItem(LOCAL_ID_KEY, String(next + 1));
  return next;
};

const isNetworkError = (err) => !err.response;

const request = async (config) => {
  try {
    return await preferredClient(config);
  } catch (err) {
    const status = err.response?.status;
    if (!fallbackAttempted && preferredClient === clientWithPrefix && status === 404) {
      fallbackAttempted = true;
      try {
        const res = await clientRoot(config);
        preferredClient = clientRoot;
        return res;
      } catch (err2) {
        throw err;
      }
    }
    throw err;
  }
};

const respond = (data) => Promise.resolve({ data });

// Auth/login - authenticate user with backend
export const login = async (role, name, password) => {
  try {
    const roleVal = role === 'family' ? 'FAMILY' : 'CENTER';
    const res = await request({
      method: 'post',
      url: '/auth/login',
      data: { username: name, password, role: roleVal },
    });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    if (!err.response || status === 404) {
      return { role, username: name };
    }
    throw err;
  }
};

// Family endpoints
export const fetchFamilyEntries = (familyName) => {
  return request({
    method: 'get',
    url: `/family/${familyName}`,
  }).catch((err) => {
    if (isNetworkError(err)) {
      const entries = readLocalEntries().filter((e) => e.familyName === familyName);
      return respond(entries);
    }
    throw err;
  });
};

export const createFamilyEntry = (payload) => {
  return request({
    method: 'post',
    url: '/family',
    data: payload,
  }).then(res => respond(res.data)).catch((err) => {
    if (isNetworkError(err)) {
      const entries = readLocalEntries();
      const newEntry = {
        id: getNextId(),
        status: 'Pending',
        ...payload,
      };
      const next = [newEntry, ...entries];
      writeLocalEntries(next);
      return respond(newEntry);
    }
    throw err;
  });
};

export const updateFamilyEntry = (id, payload) => {
  return request({
    method: 'put',
    url: `/family/${id}`,
    data: payload,
  }).catch((err) => {
    if (isNetworkError(err)) {
      const entries = readLocalEntries();
      const next = entries.map((e) => (e.id === id ? { ...e, ...payload } : e));
      writeLocalEntries(next);
      const updated = next.find((e) => e.id === id);
      return respond(updated);
    }
    throw err;
  });
};

export const deleteFamilyEntry = (id) => {
  return request({
    method: 'delete',
    url: `/family/${id}`,
  }).then(res => respond(true)).catch((err) => {
    if (isNetworkError(err)) {
      const entries = readLocalEntries();
      const next = entries.filter((e) => e.id !== id);
      writeLocalEntries(next);
      return respond(true);
    }
    throw err;
  });
};

// Center endpoints
export const fetchAllEntries = () => {
  return request({
    method: 'get',
    url: '/center',
  }).then(res => respond(res.data)).catch((err) => {
    if (isNetworkError(err)) {
      return respond(readLocalEntries());
    }
    throw err;
  });
};

export const updateEntryStatus = (id, status) => {
  return request({
    method: 'put',
    url: `/center/${id}`,
    data: { status },
  }).then(res => respond(res.data)).catch((err) => {
    if (isNetworkError(err)) {
      const entries = readLocalEntries();
      const next = entries.map((e) => (e.id === id ? { ...e, status } : e));
      const filtered = next.filter((e) => e.status !== 'Recycled');
      writeLocalEntries(filtered);
      const updated = next.find((e) => e.id === id);
      return respond(updated);
    }
    throw err;
  });
};

export const deleteEntry = (id) => {
  return request({
    method: 'delete',
    url: `/center/${id}`,
  }).then(res => respond(true)).catch((err) => {
    if (isNetworkError(err)) {
      const entries = readLocalEntries();
      const next = entries.filter((e) => e.id !== id);
      writeLocalEntries(next);
      return respond(true);
    }
    throw err;
  });
};

// Statistics endpoints
export const fetchStatistics = () => {
  return request({
    method: 'get',
    url: '/statistics',
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      // Calculate statistics from localStorage
      const entries = readLocalEntries();
      const wasteTypeCount = {};
      const wasteTypeQuantity = {};
      
      // Calculate waste type breakdown
      entries.forEach(e => {
        const type = e.wasteType || 'Unknown';
        wasteTypeCount[type] = (wasteTypeCount[type] || 0) + 1;
        wasteTypeQuantity[type] = (wasteTypeQuantity[type] || 0) + (Number(e.quantity) || 0);
      });
      
      // Helper to match status (case-insensitive)
      const matchStatus = (entry, status) => {
        return entry.status && entry.status.toUpperCase() === status.toUpperCase();
      };
      
      const stats = {
        totalEntries: entries.length,
        totalQuantity: entries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
        totalFamilies: new Set(entries.map(e => e.familyName)).size,
        pendingEntries: entries.filter(e => matchStatus(e, 'Pending')).length,
        processingEntries: entries.filter(e => matchStatus(e, 'Processing')).length,
        recycledEntries: entries.filter(e => matchStatus(e, 'Recycled')).length,
        statusQuantity: {
          PENDING: entries.filter(e => matchStatus(e, 'Pending')).reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
          PROCESSING: entries.filter(e => matchStatus(e, 'Processing')).reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
          RECYCLED: entries.filter(e => matchStatus(e, 'Recycled')).reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
        },
        wasteTypeCount,
        wasteTypeQuantity
      };
      
      return respond(stats);
    }
    throw err;
  });
};

export const fetchFamilyStatistics = (familyName) => {
  return request({
    method: 'get',
    url: `/statistics/family/${familyName}`,
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      // Calculate family statistics from localStorage
      const entries = readLocalEntries().filter(e => e.familyName === familyName);
      const wasteTypeCount = {};
      const wasteTypeQuantity = {};
      
      // Calculate waste type breakdown
      entries.forEach(e => {
        const type = e.wasteType || 'Unknown';
        wasteTypeCount[type] = (wasteTypeCount[type] || 0) + 1;
        wasteTypeQuantity[type] = (wasteTypeQuantity[type] || 0) + (Number(e.quantity) || 0);
      });
      
      // Helper to match status (case-insensitive)
      const matchStatus = (entry, status) => {
        return entry.status && entry.status.toUpperCase() === status.toUpperCase();
      };
      
      const stats = {
        totalEntries: entries.length,
        totalQuantity: entries.reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
        pendingEntries: entries.filter(e => matchStatus(e, 'Pending')).length,
        processingEntries: entries.filter(e => matchStatus(e, 'Processing')).length,
        recycledEntries: entries.filter(e => matchStatus(e, 'Recycled')).length,
        statusQuantity: {
          PENDING: entries.filter(e => matchStatus(e, 'Pending')).reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
          PROCESSING: entries.filter(e => matchStatus(e, 'Processing')).reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
          RECYCLED: entries.filter(e => matchStatus(e, 'Recycled')).reduce((sum, e) => sum + (Number(e.quantity) || 0), 0),
        },
        wasteTypeCount,
        wasteTypeQuantity
      };
      
      return respond(stats);
    }
    throw err;
  });
};

// User Management endpoints
export const fetchAllUsers = () => {
  return request({
    method: 'get',
    url: '/admin/users',
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      return respond([]);
    }
    throw err;
  });
};

export const createUser = (username, password, role) => {
  return request({
    method: 'post',
    url: '/admin/users',
    data: { username, password, role },
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      return respond({ username, role });
    }
    throw err;
  });
};

export const updateUser = (id, password, role) => {
  return request({
    method: 'put',
    url: `/admin/users/${id}`,
    data: { password, role },
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      return respond({ id });
    }
    throw err;
  });
};

export const deleteUser = (id) => {
  return request({
    method: 'delete',
    url: `/admin/users/${id}`,
  }).then(res => respond(true)).catch(err => {
    if (isNetworkError(err)) {
      return respond(true);
    }
    throw err;
  });
};

export const fetchFamilyUsers = () => {
  return request({
    method: 'get',
    url: '/admin/users/families/list',
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      return respond([]);
    }
    throw err;
  });
};

export const fetchCenterUsers = () => {
  return request({
    method: 'get',
    url: '/admin/users/centers/list',
  }).then(res => respond(res.data)).catch(err => {
    if (isNetworkError(err)) {
      return respond([]);
    }
    throw err;
  });
};

// Notification endpoints
export const sendStatusChangeNotification = (familyName, wasteType, oldStatus, newStatus) => {
  return request({
    method: 'post',
    url: '/notifications/status-change',
    data: { familyName, wasteType, oldStatus, newStatus },
  }).catch(err => {
    console.error('Failed to send notification:', err.message);
  });
};

export const sendPickupNotification = (familyName, quantity) => {
  return request({
    method: 'post',
    url: '/notifications/pickup',
    data: { familyName, quantity },
  }).catch(err => {
    console.error('Failed to send notification:', err.message);
  });
};

export const sendRecyclingCompletedNotification = (familyName, wasteType, quantity) => {
  return request({
    method: 'post',
    url: '/notifications/recycling-completed',
    data: { familyName, wasteType, quantity },
  }).catch(err => {
    console.error('Failed to send notification:', err.message);
  });
};

export default {
  login,
  fetchFamilyEntries,
  createFamilyEntry,
  updateFamilyEntry,
  deleteFamilyEntry,
  fetchAllEntries,
  updateEntryStatus,
  deleteEntry,
  fetchStatistics,
  fetchFamilyStatistics,
  fetchAllUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchFamilyUsers,
  fetchCenterUsers,
  sendStatusChangeNotification,
  sendPickupNotification,
  sendRecyclingCompletedNotification,
};
