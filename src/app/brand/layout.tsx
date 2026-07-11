export const metadata = {
  title: "Brand Portal · LUMÉA",
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[calc(100vh-120px)]">{children}</div>;
}
