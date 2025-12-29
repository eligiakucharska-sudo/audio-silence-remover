import "../styles/globals.css";

export const metadata = {
  title: "Audio Silence Remover",
  description: "Remove silence from your audio — fast and free",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
