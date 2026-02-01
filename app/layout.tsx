import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Custom theme (optional แต่แนะนำ) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      bg: '#0B1220',
                      panel: '#111827',
                      accent: '#34d399',
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>

      <body className="dark bg-bg text-white">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

