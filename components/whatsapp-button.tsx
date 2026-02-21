'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { leadService } from '@/lib/services/lead-service';

interface WhatsAppButtonProps {
  propertyId: number;
  ownerName: string;
  ownerPhone: string;
  whatsappUrl: string;
}

export function WhatsAppButton({ propertyId, ownerName, ownerPhone, whatsappUrl }: WhatsAppButtonProps) {
  
  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Não usamos e.preventDefault() aqui para que o navegador lide com o target="_blank" naturalmente.
    
    // Dispara a gravação no banco em "background" (sem await, para não atrasar o clique do usuário)
    leadService.registerClick({
      property_id: propertyId,
      owner_name: ownerName || 'Não informado',
      owner_phone: ownerPhone || 'Não informado',
      source_page: 'detalhe_imovel'
    });
  };

  return (
    <a 
      href={whatsappUrl} 
      onClick={handleWhatsAppClick}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl font-black uppercase text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-[0.98]"
    >
      <MessageCircle size={20} /> Chamar no WhatsApp
    </a>
  );
}