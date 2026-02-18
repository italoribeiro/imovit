'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  defaultValue?: string
  name?: string // Adicionamos o nome do campo para o formulário
}

export function ImageUpload({ defaultValue = '', name = 'image_url' }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('imovit-properties')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('imovit-properties')
        .getPublicUrl(fileName)

      setImageUrl(publicUrl)

    } catch (error) {
      console.error('Erro upload:', error)
      alert('Erro ao enviar imagem.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setImageUrl('')
  }

  return (
    <div className="w-full group">
      {/* O TRUQUE: Input invisível que o Server Action vai ler */}
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl ? (
        <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Capa" className="w-full h-full object-cover" />
          
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-brand-400 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
            {isUploading ? (
              <>
                <Loader2 size={40} className="animate-spin text-brand-500 mb-3" />
                <p className="text-sm font-bold text-brand-600">Enviando...</p>
              </>
            ) : (
              <>
                <UploadCloud size={40} className="mb-3 text-slate-400" />
                <p className="mb-1 text-sm font-bold text-slate-700">Clique para enviar a foto</p>
                <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
      )}
    </div>
  )
}