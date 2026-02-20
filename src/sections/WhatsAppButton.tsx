import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '13055550147'; // Número de ejemplo
  const message = encodeURIComponent('Hola ATELIER, me gustaría consultar sobre un proyecto.');
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl bg-dark-light border border-gold/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <span className="text-cream text-sm">Chatea con nosotros</span>
        <div className="absolute top-full right-6 w-2 h-2 bg-dark-light border-r border-b border-gold/30 transform rotate-45 -mt-1" />
      </div>

      {/* Button */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 whatsapp-gradient rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Main button */}
        <div className="relative w-16 h-16 whatsapp-gradient rounded-full flex items-center justify-center whatsapp-pulse group-hover:scale-110 transition-transform duration-300">
          <MessageCircle size={28} className="text-white fill-white" />
        </div>

        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-dark flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">1</span>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
