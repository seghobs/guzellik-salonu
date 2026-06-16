export interface EmailTemplateData {
  musteriAd: string;
  hizmetAd: string;
  uzmanAd: string;
  tarih: string;
  saat: string;
  fiyat: number;
  randevuId?: string;
}

export function getAppointmentConfirmationTemplate(data: EmailTemplateData): string {
  return `
    <div style="font-family: 'DM Sans', sans-serif; background-color: #FDFAF5; padding: 30px; border: 1px solid #F5ECD7; max-width: 600px; margin: 0 auto; color: #2D2A2E;">
      <div style="text-align: center; border-bottom: 2px solid #8B5E83; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #1A1118; text-transform: uppercase; letter-spacing: 2px; margin: 0;">LuxeBeauty</h1>
        <p style="font-style: italic; color: #8B5E83; margin: 5px 0 0 0;">Güzelliğin En Rafine Hali</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Sayın <strong>${data.musteriAd}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6;">Randevunuz başarıyla alınmıştır. Rezervasyon detaylarınız aşağıda yer almaktadır:</p>
      
      <div style="background-color: #ffffff; padding: 20px; border: 1px solid #F5ECD7; margin: 20px 0; border-left: 4px solid #8B5E83;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #1A1118;">Hizmet:</td>
            <td style="padding: 6px 0; text-align: right;">${data.hizmetAd}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #1A1118;">Uzman:</td>
            <td style="padding: 6px 0; text-align: right;">${data.uzmanAd}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #1A1118;">Tarih:</td>
            <td style="padding: 6px 0; text-align: right;">${data.tarih}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #1A1118;">Saat:</td>
            <td style="padding: 6px 0; text-align: right;">${data.saat}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #1A1118;">Toplam Tutar:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #8B5E83;">${data.fiyat} TL</td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 13px; line-height: 1.6; color: #2D2A2E/80; text-align: center; margin-top: 30px;">
        Sorularınız veya değişiklik talepleriniz için <strong>+90 212 555 00 00</strong> numaralı telefondan bizimle iletişime geçebilirsiniz.
      </p>
      
      <div style="text-align: center; border-top: 1px solid #F5ECD7; padding-top: 20px; margin-top: 30px; font-size: 11px; color: #2D2A2E/50;">
        <p>Nişantaşı Mah. Güzellik Cad. No:42, Şişli / İstanbul | info@luxebeauty.com</p>
        <p>&copy; ${new Date().getFullYear()} LuxeBeauty. Tüm hakları saklıdır.</p>
      </div>
    </div>
  `;
}

export function getContactMessageTemplate(data: { adSoyad: string; email: string; telefon: string; konu: string; mesaj: string }): string {
  return `
    <div style="font-family: 'DM Sans', sans-serif; background-color: #FDFAF5; padding: 30px; border: 1px solid #F5ECD7; max-width: 600px; margin: 0 auto; color: #2D2A2E;">
      <div style="border-bottom: 2px solid #8B5E83; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #1A1118; text-transform: uppercase; margin: 0;">Yeni İletişim Mesajı</h2>
        <p style="font-size: 12px; color: #8B5E83; margin: 5px 0 0 0;">LuxeBeauty Web Sitesi</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; font-weight: bold; width: 120px;">Gönderen:</td>
          <td style="padding: 6px 0;">${data.adSoyad}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold;">E-posta:</td>
          <td style="padding: 6px 0;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold;">Telefon:</td>
          <td style="padding: 6px 0;">${data.telefon}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold;">Konu:</td>
          <td style="padding: 6px 0; font-weight: bold; color: #8B5E83;">${data.konu}</td>
        </tr>
      </table>
      
      <div style="background-color: #ffffff; padding: 20px; border: 1px solid #F5ECD7; font-size: 14px; line-height: 1.6;">
        <h3 style="margin-top: 0; font-size: 14px; border-bottom: 1px solid #F5ECD7; padding-bottom: 8px;">Mesaj İçeriği:</h3>
        <p style="white-space: pre-wrap; margin-bottom: 0;">${data.mesaj}</p>
      </div>
    </div>
  `;
}
