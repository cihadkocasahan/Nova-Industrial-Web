/**
 * Nova Agro — Standalone Mock Data Layer
 * Provides comprehensive, high-fidelity agricultural datasets for 100% offline standalone capability.
 */

import type {
  Service,
  HeroSection,
  Category,
  Project,
  Brand,
  Article,
  AboutSection,
  Page,
  SeoKeyword,
} from '../types';
import type { SiteInfo } from './api';

export interface AgriculturalServiceDetail extends Service {
  categoryName?: string;
  badge?: string;
  features: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  slug: string;
}

// 1. Site Info Mock
export const mockSiteInfo: SiteInfo = {
  site_name: 'Nova Agro',
  site_slogan: 'Geleceğin Tarımı İçin İleri AgTech & Ziraat Mühendisliği',
  site_email: 'demo@nova-agro.example',
  site_phone: '+90 (555) 000 00 00',
  site_address: 'Lorem Ipsum Mah. Teknoloji Cad. No: 123/A, Kadıköy / İstanbul',
  site_whatsapp: '905550000000',
  site_primary_color: '#16a34a',
  site_cta_text: 'Teklif Al',
  site_meta_title: 'Nova Agro | İleri AgTech & Ziraat Mühendisliği Çözümleri',
  site_meta_description: 'Zirai drone ilaçlama, hassas tarım, toprak analizi ve modern sera otomasyonunda öncü AgTech çözümleri.',
  site_meta_keywords: 'zirai drone, agtech, hassas tarım, ziraat mühendisliği, sera otomasyonu, toprak analizi, Nova Agro',
};

