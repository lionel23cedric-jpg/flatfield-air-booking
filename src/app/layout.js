import "./globals.css";

export const metadata = {
  title: "Flatfield Air",
  description: "Regional jet booking system from Dairy Flat Airport",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}