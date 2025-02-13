import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { WikiArticle, SavedArticle } from '../types';
import { HeartIcon, ShareIcon, BookmarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ArticleCardProps {
  article: WikiArticle;
  isVisible: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isVisible }) => {
  const { t } = useTranslation();
  const [likes, setLikes] = useLocalStorage<SavedArticle[]>('wikitok-likes', []);
  const [bookmarks, setBookmarks] = useLocalStorage<SavedArticle[]>('wikitok-bookmarks', []);
  
  const isLiked = likes.some(like => like.pageid === article.pageid);
  const isBookmarked = bookmarks.some(bookmark => bookmark.pageid === article.pageid);

  const toggleLike = () => {
    if (isLiked) {
      setLikes(likes.filter(like => like.pageid !== article.pageid));
    } else {
      setLikes([...likes, { pageid: article.pageid, timestamp: Date.now() }]);
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.pageid !== article.pageid));
    } else {
      setBookmarks([...bookmarks, { pageid: article.pageid, timestamp: Date.now() }]);
    }
  };

  const shareArticle = async () => {
    try {
      await navigator.share({
        title: article.title,
        text: article.extract,
        url: article.url
      });
    } catch (error) {
      navigator.clipboard.writeText(article.url || '');
      alert(t('linkCopied'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="relative h-screen w-full bg-black flex items-center justify-center"
    >
      <div className="relative w-full h-full max-w-lg mx-auto">
        {article.thumbnail && (
          <div className="absolute inset-0">
            <img
              src={article.thumbnail.source}
              alt={article.title}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}
        
        <div className="relative z-10 h-full flex flex-col justify-center p-6 text-white">
          <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
          <p className="text-lg leading-relaxed overflow-y-auto mb-4">{article.extract}</p>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t('readMore')}
            <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-1" />
          </a>
          
          <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
            <button 
              onClick={toggleLike}
              className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              {isLiked ? (
                <HeartIconSolid className="w-8 h-8 text-red-500" />
              ) : (
                <HeartIcon className="w-8 h-8" />
              )}
            </button>
            <button 
              onClick={toggleBookmark}
              className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkIconSolid className="w-8 h-8 text-yellow-500" />
              ) : (
                <BookmarkIcon className="w-8 h-8" />
              )}
            </button>
            <button 
              onClick={shareArticle}
              className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <ShareIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};