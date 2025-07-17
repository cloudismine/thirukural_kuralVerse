import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { kuralAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  Eye
} from 'lucide-react';

const KuralList = () => {
  const [kurals, setKurals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    paal: '',
    adhigaram: '',
    sortBy: 'number',
    sortOrder: 'asc'
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const { isTamil } = useTheme();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 12;

  useEffect(() => {
    fetchKurals();
  }, [currentPage, limit, filters]);

  const fetchKurals = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await kuralAPI.getKurals(params);
      setKurals(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch kurals');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    // Reset to page 1 when filters change
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    setSearchParams(params);
  };

  const categories = [
    { value: '', label: isTamil ? 'அனைத்து பால்கள்' : 'All Categories' },
    { value: 'அறம்', label: isTamil ? 'அறம்' : 'Virtue (அறம்)' },
    { value: 'பொருள்', label: isTamil ? 'பொருள்' : 'Wealth (பொருள்)' },
    { value: 'இன்பம்', label: isTamil ? 'இன்பம்' : 'Love (இன்பம்)' }
  ];

  const sortOptions = [
    { value: 'number-asc', label: isTamil ? 'குறள் எண் (ஏறுவரிசை)' : 'Kural Number (Ascending)' },
    { value: 'number-desc', label: isTamil ? 'குறள் எண் (இறங்குவரிசை)' : 'Kural Number (Descending)' },
    { value: 'adhigaram-asc', label: isTamil ? 'அதிகாரம் (ஏறுவரிசை)' : 'Chapter (Ascending)' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={isTamil ? 'குறள்கள் ஏற்றுகிறது...' : 'Loading Kurals...'} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchKurals}
            className="btn-primary btn-md"
          >
            {isTamil ? 'மீண்டும் முயற்சி' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-manuscript-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tamil-800 mb-4 font-catamaran-bold">
            {isTamil ? 'திருக்குறள் தொகுப்பு' : 'Thirukkural Collection'}
          </h1>
          <p className="text-sandalwood-600 text-lg font-catamaran">
            {isTamil
              ? `மொத்தம் ${pagination.totalItems || 1330} குறள்கள்`
              : `Explore all ${pagination.totalItems || 1330} Kurals`
            }
          </p>
          <div className="tamil-divider mt-6"></div>
        </div>

        {/* Filters */}
        <div className="bg-manuscript-50 border-2 border-sandalwood-500 rounded-lg shadow-lg mb-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary-600 animate-pulse" />
              <h3 className="font-semibold gradient-text">
                {isTamil ? 'வடிகட்டல்' : 'Filters'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isTamil ? 'பால்' : 'Category'}
                </label>
                <select
                  value={filters.paal}
                  onChange={(e) => handleFilterChange('paal', e.target.value)}
                  className="input w-full"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isTamil ? 'வரிசைப்படுத்து' : 'Sort By'}
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="input w-full"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items per page */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isTamil ? 'ஒரு பக்கத்தில்' : 'Items per page'}
                </label>
                <select
                  value={limit}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('limit', e.target.value);
                    params.set('page', '1');
                    setSearchParams(params);
                  }}
                  className="input w-full"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Kurals Grid - Two columns for desktop, one for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
          {kurals.map((kural) => (
            <KuralCard key={kural._id} kural={kural} isTamil={isTamil} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="btn-outline btn-md disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {isTamil ? 'முந்தைய' : 'Previous'}
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-md ${
                      pageNum === currentPage
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="btn-outline btn-md disabled:opacity-50"
            >
              {isTamil ? 'அடுத்த' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}

        {/* Results Info */}
        <div className="text-center text-muted-foreground mt-4">
          {isTamil ? (
            <>
              பக்கம் {pagination.currentPage} / {pagination.totalPages}
              (மொத்தம் {pagination.totalItems} குறள்கள்)
            </>
          ) : (
            <>
              Page {pagination.currentPage} of {pagination.totalPages}
              ({pagination.totalItems} total kurals)
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Kural Card Component
const KuralCard = ({ kural, isTamil }) => {
  return (
    <Link to={`/kural/${kural.number}`} className="group">
      <div className="kural-box hover:shadow-lg transition-all duration-200 hover:margin-top-[-2px] h-full">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-saffron-600 font-medium font-catamaran-medium">
                {isTamil ? 'குறள்' : 'Kural'} {kural.number}
              </div>
              <div className="text-xs text-sandalwood-600 font-catamaran">
                {kural.adhigaram}
              </div>
            </div>
            <div className="text-xs bg-sandalwood-100 text-sandalwood-700 px-2 py-1 rounded border border-sandalwood-300 font-catamaran">
              <span className="mr-1">
                {kural.paal === 'அறம்' && '🪔'}
                {kural.paal === 'பொருள்' && '👑'}
                {kural.paal === 'இன்பம்' && '❤️'}
              </span>
              {kural.paal}
            </div>
          </div>

          {/* Kural Text */}
          <div className="text-center mb-4 text-tamil-800 font-catamaran-medium">
            <div className="text-base leading-relaxed">{kural.line1}</div>
            <div className="text-base leading-relaxed">{kural.line2}</div>
          </div>

          {/* Meaning */}
          <p className="text-sm line-clamp-3 text-tamil-700 font-catamaran">
            {isTamil ? kural.meaning_ta : kural.meaning_en}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-sandalwood-300">
            <div className="flex items-center space-x-4 text-xs text-sandalwood-600">
              <div className="flex items-center font-catamaran">
                <Eye className="w-3 h-3 mr-1" />
                {kural.metadata?.views || 0}
              </div>
              <div className="flex items-center font-catamaran">
                <Heart className="w-3 h-3 mr-1" />
                {kural.metadata?.favorites_count || 0}
              </div>
            </div>
            <BookOpen className="w-4 h-4 text-saffron-600 group-hover:text-saffron-700" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default KuralList;
