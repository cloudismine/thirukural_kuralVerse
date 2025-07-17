import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { kuralAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ThiruvalluvarImage from '../components/ThiruvalluvarImage';
import {
  BookOpen,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const CategoryView = () => {
  const { paal, adhigaram } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isTamil } = useTheme();

  const [kurals, setKurals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  // Decode URL parameters
  const decodedPaal = paal ? decodeURIComponent(paal) : null;
  const decodedAdhigaram = adhigaram ? decodeURIComponent(adhigaram) : null;

  const categoryInfo = {
    'அறம்': {
      nameEn: 'Virtue',
      description: isTamil
        ? 'நல்லொழுக்கம், அறநெறி, ஒழுக்கம் பற்றிய குறள்கள்'
        : 'Kurals about ethics, righteousness, and moral conduct',
      color: 'text-saffron-600',
      bgColor: 'bg-manuscript-50',
      borderColor: 'border-sandalwood-300',
      icon: '🪔',
      totalKurals: 380
    },
    'பொருள்': {
      nameEn: 'Wealth',
      description: isTamil
        ? 'செல்வம், அரசியல், பொருளாதாரம் பற்றிய குறள்கள்'
        : 'Kurals about prosperity, governance, and economics',
      color: 'text-royal-600',
      bgColor: 'bg-manuscript-50',
      borderColor: 'border-sandalwood-300',
      icon: '👑',
      totalKurals: 700
    },
    'இன்பம்': {
      nameEn: 'Love',
      description: isTamil
        ? 'காதல், இன்பம், உறவுகள் பற்றிய குறள்கள்'
        : 'Kurals about love, pleasure, and relationships',
      color: 'text-sandalwood-600',
      bgColor: 'bg-manuscript-50',
      borderColor: 'border-sandalwood-300',
      icon: '❤️',
      totalKurals: 250
    }
  };

  const currentCategory = categoryInfo[decodedPaal];
  const isAdhigaramView = !!decodedAdhigaram;

  useEffect(() => {
    fetchKurals();
  }, [decodedPaal, decodedAdhigaram, currentPage]);

  const fetchKurals = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit
      };

      let response;
      if (isAdhigaramView) {
        response = await kuralAPI.getKuralsByAdhigaram(decodedAdhigaram, params);
      } else {
        response = await kuralAPI.getKuralsByPaal(decodedPaal, params);
      }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={isTamil ? 'குறள்கள் ஏற்றுகிறது...' : 'Loading kurals...'} />
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
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to={isAdhigaramView ? `/category/${encodeURIComponent(decodedPaal)}` : '/kurals'}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-tamil-700 hover:text-sandalwood-500 hover:bg-manuscript-100 rounded-md transition-colors duration-200 border border-transparent hover:border-sandalwood-300 font-catamaran"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isTamil ? 'பின்செல்' : 'Back'}
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          {currentCategory && !isAdhigaramView && (
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-sandalwood-500 flex items-center justify-center text-4xl shadow-lg">
              {currentCategory.icon}
            </div>
          )}

          <h1 className="text-4xl font-bold text-tamil-800 mb-4 font-catamaran-bold">
            {isAdhigaramView ? (
              <>
                {decodedAdhigaram}
                <div className="text-lg text-sandalwood-600 mt-2 font-catamaran">
                  {decodedPaal} {isTamil ? 'பாலின் அதிகாரம்' : 'Chapter'}
                </div>
              </>
            ) : (
              <>
                {isTamil ? decodedPaal : currentCategory?.nameEn}
                <div className="text-lg text-sandalwood-600 mt-2 font-catamaran">
                  {isTamil ? 'பால்' : 'Section'}
                </div>
              </>
            )}
          </h1>

          <p className="text-sandalwood-600 text-lg max-w-2xl mx-auto font-catamaran">
            {isAdhigaramView ? (
              isTamil ?
                `${decodedAdhigaram} அதிகாரத்தின் குறள்கள்` :
                `Kurals from ${decodedAdhigaram} chapter`
            ) : (
              currentCategory?.description
            )}
          </p>

          <div className="mt-4 text-sm text-sandalwood-600 font-catamaran">
            {pagination.totalItems ? (
              isTamil ?
                `மொத்தம் ${pagination.totalItems} குறள்கள்` :
                `${pagination.totalItems} total kurals`
            ) : (
              isTamil ? 'குறள்கள் ஏற்றுகிறது...' : 'Loading kurals...'
            )}
          </div>
          <div className="tamil-divider mt-6"></div>
        </div>

        {kurals.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">
              {isTamil ? 'குறள்கள் கிடைக்கவில்லை' : 'No Kurals Found'}
            </h2>
            <p className="text-muted-foreground">
              {isTamil
                ? 'இந்த பிரிவில் குறள்கள் கிடைக்கவில்லை.'
                : 'No kurals found in this section.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Kurals Grid - Two columns for desktop, one for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-6xl mx-auto">
              {kurals.map((kural) => (
                <CategoryKuralCard key={kural._id} kural={kural} isTamil={isTamil} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border-2 border-sandalwood-500 text-sandalwood-600 rounded-md hover:bg-sandalwood-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-catamaran-medium"
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
                        className={`w-10 h-10 rounded-md font-catamaran-medium ${
                          pageNum === currentPage
                            ? 'bg-saffron-600 text-white'
                            : 'bg-manuscript-50 border-2 border-sandalwood-300 text-tamil-700 hover:bg-sandalwood-50'
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
                  className="px-4 py-2 border-2 border-sandalwood-500 text-sandalwood-600 rounded-md hover:bg-sandalwood-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-catamaran-medium"
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
          </>
        )}

        {/* Related Sections */}
        {!isAdhigaramView && currentCategory && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-4 text-tamil-800 font-catamaran-bold">
              {isTamil ? 'மற்ற பால்கள்' : 'Other Sections'}
            </h2>
            <div className="tamil-divider mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {Object.entries(categoryInfo)
                .filter(([key]) => key !== decodedPaal)
                .map(([key, info]) => (
                  <Link
                    key={key}
                    to={`/category/${encodeURIComponent(key)}`}
                    className="group"
                  >
                    <div className="kural-box hover:shadow-lg transition-all duration-200 hover:margin-top-[-2px] bg-manuscript-50 border-sandalwood-300">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-sandalwood-500 flex items-center justify-center text-2xl shadow-lg">
                          {info.icon}
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${info.color} font-catamaran-bold`}>
                          {isTamil ? key : info.nameEn}
                        </h3>
                        <p className="text-sandalwood-600 text-sm font-catamaran">
                          {info.description}
                        </p>
                        <div className="mt-3 text-xs text-saffron-600 font-catamaran-medium">
                          {info.totalKurals} {isTamil ? 'குறள்கள்' : 'kurals'}
                        </div>
                        <div className="flex items-center justify-center text-sm text-saffron-600 group-hover:text-saffron-700 transition-colors font-catamaran-medium mt-3">
                          <span>{isTamil ? 'ஆராயுங்கள்' : 'Explore'}</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Category Kural Card Component
const CategoryKuralCard = ({ kural, isTamil }) => {
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

export default CategoryView;
