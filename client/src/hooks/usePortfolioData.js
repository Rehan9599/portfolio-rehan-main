import snapshot from '../data/portfolio.json';

/**
 * Portfolio content is versioned with the frontend, so it must not be replaced
 * by stale API data from a previous deployment.
 */
export default function usePortfolioData() {
  return { data: snapshot, loading: false, error: null, isLive: false };
}
