import { db } from '../db/connection.js';
import { projects, categories, projectImages } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateSlug } from '../utils/slug.js';

async function seedProjects() {
  try {
    console.log('🌱 Tarımsal AgTech projeleri ekleniyor...');

    // Kategorileri getir
    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map((cat) => [cat.slug, cat]));

    const projectData = [
      // 1. Zirai Drone & Havadan Analiz
      {
        categorySlug: 'zirai-drone-havadan-analiz',
        projects: [
          {
            title: 'Çukurova 12.000 Dekar Mısır ve Pamuk Sahasında Otonom Zirai Drone İlaçlama ve NDVI Haritalama',
            description: 'Adana Çukurova bölgesinde 12.000 dekar alanda otonom zirai dronelar ile değişken oranlı (VRA) ilaçlama ve multispektral NDVI bitki sağlığı haritalama projesi.',
            content: `
              <h3>Proje Kapsamı ve Uygulama</h3>
              <p>Çukurova'nın yoğun tarımsal üretim havzasında Nova Agro AgTech filosu tarafından yürütülen geniş ölçekli havadan koruma projesi:</p>
              <ul>
                <li>Multispektral kameralarla NDVI bitki stres indeksi ve yabancı ot yoğunluk haritalarının çıkarılması</li>
                <li>RTK santimetre hassasiyetli otonom zirai insansız hava araçları ile milimetrik gece/gündüz ilaçlama</li>
                <li>Traktör tekerleği kaynaklı %6'lık mekanik ezilme rekolte kaybının tamamen engellenmesi</li>
                <li>Geleneksel pülverizatörlere oranla %90 su ve %32 kimyasal girdi tasarrufu</li>
                <li>Pamukta yeşilkurt ve mısırda koçan kurdu zararlılarına karşı %98 biyolojik etkinlik</li>
              </ul>
              <p>Tüm operasyonel uçuş kayıtları ve analiz raporları çiftlik yönetim bilgi sistemine anlık olarak entegre edilmiştir.</p>
            `,
            location: 'Adana / Çukurova',
            image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800',
            order: 1,
            seoTitle: 'Çukurova Zirai Drone İlaçlama & NDVI Haritalama | Nova Agro',
            seoDescription: 'Çukurova 12.000 dekar mısır ve pamuk arazisinde otonom zirai drone ilaçlama ve multispektral analiz projesi.',
            seoKeywords: 'zirai drone ilaçlama, Çukurova tarım, NDVI analiz, hassas tarım, Nova Agro',
            additionalImages: [
              'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
              'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
            ],
          },
          {
            title: 'Güneydoğu Anadolu Buğday Ekim Alanlarında Değişken Oranlı (VRA) Havadan Gübreleme',
            description: 'Harran Ovası genelinde tahıl ekili arazilerde havadan granül üre gübreleme ve multispektral klorofil haritalama projesi.',
            content: `
              <h3>Uygulanan AgTech Çözümleri</h3>
              <p>Harran Ovası'nda 8.000 dekar buğday arazisinde fenolojik kardeşlenme ve sapa kalkma dönemlerinde havadan besleme gerçekleştirilmiştir:</p>
              <ul>
                <li>Hava sensörleri ile tespit edilen azot eksiklik bölgelerine Değişken Oranlı (VRA) granül gübre atımı</li>
                <li>Ağır killi toprak yapısı nedeniyle traktörün giremediği yağış sonrası kritik gübreleme penceresinin yakalanması</li>
                <li>Dekar başına ortalama 45 kg verim artışı ve protein kalitesinde %1.8 artış</li>
              </ul>
            `,
            location: 'Şanlıurfa / Harran Ovası',
            image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
            order: 2,
            seoTitle: 'Harran Ovası Havadan Granül Gübreleme | Nova Agro',
            seoDescription: 'Güneydoğu Anadolu tahıl ekim alanlarında zirai drone ile granül gübreleme ve azot haritalama.',
            seoKeywords: 'havadan gübreleme, granül gübreleme, drone tarım, Harran tarım, buğday gübreleme',
            additionalImages: [
              'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800',
            ],
          },
        ],
      },

      // 2. Akıllı Sulama & Otomasyon
      {
        categorySlug: 'akilli-sulama-otomasyon',
        projects: [
          {
            title: 'Ege Bölgesi 3.500 Dekar Zeytinlik ve Bağ LoRaWAN Akıllı Sulama Otomasyonu',
            description: 'Manisa Akhisar ve Salihli havzasında 3.500 dekar zeytin ve bağ tesisinde kablosuz telemetri ve solar otonom damlama sulama sistemi.',
            content: `
              <h3>Akıllı Sulama Mimarisi</h3>
              <p>Yüksek kaliteli sofralık zeytin ve bağ alanlarında su tüketimini %42 azaltan hassas sulama projesi:</p>
              <ul>
                <li>15 km menzilli LoRaWAN ağ geçidi ve 64 adet kablosuz selenoid vana aktüatörü</li>
                <li>30, 60 ve 90 cm derinlikte toprak nemi, toprak sıcaklığı ve tuzluluk (EC) telemetri istasyonları</li>
                <li>Yerel meteoroloji istasyonu verileriyle Penman-Monteith evapotranspirasyon (ET0) hesaplaması</li>
                <li>Solar güneş paneli ve lityum bataryalı otonom pompa istasyonları kontrol panosu</li>
                <li>Mobil ve web kontrol paneli üzerinden basınç dengesizliği ve boru patlama erken uyarı alarmı</li>
              </ul>
            `,
            location: 'Manisa / Akhisar',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
            order: 1,
            seoTitle: 'Zeytin ve Bağ LoRaWAN Akıllı Sulama Projesi | Nova Agro',
            seoDescription: 'Ege Bölgesi 3.500 dekar zeytinlikte LoRaWAN kablosuz vana kontrolü ve nem telemetrisi projesi.',
            seoKeywords: 'akıllı sulama, LoRaWAN tarım, zeytin sulama, damlama sulama otomasyonu, su tasarrufu',
            additionalImages: [
              'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800',
            ],
          },
          {
            title: 'İç Anadolu Şeker Pancarı Sahasında Solar Güneş Enerjili Pompa ve Nem Telemetrisi',
            description: 'Konya Çumra ovasında derin kuyu dalgıç pompaları için güneş enerjili off-grid sürücü ve toprak nem profil optimizasyonu.',
            content: `
              <h3>Solar Sulama ve Enerji Dönüşümü</h3>
              <p>Yüksek elektrik maliyetlerine karşı derin kuyu dalgıç motorlarının solar pompa sürücüleriyle entegrasyonu:</p>
              <ul>
                <li>120 kWp fotovoltaik güneş paneli sahası ve MPPT frekans invertörü</li>
                <li>Şebekeden bağımsız otonom kuyu suyu transferi ve rezervuar havuzu yönetimi</li>
                <li>Şeker pancarı kök gelişim dönemine göre dinamik sulama debisi regülasyonu</li>
              </ul>
            `,
            location: 'Konya / Çumra',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800',
            order: 2,
            seoTitle: 'Konya Solar Pompa & Nem Telemetrisi | Nova Agro',
            seoDescription: 'Konya Çumra şeker pancarı üretiminde solar kuyu pompası ve akıllı sulama projesi.',
            seoKeywords: 'solar sulama, güneş enerjili pompa, Konya tarım, şeker pancarı sulama, telemetri',
            additionalImages: [
              'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
            ],
          },
        ],
      },

      // 3. Toprak Analizi & Gübreleme
      {
        categorySlug: 'toprak-analizi-gubreleme',
        projects: [
          {
            title: 'Konya Havzası Tahıl Ekim Alanları Kapsamlı Toprak Analizi ve Reçeteli Taban Gübreleme',
            description: '20.000 dekar alanda GPS koordinatlı toprak numune alımı, akredite laboratuvar analizi ve tarlaya özel reçeteli taban gübreleme projesi.',
            content: `
              <h3>Bilimsel Toprak İyileştirme Çözümleri</h3>
              <p>Toprak verimliliğini restore etmek ve gereksiz kimyasal kullanımını önlemek amacıyla gerçekleştirilen kapsamlı toprak etüdü:</p>
              <ul>
                <li>Her 25 dekardan GPS koordinatlı standart helezon burgulu toprak numunesi alımı</li>
                <li>Akredite laboratuvarımızda ICP-OES cihazı ile makro ve mikro element analizi</li>
                <li>Yüksek kireç ve alkali pH kaynaklı fosfor kilitlenmesine karşı sıvı kükürt ve hümik asit ıslah reçetesi</li>
                <li>Ziraat yüksek mühendislerimiz tarafından parsel bazlı hazırlanan 5 aşamalı besleme takvimi</li>
              </ul>
            `,
            location: 'Konya / Karapınar',
            image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
            order: 1,
            seoTitle: 'Konya Havzası Toprak Analizi & Gübreleme Reçetesi | Nova Agro',
            seoDescription: 'Konya Karapınar tahıl alanlarında akredite laboratuvar toprak analizi ve parsel bazlı gübreleme planlaması.',
            seoKeywords: 'toprak analizi, gübreleme reçetesi, Konya tarım, bitki besleme, akredite laboratuvar',
            additionalImages: [
              'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800',
            ],
          },
          {
            title: 'Bursa Ovası Meyve Bahçelerinde Mikro Element Eksikliği Teşhisi ve Yaprak Besleme Programı',
            description: 'Şeftali, armut ve kiraz bahçelerinde kloroz sararma sorununa karşı yaprak doku analizi ve şelatlı mikro besin takviyesi.',
            content: `
              <h3>Meyvecilikte Hassas Yaprak Analizi</h3>
              <p>Marmara Bölgesi'nin kritik meyve üretim merkezinde meyve kalitesini ve ihracat standardını yükselten yaprak analiz çalışması:</p>
              <ul>
                <li>Fenolojik çiçeklenme ve meyve bağlama dönemlerinde yaprak numune taraması</li>
                <li>Demir (Fe), Çinko (Zn) ve Kalsiyum (Ca) noksanlıklarının yapraktan şelatlı formda telafisi</li>
                <li>Meyve sertliği ve raf ömründe %25 artış, depolama kayıplarında %40 azalma</li>
              </ul>
            `,
            location: 'Bursa / Gürsu',
            image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800',
            order: 2,
            seoTitle: 'Bursa Meyve Bahçesi Yaprak Analizi | Nova Agro',
            seoDescription: 'Bursa Gürsu meyve bahçelerinde mikro element eksikliği teşhisi ve yaprak gübreleme çözümleri.',
            seoKeywords: 'yaprak analizi, meyve bahçesi gübreleme, kloroz tedavisi, Bursa tarım, şelatlı çinko',
            additionalImages: [
              'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
            ],
          },
        ],
      },

      // 4. Modern Sera Otomasyonu
      {
        categorySlug: 'modern-sera-otomasyonu',
        projects: [
          {
            title: 'Antalya Kumluca 50 Dekar Topraksız Cam Sera Tam Otomasyon ve Sisleme Sistemi',
            description: 'Yüksek teknolojili salkım domates serasında 70 bar yüksek basınçlı sisleme, otomatik gölgeleme perdesi ve EC/pH besin dozajlama sistemi.',
            content: `
              <h3>Modern Sera Otomasyonu Mimarisi</h3>
              <p>Akdeniz sahil kuşağında aşırı yaz sıcaklıklarına karşı kesintisiz üretim sağlayan anahtar teslim modern sera projesi:</p>
              <ul>
                <li>70 bar yüksek basınçlı mikronize sisleme ile sera sıcaklığında 7-9 °C düşüş</li>
                <li>VPD (Buhar Basıncı Açığı) hesaplayıcı algoritma ile otomatik çatı pencereleri ve fan-pad koordinasyonu</li>
                <li>A/B gübre tankları ve asit enjeksiyonu ile 0.05 hassasiyetli EC/pH kapalı devre fertigasyon ünitesi</li>
                <li>İklimlendirme bilgisayarı ve bulut tabanlı mobil izleme/alarm SCADA altyapısı</li>
                <li>Yıllık dekar başına 42 ton salkım domates rekor rekoltesi</li>
              </ul>
            `,
            location: 'Antalya / Kumluca',
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
            order: 1,
            seoTitle: 'Antalya Topraksız Cam Sera Otomasyonu | Nova Agro',
            seoDescription: 'Antalya Kumluca 50 dekar cam serada 70 bar sisleme, fertigasyon ve tam iklim otomasyonu projesi.',
            seoKeywords: 'sera otomasyonu, topraksız tarım, sisleme sistemi, Antalya sera, iklimlendirme',
            additionalImages: [
              'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800',
            ],
          },
          {
            title: 'İzmir Dikili Jeotermal Sera İklimlendirme ve CO2 Dozajlama Entegrasyonu',
            description: 'Jeotermal kaynaklı modern sera kompleksinde borulu ısıtma, CO2 zenginleştirme ve fotosentez optimizasyon otomasyonu.',
            content: `
              <h3>Jeotermal Enerjiyle Sürdürülebilir Seracılık</h3>
              <p>Ege'nin zengin jeotermal kaynaklarının sera iklimlendirme sistemlerine entegrasyonu:</p>
              <ul>
                <li>Termal kuyu suyu eşanjörleri ve ray borulu zemin ısıtma dengesi</li>
                <li>Sıvı CO2 dozajlama ünitesi ile sera içi 800-1000 ppm CO2 konsantrasyonu sağlanması</li>
                <li>Kış aylarında fotosentez hızında %30 artış ve erken hasat avantajı</li>
              </ul>
            `,
            location: 'İzmir / Dikili',
            image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800',
            order: 2,
            seoTitle: 'İzmir Jeotermal Sera İklimlendirme | Nova Agro',
            seoDescription: 'Dikili jeotermal sera tesisinde otomatik ısıtma kontrolü ve CO2 dozajlama otomasyonu.',
            seoKeywords: 'jeotermal sera, sera ısıtma, CO2 dozajlama, İzmir tarım, modern sera',
            additionalImages: [
              'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
            ],
          },
        ],
      },

      // 5. Ziraat Mühendisliği & Danışmanlık
      {
        categorySlug: 'ziraat-muhendisligi-danismanlik',
        projects: [
          {
            title: 'Trakya Ayçiçeği Ekim Alanlarında Entegre Zararlı Yönetimi (IPM) ve Mühendislik Danışmanlığı',
            description: 'Tekirdağ ve Edirne havzasında 15.000 dekar ayçiçeği sahasında canavar otu (orobanş), çayır tırtılı ve mildiyö erken uyarı takvimi danışmanlığı.',
            content: `
              <h3>Ruhsatlı Zirai Danışmanlık & Koruma</h3>
              <p>Trakya'nın can damarı olan yağlık ayçiçeği üretiminde kayıpları sıfıra indiren bilimsel danışmanlık modeli:</p>
              <ul>
                <li>Tarım ve Orman Bakanlığı ruhsatlı ziraat mühendisleri tarafından haftalık arazi taramaları</li>
                <li>Feromon tuzakları ve meteoroloji istasyonu verileriyle zararlı çıkış günlerinin matematiksel modellenmesi</li>
                <li>Gereksiz koruyucu ilaçlama yerine nokta atışı Entegre Mücadele (IPM) reçetelendirmesi</li>
                <li>Orobanş parazitine karşı toleranslı sertifikalı tohum seçimi danışmanlığı</li>
              </ul>
            `,
            location: 'Tekirdağ / Hayrabolu',
            image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
            order: 1,
            seoTitle: 'Trakya Ayçiçeği Entegre Zararlı Danışmanlığı | Nova Agro',
            seoDescription: 'Trakya ayçiçeği ekim alanlarında ruhsatlı ziraat mühendisliği ve IPM erken uyarı danışmanlığı.',
            seoKeywords: 'zirai danışmanlık, ziraat mühendisliği, ayçiçeği hastalıkları, IPM, Trakya tarım',
            additionalImages: [
              'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800',
            ],
          },
          {
            title: 'Gediz Havzası Yüksek Çimlenme Garantili Sertifikalı Mısır Tohumu Adaptasyon Projesi',
            description: 'Manisa Salihli bölgesinde FAO 650-700 grubu hibrit mısır çeşitlerinin kuraklık toleransı ve koçan doldurma performans testleri.',
            content: `
              <h3>Sertifikalı Tohum & Adaptasyon Çalışması</h3>
              <p>Bölge iklim ve toprak şartlarına en uygun yüksek rekolteli hibrit tohum hatlarının belirlenmesi:</p>
              <ul>
                <li>Bakanlık tescilli orijinal sertifikalı tohum varyetelerinin deneme parsellerinde ekimi</li>
                <li>Çıkış gücü, sap sağlamlığı ve koçan ucu kapalılık oranlarının fenolojik takibi</li>
                <li>Dekar başına 1.650 kg danelik mısır verimi ile bölge ortalamasının %22 üzerinde rekolte</li>
              </ul>
            `,
            location: 'Manisa / Salihli',
            image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800',
            order: 2,
            seoTitle: 'Gediz Havzası Sertifikalı Tohum Adaptasyonu | Nova Agro',
            seoDescription: 'Manisa Salihli ovasında sertifikalı hibrit mısır tohumu deneme ve adaptasyon danışmanlığı.',
            seoKeywords: 'sertifikalı tohum, mısır tohumu, tohumculuk, ziraat mühendisi, Manisa tarım',
            additionalImages: [
              'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
            ],
          },
        ],
      },
    ];

    let totalInserted = 0;

    for (const categoryData of projectData) {
      const category = categoryMap.get(categoryData.categorySlug);

      if (!category) {
        console.log(`⚠️  Kategori bulunamadı: ${categoryData.categorySlug}`);
        continue;
      }

      for (const project of categoryData.projects) {
        try {
          const slug = generateSlug(project.title);
          
          const existing = await db
            .select()
            .from(projects)
            .where(eq(projects.slug, slug))
            .limit(1);

          let projectId: number;

          if (existing.length > 0) {
            projectId = existing[0].id;
            await db
              .update(projects)
              .set({
                categoryId: category.id,
                title: project.title,
                description: project.description,
                content: project.content.trim(),
                image: project.image,
                location: project.location,
                seoTitle: (project as any).seoTitle || null,
                seoDescription: (project as any).seoDescription || null,
                seoKeywords: (project as any).seoKeywords || null,
                order: project.order,
              })
              .where(eq(projects.id, projectId));
            console.log(`🔄 Güncellendi: ${project.title}`);
          } else {
            const insertResult = await db.insert(projects).values({
              categoryId: category.id,
              title: project.title,
              slug: slug,
              description: project.description,
              content: project.content.trim(),
              image: project.image,
              location: project.location,
              seoTitle: (project as any).seoTitle || null,
              seoDescription: (project as any).seoDescription || null,
              seoKeywords: (project as any).seoKeywords || null,
              order: project.order,
            });

            projectId = insertResult[0].insertId;
            console.log(`✅ Proje eklendi: ${project.title}`);
          }

          if (project.additionalImages && Array.isArray(project.additionalImages) && project.additionalImages.length > 0) {
            // Delete old images for this project first
            await db.delete(projectImages).where(eq(projectImages.projectId, projectId));

            for (let i = 0; i < project.additionalImages.length; i++) {
              try {
                await db.insert(projectImages).values({
                  projectId: projectId,
                  imageUrl: project.additionalImages[i],
                  order: i + 1,
                });
              } catch (imgError: any) {
                console.error(`❌ Resim eklenirken hata:`, imgError.message);
              }
            }
          }

          totalInserted++;
        } catch (error: any) {
          console.error(`❌ Hata (${project.title}):`, error.message);
        }
      }
    }

    console.log(`\n🎉 Toplam ${totalInserted} tarımsal proje başarıyla işlendi!`);
  } catch (error) {
    console.error('❌ Proje seed işlemi başarısız:', error);
    throw error;
  }
}

export { seedProjects };
