import axios from 'axios';
import { WikiArticle } from '../types';
import i18n from '../i18n';

const getWikiLanguageCode = () => {
  const langMap: { [key: string]: string } = {
    en: 'en',
    zh: 'zh',
    fr: 'fr',
    de: 'de',
    ja: 'ja',
    ko: 'ko',
    es: 'es'
  };
  return langMap[i18n.language] || 'en';
};

export async function getRandomArticle(): Promise<WikiArticle> {
  const lang = getWikiLanguageCode();
  const API_BASE_URL = `https://${lang}.wikipedia.org/api/rest_v1`;
  
  const response = await axios.get(`${API_BASE_URL}/page/random/summary`);
  return {
    title: response.data.title,
    extract: response.data.extract,
    thumbnail: response.data.thumbnail,
    pageid: response.data.pageid,
    description: response.data.description,
    url: response.data.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(response.data.title)}`
  };
}