'use client';
import { useState, useEffect } from 'react';
import { applicationApi } from '@/lib/api';

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

        const params = {
          page,
          limit,
          search: query || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        };

        const resData = await applicationApi.getAll(params);
        
        // The backend returns { success: true, data: { data: [...], pagination: {...} } }
        const payloadData = resData.data || {};
        
        setApplications(payloadData.data || []);
        setTotalItems(payloadData.pagination?.total || payloadData.data?.length || 0);
        setData(payloadData.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch applications');
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
