export type Notification = {
  id: string
  type: 'auction_ending' | 'new_arrival' | 'price_drop' | 'new_listing'
  title: string
  body: string
  productId: string
  productImage: string
  productUrl: string
  timestamp: string
  read: boolean
}

export const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "auction_ending",
    title: "Auction ending soon",
    body: "Handcrafted Shell Jewellery Stand — 4h remaining",
    productId: "exp-008",
    productImage: "/images/454b1c36b55a7aac07a46dec81f95a6f.jpg",
    productUrl: "/product/exp-008",
    timestamp: "2026-08-31T20:00:00Z", // 4 hours ago relative to 2026-09-01
    read: false
  },
  {
    id: "notif-2",
    type: "auction_ending",
    title: "Last chance to bid",
    body: "Vintage Hand-carved Chess Set — 1h remaining",
    productId: "exp-011",
    productImage: "/images/p452729_2.jpg",
    productUrl: "/product/exp-011",
    timestamp: "2026-08-31T23:00:00Z", // 1 hour ago
    read: false
  },
  {
    id: "notif-3",
    type: "new_arrival",
    title: "New listing just dropped",
    body: "Lord Ganesha — Intricate Ink Study by Sneha Agarwal",
    productId: "art-001",
    productImage: "/images/5ad309e5bf37d2a19670076e986021fd.webp",
    productUrl: "/product/art-001",
    timestamp: "2026-08-31T12:00:00Z", // 12 hours ago
    read: false
  },
  {
    id: "notif-4",
    type: "new_arrival",
    title: "New listing just dropped",
    body: "Limited Edition Comic #1 by Rohan Illustrations",
    productId: "exp-010",
    productImage: "/images/80891aa6bb34af3854d903c9a40bde21.jpg",
    productUrl: "/product/exp-010",
    timestamp: "2026-08-31T10:00:00Z", // 14 hours ago
    read: true
  },
  {
    id: "notif-5",
    type: "price_drop",
    title: "Price drop on your wishlist",
    body: "Resin Art Mirror is now ₹2,199",
    productId: "exp-003",
    productImage: "/images/e0e8112d8f5b16d5612a0e69efbae352.jpg",
    productUrl: "/product/exp-003",
    timestamp: "2026-08-30T15:00:00Z", // 1 day ago
    read: true
  },
  {
    id: "notif-6",
    type: "new_listing",
    title: "New from a creator you might like",
    body: "Customised Birthday Candle by Arjun Menon",
    productId: "exp-014",
    productImage: "/images/a344e75529581e9f43f2c00dc233dea4.webp",
    productUrl: "/product/exp-014",
    timestamp: "2026-08-30T09:00:00Z", // 1 day, 15 hours ago
    read: true
  }
];
