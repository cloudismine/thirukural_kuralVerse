import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Heart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
  Eye
} from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();
  const { isTamil } = useTheme();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  useEffect(() => {
    fetchFavorites();
  }, [currentPage]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.getFavorites({
        page: currentPage,
        limit
      });

      setFavorites(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (kuralNumber) => {
    try {
      await userAPI.removeFavorite(kuralNumber);
      // Remove from local state
      setFavorites(prev => prev.filter(kural => kural.number !== kuralNumber));

      // Update pagination if needed
      if (favorites.length === 1 && currentPage > 1) {
        const params = new URLSearchParams(searchParams);
        params.set('page', (currentPage - 1).toString());
        setSearchParams(params);
      } else {
        fetchFavorites();
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={isTamil ? 'விருப்பங்கள் ஏற்றுகிறது...' : 'Loading favorites...'} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={fetchFavorites}
            className="btn-primary btn-md"
          >
            {isTamil ? 'மீண்டும் முயற்சி' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 mr-4" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                {isTamil ? 'விருப்பமான குறள்கள்' : 'Favorite Kurals'}
              </h1>
              <p className="text-muted-foreground">
                {favorites.length > 0 ? (
                  isTamil ? (
                    <>உங்கள் {pagination.totalItems} விருப்பமான குறள்கள்</>
                  ) : (
                    <>Your {pagination.totalItems} favorite kurals</>
                  )
                ) : (
                  isTamil ? 'இன்னும் விருப்பங்கள் இல்லை' : 'No favorites yet'
                )}
              </p>
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">
              {isTamil ? 'விருப்பமான குறள்கள் இல்லை' : 'No Favorite Kurals Yet'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isTamil
                ? 'குறள்களைப் படித்து ❤️ பொத்தானைக் கிளிக் செய்து உங்கள் விருப்பமான குறள்களைச் சேமிக்கவும்.'
                : 'Start reading Kurals and click the ❤️ button to save your favorites.'
              }
            </p>
            <div className="space-y-4">
              <Link to="/kurals" className="btn-primary btn-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                {isTamil ? 'குறள்களை ஆராயுங்கள்' : 'Explore Kurals'}
              </Link>
              <div>
                <Link to="/chat" className="btn-outline btn-md">
                  {isTamil ? 'வள்ளுவருடன் பேசுங்கள்' : 'Chat with Valluvar'}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {favorites.map((kural) => (
                <FavoriteKuralCard
                  key={kural._id}
                  kural={kural}
                  isTamil={isTamil}
                  onRemove={handleRemoveFavorite}
                />
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
                  (மொத்தம் {pagination.totalItems} விருப்பங்கள்)
                </>
              ) : (
                <>
                  Page {pagination.currentPage} of {pagination.totalPages}
                  ({pagination.totalItems} total favorites)
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Favorite Kural Card Component
const FavoriteKuralCard = ({ kural, isTamil, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (removing) return;

    setRemoving(true);
    try {
      await onRemove(kural.number);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="group relative">
      <Link to={`/kural/${kural.number}`}>
        <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105 h-full">
          <div className="card-content">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-primary-600 font-medium">
                  {isTamil ? 'குறள்' : 'Kural'} {kural.number}
                </div>
                <div className="text-xs text-muted-foreground">
                  {kural.adhigaram}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {kural.paal}
                </div>
                <button
                  onClick={handleRemove}
                  disabled={removing}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                  title={isTamil ? 'விருப்பத்திலிருந்து நீக்கு' : 'Remove from favorites'}
                >
                  {removing ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Kural Text */}
            <div className="kural-text text-center mb-4 text-primary-800">
              {kural.line1}<br />
              {kural.line2}
            </div>

            {/* Meaning */}
            <p className="kural-meaning text-sm line-clamp-3 mb-4">
              {isTamil ? kural.meaning_ta : kural.meaning_en}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {kural.metadata?.views || 0}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{isTamil ? 'சேர்க்கப்பட்டது' : 'Added'}</span>
                </div>
              </div>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Favorites;
