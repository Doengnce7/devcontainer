export const metadata = {
  title: "Coder Next Devcontainer",
  description: "Next.js + Postgres + Docker-in-Docker"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 24 }}>{children}</body>
    </html>
  );
}
