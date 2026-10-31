/**
 * Unified Seed File for Nova Agro AgTech Platform
 * Tüm seed verilerini tek dosyada toplar
 * Türkçe karakter desteği ile çalışır (utf8mb4_turkish_ci)
 */

import { db } from '../db/connection.js';
import { 
  adminUsers, 
  categories, 
  services, 
  brands, 
  seoKeywords, 
  heroSections,
  aboutSections,
  articles,
  settings,
  projects,
  projectImages
} from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateSlug } from '../utils/slug.js';
import { defaultSeoKeywords } from '../utils/defaultSeoKeywords.js';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const isDirectRun = Boolean(
  process.argv[1] &&
  (import.meta.url === `file://${process.argv[1]}` ||
   fileURLToPath(import.meta.url) === path.resolve(process.argv[1]))
);

// ========== SEED DATA ==========

export const adminUsersData = [
  {
    email: 'admin@nova-agro.demo',
    password: 'DemoAdmin2026!',
    name: 'Nova Agro Ziraat Mühendisliği Demo Admin',
    active: true,
  },
  {
    email: 'admin@novaagro.demo',
    password: 'DemoAdmin2026!',
    name: 'Nova Agro Ziraat Mühendisliği',
    active: true,
  },
  {
    email: 'admin@nova-industrial.demo',
    password: 'DemoAdmin2026!',
    name: 'System Administrator',
    active: true,
  },
];

export const settingsData = [
  { key: 'site_name', value: 'Nova Agro', description: 'Web sitesi adı' },
  { key: 'site_slogan', value: 'Geleceğin Tarımı İçin İleri AgTech & Ziraat Mühendisliği', description: 'Site sloganı' },
  { key: 'site_primary_color', value: '#16a34a', description: 'Birincil tema rengi (AgTech Green)' },
  { key: 'site_cta_text', value: 'Teklif Al', description: 'Ana buton metni' },
  { key: 'site_email', value: 'info@novaagro.demo', description: 'İletişim e-posta adresi' },
  { key: 'site_phone', value: '+90 (242) 555 01 20', description: 'İletişim telefon numarası' },
  { key: 'site_address', value: 'Antalya Tarım Teknokenti, AgTech İnovasyon Merkezi No: 18, Antalya', description: 'Fiziksel adres bilgisi' },
  { key: 'site_whatsapp', value: '+90 (532) 555 01 20', description: 'WhatsApp iletişim hattı' },
  { key: 'site_meta_title', value: 'Nova Agro | İleri AgTech & Ziraat Mühendisliği Çözümleri', description: 'SEO başlığı' },
  { key: 'site_meta_description', value: 'Zirai drone ilaçlama, hassas tarım, akıllı sulama otomasyonu ve ziraat mühendisliği danışmanlığı ile tarımda maksimum verimlilik.', description: 'SEO açıklaması' },
  { key: 'site_meta_keywords', value: 'zirai drone, hassas tarım, akıllı sulama, toprak analizi, sera otomasyonu, nova agro, ziraat mühendisliği', description: 'SEO anahtar kelimeleri' },
  { key: 'site_offline', value: 'false', description: 'Site bakım modu durumu' },
  { key: 'home_show_articles', value: 'true', description: 'Anasayfa blog bloğunu göster/gizle' },
  { key: 'home_show_services', value: 'true', description: 'Anasayfa hizmetler bloğunu göster/gizle' },
  { key: 'home_show_projects', value: 'true', description: 'Anasayfa projeler bloğunu göster/gizle' },
  { key: 'home_show_categories', value: 'true', description: 'Anasayfa kategoriler bloğunu göster/gizle' },
];

export const categoriesData = [
  {
    name: 'Zirai Drone & Havadan Analiz',
    slug: 'zirai-drone-havadan-analiz',
    description: 'Multispektral NDVI haritalama, otonom drone ilaçlama, rekolte tahmini ve hava telemetrisi çözümleri.',
  },
  {
    name: 'Akıllı Sulama & Otomasyon',
    slug: 'akilli-sulama-otomasyon',
    description: 'Toprak nem ve tuzluluk telemetrisi, LoRaWAN kablosuz vana kontrolü ve solar sulama optimizasyon sistemleri.',
  },
  {
    name: 'Toprak Analizi & Gübreleme',
    slug: 'toprak-analizi-gubreleme',
    description: 'Akredite laboratuvar analizleri, reçeteli N-P-K besleme programları ve toprak ıslahı danışmanlığı.',
  },
  {
    name: 'Modern Sera Otomasyonu',
    slug: 'modern-sera-otomasyonu',
    description: 'Sensör güdümlü sisleme, dinamik gölgeleme, CO2 dozajlama ve hidroponik iklimlendirme otomasyonu.',
  },
  {
    name: 'Ziraat Mühendisliği & Danışmanlık',
    slug: 'ziraat-muhendisligi-danismanlik',
    description: 'Ruhsatlı zirai mühendislik danışmanlığı, entegre zararlı yönetimi (IPM) ve sertifikalı tohum tedariki.',
  },
];

