export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div>LAYOUT BASE</div>
        {children}
      </body>
    </html>
  );
}
