import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { kuralAPI, userAPI, chatAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar
} from 'lucide-react';

const KuralDetail = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isTamil } = useTheme();

  const [kural, setKural] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [aiExplanation, setAiExplanation] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (number) {
      fetchKural();
      if (showComments) {
        fetchComments();
      }
    }
  }, [number, showComments]);

  const fetchKural = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await kuralAPI.getKural(number);
      setKural(response.data.data);

      // Check if it's in user's favorites
      if (isAuthenticated()) {
        // This would need to be implemented in the API
        // For now, we'll assume it's not favorited
        setIsFavorite(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch kural');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await kuralAPI.getKuralComments(number);
      setComments(response.data.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await userAPI.removeFavorite(number);
        setIsFavorite(false);
      } else {
        await userAPI.addFavorite(number);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to update favorite:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      await userAPI.addComment({
        kuralNumber: number,
        content: newComment.trim(),
        language: isTamil ? 'tamil' : 'english'
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const getAIExplanation = async () => {
    try {
      setLoadingAI(true);
      const language = isTamil ? 'tamil' : 'english';
      const response = await chatAPI.getKuralExplanation(number, '', language);

      // Handle both AI and fallback responses
      if (response.data.success) {
        if (response.data.data && response.data.data.explanation) {
          // AI response
          setAiExplanation(response.data.data.explanation);
        } else if (response.data.explanation) {
          // Fallback response
          setAiExplanation(response.data.explanation);
        } else {
          // Default fallback
          setAiExplanation(generateFallbackExplanation());
        }
      } else {
        setAiExplanation(generateFallbackExplanation());
      }
    } catch (err) {
      console.error('Failed to get AI explanation:', err);
      setAiExplanation(generateFallbackExplanation());
    } finally {
      setLoadingAI(false);
    }
  };

  const generateFallbackExplanation = () => {
  if (!kural) return '';

  const explanation = isTamil ? `
**குறள் ${kural.number} - ${kural.adhigaram}**

**குறள்:**
${kural.line1}
${kural.line2}

**பொருள்:** ${kural.meaning_ta}

**சிறுகதை:** ஒருநாள் ஒரு மாணவன் இந்த குறளைப் படித்து நடப்பதற்குள் தவறுகளைத் தவிர்த்து முன்னேறினார்.

**பாடம்:** இந்த குறள் எளிமையாகவும் தெளிவாகவும் நமக்கு வாழ்வில் நற்பண்பு தேவை என்பதை நினைவூட்டுகிறது.
  ` : `
**Kural ${kural.number} - ${kural.adhigaram}**

**Kural:**
${kural.line1}
${kural.line2}

**Meaning:** ${kural.meaning_en}

**Story:** A young student once read this kural and started avoiding bad habits. Soon, he became respected and wise.

**Lesson:** This kural reminds us that small virtues lead to big impact in life.
  `;

  return explanation.trim();
};


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${isTamil ? 'குறள்' : 'Kural'} ${number}`,
          text: `${kural.line1} ${kural.line2}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const navigateKural = (direction) => {
    const newNumber = direction === 'prev'
      ? Math.max(1, parseInt(number) - 1)
      : Math.min(1330, parseInt(number) + 1);
    navigate(`/kural/${newNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={isTamil ? 'குறள் ஏற்றுகிறது...' : 'Loading Kural...'} />
      </div>
    );
  }

  if (error || !kural) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error || (isTamil ? 'குறள் கிடைக்கவில்லை' : 'Kural not found')}
          </div>
          <Link to="/kurals" className="btn-primary btn-md">
            {isTamil ? 'குறள் பட்டியலுக்கு' : 'Back to Kurals'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg-heritage relative overflow-hidden">
      {/* Heritage Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-heritage-100/15 via-temple-100/10 to-heritage-200/15"></div>
      <div className="absolute top-20 right-20 w-20 h-20 border-2 border-heritage-300/30 rounded-full opacity-40" style={{animation: 'gentle-float 8s ease-in-out infinite'}}></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-temple-300/30 rounded-full opacity-35" style={{animation: 'gentle-float 10s ease-in-out infinite', animationDelay: '1s'}}></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/kurals" className="btn-ghost btn-md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isTamil ? 'பின்செல்' : 'Back'}
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateKural('prev')}
              disabled={parseInt(number) <= 1}
              className="btn-outline btn-sm disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-muted-foreground">
              {number} / 1330
            </span>
            <button
              onClick={() => navigateKural('next')}
              disabled={parseInt(number) >= 1330}
              className="btn-outline btn-sm disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kural Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kural Card */}
            <div className="card-heritage">
              <div className="card-content p-8 bg-gradient-to-br from-heritage-50/80 via-temple-50/40 to-heritage-100/60">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-bold gradient-text-heritage mb-2 drop-shadow-md">
                      {isTamil ? 'குறள்' : 'Kural'} {kural.number}
                    </h1>
                    <div className="text-muted-foreground">
                      <div className="font-medium">{kural.adhigaram}</div>
                      <div className="text-sm">{kural.paal}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleFavorite}
                      className={`btn-ghost btn-sm ${isFavorite ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={handleShare} className="btn-ghost btn-sm">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Kural Text */}
                <div className="text-center mb-8 p-6 bg-gradient-to-r from-heritage-50/60 via-temple-50/40 to-heritage-100/60 rounded-xl border border-heritage-200/40">
                  <div className="kural-text text-3xl mb-4 text-heritage-800 leading-relaxed font-bold anek-tamil-bold">
                    {kural.line1}<br />
                    {kural.line2}
                  </div>
                  {kural.transliteration && (
                    <div className="text-muted-foreground italic text-lg">
                      {kural.transliteration}
                    </div>
                  )}
                </div>

                {/* Meanings */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {isTamil ? 'தமிழ் பொருள்' : 'Tamil Meaning'}
                    </h3>
                    <p className="kural-meaning anek-tamil-default">{kural.meaning_ta}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {isTamil ? 'ஆங்கில பொருள்' : 'English Meaning'}
                    </h3>
                    <p className="kural-meaning">{kural.meaning_en}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaries */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  {isTamil ? 'உரைகள்' : 'Commentaries'}
                </h2>
              </div>
              <div className="card-content space-y-6">
                {/* Parimelalhagar Commentary */}
                <div>
                  <h3 className="font-semibold mb-2 text-primary-600">
                    {isTamil ? 'பரிமேலழகர் உரை' : 'Parimelazhagar Commentary'}
                  </h3>
                  <p className="kural-commentary anek-tamil-default">{kural.commentary_parimel}</p>
                </div>

                {/* Karunanidhi Commentary */}
                {kural.commentary_karunanidhi && (
                  <div>
                    <h3 className="font-semibold mb-2 text-primary-600">
                      {isTamil ? 'கருணாநிதி உரை' : 'Karunanidhi Commentary'}
                    </h3>
                    <p className="kural-commentary anek-tamil-default">{kural.commentary_karunanidhi}</p>
                  </div>
                )}

                {/* Yogi Commentary */}
                {kural.commentary_yogi && (
                  <div>
                    <h3 className="font-semibold mb-2 text-primary-600">
                      {isTamil ? 'யோகி உரை' : 'Yogi Commentary'}
                    </h3>
                    <p className="kural-commentary anek-tamil-default">{kural.commentary_yogi}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Explanation */}
            <div className="card-heritage bg-gradient-to-br from-heritage-50/80 via-temple-50/60 to-heritage-100/80">
              <div className="card-header">
                <div className="flex justify-between items-center">
                  <h2 className="card-title flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-heritage-600" />
                    {isTamil ? 'AI விளக்கம்' : 'AI Explanation'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {!aiExplanation ? (
                      <button
                        onClick={getAIExplanation}
                        disabled={loadingAI}
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-heritage-600 to-heritage-700 text-heritage-50 rounded-md hover:from-heritage-700 hover:to-heritage-800 transition-all duration-200 shadow-sm hover:shadow-md border border-heritage-500/30 disabled:opacity-50"
                      >
                        {loadingAI ? (
                          <div className="flex items-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">
                              {isTamil ? 'தயாராகிறது...' : 'Loading...'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isTamil ? 'விளக்கம் பெறு' : 'Get Explanation'}
                          </div>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={getAIExplanation}
                        disabled={loadingAI}
                        className="px-3 py-1 text-xs font-medium text-heritage-600 hover:text-heritage-700 hover:bg-heritage-50/50 rounded-md transition-all duration-200 border border-heritage-200/30 hover:border-heritage-300/50"
                      >
                        {loadingAI ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          isTamil ? 'புதுப்பி' : 'Refresh'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {aiExplanation && (
                <div className="card-content">
                  <div className="prose max-w-none">
                    {aiExplanation.split('\n').map((paragraph, index) => {
                      if (paragraph.trim() === '') return null;

                      // Handle markdown-style headers
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h4 key={index} className="font-bold text-heritage-700 mt-4 mb-2 text-lg">
                            {paragraph.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }

                      // Handle regular paragraphs
                      return (
                        <p key={index} className="mb-3 leading-relaxed text-temple-700">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* AI Service Status */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-heritage-50/80 via-temple-50/40 to-heritage-100/60 border border-heritage-200/50 rounded-lg">
                    <div className="flex items-center text-sm text-heritage-700">
                      <Sparkles className="w-4 h-4 mr-2 text-heritage-600" />
                      <span className="font-medium">
                        {isTamil
                          ? 'AI விளக்கம் தயார்!'
                          : 'AI Explanation Ready!'
                        }
                      </span>
                    </div>
                    <p className="text-xs text-heritage-600 mt-1">
                      {isTamil
                        ? 'இந்த விளக்கம் வள்ளுவரின் ஞானத்தை நவீன வாழ்க்கையுடன் இணைக்கிறது.'
                        : 'This explanation connects Valluvar\'s wisdom with modern life applications.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-lg">
                  {isTamil ? 'செயல்கள்' : 'Actions'}
                </h3>
              </div>
              <div className="card-content space-y-3">
                <Link to="/chat" className="btn-primary btn-md w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {isTamil ? 'வள்ளுவருடன் பேசு' : 'Chat with Valluvar'}
                </Link>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="btn-outline btn-md w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {isTamil ? 'கருத்துகள்' : 'Comments'} ({comments.length})
                </button>
              </div>
            </div>

            {/* Related Kurals */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-lg">
                  {isTamil ? 'தொடர்புடைய குறள்கள்' : 'Related Kurals'}
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-2">
                  <Link
                    to={`/adhigaram/${encodeURIComponent(kural.adhigaram)}`}
                    className="block p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="font-medium text-sm">{kural.adhigaram}</div>
                    <div className="text-xs text-muted-foreground">
                      {isTamil ? 'இந்த அதிகாரத்தின் மற்ற குறள்கள்' : 'Other kurals in this chapter'}
                    </div>
                  </Link>

                  <Link
                    to={`/category/${kural.paal}`}
                    className="block p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="font-medium text-sm">{kural.paal}</div>
                    <div className="text-xs text-muted-foreground">
                      {isTamil ? 'இந்த பாலின் அனைத்து குறள்கள்' : 'All kurals in this section'}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {isTamil ? 'கருத்துகள்' : 'Comments'}
                </h3>
              </div>
              <div className="card-content">
                {/* Add Comment Form */}
                {isAuthenticated() ? (
                  <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={isTamil ? 'உங்கள் கருத்தை பகிருங்கள்...' : 'Share your thoughts...'}
                      className="textarea w-full mb-3"
                      rows="3"
                    />
                    <button type="submit" className="btn-primary btn-md">
                      {isTamil ? 'கருத்து சேர்' : 'Add Comment'}
                    </button>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-muted rounded-md text-center">
                    <p className="mb-3">
                      {isTamil ? 'கருத்து சேர்க்க உள்நுழையவும்' : 'Login to add comments'}
                    </p>
                    <Link to="/login" className="btn-primary btn-md">
                      {isTamil ? 'உள்நுழை' : 'Login'}
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="border-l-4 border-primary-200 pl-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{comment.user.username}</span>
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      {isTamil ? 'இன்னும் கருத்துகள் இல்லை' : 'No comments yet'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KuralDetail;