export const servicesData = [
  {
    title: 'Zirai Drone İlaçlama, Haritalama & Multispektral Analiz',
    slug: 'zirai-drone-ilaclama-haritalama-multispektral-analiz',
    badge: 'Otonom Uçuş & VRA',
    icon: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600',
    iconText: 'sensors',
    description: 'Yüksek çözünürlüklü multispektral kameralarla NDVI bitki sağlığı haritalama, yabancı ot ve rekolte tespiti; santimetre hassasiyetinde RTK GPS destekli otonom zirai dronelar ile milimetrik değişken oranlı (VRA) ilaçlama ve gübreleme.',
    features: JSON.stringify([
      'NDVI / NDRE multispektral bitki sağlığı haritalama',
      'Değişken Oranlı Uygulama (VRA) ile %35 ilaç tasarrufu',
      'RTK santimetre hassasiyetinde otonom uçuş rotalama',
      'Sıvı ve granül gübreleme desteği (50 kg faydalı yük)',
      'Aynı gün termal stres ve rekolte tahmin raporlaması',
    ]),
    order: 1,
  },
  {
    title: 'Hassas Tarım & Akıllı Sulama Otomasyonu',
    slug: 'hassas-tarim-akilli-sulama-otomasyonu',
    badge: '%40 Su Tasarrufu',
    icon: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
    iconText: 'water_drop',
    description: 'Toprak nem, tuzluluk ve sıcaklık telemetrisi, LoRaWAN tabanlı kablosuz vana kontrolü, solar sulama optimizasyonu ve su tüketiminde %40\'a varan tasarruf sağlayan yapay zeka destekli akıllı sulama otomasyonu.',
    features: JSON.stringify([
      'Çok derinlikli (30-60-90 cm) toprak nem & EC telemetrisi',
      'LoRaWAN kablosuz aktüatör ile 15 km menzilli vana yönetimi',
      'Meteoroloji istasyonu ve evapotranspirasyon (ET0) tabanlı sulama',
      'Güneş enerjili (Off-Grid) otonom pompa otomasyon panoları',
      'Mobil uygulama üzerinden anlık debi ve basınç takibi',
    ]),
    order: 2,
  },
  {
    title: 'Toprak Analizi, Gübreleme & Bitki Besleme',
    slug: 'toprak-analizi-gubreleme-bitki-besleme',
    badge: 'Akredite Laboratuvar',
    icon: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600',
    iconText: 'science',
    description: 'Akredite laboratuvar ortamında N-P-K, mikro element, organik madde ve ağır metal analizleri; tarlanıza ve mahsulünüze özel reçetelendirilmiş dengeli taban ve yaprak gübreleme besleme programları.',
    features: JSON.stringify([
      'Makro ve mikro element (N, P, K, Ca, Mg, Fe, Zn) tayini',
      'Toprak pH, kireç, tuzluluk ve organik madde profili',
      'Mahsul ve fenolojik evreye özel reçeteli gübreleme planı',
      'Tuzlulaşma önleyici ve toprak iyileştirici çözümler',
      'Ziraat yüksek mühendisleri onaylı resmi analiz raporu',
    ]),
    order: 3,
  },
  {
    title: 'Modern Sera Otomasyonu & İklimlendirme',
    slug: 'modern-sera-otomasyonu-iklimlendirme',
    badge: 'Tam İklim Kontrolü',
    icon: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600',
    iconText: 'thermostat',
    description: 'Sensör güdümlü yüksek basınçlı sisleme, gölgeleme perdesi, fan-pad havalandırma, CO2 zenginleştirme, hidroponik besin dojazlama ve iklimlendirme kontrolü ile 365 gün maksimum sera verimliliği.',
    features: JSON.stringify([
      'VPD (Buhar Basıncı Açığı) odaklı dinamik iklimlendirme',
      'Otomatik gölgeleme, termal perde ve çatı havalandırma kontrolü',
      'Yüksek basınçlı (70 bar) sisleme ile nem ve sıcaklık optimizasyonu',
      'EC/pH kontrollü kapalı devre hidroponik gübre dozajlama',
      'SCADA ve bulut üzerinden 7/24 alarm ve izleme sistemi',
    ]),
    order: 4,
  },
  {
    title: 'Ziraat Mühendisliği Ruhsatlı Danışmanlık & Sertifikalı Tohumculuk',
    slug: 'ziraat-muhendisligi-ruhsatli-danismanlik-sertifikali-tohumculuk',
    badge: 'Bakanlık Ruhsatlı',
    icon: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
    iconText: 'verified',
    description: 'Tarım ve Orman Bakanlığı ruhsatlı ziraat mühendisleri denetiminde saha etütleri, fenolojik gelişim takibi, entegre zararlı yönetimi (IPM), erken uyarı takvimi ve yüksek çimlenme garantili sertifikalı tohum tedariki.',
    features: JSON.stringify([
      'Bakanlık onaylı ruhsatlı zirai danışmanlık ve reçete yazımı',
      'Hastalık ve zararlılara karşı Entegre Mücadele (IPM) takvimi',
      'Yüksek verimli hibrit ve standart sertifikalı tohum temini',
      'Periyodik saha inspeksiyonu ve fenolojik gelişim raporu',
      'İyi Tarım ve GlobalG.A.P. sertifikasyon süreç danışmanlığı',
    ]),
    order: 5,
  },
];

