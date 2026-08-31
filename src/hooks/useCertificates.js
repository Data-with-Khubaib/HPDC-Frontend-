'use client';
import { useState, useEffect } from 'react';
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

        const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
        const response = await fetch(
          `https://6a9523f70e895b145e5fb03b.mockapi.io/Certificates?page=${page}&limit=${limit}&search=${query}${statusParam}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch certificates data');
        }

        const data = await response.json();

        setCertificates(data);
        const totalResponse = await fetch(`https://6a9523f70e895b145e5fb03b.mockapi.io/Certificates`);
        const allData = await totalResponse.json();
        setTotalItems(allData.length);
        setData(allData);
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
