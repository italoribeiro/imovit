import { supabase } from '@/lib/supabase' // Verifique se o caminho do seu supabase client está correto

export const leadService = {
  async registerClick(data: {
    property_id: number;
    owner_name: string;
    owner_phone: string;
    source_page: string;
  }) {
    try {
      // Faz a inserção na tabela leads_log que aparece na sua imagem
      const { error } = await supabase
        .from('leads_log')
        .insert([data]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao salvar lead:', err);
      return false; // Retorna false mas não quebra a aplicação
    }
  }
};