export const heroSectionsData = [
  {
    title: 'Yapay Zeka Destekli Hassas Tarım & Zirai Dronelar',
    subtitle: 'Nova Agro, otonom zirai dronelar, multispektral NDVI haritalama ve milimetrik değişken oranlı ilaçlama teknolojileri ile tarımda verimi zirveye taşıyor.',
    ctaText: 'Teklif Al',
    ctaLink: '/#quotes',
    backgroundImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80',
    active: true,
    order: 1,
  },
  {
    title: 'Akıllı Sulama Otomasyonu & Su Tasarrufu',
    subtitle: 'Toprak nem telemetrisi, LoRaWAN kablosuz vana kontrolü ve solar sulama altyapıları ile su tüketiminizde %40\'a varan tasarruf sağlayın.',
    ctaText: 'Hizmetlerimiz',
    ctaLink: '/#services',
    backgroundImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    active: true,
    order: 2,
  },
  {
    title: 'Modern Sera Otomasyonu & İklimlendirme',
    subtitle: 'Sensör güdümlü sisleme, CO2 dozajlama, hidroponik besleme ve akıllı iklimlendirme sistemleri ile dört mevsim yüksek rekolte garantisi.',
    ctaText: 'Projelerimiz',
    ctaLink: '/#projects',
    backgroundImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80',
    active: true,
    order: 3,
  },
  {
    title: 'Ruhsatlı Ziraat Mühendisliği & Laboratuvar Analizleri',
    subtitle: 'Akredite toprak, yaprak ve su analizleri ile tarlanıza özel reçetelendirilmiş bitki besleme ve sertifikalı tohum danışmanlığı.',
    ctaText: 'İletişime Geçin',
    ctaLink: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&q=80',
    active: true,
    order: 4,
  },
];

export const brandsData = [
  { name: 'DJI Agriculture', logoUrl: 'https://logo.clearbit.com/dji.com', websiteUrl: 'https://ag.dji.com', order: 1, active: true },
  { name: 'Trimble Agriculture', logoUrl: 'https://logo.clearbit.com/trimble.com', websiteUrl: 'https://agriculture.trimble.com', order: 2, active: true },
  { name: 'Netafim', logoUrl: 'https://logo.clearbit.com/netafim.com', websiteUrl: 'https://www.netafim.com', order: 3, active: true },
  { name: 'Yara International', logoUrl: 'https://logo.clearbit.com/yara.com', websiteUrl: 'https://www.yara.com.tr', order: 4, active: true },
  { name: 'Rain Bird', logoUrl: 'https://logo.clearbit.com/rainbird.com', websiteUrl: 'https://www.rainbird.com', order: 5, active: true },
  { name: 'Pessl Instruments', logoUrl: 'https://logo.clearbit.com/metos.at', websiteUrl: 'https://metos.at', order: 6, active: true },
];

