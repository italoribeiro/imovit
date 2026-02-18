'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PropertyCardSlider({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const hasImages = images && images.length > 0
  const photoList = hasImages ? images : ['/placeholder.png']

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault() // Impede de abrir o link do imóvel ao clicar na seta
    setCurrentIndex((prev) => (prev === photoList.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentIndex((prev) => (prev === 0 ? photoList.length - 1 : prev - 1))
  }

  return (
    <div className="relative h-full w-full group/slider overflow-hidden">
      <Image 
        src={photoList[currentIndex]} 
        alt={title} 
        fill 
        className="object-cover transition-transform duration-500 group-hover:scale-110" 
      />

      {/* Setas de Navegação (Só aparecem se houver mais de 1 foto e no hover) */}
      {photoList.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/60 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/60 text-white rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={16} />
          </button>

          {/* Indicador de quantidade (Estilo Zap) */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-md backdrop-blur-sm">
            {currentIndex + 1} / {photoList.length}
          </div>
        </>
      )}
    </div>
  )
}