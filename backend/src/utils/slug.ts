/**
 * Türkçe karakterleri İngilizce karşılıklarına çevirir
 */
function turkishToEnglish(text: string): string {
  const turkishChars: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
  };

  return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => turkishChars[char] || char);
}

/**
 * Başlıktan SEO dostu slug oluşturur
 */
export function generateSlug(title: string): string {
  return turkishToEnglish(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Birden fazla tireyi tek tireye çevir
    .replace(/(^-|-$)/g, ''); // Başta ve sonda tire varsa kaldır
}

