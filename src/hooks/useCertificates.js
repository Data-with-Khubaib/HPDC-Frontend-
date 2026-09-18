'use client';
import { useState, useEffect } from 'react';
import { certificateApi } from '@/lib/api';
const certificatesCache = {};

export function useCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0); // MockAPI Total Items Count

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState([]);

  const applyAdvancedFilters = ({ status }) => {
    if (status !== undefined) setStatusFilter(status);
    setPage(1);
  };

  useEffect(() => {
    async function fetchCertificates() {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          limit,
          search: query || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        };

        const resData = await certificateApi.getAll(params);
        
        const payloadData = resData.data || {};
        
        setCertificates(payloadData.data || []);
        setTotalItems(payloadData.pagination?.total || payloadData.data?.length || 0);
        setData(payloadData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, [page, limit, query, statusFilter]);

  return {
    data,
    certificates,
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
    applyAdvancedFilters,
  };
}
