import { useState, useEffect } from 'react';
import API from '../api';

export default function usePortfolioData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/portfolio');
        if (response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error('Failed to fetch portfolio data');
        }
      } catch (err) {
        console.error('Portfolio data fetch error:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