export const aboutSectionData = {
  title: 'Nova Agro Tarım Teknolojileri ve Ziraat Mühendisliği',
  content: `
    <h3>Geleceğin Tarımını Bugünden İnşa Ediyoruz</h3>
    <p>Nova Agro, modern tarımın karşı karşıya kaldığı kuraklık, iklim değişikliği ve artan girdi maliyetlerine karşı ileri teknoloji (AgTech) ve bilimsel ziraat mühendisliği metodolojilerini bir araya getiren öncü bir tarım teknolojileri şirketidir.</p>
    <p>Antalya Teknokent bünyesindeki AR-GE merkezimiz, son teknoloji zirai insansız hava araçları filosu, akredite toprak-bitki analiz laboratuvarı ve IoT tabanlı hassas sulama sistemleri ile Türkiye genelinde binlerce dekar tarım arazisinde sürdürülebilir ve yüksek verimli tarımsal üretim sağlamaktadır.</p>
    <p>Alanında uzman ziraat yüksek mühendisleri, yazılım mühendisleri ve otonom İHA pilotlarından oluşan multidisipliner kadromuzla; tohumdan hasada kadar her aşamada çiftçimizin ve kurumsal tarım işletmelerinin yanında yer alıyor, su ve ilaç girdilerini %40'a varan oranda azaltırken dekar başına rekolteyi maksimize ediyoruz.</p>
  `.trim(),
  visible: true,
};

