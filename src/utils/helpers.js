
export const findBestDeal = (results) => {
  if (!results || results.length === 0) return null;
  return results.reduce((best, current) => (current.price < best.price ? current : best), results[0]);
};