'use client';
import { useState, useEffect } from 'react';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError(null);

        const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
        const response = await fetch(
          `https://6a9523f70e895b145e5fb03b.mockapi.io/Applications?page=${page}&limit=${limit}&search=${query}${statusParam}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch applications data');
        }

        const resData = await response.json();
        setApplications(resData);

        const totalResponse = await fetch(`https://6a9523f70e895b145e5fb03b.mockapi.io/Applications`);
        const allData = await totalResponse.json();
        setTotalItems(allData.length);
        setData(allData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [page, limit, query, statusFilter]);

  return {
    applications,
    data,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    totalItems,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    recentApplications: applications.slice(0, 5),
  };
}
