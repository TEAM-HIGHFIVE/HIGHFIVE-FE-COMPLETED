const SERVER_URL = "https://api.highfive.p-e.kr/";
const API_URL = `${SERVER_URL}/`;

const requestFetch = async (
  url: string,
  method: string,
  data?: object,
  option?: Record<string, string>,
) => {
  const token = localStorage.getItem('token') || '';
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    ...(data ? { 'Content-Type': 'application/json' } : {}),
    ...option,
  });

  const fullUrl = `${API_URL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      // credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

// POST 요청
export const requestPostFetch = async (url: string, data: object) => {
  return await requestFetch(url, 'POST', data, {
    'Content-Type': 'application/json',
  });
};

// PUT 요청
export const requestPutFetch = async (url: string, data: object) => {
  return await requestFetch(url, 'PUT', data, {
    'Content-Type': 'application/json',
  });
};

// GET 요청
export const requestGetFetch = async (url: string) => {
  return await requestFetch(url, 'GET');
};

// DELETE 요청
export const requestDeleteFetch = async (url: string) => {
  return await requestFetch(url, 'DELETE');
};

// PATCH 요청
export const requestPatchFetch = async (url: string, data: object) => {
  return await requestFetch(url, 'PATCH', data, {
    'Content-Type': 'application/json',
  });
};

