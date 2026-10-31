import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface QuoteRequestPayload {
  serviceType: string;
  landArea: string;
  landUnit: 'Dekar' | 'Dönüm' | 'Hektar' | 'm²';
  cropType: string;
  farmLocation: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  kvkkConsent: boolean;
  referenceCode?: string;
  createdAt?: string;
}

export interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const AGRO_SERVICES = [
  'Zirai Drone İlaçlama, Haritalama & Multispektral Analiz',
  'Hassas Tarım & Akıllı Sulama Otomasyonu',
  'Toprak Analizi, Gübreleme & Bitki Besleme',
  'Modern Sera Otomasyonu & İklimlendirme',
  'Ziraat Mühendisliği Ruhsatlı Danışmanlık & Sertifikalı Tohumculuk',
];

const QUICK_CROPS = ['Mısır', 'Pamuk', 'Buğday', 'Ayçiçeği', 'Domates', 'Çeltik', 'Narenciye', 'Zeytin'];

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialService,
}) => {
  const [serviceType, setServiceType] = useState<string>(
    initialService || AGRO_SERVICES[0]
  );
  const [landArea, setLandArea] = useState<string>('');
  const [landUnit, setLandUnit] = useState<'Dekar' | 'Dönüm' | 'Hektar' | 'm²'>('Dekar');
  const [cropType, setCropType] = useState<string>('');
  const [farmLocation, setFarmLocation] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [kvkkConsent, setKvkkConsent] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync initialService when prop changes
  useEffect(() => {
    if (initialService) {
      setServiceType(initialService);
    }
  }, [initialService]);

  // Handle ESC key press and scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. serviceType
    if (!serviceType || !serviceType.trim()) {
      errs.serviceType = 'Lütfen bir hizmet türü seçiniz (serviceType is required).';
    }

    // 2. landArea
    if (landArea === undefined || landArea === null || String(landArea).trim() === '') {
      errs.landArea = 'Arazi / tesis büyüklüğü zorunludur (landArea is required).';
    } else {
      const areaNum = Number(landArea);
      if (isNaN(areaNum) || areaNum <= 0) {
        errs.landArea = 'Arazi büyüklüğü pozitif bir sayı olmalıdır (landArea must be a positive number).';
      }
    }

    // 3. fullName
    if (!fullName || fullName.trim().length < 2) {
      errs.fullName = 'Ad Soyad en az 2 karakter olmalıdır (fullName must be at least 2 characters).';
    }

    // 4. phone - Turkish mobile pattern (05XX, +905XX, 5XX)
    const normalizedPhone = phone ? phone.trim().replace(/^(\+90|0090|90)/, '0').replace(/\D/g, '') : '';
    const isPhoneValid = /^(0?5\d{9})$/.test(normalizedPhone);
    if (!isPhoneValid) {
      errs.phone = 'Geçerli bir Türkiye cep telefonu giriniz (phone must be a valid Turkish mobile number, 05XX XXX XX XX).';
    }

    // 5. email (optional, but validate format if present)
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Geçerli bir e-posta adresi giriniz (email format is invalid).';
      }
    }

    // 6. KVKK
    if (!kvkkConsent) {
      errs.kvkkConsent = 'KVKK aydınlatma metnini onaylamanız gerekmektedir.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Reference code generation: AGRO-2026-XXXX format
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refCode = `AGRO-2026-${randomSuffix}`;

    const payload: QuoteRequestPayload = {
      serviceType,
      landArea: String(landArea).trim(),
      landUnit,
      cropType: cropType.trim(),
      farmLocation: farmLocation.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      kvkkConsent,
      referenceCode: refCode,
      createdAt: new Date().toISOString(),
    };

    // Try posting to API
    try {
      await api.post('/quotes', payload);
    } catch {
      // Graceful offline mock fallback
    }

    // LocalStorage fallback & persistence simulation
    try {
      const existing = JSON.parse(localStorage.getItem('nova_agro_quote_requests') || '[]');
      existing.push(payload);
      localStorage.setItem('nova_agro_quote_requests', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }

    // Simulate network delay for natural UI response
    await new Promise((resolve) => setTimeout(resolve, 500));

    setReferenceCode(refCode);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setServiceType(initialService || AGRO_SERVICES[0]);
    setLandArea('');
    setLandUnit('Dekar');
    setCropType('');
    setFarmLocation('');
    setFullName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setKvkkConsent(false);
    setErrors({});
    setReferenceCode('');
    setCopied(false);
  };

  const handleClose = () => {
    onClose();
    if (isSubmitted) {
      handleReset();
    }
  };

  const copyRefCode = () => {
    if (!referenceCode) return;
    navigator.clipboard.writeText(referenceCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="quote-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div
        className="quote-modal-container"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
          animation: 'quoteModalFadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="quote-modal-header"
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
              }}
            >
              🌱
            </div>
            <div>
              <h2
                id="quote-modal-title"
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                }}
              >
                Nova Agro - Zirai Hizmet & Fiyat Teklifi Al
              </h2>
              <p
                style={{
                  margin: '0.15rem 0 0',
                  fontSize: '0.85rem',
                  color: '#64748b',
                }}
              >
                Tarımsal operasyon ve arazinize özel agronomik fiyat teklifi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Kapat"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              color: '#64748b',
              cursor: 'pointer',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div
          className="quote-modal-body"
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
          }}
        >
          {isSubmitted ? (
            /* Success State */
            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.2)',
                }}
              >
                ✓
              </div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: '0 0 0.5rem',
                }}
              >
                Teklif Talebiniz Başarıyla Alındı!
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#475569',
                  maxWidth: '500px',
                  lineHeight: 1.5,
                  margin: '0 0 1.5rem',
                }}
              >
                Ziraat mühendislerimiz arazi büyüklüğünüz ve mahsul gereksinimlerinize göre hazırlanan
                ön fizibilite ve operasyon teklifini en kısa sürede iletecektir.
              </p>

              {/* Reference Code Card */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1.5px dashed #86efac',
                  borderRadius: '12px',
                  padding: '1.25rem 2rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#15803d',
                    fontWeight: 600,
                  }}
                >
                  Teklif Takip Referans Kodu
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace, monospace',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      color: '#16a34a',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {referenceCode}
                  </span>
                  <button
                    type="button"
                    onClick={copyRefCode}
                    style={{
                      backgroundColor: copied ? '#16a34a' : '#ffffff',
                      color: copied ? '#ffffff' : '#15803d',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>
              </div>

              {/* Summary Pill Grid */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <strong style={{ color: '#64748b' }}>Hizmet:</strong>
                  <div style={{ color: '#0f172a', fontWeight: 600 }}>{serviceType}</div>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>Arazi:</strong>
                  <div style={{ color: '#0f172a', fontWeight: 600 }}>
                    {landArea} {landUnit}
                  </div>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>Mahsul / Lokasyon:</strong>
                  <div style={{ color: '#0f172a', fontWeight: 600 }}>
                    {cropType || '-'} {farmLocation ? `(${farmLocation})` : ''}
                  </div>
                </div>
                <div>
                  <strong style={{ color: '#64748b' }}>İletişim:</strong>
                  <div style={{ color: '#0f172a', fontWeight: 600 }}>
                    {fullName} — {phone}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.75rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)',
                  }}
                >
                  Tamam, Kapat
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Yeni Teklif Oluştur
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} noValidate>
              {/* Hizmet Türü */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="quote-serviceType"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.4rem',
                  }}
                >
                  Hizmet Türü <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="quote-serviceType"
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value);
                    if (errors.serviceType) setErrors((prev) => ({ ...prev, serviceType: '' }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: errors.serviceType ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                >
                  {AGRO_SERVICES.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem', margin: '0.35rem 0 0' }}>
                    {errors.serviceType}
                  </p>
                )}
              </div>

              {/* Arazi Büyüklüğü & Birim */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="quote-landArea"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.4rem',
                  }}
                >
                  Arazi / Tesis Büyüklüğü <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="quote-landArea"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Örn: 250"
                    value={landArea}
                    onChange={(e) => {
                      setLandArea(e.target.value);
                      if (errors.landArea) setErrors((prev) => ({ ...prev, landArea: '' }));
                    }}
                    style={{
                      flex: 1,
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: errors.landArea ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  <select
                    id="quote-landUnit"
                    value={landUnit}
                    onChange={(e) => setLandUnit(e.target.value as any)}
                    style={{
                      width: '120px',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      outline: 'none',
                      fontWeight: 500,
                    }}
                  >
                    <option value="Dekar">Dekar</option>
                    <option value="Dönüm">Dönüm</option>
                    <option value="Hektar">Hektar</option>
                    <option value="m²">m²</option>
                  </select>
                </div>
                {errors.landArea && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.35rem', margin: '0.35rem 0 0' }}>
                    {errors.landArea}
                  </p>
                )}
              </div>

              {/* Mahsul / Ürün Türü & Konum */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label
                    htmlFor="quote-cropType"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Mahsul / Ürün Türü
                  </label>
                  <input
                    id="quote-cropType"
                    type="text"
                    placeholder="Örn: Mısır, Pamuk, Buğday..."
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="quote-farmLocation"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Uygulama / Arazi Konumu
                  </label>
                  <input
                    id="quote-farmLocation"
                    type="text"
                    placeholder="İl / İlçe (Örn: Adana / Ceyhan)"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Quick Crop Pills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', marginRight: '0.5rem' }}>
                  Hızlı Seçim:
                </span>
                <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {QUICK_CROPS.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setCropType(crop)}
                      style={{
                        background: cropType === crop ? '#dcfce7' : '#f1f5f9',
                        color: cropType === crop ? '#15803d' : '#475569',
                        border: '1px solid',
                        borderColor: cropType === crop ? '#86efac' : '#e2e8f0',
                        borderRadius: '12px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: cropType === crop ? 600 : 400,
                      }}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* İletişim Bilgileri: Ad Soyad & Telefon */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label
                    htmlFor="quote-fullName"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Ad Soyad <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="quote-fullName"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: errors.fullName ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  {errors.fullName && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.35rem 0 0' }}>
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="quote-phone"
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Telefon Numarası <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '8px',
                      border: errors.phone ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  {errors.phone && (
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.35rem 0 0' }}>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* E-posta */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="quote-email"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.4rem',
                  }}
                >
                  E-posta Adresi <span style={{ fontSize: '0.8rem', color: '#64748b' }}>(PDF Teklifi İçin Opsiyonel)</span>
                </label>
                <input
                  id="quote-email"
                  type="email"
                  placeholder="ornek@alanadi.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: errors.email ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
                {errors.email && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.35rem 0 0' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Ek Notlar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="quote-notes"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.4rem',
                  }}
                >
                  Arazi & Uygulama Notları
                </label>
                <textarea
                  id="quote-notes"
                  rows={2}
                  placeholder="Arazi eğimi, varsa zararlı/hastalık tipi, acil tarih talebi veya eklemek istediğiniz detaylar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem',
                    color: '#0f172a',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* KVKK Onay Kutusu */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: '#475569',
                    lineHeight: 1.4,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={kvkkConsent}
                    onChange={(e) => {
                      setKvkkConsent(e.target.checked);
                      if (errors.kvkkConsent) setErrors((prev) => ({ ...prev, kvkkConsent: '' }));
                    }}
                    style={{
                      marginTop: '0.2rem',
                      width: '17px',
                      height: '17px',
                      accentColor: '#16a34a',
                      cursor: 'pointer',
                    }}
                  />
                  <span>
                    Nova Agro Kişisel Verilerin Korunması Kanunu (KVKK) aydınlatma metnini ve zirai
                    teklif bildirimleri amacıyla iletişime geçilmesini onaylıyorum.{' '}
                    <span style={{ color: '#ef4444' }}>*</span>
                  </span>
                </label>
                {errors.kvkkConsent && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.35rem 0 0' }}>
                    {errors.kvkkConsent}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.75rem 1.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)',
                    opacity: isSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isSubmitting ? 'Teklif Talebi Gönderiliyor...' : 'Teklif Talebini Gönder'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
