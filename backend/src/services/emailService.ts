import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'curie.ishostname.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'info@novaagro.demo',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  farmLocation?: string;
  landArea?: string;
  cropType?: string;
  notes?: string;
  referenceCode: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  try {
    const adminUser = process.env.SMTP_USER || 'info@novaagro.demo';
    
    // Email to admin
    const adminMailOptions = {
      from: `"Nova Agro İletişim Formu" <${adminUser}>`,
      to: adminUser,
      replyTo: formData.email,
      subject: formData.subject || `Yeni İletişim Formu Mesajı - ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            Yeni İletişim Formu Mesajı
          </h2>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Adı:</strong> ${formData.name}</p>
            <p style="margin: 5px 0;"><strong>E-posta:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            ${formData.phone ? `<p style="margin: 5px 0;"><strong>Telefon:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>` : ''}
            ${formData.subject ? `<p style="margin: 5px 0;"><strong>Konu:</strong> ${formData.subject}</p>` : ''}
          </div>
          
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Mesaj:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Bu mesaj NOVA AGRO web sitesindeki iletişim formundan gönderilmiştir.<br>
            Yanıtlamak için: <a href="mailto:${formData.email}">${formData.email}</a>
          </p>
        </div>
      `,
      text: `
Yeni İletişim Formu Mesajı

Adı: ${formData.name}
E-posta: ${formData.email}
${formData.phone ? `Telefon: ${formData.phone}` : ''}
${formData.subject ? `Konu: ${formData.subject}` : ''}

Mesaj:
${formData.message}

---
Bu mesaj NOVA AGRO web platformundan gönderilmiştir.
      `.trim(),
    };

    if (process.env.SMTP_PASSWORD) {
      await transporter.sendMail(adminMailOptions);
    }

    // Auto-reply to customer
    const customerMailOptions = {
      from: `"NOVA AGRO" <${adminUser}>`,
      to: formData.email,
      subject: 'Mesajınız Alındı - NOVA AGRO',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            Mesajınız Alındı
          </h2>
          
          <p>Merhaba <strong>${formData.name}</strong>,</p>
          
          <p>
            NOVA AGRO iletişim formu üzerinden gönderdiğiniz mesajınızı aldık. 
            Ziraat mühendislerimiz en kısa sürede size geri dönüş yapacaktır.
          </p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">İletişim Bilgilerimiz</h3>
            <p style="margin: 5px 0;"><strong>E-posta:</strong> info@novaagro.demo</p>
            <p style="margin: 5px 0;"><strong>Telefon:</strong> +90 (242) 555 01 20</p>
            <p style="margin: 5px 0;"><strong>Adres:</strong> Antalya Tarım Teknokenti, AgTech İnovasyon Merkezi No: 18, Antalya</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Teşekkürler,<br>
            <strong>NOVA AGRO Ziraat Mühendisliği & AgTech Ekibi</strong>
          </p>
        </div>
      `,
      text: `
Mesajınız Alındı

Merhaba ${formData.name},

NOVA AGRO iletişim formu üzerinden gönderdiğiniz mesajınızı aldık. 
Ziraat mühendislerimiz en kısa sürede size geri dönüş yapacaktır.

İletişim Bilgilerimiz:
E-posta: info@novaagro.demo
Telefon: +90 (242) 555 01 20
Adres: Antalya Tarım Teknokenti, AgTech İnovasyon Merkezi No: 18, Antalya

Teşekkürler,
NOVA AGRO Ziraat Mühendisliği & AgTech Ekibi
      `.trim(),
    };

    if (process.env.SMTP_PASSWORD) {
      await transporter.sendMail(customerMailOptions);
    }

    console.log('Contact form emails processed successfully');
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw new Error('E-posta gönderilirken bir hata oluştu');
  }
};

export const sendQuoteEmail = async (data: QuoteFormData): Promise<void> => {
  try {
    const adminUser = process.env.SMTP_USER || 'info@novaagro.demo';

    const adminMailOptions = {
      from: `"Nova Agro Teklif Talebi" <${adminUser}>`,
      to: adminUser,
      replyTo: data.email,
      subject: `[${data.referenceCode}] Yeni Tarımsal Teklif Talebi - ${data.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            🌾 Yeni Tarımsal Teklif Talebi
          </h2>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; margin: 15px 0;">
            <strong style="color: #15803d;">Referans Kodu:</strong> <span style="font-size: 16px; font-weight: bold; color: #16a34a;">${data.referenceCode}</span>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Ad Soyad:</strong> ${data.fullName}</p>
            <p style="margin: 5px 0;"><strong>E-posta:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p style="margin: 5px 0;"><strong>Telefon:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
            <p style="margin: 5px 0;"><strong>Hizmet Türü:</strong> ${data.serviceType}</p>
            ${data.farmLocation ? `<p style="margin: 5px 0;"><strong>Konum:</strong> ${data.farmLocation}</p>` : ''}
            ${data.landArea ? `<p style="margin: 5px 0;"><strong>Arazi Büyüklüğü:</strong> ${data.landArea}</p>` : ''}
            ${data.cropType ? `<p style="margin: 5px 0;"><strong>Mahsul / Ürün:</strong> ${data.cropType}</p>` : ''}
          </div>
          ${data.notes ? `
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0;">
              <h3 style="color: #16a34a; margin-top: 0;">Ek Açıklamalar:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${data.notes}</p>
            </div>
          ` : ''}
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Bu talep Nova Agro Teklif Al modülü üzerinden iletilmiştir.
          </p>
        </div>
      `,
      text: `
Yeni Tarımsal Teklif Talebi
Referans Kodu: ${data.referenceCode}
Ad Soyad: ${data.fullName}
E-posta: ${data.email}
Telefon: ${data.phone}
Hizmet Türü: ${data.serviceType}
Konum: ${data.farmLocation || '-'}
Arazi: ${data.landArea || '-'}
Mahsul: ${data.cropType || '-'}
Notlar: ${data.notes || '-'}
      `.trim(),
    };

    if (process.env.SMTP_PASSWORD) {
      await transporter.sendMail(adminMailOptions);
    } else {
      console.log(`ℹ️ [EmailService Mock] Quote email logged for ${data.referenceCode}`);
    }
  } catch (error) {
    console.error('Error sending quote email notification:', error);
  }
};

// Test email connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email server connection is ready');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
};