export const articlesData = [
  {
    title: 'Zirai Dronelar ile Değişken Oranlı (VRA) İlaçlama ve Girdi Tasarrufu',
    slug: 'zirai-dronelar-ile-degisken-oranli-ilaclama-ve-tasarruf',
    categorySlug: 'zirai-drone-havadan-analiz',
    excerpt: 'Geleneksel traktörle ilaçlamaya kıyasla %95 su ve %35 kimyasal tasarrufu sağlayan otonom zirai drone teknolojilerinin saha sonuçları.',
    content: `
      <h3>Tarımda Havadan İlaçlama Devrimi</h3>
      <p>Modern tarımda kimyasal girdilerin bilinçsiz kullanımı hem toprak sağlığını tehdit etmekte hem de çiftçi bütçesini zorlamaktadır. Nova Agro'nun 50 kg faydalı yüke sahip otonom zirai droneları, santimetre hassasiyetinde RTK GPS güdümüyle yalnızca ihtiyaç duyulan bölgelere milimetrik püskürtme yapmaktadır.</p>
      <h4>Öne Çıkan Avantajlar:</h4>
      <ul>
        <li>Traktör tekerleği kaynaklı %5-8 oranındaki rekolte ezilme kaybının tamamen önlenmesi.</li>
        <li>Ultra Düşük Hacimli (ULV) nozül teknolojisi ile dekar başına su tüketiminin 20 litreden 1.5 litreye düşürülmesi.</li>
        <li>Çamurlu ve engebeli arazilerde traktör giremediği kritik hastalık anında anında müdahale imkânı.</li>
      </ul>
      <p>Yapılan saha testlerinde mısır koçan kurdu ve pamuk yeşilkurt mücadelesinde %98 biyolojik etkinlik sağlanmıştır.</p>
    `.trim(),
    featuredImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200',
    visible: true,
  },
  {
    title: 'Multispektral NDVI Haritalama ile Bitki Sağlığı ve Stres Tespiti',
    slug: 'multispektral-ndvi-haritalama-ile-bitki-sagligi',
    categorySlug: 'zirai-drone-havadan-analiz',
    excerpt: 'Gözle görülmeyen klorofil değişimlerini ve su stresini erken aşamada tespit eden multispektral hava taraması.',
    content: `
      <h3>Bitkilerin Gözle Görünmeyen Dili: NDVI & NDRE</h3>
      <p>Bitkiler stres altına girdiklerinde (su yetersizliği, nematod, mantari hastalık veya azot eksikliği) klorofil üretimleri yavaşlar ve yakın kızılötesi (NIR) ışığı yansıtma kapasiteleri düşer. İnsan gözü bu stresi sararma oluştuktan sonra fark edebilirken, multispektral sensörler günler öncesinden tespit eder.</p>
      <p>Nova Agro uzman ziraat mühendisleri, tarlanızın NDVI haritalarını çıkararak reçetelendirilmiş müdahale haritalarını doğrudan zirai drone ve gübre dağıtıcılarına yüklemektedir.</p>
    `.trim(),
    featuredImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200',
    visible: true,
  },
  {
    title: 'Kuraklık Tehdidine Karşı LoRaWAN Akıllı Sulama Otomasyonu',
    slug: 'kuraklik-tehdidine-karsi-akilli-sulama-otomasyonu',
    categorySlug: 'akilli-sulama-otomasyon',
    excerpt: 'Toprak nem profili ve evapotranspirasyon telemetrisi ile su tüketiminde %40 tasarruf sağlayan akıllı sulama.',
    content: `
      <h3>Damla Başına Değer: Akıllı Su Yönetimi</h3>
      <p>Küresel iklim kriziyle birlikte yeraltı su seviyelerinin hızla çekildiği günümüzde, takvim usulü sulama dönemi sona ermiştir. Nova Agro akıllı sulama altyapısı, 30 cm, 60 cm ve 90 cm derinliklerdeki sensörlerle toprağın su tutma kapasitesini ve bitki kök bölgesinin anlık nemini ölçer.</p>
      <p>LoRaWAN kablosuz vana kontrol üniteleri sayesinde çiftçilerimiz evinden veya cep telefonundan tek tuşla bölge bazlı sulama yapabilmekte, solar panelli istasyonlar şebeke elektriğine ihtiyaç duymadan çalışmaktadır.</p>
    `.trim(),
    featuredImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200',
    visible: true,
  },
  {
    title: 'Toprak Analizine Dayalı Dengeli Bitki Besleme Programları',
    slug: 'toprak-analizine-dayali-dengeli-bitki-besleme',
    categorySlug: 'toprak-analizi-gubreleme',
    excerpt: 'Toprağın fiziksel ve kimyasal yapısına uygun gübreleme reçeteleri ile maliyetleri düşürün, verimi artırın.',
    content: `
      <h3>Toprağınızı Tanımadan Gübre Atmayın</h3>
      <p>Toprağın pH derecesi, kireç oranı ve tuzluluk düzeyi bilinmeden atılan gübrelerin %50\'den fazlası bitki tarafından alınamamakta ve toprakta kilitlenmektedir. Nova Agro akredite laboratuvarında gerçekleştirilen detaylı analizler sonucunda;</p>
      <ul>
        <li>Makro elementler (Azot, Fosfor, Potasyum)</li>
        <li>İkincil besin maddeleri (Kalsiyum, Magnezyum, Kükürt)</li>
        <li>Mikro elementler (Çinko, Demir, Mangan, Bor, Bakır)</li>
      </ul>
      <p>oranları tam olarak belirlenir ve mahsulün fenolojik evrelerine göre haftalık besleme reçetesi hazırlanır.</p>
    `.trim(),
    featuredImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200',
    visible: true,
  },
  {
    title: 'Modern Seracılıkta VPD (Buhar Basıncı Açığı) ve İklimlendirme',
    slug: 'modern-seracilikta-vpd-ve-iklimlendirme-yonetimi',
    categorySlug: 'modern-sera-otomasyonu',
    excerpt: 'Sera içinde ideal transpirasyon ve fotosentez hızı için VPD temelli akıllı sisleme ve iklimlendirme kontrolü.',
    content: `
      <h3>Seralarda Maksimum Verim İçin VPD Dinamikleri</h3>
      <p>Geleneksel sıcaklık ve bağıl nem ölçümleri, bitkinin gerçek terleme (transpirasyon) hızını açıklamada yetersiz kalır. Buhar Basıncı Açığı (VPD), yaprak yüzey sıcaklığı ile ortam havası arasındaki buhar basıncı farkını ifade eder.</p>
      <p>Nova Agro sera otomasyon sistemi, yüksek basınçlı 70 bar sisleme memeleri, gölgeleme perdeleri ve oransal havalandırma pencerelerini otomatik koordine ederek bitkiyi her zaman optimum fotosentez bölgesinde tutar.</p>
    `.trim(),
    featuredImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200',
    visible: true,
  },
];

// ========== SEED FUNCTIONS ==========

