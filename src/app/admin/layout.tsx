import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
  title: "Ops Console",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell -mt-0 min-h-[calc(100vh-108px)]">
      <div className="flex flex-col lg:flex-row">
        <AdminNav />
        <div className="flex-1 overflow-x-auto p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
