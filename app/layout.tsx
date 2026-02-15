import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// CONFIGURAÇÃO DE SEO E METADADOS
export const metadata: Metadata = {
  title: {
    template: '%s | Imovit', // As páginas internas ficarão: "Dashboard | Imovit"
    default: 'Imovit Admin | Gestão Imobiliária Inteligente',
  },
  description: 'CRM de alta performance com inteligência artificial para corretores e gestão de leads.',
  keywords: ['imobiliária', 'crm', 'inteligência artificial', 'gestão de leads', 'ceará', 'investimento'],
  authors: [{ name: 'Italo Ribeiro' }],
  creator: 'Italo Ribeiro',
  robots: {
    index: true,
    follow: true,
  },
  // Configuração para quando compartilhar o link no WhatsApp
  openGraph: {
    title: 'Imovit - Inteligência Imobiliária',
    description: 'Transforme leads em vendas com análise de IA.',
    url: 'https://imovit.netlify.app',
    siteName: 'Imovit Admin',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50`}
      >
        {/* O conteúdo principal expande para empurrar o rodapé (flex-grow) */}
        <main className="flex-grow w-full">
          {children}
        </main>

        {/* RODAPÉ FIXO NO FINAL */}
        <footer className="w-full py-8 text-center border-t border-slate-200 bg-white mt-auto">
          <div className="container mx-auto px-4">
            <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-widest">
              App idealizado por <span className="font-black text-brand-600">Italo Ribeiro</span> • (85) 98183-2250
            </p>
            <p className="text-[9px] text-slate-300 mt-1">
              &copy; {new Date().getFullYear()} Imovit Tecnologia. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}