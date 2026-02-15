'use server'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function submitProposal(formData: FormData) {
  const rawValue = String(formData.get('totalOffer') || '0').replace(/\D/g, '')
  const cleanValue = Number(rawValue) / 100

  const { error } = await supabase.from('proposals').insert({
    property_id: formData.get('propertyId'),
    client_name: formData.get('name'),
    client_email: formData.get('email'),
    client_phone: formData.get('phone'),
    notes: formData.get('message'),
    total_offer: cleanValue,
    status: 'novo'
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  return { success: true }
}

export async function updateProposalStatus(id: number, status: string) {
  const { data, error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/platform/admin/proposals')
  return { success: true }
}