export async function cleanLegacyData() {
  console.log('🧹 Checking and cleaning legacy industrial seed data...');
  try {
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
    await db.execute(sql`DELETE FROM project_images;`);
    await db.execute(sql`DELETE FROM projects;`);
    await db.execute(sql`DELETE FROM articles;`);
    await db.execute(sql`DELETE FROM services;`);
    await db.execute(sql`DELETE FROM categories;`);
    await db.execute(sql`DELETE FROM hero_sections;`);
    await db.execute(sql`DELETE FROM brands;`);
    await db.execute(sql`DELETE FROM seo_keywords;`);
    await db.execute(sql`DELETE FROM about_sections;`);
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log('✅ Legacy tables cleaned successfully for Nova Agro transformation.');
  } catch (error: any) {
    console.warn('⚠️ Legacy cleanup notice:', error.message);
    try {
      await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch {}
  }
}

export async function seedAdminUsers() {
  console.log('🌱 Seeding admin users...\n');

  for (const userData of adminUsersData) {
    try {
      const existing = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, userData.email))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  Admin user "${userData.email}" already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await db.insert(adminUsers).values({
        email: userData.email,
        password: hashedPassword,
        name: userData.name || null,
        active: userData.active,
      });

      console.log(`✅ Admin user "${userData.email}" added`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⏭️  Admin user "${userData.email}" already exists, skipping...`);
      } else {
        console.error(`❌ Error adding admin user "${userData.email}":`, error.message);
      }
    }
  }

  console.log('\n✨ Admin users seeding completed!\n');
}

export async function seedSettings() {
  console.log('🌱 Seeding Nova Agro site settings...\n');

  for (const setting of settingsData) {
    try {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, setting.key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: setting.value, description: setting.description })
          .where(eq(settings.key, setting.key));
        console.log(`🔄 Updated setting: ${setting.key} = ${setting.value}`);
      } else {
        await db.insert(settings).values(setting);
        console.log(`✅ Added setting: ${setting.key} = ${setting.value}`);
      }
    } catch (error: any) {
      console.error(`❌ Error seeding setting "${setting.key}":`, error.message);
    }
  }

  console.log('\n✨ Settings seeding completed!\n');
}

export async function seedCategories() {
  console.log('📝 Seeding agricultural categories...\n');

  for (const categoryData of categoriesData) {
    try {
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categoryData.slug))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(categories)
          .set({ name: categoryData.name, description: categoryData.description })
          .where(eq(categories.slug, categoryData.slug));
        console.log(`🔄 Updated category: ${categoryData.name}`);
        continue;
      }

      await db.insert(categories).values({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || null,
      });

      console.log(`✅ Added category: ${categoryData.name}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⏭️  Skipped (duplicate): ${categoryData.name}`);
      } else {
        console.error(`❌ Error adding "${categoryData.name}":`, error.message);
      }
    }
  }

  console.log('\n✨ Categories seeding completed!\n');
}

export async function seedServices() {
  console.log('📝 Seeding 5 Core AgTech Services...\n');

  for (const serviceData of servicesData) {
    try {
      const existing = await db
        .select()
        .from(services)
        .where(eq(services.title, serviceData.title))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(services)
          .set({
            slug: serviceData.slug,
            description: serviceData.description,
            features: serviceData.features,
            badge: serviceData.badge,
            icon: serviceData.icon,
            iconText: serviceData.iconText,
            order: serviceData.order,
          })
          .where(eq(services.title, serviceData.title));
        console.log(`🔄 Updated service: ${serviceData.title}`);
        continue;
      }

      await db.insert(services).values({
        title: serviceData.title,
        slug: serviceData.slug,
        description: serviceData.description,
        features: serviceData.features,
        badge: serviceData.badge,
        icon: serviceData.icon,
        iconText: serviceData.iconText,
        order: serviceData.order,
      });

      console.log(`✅ Added service: ${serviceData.title}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⏭️  Skipped (duplicate): ${serviceData.title}`);
      } else {
        console.error(`❌ Error adding "${serviceData.title}":`, error.message);
      }
    }
  }

  console.log('\n✨ Services seeding completed!\n');
}

export async function seedBrands() {
  console.log('🌱 Seeding AgTech brands...\n');

  for (const brandData of brandsData) {
    try {
      const existing = await db
        .select()
        .from(brands)
        .where(eq(brands.name, brandData.name))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(brands)
          .set(brandData)
          .where(eq(brands.name, brandData.name));
        console.log(`🔄 Updated brand: ${brandData.name}`);
        continue;
      }

      await db.insert(brands).values(brandData);
      console.log(`✅ Brand "${brandData.name}" added`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⏭️  Brand "${brandData.name}" already exists, skipping...`);
      } else {
        console.error(`❌ Error adding brand "${brandData.name}":`, error.message);
      }
    }
  }

  console.log('\n✨ Brands seeding completed!\n');
}

