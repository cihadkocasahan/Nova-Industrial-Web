function WhatsAppButton() {
  const phoneNumber = '905550000000'; // +90 kaldırıldı (WhatsApp formatı için)
  const message = encodeURIComponent('Merhaba, Nova Agro ile ilgili bilgi almak istiyorum.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      title="WhatsApp ile iletişime geçin"
      aria-label="WhatsApp ile iletişime geçin"
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="whatsapp-icon" />
      <span className="whatsapp-button-text">WhatsApp</span>
    </a>
  );
}

export default WhatsAppButton;


