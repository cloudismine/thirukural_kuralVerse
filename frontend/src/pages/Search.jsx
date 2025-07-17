import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { kuralAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search as SearchIcon,
  Filter,
  BookOpen,
  Heart,
  Eye,
  X
} from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isTamil } = useTheme();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    paal: searchParams.get('paal') || '',
    adhigaram: searchParams.get('adhigaram') || ''
  });

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    // Check if query is a number - if so, navigate directly to kural
    const queryNumber = parseInt(searchQuery.trim());
    if (!isNaN(queryNumber) && queryNumber >= 1 && queryNumber <= 1330) {
      navigate(`/kural/${queryNumber}`);
      return;
    }

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

      const response = await kuralAPI.searchKurals(searchQuery, params);

      // Handle direct match from backend
      if (response.data.isDirectMatch && response.data.data.length === 1) {
        navigate(`/kural/${response.data.data[0].number}`);
        return;
      }

      setResults(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set('q', query.trim());
    params.set('page', '1');

    // Add filters if they exist
    if (filters.paal) params.set('paal', filters.paal);
    if (filters.adhigaram) params.set('adhigaram', filters.adhigaram);

    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('q', query.trim());
      params.set('page', '1');

      if (newFilters.paal) params.set('paal', newFilters.paal);
      if (newFilters.adhigaram) params.set('adhigaram', newFilters.adhigaram);

      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    setFilters({ paal: '', adhigaram: '' });
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('q', query.trim());
      params.set('page', '1');
      setSearchParams(params);
    }
  };

  const categories = [
    { value: '', label: isTamil ? 'அனைத்து பால்கள்' : 'All Categories' },
    { value: 'அறம்', label: isTamil ? 'அறம்' : 'Virtue (அறம்)' },
    { value: 'பொருள்', label: isTamil ? 'பொருள்' : 'Wealth (பொருள்)' },
    { value: 'இன்பம்', label: isTamil ? 'இன்பம்' : 'Love (இன்பம்)' }
  ];

  const hasActiveFilters = filters.paal || filters.adhigaram;

  return (
    <div className="min-h-screen bg-manuscript-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tamil-800 mb-4 font-catamaran-bold">
            {isTamil ? 'குறள் தேடல்' : 'Search Kurals'}
          </h1>
          <p className="text-sandalwood-600 text-lg font-catamaran">
            {isTamil
              ? 'குறள் எண், உள்ளடக்கம் அல்லது பொருள் மூலம் தேடுங்கள்'
              : 'Search by Kural number, content, or meaning'
            }
          </p>
          <div className="tamil-divider mt-6"></div>
        </div>

        {/* Search Form */}
        <div className="bg-manuscript-50 border-2 border-sandalwood-500 rounded-lg shadow-lg mb-8">
          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search */}
              <div className="relative max-w-lg mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sandalwood-600 w-5 h-5 z-10" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isTamil
                    ? 'குறள் எண், தமிழ் அல்லது ஆங்கில உள்ளடக்கம்...'
                    : 'Kural number, Tamil or English content...'
                  }
                  className="w-full pr-24 py-3 text-lg border-2 border-sandalwood-500 rounded-lg bg-manuscript-50 text-tamil-800 placeholder-sandalwood-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 font-catamaran shadow-sm"
                  style={{ paddingLeft: '48px', maxWidth: '400px' }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 transition-colors duration-200 font-catamaran-medium shadow-sm"
                >
                  {isTamil ? 'தேடு' : 'Search'}
                </button>
              </div>

              {/* Filters */}
              <div className="border-t border-sandalwood-300 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-saffron-600" />
                  <h3 className="font-semibold text-tamil-800 font-catamaran-semibold">
                    {isTamil ? 'வடிகட்டல்' : 'Filters'}
                  </h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-catamaran"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {isTamil ? 'அழி' : 'Clear'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-tamil-700 font-catamaran-medium">
                      {isTamil ? 'பால்' : 'Category'}
                    </label>
                    <select
                      value={filters.paal}
                      onChange={(e) => handleFilterChange('paal', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-sandalwood-300 rounded-md bg-white text-tamil-800 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent font-catamaran"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chapter Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-tamil-700 font-catamaran-medium">
                      {isTamil ? 'அதிகாரம்' : 'Chapter'}
                    </label>
                    <input
                      type="text"
                      value={filters.adhigaram}
                      onChange={(e) => handleFilterChange('adhigaram', e.target.value)}
                      placeholder={isTamil ? 'அதிகார பெயர்...' : 'Chapter name...'}
                      className="w-full px-3 py-2 border-2 border-sandalwood-300 rounded-md bg-white text-tamil-800 placeholder-sandalwood-600 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent font-catamaran"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" text={isTamil ? 'தேடுகிறது...' : 'Searching...'} />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4 font-catamaran">{error}</div>
            <button
              onClick={() => performSearch()}
              className="px-4 py-2 bg-saffron-600 text-white rounded-md hover:bg-saffron-700 transition-colors duration-200 font-catamaran-medium"
            >
              {isTamil ? 'மீண்டும் முயற்சி' : 'Try Again'}
            </button>
          </div>
        )}

        {!loading && !error && query && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-tamil-800 font-catamaran-semibold">
                {isTamil ? 'தேடல் முடிவுகள்' : 'Search Results'}
              </h2>
              <p className="text-sandalwood-600 font-catamaran">
                {results.length > 0 ? (
                  isTamil ? (
                    <>"{query}" க்கான {pagination.totalItems} முடிவுகள் கிடைத்தன</>
                  ) : (
                    <>Found {pagination.totalItems} results for "{query}"</>
                  )
                ) : (
                  isTamil ? (
                    <>"{query}" க்கான முடிவுகள் கிடைக்கவில்லை</>
                  ) : (
                    <>No results found for "{query}"</>
                  )
                )}
              </p>
            </div>

            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((kural) => (
                  <SearchResultCard key={kural._id} kural={kural} isTamil={isTamil} query={query} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {isTamil ? 'முடிவுகள் இல்லை' : 'No Results Found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isTamil
                    ? 'வேறு முக்கிய வார்த்தைகளை முயற்சிக்கவும்'
                    : 'Try different keywords or check your spelling'
                  }
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{isTamil ? 'தேடல் குறிப்புகள்:' : 'Search tips:'}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{isTamil ? 'குறள் எண் (எ.கா: 1, 100)' : 'Kural number (e.g: 1, 100)'}</li>
                    <li>{isTamil ? 'தமிழ் வார்த்தைகள் (எ.கா: அறம், காதல்)' : 'Tamil words (e.g: அறம், காதல்)'}</li>
                    <li>{isTamil ? 'ஆங்கில வார்த்தைகள் (எ.கா: virtue, love)' : 'English words (e.g: virtue, love)'}</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!query && !loading && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isTamil ? 'குறள் தேடலைத் தொடங்குங்கள்' : 'Start Your Kural Search'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isTamil
                ? 'மேலே உள்ள தேடல் பெட்டியில் குறள் எண் அல்லது உள்ளடக்கத்தை உள்ளிடவும்'
                : 'Enter a Kural number or content in the search box above'
              }
            </p>

            {/* Popular Searches */}
            <div className="max-w-md mx-auto">
              <h4 className="font-medium mb-3 text-tamil-800 font-catamaran-medium">
                {isTamil ? 'பிரபலமான தேடல்கள்:' : 'Popular searches:'}
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {['அறம்', 'காதல்', 'virtue', 'love', '1', '100'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      const params = new URLSearchParams();
                      params.set('q', term);
                      params.set('page', '1');
                      setSearchParams(params);
                    }}
                    className="px-3 py-1 bg-sandalwood-100 text-sandalwood-700 rounded-full text-sm hover:bg-sandalwood-200 transition-colors border border-sandalwood-300 font-catamaran"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Search Result Card Component
const SearchResultCard = ({ kural, isTamil, query }) => {
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

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
            <div className="text-base leading-relaxed">{highlightText(kural.line1, query)}</div>
            <div className="text-base leading-relaxed">{highlightText(kural.line2, query)}</div>
          </div>

          {/* Meaning */}
          <p className="text-sm line-clamp-3 text-tamil-700 font-catamaran">
            {highlightText(
              isTamil ? kural.meaning_ta : kural.meaning_en,
              query
            )}
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

export default Search;
