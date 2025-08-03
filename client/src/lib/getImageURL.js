const TMDB_BASE = 'https://image.tmdb.org/t/p/original';

function getFullImageUrl(path) {
  // Return empty string for invalid paths
  if (!path || typeof path !== 'string') return '';
  
  // Return the path as-is if it's already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Add TMDB base URL for relative paths
  return TMDB_BASE + (path.startsWith('/') ? path : '/' + path);
}

export default getFullImageUrl;