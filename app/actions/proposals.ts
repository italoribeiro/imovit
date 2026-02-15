'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateProposalStatus(id: number, status: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  )

  const { error } = await supabase
    .from('proposals')
    .update({ status })
    .eq('id', id)

  if (!error) revalidatePath('/platform/admin/proposals')
  return { success: !error }
}