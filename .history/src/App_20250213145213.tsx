import  { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { ArticleCard } from './components/ArticleCard';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { getRandomArticle } from './api/wikipedia';
import { WikiArticle } from './types';
import './i18n';

function App() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMoreArticles = async () => {
    try {
      const newArticles = await Promise.all(
        Array(3).fill(null).map(() => getRandomArticle())
      );
      setArticles(prev => [...prev, ...newArticles]);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreArticles();
  }, []);

  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      loadMoreArticles();
    }
  }, [inView]);

  return (
    <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory">
      <LanguageSwitcher />
      {articles.map((article, index) => (
        <div key={article.pageid} className="h-screen snap-start">
          <ArticleCard
            article={article}
            isVisible={true}
          />
          {index === articles.length - 1 && (
            <div ref={ref} className="h-1" />
          )}
        </div>
      ))}
      {loading && (
        <div className="h-screen flex items-center justify-center text-white">
          {t('loading')}
        </div>
      )}
    </div>
  );
}

export default App;