export async function seedKeywords() {
  console.log('🌱 Seeding AgTech SEO keywords...\n');

  let order = 0;
  for (const keywordText of defaultSeoKeywords) {
    try {
      const existing = await db
        .select()
        .from(seoKeywords)
        .where(eq(seoKeywords.keyword, keywordText))
        .limit(1);

      if (existing.length > 0) {
        continue;
      }

      await db.insert(seoKeywords).values({
        keyword: keywordText,
        order: order++,
        active: true,
      });

      console.log(`✅ Keyword "${keywordText}" added`);
    } catch (error: any) {
      if (error.code !== 'ER_DUP_ENTRY') {
        console.error(`❌ Error adding keyword "${keywordText}":`, error.message);
      }
    }
  }

  console.log('\n✨ SEO keywords seeding completed!\n');
}

export async function seedHeroSections() {
  console.log('🌱 Seeding AgTech hero sections...\n');

  for (const slide of heroSectionsData) {
    try {
      const existing = await db
        .select()
        .from(heroSections)
        .where(eq(heroSections.title, slide.title))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(heroSections)
          .set(slide)
          .where(eq(heroSections.title, slide.title));
        console.log(`🔄 Updated slide: ${slide.title}`);
      } else {
        await db.insert(heroSections).values(slide);
        console.log(`✅ Added slide: "${slide.title}"`);
      }
    } catch (error: any) {
      console.error(`❌ Error adding hero section "${slide.title}":`, error.message);
    }
  }

  console.log(`\n✨ Hero sections seeding completed!\n`);
}

export async function seedAboutSection() {
  console.log('🌱 Seeding Nova Agro about section...\n');

  try {
    const existing = await db.select().from(aboutSections).limit(1);
    if (existing.length > 0) {
      await db
        .update(aboutSections)
        .set(aboutSectionData)
        .where(eq(aboutSections.id, existing[0].id));
      console.log(`🔄 Updated about section: ${aboutSectionData.title}`);
    } else {
      await db.insert(aboutSections).values(aboutSectionData);
      console.log(`✅ Added about section: ${aboutSectionData.title}`);
    }
  } catch (error: any) {
    console.error(`❌ Error seeding about section:`, error.message);
  }

  console.log('\n✨ About section seeding completed!\n');
}

export async function seedArticles() {
  console.log('🌱 Seeding agricultural blog articles...\n');

  const allCategories = await db.select().from(categories);
  const categoryMap = new Map(allCategories.map((cat) => [cat.slug, cat]));

  for (const article of articlesData) {
    try {
      const category = categoryMap.get(article.categorySlug);
      const existing = await db
        .select()
        .from(articles)
        .where(eq(articles.slug, article.slug))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(articles)
          .set({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            featuredImage: article.featuredImage,
            categoryId: category?.id || null,
            publishedAt: new Date(),
          })
          .where(eq(articles.slug, article.slug));
        console.log(`🔄 Updated article: ${article.title}`);
        continue;
      }

      await db.insert(articles).values({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featuredImage: article.featuredImage,
        categoryId: category?.id || null,
        publishedAt: new Date(),
        visible: true,
      });

      console.log(`✅ Added article: ${article.title}`);
    } catch (error: any) {
      if (error.code !== 'ER_DUP_ENTRY') {
        console.error(`❌ Error adding article "${article.title}":`, error.message);
      }
    }
  }

  console.log('\n✨ Articles seeding completed!\n');
}

// ========== MAIN SEED FUNCTION ==========

export async function seedAll() {
  try {
    console.log('🚀 Starting Nova Agro unified database seeding...\n');
    console.log('📌 Collation: utf8mb4_turkish_ci\n');

    // 1. Clean legacy industrial data if needed
    await cleanLegacyData();

    // 2. Ordered seed operations
    await seedAdminUsers();
    await seedSettings();
    await seedCategories();
    await seedServices();
    await seedBrands();
    await seedKeywords();
    await seedHeroSections();
    await seedAboutSection();
    await seedArticles();

    console.log('🎉 Nova Agro unified seeding completed successfully!');
    
    if (isDirectRun) {
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    if (isDirectRun) {
      process.exit(1);
    }
    throw error;
  }
}

// Run if called directly
if (isDirectRun) {
  seedAll();
}
