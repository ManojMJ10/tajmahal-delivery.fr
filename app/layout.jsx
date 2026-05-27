import "./globals.css";

export const metadata = {
  title: "Taj Mahal Menu",
  description: "Indian and Pakistani restaurant menu, ordering, and booking prototype for Nice, France.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
