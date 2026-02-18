import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ADICIONE ESTA FUNÇÃO:
export function generateSlug(title: string): string {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') // Espaço vira traço
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/--+/g, '-') + // Remove traços duplicados
    `-${Date.now().toString().slice(-4)}` // Adiciona sufixo único para evitar duplicidade
}