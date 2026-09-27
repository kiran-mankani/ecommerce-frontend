import axios from 'axios';
import { tokenStore } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Call once on app startup. If we have a refresh token but no valid access token,
 * try to silently get a new access token. Returns true if session is alive.
 */
export const bootstrapAuth = async () => {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
    tokenStore.set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
};