// 2. Hero Sections (Carousel Slides) Mock
export const mockHeroSections: HeroSection[] = [
  {
    id: 1,
    title: 'Nova Agro — Zirai Drone & Multispektral Analiz',
    subtitle: 'RTK Destekli Hassas Otonom İlaçlama ve NDVI Bitki Sağlığı Haritalama',
    description: 'Santimetre hassasiyetinde değişken oranlı ilaçlama (VRA) ile mahsulü ezmeden %90 su ve %30 kimyasal tasarrufu sağlayın.',
    ctaText: 'Hizmeti İncele',
    ctaLink: '/#services',
    backgroundImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80',
    active: true,
    order: 1,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Hassas Tarım & Akıllı Sulama Otomasyonu',
    subtitle: 'IoT Toprak Nem Sensörleri ve Yapay Zeka Destekli Sulama Yönetimi',
    description: 'Toprak nemi ve mikroklima verileriyle otonom çalışan sulama altyapısı sayesinde su ve enerji israfına son verin.',
    ctaText: 'Sulama Çözümleri',
    ctaLink: '/#services',
    backgroundImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&q=80',
    active: true,
    order: 2,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 3,
    title: 'Modern Sera Otomasyonu & İklimlendirme',
    subtitle: '365 Gün Yüksek Verimli Örtüaltı Tarım ve Fertigasyon Çözümleri',
    description: 'Endüstriyel iklim bilgisayarları, oransal havalandırma ve topraksız fertigasyon ile maksimum fotosentez ve rekolte artışı.',
    ctaText: 'Sera Sistemleri',
    ctaLink: '/#services',
    backgroundImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80',
    active: true,
    order: 3,
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
];

// 3. The 5 Core Agricultural Services Mock
export const mockServices: AgriculturalServiceDetail[] = [
  {
    id: 1,
    title: 'Zirai Drone İlaçlama, Haritalama & Multispektral Analiz',
    slug: 'zirai-drone-ilaclama-haritalama-multispektral-analiz',
    description: 'RTK santimetre hassasiyetli otonom zirai insansız hava araçları (İHA) ile değişken oranlı ilaçlama (VRA), NDVI/NDRE multispektral bitki sağlığı haritalama ve rekolte tahmin çözümleri.',
    icon: 'flight_takeoff',
    iconText: 'flight_takeoff',
    order: 1,
    visible: true,
    categoryName: 'Hassas Tarım Teknolojileri',
    badge: 'RTK & Multispektral',
    features: [
      'RTK (Gerçek Zamanlı Kinematik) ±1 cm hassasiyetli otonom rota uçuşu',
      'NDVI ve NDRE 5 bantlı multispektral bitki stres haritalama',
      'Değişken Oranlı Uygulama (VRA) reçete haritası ile nokta atışı ilaçlama',
      'Santrifüj atomize püskürtme memeleri ile 50-300 mikron ayarlanabilir damlacık boyutu',
      'Traktör tekerlek izi kaynaklı %5 ezilme kaybının tamamen sıfırlanması',
      'Konvansiyonel pülverizatörlere kıyasla %90 su ve %30 kimyasal tasarrufu',
    ],
    specs: [
      { label: 'Tank Kapasitesi', value: '40 Litre sıvı / 50 kg granül yayma' },
      { label: 'İş Genişliği & Hızı', value: '7.5 - 11 m püskürtme, 10 m/s uçuş hızı' },
      { label: 'Günlük Kapasite', value: '1.500 - 2.500 dekar / filo / gün' },
      { label: 'Sensör Çözünürlüğü', value: '5 Bant Multispektral + 20 MP RGB (2 cm/px)' },
      { label: 'Rüzgar Dayanımı', value: '8 m/s operasyonel limit; IPX6K koruma' },
    ],
    benefits: [
      'Çamurlu arazide traktörsüz zamanında acil ilaçlama imkanı',
      'Bitkiyi ve toprağı ezmeden sıfır verim kaybı',
      'Yeraltı sularına ve çevreye minimum kimyasal sızıntı',
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 2,
    title: 'Hassas Tarım & Akıllı Sulama Otomasyonu',
    slug: 'hassas-tarim-akilli-sulama-otomasyonu',
    description: 'IoT toprak nem ve tuzluluk sensörleri, meteoroloji istasyonları ve yapay zeka destekli evapotranspirasyon (ET0) modelleriyle tam otomatik, uzaktan yönetilebilir akıllı sulama sistemleri.',
    icon: 'water_drop',
    iconText: 'water_drop',
    order: 2,
    visible: true,
    categoryName: 'Akıllı Su ve Enerji Yönetimi',
    badge: 'IoT & Telemetri',
    features: [
      '10, 30, 60, 90 cm çok derinlikli toprak nemi, sıcaklık ve tuzluluk (EC) izleme',
      'Tarla içi mikroklima meteoroloji istasyonu (radyasyon, rüzgar, bağıl nem, ET0)',
      'LoRaWAN kablosuz 15 km menzilli vana ve debimetre kontrol üniteleri',
      'Güneş enerjili bağımsız saha düğümleri (şebeke gerektirmez)',
      'Mobil uygulama ve web panelinden anlık debi, hat basıncı ve kuyu seviye takibi',
      'Otomatik basınç düşüşü ve hat patlağı koruma sistemi ile SMS uyarısı',
    ],
    specs: [
      { label: 'Sensör Doğruluğu', value: '±%1.5 VWC (Hacimsel Su), 0-50 dS/m EC' },
      { label: 'Haberleşme', value: 'LoRaWAN 868 MHz / NB-IoT / GSM çift yedekli' },
      { label: 'Pompa Sürücüsü', value: 'VFD Değişken Frekanslı Sürücü (Sabit Basınç)' },
      { label: 'Pil Ömrü', value: 'Solar destekli 5+ yıl kesintisiz lityum batarya' },
      { label: 'Tasarruf', value: '%35 - %45 Su, %30 Pompalama Elektrik Enerjisi' },
    ],
    benefits: [
      'Aşırı sulamadan kaynaklanan kök çürüklüğü ve mantari hastalıkları önler',
      'Elektrik faturalarında ve derin kuyu enerji sarfiyatında %30 tasarruf',
      'Uzaktan tek tıkla vana açma/kapama ve zaman programlama',
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 3,
    title: 'Toprak Analizi, Gübreleme & Bitki Besleme',
    slug: 'toprak-analizi-gubreleme-bitki-besleme',
    description: 'GPS destekli grid toprak örnekleme, akredite laboratuvar analizleri ve bitki doku testleri ile parsel bazında reçeteli gübreleme ve toprak ıslah programları.',
    icon: 'science',
    iconText: 'science',
    order: 3,
    visible: true,
    categoryName: 'Toprak Sağlığı & Agrokimi',
    badge: 'Laboratuvar & CBS',
    features: [
      'CBS (GIS) tabanlı 10-25 dekar grid sistematik toprak karot örneklemesi',
      'Tam kapsamlı fiziksel analiz: bünye (kum-silt-kil), kireç (% CaCO3), drenaj sınıfı',
      'Kimyasal analiz: pH, EC (tuzluluk), Organik Madde, Katyon Değişim Kapasitesi',
      'Makro ve mikro element tayini (Azot, Fosfor, Potasyum, Kalsiyum, Demir, Çinko, Bor)',
      'Sezon içi yaprak petiol ve doku analizi ile gizli besin noksanlığı erken tespiti',
      'Ruhsatlı Ziraat Mühendisi onaylı parsel bazlı fertigasyon ve taban gübreleme reçetesi',
    ],
    specs: [
      { label: 'Analiz Metodu', value: 'ICP-OES Spektrofotometre, Dumas Azot, Olsen P' },
      { label: 'Hassasiyet', value: 'ppm (mg/kg) duyarlılığında mikro besin ölçümü' },
      { label: 'Rapor Formatı', value: 'Dijital Harita (Shapefile, GeoJSON), ISOBUS XML' },
      { label: 'Verim Artışı', value: '%20 - %35 verim ve ürün kalite sınıfı artışı' },
      { label: 'Maliyet Avantajı', value: 'Bilinçli gübreleme ile %25 gübre tasarrufu' },
    ],
    benefits: [
      'Toprağın tuzlanmasını ve çoraklaşmasını engelleyen sürdürülebilir ıslah',
      'Gereksiz aşırı gübre kullanımını önleyerek doğrudan girdi maliyetini düşürme',
      'Traktör gübre dağıtıcı terminalleriyle tam uyumlu değişken oranlı ISOBUS haritaları',
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 4,
    title: 'Modern Sera Otomasyonu & İklimlendirme',
    slug: 'modern-sera-otomasyonu-iklimlendirme',
    description: 'Endüstriyel cam ve polikarbon seralar için tam entegre iklimlendirme bilgisayarları, oransal havalandırma, sisleme, perdeleme ve topraksız tarım fertigasyon üniteleri.',
    icon: 'thermostat',
    iconText: 'thermostat',
    order: 4,
    visible: true,
    categoryName: 'Örtüaltı Tarım Teknolojileri',
    badge: 'İklim & Fertigasyon',
    features: [
      'Çok bölmeli merkezi sera iklim kontrol bilgisayarı (Climate Computer)',
      'Meteoroloji istasyonu koruması (fırtına, şiddetli rüzgar ve yağmurda otomatik kapanma)',
      'Oransal çift pencere ve yan havalandırma redüktör motor sürücüleri',
      'Termal enerji perdeleri ve karartma (blackout) mekanizmaları',
      'Yüksek basınçlı evaporatif sisleme (Fogging) ve serinletme otomasyonu',
      'Kapalı devre topraksız A-B-C fertigasyon ve UV drenaj sterilizasyonu',
    ],
    specs: [
      { label: 'İklim Kontrolü', value: '±0.2 °C sıcaklık, ±%1 nem, ±0.05 kPa VPD hassasiyeti' },
      { label: 'Fertigasyon', value: '±0.05 mS/cm EC, ±0.1 pH otomatik asit/gübre dozajlama' },
      { label: 'Motor Sürücüleri', value: '3 Faz 400V IP55 enkoderli pencere motorları' },
      { label: 'CO2 Yönetimi', value: '0 - 2000 ppm ayarlanabilir baca gazı veya sıvı CO2' },
      { label: 'Su Geri Kazanımı', value: 'Drenaj arıtma ünitesi ile %30 su ve gübre tasarrufu' },
    ],
    benefits: [
      'Yılın 365 günü optimum fotosentez iklimi ve homojen ürün gelişimi',
      'Topraksız tarımda kök bölgesinde hassas besin ve oksijen dengesi',
      'Isıtma ve havalandırma enerji giderlerinde %25 verimlilik artışı',
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 5,
    title: 'Ziraat Mühendisliği Ruhsatlı Danışmanlık & Sertifikalı Tohumculuk',
    slug: 'ziraat-muhendisligi-ruhsatli-danismanlik-sertifikali-tohumculuk',
    description: 'T.C. Tarım ve Orman Bakanlığı ruhsatlı ziraat mühendisleri denetiminde tarımsal işletme yönetimi, entegre mücadele (IPM) reçeteleri ve yüksek verimli sertifikalı tohum temini.',
    icon: 'verified',
    iconText: 'verified',
    order: 5,
    visible: true,
    categoryName: 'Ruhsatlı Danışmanlık & Tohumculuk',
    badge: 'Bakanlık Ruhsatlı',
    features: [
      'T.C. Tarım ve Orman Bakanlığı onaylı Yetkili Tarımsal Danışmanlık Belgesi',
      'Haftalık fenolojik saha teftişi, gelişim takibi ve dijital tarla günlüğü',
      'Entegre Zararlı Yönetimi (IPM) ve biyolojik/biyoteknik mücadele programları',
      'Resmi Bitki Koruma Ürünleri (BKÜ) reçete yazma ve bayilik yetkisi',
      'OECD standartlarında Mavi ve Beyaz etiketli sertifikalı tohum tedariki',
      'GlobalGAP ve İyi Tarım Uygulamaları (İTU) belgelendirme danışmanlığı',
    ],
    specs: [
      { label: 'Ruhsat & Yetki', value: 'T.C. Tarım Bakanlığı Danışmanlık Ruhsatı & BKÜ Yetkisi' },
      { label: 'Tohum Standardı', value: 'OECD Sertifikalı (Çimlenme ≥ %95, Safiyet ≥ %99)' },
      { label: 'Saha Denetimi', value: 'Kritik fenolojik evrelerde haftalık arazi teftişi' },
      { label: 'Raporlama', value: 'Multispektral uydu/drone verisiyle dijital saha raporu' },
      { label: 'Portföy', value: 'Tarla bitkileri, bağcılık, meyvecilik ve örtüaltı sebze' },
    ],
    benefits: [
      'Gereksiz pestisit ve kimyasal kullanımını önleyen akredite reçete güvencesi',
      'Bölge iklimine ve toprak yapısına en uygun tohum varyeteleriyle maksimum çimlenme',
      'İhracat standartlarında kalıntısız (MRL limitlerine uygun) güvenli mahsul üretimi',
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
];

// 4. Categories Mock
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Zirai Drone Teknolojileri',
    slug: 'zirai-drone-teknolojileri',
    description: 'Otonom RTK zirai insansız hava araçları ile multispektral haritalama ve ultra düşük hacimli değişken oranlı ilaçlama çözümleri.',
    visible: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 2,
    name: 'Akıllı Sulama Sistemleri',
    slug: 'akilli-sulama-sistemleri',
    description: 'IoT toprak nem sensörleri, LoRaWAN kablosuz vana telemetrisi ve yapay zeka destekli evapotranspirasyon sulama otomasyonu.',
    visible: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 3,
    name: 'Toprak Sağlığı & Bitki Besleme',
    slug: 'toprak-sagligi-bitki-besleme',
    description: 'GPS grid örnekleme, laboratuvar mineral analizleri ve parsel bazında değişken oranlı ISOBUS reçeteli gübreleme.',
    visible: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 4,
    name: 'Modern Örtüaltı & Sera Sistemleri',
    slug: 'modern-ortualti-sera-sistemleri',
    description: 'Endüstriyel sera iklim kontrol bilgisayarları, topraksız tarım fertigasyon üniteleri ve oransal havalandırma sistemleri.',
    visible: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 5,
    name: 'Zirai Danışmanlık & Sertifikalı Tohum',
    slug: 'zirai-danismanlik-sertifikali-tohum',
    description: 'Bakanlık ruhsatlı ziraat mühendisliği danışmanlığı, entegre mücadele (IPM) ve OECD sertifikalı yüksek verimli tohum tedariki.',
    visible: true,
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
];

// 5. Projects (Agricultural Case Studies) Mock
export const mockProjects: Project[] = [
  {
    id: 1,
    categoryId: 1,
    title: 'Çukurova 1.500 Dekar Mısır Zirai Drone İlaçlama & NDVI Analizi',
    slug: 'cukurova-1500-dekar-misir-zirai-drone-ilaclama-ndvi-analizi',
    description: 'Aşırı yağış sonrası çamurlu tarlaya traktör giremediğinde 4 filoluk RTK zirai drone ile 3 günde 1.500 dekar koçan kurdu ilaçlaması ve NDVI haritalaması tamamlandı.',
    content: '<p>Çukurova bölgesinde mısır tarlalarında koçan kurdu istilası sırasında meydana gelen aşırı yağışlar traktörlerin tarlaya girmesini imkansız hale getirmişti. Nova Agro zirai drone ekibi, RTK baz istasyonu kurarak 4 adet 40L kapasiteli otonom İHA ile operasyon başlattı. 3 günde 1.500 dekar arazi santimetre hassasiyetinde ilaçlandı, traktör tekerlek izi kaybı sıfırlandı ve %92 su tasarrufu sağlandı.</p>',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80',
    location: 'Adana / Ceyhan',
    seoTitle: 'Çukurova Mısır Zirai Drone İlaçlama Projesi | Nova Agro',
    seoDescription: 'Çukurova bölgesinde 1.500 dekar mısır arazisinde otonom zirai drone ile rekor sürede ilaçlama ve multispektral analiz projesi.',
    seoKeywords: 'zirai drone ilaçlama, mısır koçan kurdu, Adana tarım, NDVI haritalama',
    order: 1,
    visible: true,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 2,
    categoryId: 2,
    title: 'Konya Ovası 850 Dekar LoRaWAN Akıllı Damla Sulama Otomasyonu',
    slug: 'konya-ovasi-850-dekar-lorawan-akilli-damla-sulama-otomasyonu',
    description: 'Yeraltı su seviyesinin kritik olduğu Konya kapalı havzasında, 850 dekar şeker pancarı ve buğday arazisinde IoT nem sensörlü ve güneş enerjili akıllı sulama altyapısı kuruldu.',
    content: '<p>Konya havzasında su tasarrufunu maksimize etmek amacıyla 850 dekar arazi 12 sulama sektörüne bölündü. Her parsele 30-60-90 cm derinlikte kablosuz LoRaWAN nem sensörleri ve güneş enerjili vana kontrol üniteleri yerleştirildi. Pompa istasyonu VFD frekans sürücüsü ile sabit basınçta çalıştırılarak hem su tüketiminde %42, hem de elektrik sarfiyatında %33 net tasarruf sağlandı.</p>',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80',
    location: 'Konya / Karapınar',
    seoTitle: 'Konya Ovası Akıllı Damla Sulama Otomasyonu | Nova Agro',
    seoDescription: 'Konya Karapınar bölgesinde 850 dekar arazide LoRaWAN destekli IoT toprak nem sensörleri ve akıllı sulama otomasyonu projesi.',
    seoKeywords: 'akıllı sulama, LoRaWAN vana kontrol, Konya tarım, su tasarrufu',
    order: 2,
    visible: true,
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 3,
    categoryId: 4,
    title: 'Antalya Kumluca 45 Dekar Yüksek Teknolojili Topraksız Cam Sera',
    slug: 'antalya-kumluca-45-dekar-yuksek-teknolojili-topraksiz-cam-sera',
    description: 'İhracatlık salkım domates üretimi için tam otonom iklimlendirme bilgisayarı, yüksek basınçlı fogging ve kapalı devre A-B-C fertigasyon sistemi devreye alındı.',
    content: '<p>Antalya Kumluca bölgesinde 45 dekarlık modern venlo tipi cam serada, iç iklim parametreleri (sıcaklık, nem, radyasyon, VPD) saniyelik hassasiyetle kontrol edilmektedir. Topraksız kokopit ortamında yetiştirilen domatesler için EC ve pH dengeli fertigasyon ünitesi ile %35 rekolte artışı ve ihracat kalibre standartları yakalanmıştır.</p>',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80',
    location: 'Antalya / Kumluca',
    seoTitle: 'Antalya Topraksız Cam Sera Otomasyonu Projesi | Nova Agro',
    seoDescription: 'Antalya Kumluca modern cam serada tam otomatik iklim bilgisayarı ve kapalı devre fertigasyon çözümü.',
    seoKeywords: 'sera otomasyonu, topraksız tarım, Antalya sera, iklimlendirme bilgisayarı',
    order: 3,
    visible: true,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 4,
    categoryId: 3,
    title: 'Harran Ovası 2.200 Dekar Pamuk Dijital Besin & Zararlı Haritalama',
    slug: 'harran-ovasi-2200-dekar-pamuk-dijital-besin-zararli-haritalama',
    description: 'Harran Ovasında GPS grid toprak örneklemesi ve sezon içi 4 periyot multispektral drone taraması ile değişken oranlı potasyum ve azot reçetesi uygulandı.',
    content: '<p>Şanlıurfa Harran Ovasında 2.200 dekarlık pamuk tarlasında aşırı gübreleme ve taban suyu tuzlanmasına karşı kapsamlı bir toprak sağlığı projesi yürütüldü. Laboratuvar ICP-OES analizleri sonucunda değişken oranlı gübreleme haritaları traktör terminallerine yüklendi; verimde %24 artış, gübre girdi maliyetinde ise %28 tasarruf sağlandı.</p>',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&q=80',
    location: 'Şanlıurfa / Harran',
    seoTitle: 'Harran Pamuk Dijital Besin ve Toprak Haritalama | Nova Agro',
    seoDescription: 'Harran Ovasında 2.200 dekar pamuk arazisinde GPS grid toprak analizi ve değişken oranlı gübreleme projesi.',
    seoKeywords: 'toprak analizi, Harran pamuk, değişken oranlı gübreleme, ISOBUS',
    order: 4,
    visible: true,
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
];

// 6. Partner Brands Mock
export const mockBrands: Brand[] = [
  {
    id: 1,
    name: 'DJI Agriculture',
    logoUrl: '/brands/dji.svg',
    websiteUrl: 'https://ag.dji.com',
    order: 1,
    active: true,
    visible: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'John Deere AgTech',
    logoUrl: '/brands/deere.svg',
    websiteUrl: 'https://www.deere.com',
    order: 2,
    active: true,
    visible: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Trimble Agriculture',
    logoUrl: '/brands/trimble.svg',
    websiteUrl: 'https://agriculture.trimble.com',
    order: 3,
    active: true,
    visible: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Netafim Precision Irrigation',
    logoUrl: '/brands/netafim.svg',
    websiteUrl: 'https://www.netafim.com',
    order: 4,
    active: true,
    visible: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Yara International',
    logoUrl: '/brands/yara.svg',
    websiteUrl: 'https://www.yara.com',
    order: 5,
    active: true,
    visible: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    name: 'Rain Bird Smart Water',
    logoUrl: '/brands/rainbird.svg',
    websiteUrl: 'https://www.rainbird.com',
    order: 6,
    active: true,
    visible: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

// 7. Educational AgTech Articles Mock
export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'NDVI Haritalama Rehberi: Multispektral Drone ile Erken Stres Teşhisi',
    slug: 'ndvi-haritalama-rehberi-multispektral-drone-erken-stres-teshisi',
    excerpt: 'Multispektral kameralarla bitkide klorofil yoğunluğu, azot yetersizliği ve kuraklık stresini gözle görünmeden 10 gün önce nasıl tespit edebilirsiniz?',
    content: '<p>Normalize Edilmiş Fark Bitki İndeksi (NDVI), bitkilerin fotosentez aktivitesini ve genel canlılık durumunu ölçmede kullanılan en güvenilir uzaktan algılama metriğidir. Sağlıklı bitki dokusu fotosentez sırasında kırmızı ışığı (650 nm) emerken, yaprak hücre yapısı yakın kızılötesi (NIR - 840 nm) dalga boyunu güçlü şekilde geri yansıtır. Nova Agro zirai drone filoları, 5 bantlı multispektral sensörlerle tarlanın her metrekaresini santimetre çözünürlükle tarayarak mantari hastalık odaklarını ve azot stresini semptomlar tarlaya yayılmadan tespit eder.</p>',
    featuredImage: '/articles/placeholder-drone.svg',
    categoryId: 1,
    publishedAt: '2026-02-18T10:00:00.000Z',
    visible: true,
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Değişken Oranlı Gübreleme (VRA) ve Toprak Sağlığı Yönetimi',
    slug: 'degisken-oranli-gubreleme-vra-toprak-sagligi-yonetimi',
    excerpt: 'Tarlanın her noktasına aynı miktar gübre atmak neden verim kaybına ve toprak çoraklaşmasına yol açar? Değişken oranlı ISOBUS gübreleme yöntemi.',
    content: '<p>Geleneksel tarımda tüm parsele hektar başına sabit oranlı taban gübresi uygulanması, yüksek verimli zonlarda besin yetersizliğine, düşük verimli zonlarda ise aşırı gübreleme kaynaklı tuzlanmaya neden olur. GPS destekli grid toprak analizlerimiz ve NDVI canlılık haritalarımız birleştirilerek oluşturulan ISOBUS uyumlu VRA reçete haritaları, traktör terminaline yüklenerek gübre saçıcı diskleri parsel zonlarına göre otomatik dozlar. Böylece hem gübre maliyetinden %25 tasarruf edilir hem de toprak canlılığı korunur.</p>',
    featuredImage: '/articles/placeholder-soil.svg',
    categoryId: 3,
    publishedAt: '2026-02-22T10:00:00.000Z',
    visible: true,
    createdAt: '2026-02-22T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 3,
    title: 'Modern Seralarda İklim Kontrolü ve Buhar Basıncı Açığı (VPD) Optimizasyonu',
    slug: 'modern-seralarda-iklim-kontrolu-ve-buhar-basinci-acigi-vpd-optimizasyonu',
    excerpt: 'Sadece sıcaklık ve neme bakarak sera yönetmek neden yetersizdir? VPD parametresi ile transpirasyonu ve kalsiyum taşınımını maksimize etme yolları.',
    content: '<p>Örtüaltı tarımında bitkinin yaprak stomalarını açarak karbondioksit alabilmesi ve köklerden kalsiyum ile diğer besin elementlerini tepe noktasına taşıyabilmesi için yaprak ile sera havası arasındaki buhar basıncı farkının (VPD) 0.8 - 1.2 kPa aralığında tutulması şarttır. Nova Agro iklim kontrol otomasyonu, yaprak sıcaklık sensörleri ve oransal sisleme sistemleriyle VPD değerini gerçek zamanlı hesaplayarak tepe pencerelerini ve enerji perdelerini mikrosaniyelik döngülerle yönetir.</p>',
    featuredImage: '/articles/placeholder-greenhouse.svg',
    categoryId: 4,
    publishedAt: '2026-02-26T10:00:00.000Z',
    visible: true,
    createdAt: '2026-02-26T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
];

// 8. About Section Mock
export const mockAboutSection: AboutSection = {
  id: 1,
  title: 'Nova Agro — Geleceğin Tarımını İleri Mühendislikle İnşa Ediyoruz',
  content: `
    <div class="about-lead">
      <p><strong>Nova Agro</strong>, tarımsal verimliliği ve gıda güvenliğini maksimize etmek amacıyla ileri AgTech teknolojilerini ziraat mühendisliği disipliniyle buluşturan öncü bir tarımsal mühendislik platformudur.</p>
    </div>
    <div class="about-grid">
      <div class="about-item">
        <h4>Misyonumuz</h4>
        <p>Geleneksel tarımsal alışkanlıkları veri temelli hassas tarım yöntemleriyle dönüştürmek; su, gübre ve pestisit girdilerini minimize ederken birim alandan alınan verimi ve kaliteyi en üst düzeye çıkarmaktır.</p>
      </div>
      <div class="about-item">
        <h4>Uzman Kadromuz</h4>
        <p>Bünyemizdeki T.C. Tarım ve Orman Bakanlığı ruhsatlı ziraat mühendisleri, İHA-2 ticari drone pilotları ve tarımsal yazılım uzmanlarımızla sahadan laboratuvara kesintisiz agronomik danışmanlık sunuyoruz.</p>
      </div>
      <div class="about-item">
        <h4>Sürdürülebilirlik</h4>
        <p>Toprak mikrobiyolojisini koruyan, yeraltı sularını kirletmeyen ve karbon ayak izini düşüren çevre dostu entegre mücadele (IPM) prensipleriyle gelecek nesillere verimli topraklar bırakmayı taahhüt ediyoruz.</p>
      </div>
    </div>
  `,
  visible: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-03-01T12:00:00.000Z',
};

// 9. Home Settings Mock
export const mockHomeSettings = {
  home_show_articles: true,
  home_show_services: true,
  home_show_projects: true,
  home_show_categories: true,
};

// 10. Pages Mock
export const mockPages: Page[] = [
  {
    id: 1,
    title: 'Hakkımızda',
    slug: 'hakkimizda',
    content: 'Nova Agro kurumsal bilgileri ve ziraat mühendisliği çözümleri.',
    seoTitle: 'Hakkımızda | Nova Agro İleri Tarım Teknolojileri',
    seoDescription: 'Nova Agro kurumsal ziraat mühendisliği ve AgTech inovasyonları.',
    publishedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

// 11. SEO Keywords Mock
export const mockSeoKeywords: SeoKeyword[] = [
  { id: 1, keyword: 'Zirai Drone İlaçlama', order: 1, active: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 2, keyword: 'Multispektral NDVI Haritalama', order: 2, active: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 3, keyword: 'Akıllı Damla Sulama Otomasyonu', order: 3, active: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 4, keyword: 'Toprak Analizi ve Fertigasyon', order: 4, active: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 5, keyword: 'Modern Sera İklim Bilgisayarı', order: 5, active: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

// 12. Contact Forms Mock
export const mockContactForms = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@ornek-ciftlik.example',
    phone: '+90 555 111 22 33',
    subject: 'Mısır Tarlası Zirai Drone İlaçlama Teklifi',
    message: '250 dekar mısır arazimizde koçan kurdu mücadelesi için DJI T50 drone ilaçlama hizmeti talep etmekteyiz.',
    read: true,
    createdAt: '2026-03-15T09:30:00.000Z',
  },
  {
    id: 2,
    name: 'Mehmet Özdemir',
    email: 'mehmet.ozdemir@antalyasera.example',
    phone: '+90 555 444 55 66',
    subject: 'Topraksız Domates Serası Otomasyonu',
    message: '30 dekar modern cam seramız için akıllı fertigasyon ve iklimlendirme otomasyonu kurulumu hakkında görüşmek istiyoruz.',
    read: false,
    createdAt: '2026-03-20T14:15:00.000Z',
  },
];

