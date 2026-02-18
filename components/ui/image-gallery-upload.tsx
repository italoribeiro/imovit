'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud, X, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'

interface Props {
  defaultImages?: string[]
  name?: string
}

export function ImageGalleryUpload({ defaultImages = [], name = 'images' }: Props) {
  // CORREÇÃO: Inicializa o estado apenas uma vez com as props, sem useEffect para resetar.
  const [images, setImages] = useState<string[]>(defaultImages)
  const [isUploading, setIsUploading] = useState(false)

  // Log para depuração: abra o console do navegador (F12) antes de clicar em salvar.
  // Você verá que a ordem aqui muda conforme você arrasta.
  console.log('Ordem atual das imagens no componente:', images)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const uploadPromises = files.map(async (file) => {
      // Remove caracteres especiais e espaços do nome do arquivo
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedName}`
      
      const { error } = await supabase.storage.from('imovit-properties').upload(fileName, file)
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage.from('imovit-properties').getPublicUrl(fileName)
      return publicUrl
    })

    try {
      const newUrls = await Promise.all(uploadPromises)
      setImages(prev => [...prev, ...newUrls])
    } catch (err) {
      console.error(err)
      alert("Erro ao subir imagens. Tente arquivos menores.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    
    const newImages = [...images]
    const [movedItem] = newImages.splice(index, 1)
    newImages.splice(newIndex, 0, movedItem)
    setImages(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Input único enviando o array como string JSON. A ordem aqui será respeitada. */}
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((url, index) => (
          <div key={url + index} className="relative aspect-video group bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <img src={url} className="w-full h-full object-cover" alt="" />
            
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase shadow-lg z-10">
                Capa Principal
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {index > 0 && (
                <button type="button" onClick={() => moveImage(index, 'left')} className="p-2 bg-white text-slate-900 rounded-lg hover:bg-brand-500 hover:text-white transition-colors" title="Mover para esquerda">
                  <ArrowLeft size={16} />
                </button>
              )}
              <button type="button" onClick={() => removeImage(index)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" title="Excluir">
                <X size={16} />
              </button>
              {index < images.length - 1 && (
                <button type="button" onClick={() => moveImage(index, 'right')} className="p-2 bg-white text-slate-900 rounded-lg hover:bg-brand-500 hover:text-white transition-colors" title="Mover para direita">
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-brand-500 transition-all group">
          {isUploading ? (
            <Loader2 className="animate-spin text-brand-600" />
          ) : (
            <>
              <UploadCloud className="text-slate-400 mb-1 group-hover:text-brand-500 transition-colors" size={24} />
              <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-brand-500 transition-colors">ADICIONAR</span>
            </>
          )}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      </div>
      
      {images.length > 0 && (
         <p className="text-[10px] text-slate-400 italic">
           * A ordem que você vê acima é a ordem que será salva.
         </p>
      )}
    </div>
  )
}