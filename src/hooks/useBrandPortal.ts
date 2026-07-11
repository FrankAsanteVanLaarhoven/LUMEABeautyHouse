"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Brand, Product, TeamPermission, TeamRole } from "@/lib/types";

export type PortalBrand = Omit<Brand, "password"> & {
  seatsUsed?: number;
};

export function useBrandPortal(opts?: { permission?: TeamPermission }) {
  const router = useRouter();
  const [brand, setBrand] = useState<PortalBrand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<TeamRole>("viewer");
  const [member, setMember] = useState<{
    id: string;
    name: string;
    email: string;
    role: TeamRole;
  } | null>(null);
  const [permissions, setPermissions] = useState<TeamPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  async function reload() {
    const res = await fetch("/api/brands/me");
    if (res.status === 401) {
      router.replace("/brand");
      return null;
    }
    if (res.status === 403) {
      setForbidden(true);
      setLoading(false);
      return null;
    }
    if (!res.ok) {
      router.replace("/brand");
      return null;
    }
    const d = await res.json();
    setBrand(d.brand);
    setProducts(d.products || []);
    setRole(d.role || "owner");
    setMember(d.member || null);
    setPermissions(d.permissions || []);
    setLoading(false);
    return d;
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const can = (perm: TeamPermission) => permissions.includes(perm);

  return {
    brand,
    products,
    setProducts,
    role,
    member,
    permissions,
    can,
    loading,
    forbidden,
    reload,
  };
}
