# Ice Cream Hill - icecreamhill.com

Video prodüksiyon stüdyosu web sitesi. Markalar (B2B) ve sanatçılar/kişiler (B2C) için video ve fotoğraf prodüksiyonu. Pazar Türkiye, site Türkçe (varsayılan) + İngilizce.

## Stack
- Astro 7, Tailwind CSS v4 (@tailwindcss/vite ile kurulu, src/styles/global.css)
- Fontlar Fontsource ile self-hosted: @fontsource/anton, @fontsource-variable/manrope, @fontsource-variable/jetbrains-mono
- Animasyon: gsap (+ ScrollTrigger), lenis (smooth scroll)
- İçerik: Astro Content Collections, ileride Keystatic CMS eklenecek
- Hosting: Cloudflare Pages (statik build)
- Dil: Astro yerleşik i18n routing. tr kök (/), en ikinci (/en/)
- Sayfa geçişleri: Astro 7'de `ViewTransitions` bileşeni yok, `astro:transitions` içinden `ClientRouter` kullanılıyor (src/layouts/Base.astro). Sayfa bazlı scriptler `astro:page-load` olayına bağlanır

## Marka ve tasarım dili
- Renkler: ana mavi #005AFF, siyah #0A0A0A, beyaz #FFFFFF. Yardımcı: koyu mavi #0041B8, açık mavi #3D82FF (siyah zeminde vurgu), buz #E8F0FF, gri #8A94A6 (ikincil metin), koyu gri metin #3A3F4A
- Tipografi: başlıklar Anton (büyük harf, line-height 0.9, letter-spacing -0.01em). Gövde ve menü Manrope. Etiketler, numaralar, bölüm başlık kodları JetBrains Mono (12px, uppercase, letter-spacing 0.08em)
- Bölüm ritmi: beyaz zemin, araya tam mavi (#005AFF) ve tam siyah (#0A0A0A) bloklar. Mavi sadece vurgu ve bir bölüm rengi, her yere yayılmaz
- Kartlarda ve görsellerde köşe yuvarlatma yok (sert köşe). Sadece butonlar pill (border-radius 999px)
- Bölüm etiketleri "01 / Seçili işler" formatında mono fontla

## Konumlandırma ve metin dili
- Ice Cream Hill isimsiz bir ekip olarak konuşur ("biz"). Metinlerde kişi adı geçmez, ekip büyüklüğü (kişi sayısı vb.) verilmez
- Logo dili: halftone, kolaj, hafif grunge. Site temiz ama kurumsal değil, editoryal
- Yasak: gradient blob, emoji ikon, left-border kart, Inter/Roboto/Arial, "Elevate your brand" tarzı jenerik metin, üçlü ikon-kart dizileri

## Sayfalar
- / ana sayfa: hero (tam ekran showreel video + büyük başlık), hizmet kelimeleri marquee, seçili işler (asimetrik grid, 5-6 proje), hizmetler (mavi blok, "Markalar için" ve "Sanatçılar ve kişiler için" iki sütun + 5 adımlı süreç), stüdyo, müşteri marquee, iletişim formu + footer (siyah)
- /isler: filtrelenebilir proje grid'i
- /isler/[slug]: proje detay (kapak video, 2-3 cümle, galeri, künye)
- /hizmetler, /studyo, /iletisim
- Her sayfanın /en/ karşılığı: /en/work, /en/work/[slug], /en/services, /en/studio, /en/contact (eşleme src/i18n/index.ts içinde)

## Proje kategorileri
sosyal-medya, urun, fabrika-tesis, fuar-etkinlik, muzik-videosu, portre-kampanya

## Hareket kuralları
- Lenis smooth scroll global
- Hero başlığı satır satır yukarıdan gelir
- Scroll ile görsellerde hafif parallax ve ölçek
- Proje kartlarında hover'da sessiz video loop
- Marquee CSS animasyonu
- Astro View Transitions ile sayfa geçişi
- prefers-reduced-motion açıksa tüm animasyonlar kapanır
- Mobilde ağır efektler (custom cursor, pinned horizontal scroll) kapalı

## Kod kuralları
- Bileşenler src/components/, layoutlar src/layouts/, içerik src/content/
- Görseller src/assets/ altında, astro:assets <Image> ile optimize
- Metinler i18n için src/i18n/tr.json ve en.json dosyalarında, bileşenler buradan okur
- Türkçe karakter (ş, ğ, ı, İ, ö, ü, ç) her yerde doğru render edilmeli, slug'larda ASCII'ye çevrilir
- Her değişiklikten sonra `npm run build` hatasız geçmeli
- Kullanıcıya terminal komutu verirken adım adım ve açıklamalı yaz
- Müşteriye görünecek metinlerde uzun tire (—) kullanma
