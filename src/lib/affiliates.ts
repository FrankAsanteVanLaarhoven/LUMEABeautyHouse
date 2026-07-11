/** Influencer / affiliate promo codes — validated alongside DB promos */

export interface AffiliateCode {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  creator: string;
  handle: string;
  commissionNote: string;
  active: boolean;
}

export const AFFILIATE_CODES: AffiliateCode[] = [
  {
    code: "NYMA15",
    type: "percent",
    value: 15,
    minSubtotal: 40,
    creator: "Nyma Tang inspired edit",
    handle: "@deepshadeedit",
    commissionNote: "15% off for community · 10% back to creator",
    active: true,
  },
  {
    code: "COILS20",
    type: "percent",
    value: 20,
    minSubtotal: 55,
    creator: "Coil Ritual",
    handle: "@coilsbykeisha",
    commissionNote: "Hair ritual stack discount",
    active: true,
  },
  {
    code: "GLASS10",
    type: "fixed",
    value: 10,
    minSubtotal: 30,
    creator: "Lumé Glass crew",
    handle: "@glassmoves",
    commissionNote: "$10 off lips & face",
    active: true,
  },
  {
    code: "ICON25",
    type: "percent",
    value: 25,
    minSubtotal: 100,
    creator: "LUMÉA Icons",
    handle: "@lumeaicons",
    commissionNote: "VIP creator drop",
    active: true,
  },
  {
    code: "WARMTH15",
    type: "percent",
    value: 15,
    minSubtotal: 45,
    creator: "Warm undertone house",
    handle: "@warmlumea",
    commissionNote: "Olive + warm match edit",
    active: true,
  },
];

export function getAffiliateCode(code: string): AffiliateCode | undefined {
  const c = code.trim().toUpperCase();
  return AFFILIATE_CODES.find((a) => a.active && a.code === c);
}
