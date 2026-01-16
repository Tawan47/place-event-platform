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
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-accent font-bold">
            ▲ BKK Explorer
          </div>

          <nav className="flex items-center gap-6">
            <a href="/events" className="hover:text-accent">
              EVENTS
            </a>
            <a href="/admin" className="hover:text-accent">
              ADMIN
            </a>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
