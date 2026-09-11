import { useState, useEffect } from 'react';
import API from '../api';
import snapshot from '../data/portfolio.json';

/**
 * Renders from a build-time snapshot immediately, then refreshes from the API
 * in the background. The API is an Azure App Service that can cold-start, so
 * blocking first paint on it meant visitors saw a spinner — or a "Connection
 * Notice" error screen — for content that never actually changes between
 * deploys. Refresh the snapshot with `npm run sync:data`.
 */
export default function usePortfolioData() {
  const [data, setData] = useState(snapshot);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    API.get('/api/portfolio', { signal: controller.signal })
      .then((response) => {
        if (response.data?.success && response.data.data?.personalInfo?.name) {
          setData(response.data.data);
          setIsLive(true);
        }
      })
      .catch((err) => {
        if (err.name === 'CanceledError') return;
        // Non-fatal by design: the snapshot is already on screen.
        console.warn('Live portfolio fetch failed, showing snapshot:', err.message);
      });

    return () => controller.abort();
  }, []);

  // `loading` and `error` are kept in the shape callers already expect, but
  // both are now permanently false — there is always something to render.
  return { data, loading: false, error: null, isLive };
}
