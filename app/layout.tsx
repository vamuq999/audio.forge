import "./globals.css";

export const metadata = {
  title: "Audio Forge",
  description: "Upload and transform audio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}