export interface MenuItem {
  name: string;
  price: string;
  description?: string;
  image?: string;
  isFeatured?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "menu-utama",
    name: "Menu Utama",
    items: [
      { name: "Mie Sop Medan", price: "29K", isFeatured: true, image: "/mie-sop.png" },
      { name: "Mie Sop Komplit (Ayam, Bakso, Telur)", price: "29K", isFeatured: true, image: "/mie-sop.png" },
      { name: "Soto Ayam", price: "17K", isFeatured: true, image: "/soto-ayam.png" },
    ],
  },
  {
    id: "add-on",
    name: "Add-On",
    items: [
      { name: "Telur Dadar/Mata Sapi/Telur Bulat", price: "7K", image: "/placeholder-food.png" },
      { name: "Nasi Putih", price: "6K", image: "/placeholder-food.png" },
      { name: "Kerupuk Emping", price: "3K", image: "/placeholder-food.png" },
      { name: "Kentang Goreng", price: "15K", image: "/placeholder-food.png" },
      { name: "Tahu Isi/Tempe Goreng", price: "12K", image: "/placeholder-food.png" },
      { name: "Bakwan Jagung/Bakwan Sayur", price: "12K", image: "/placeholder-food.png" },
      { name: "Gorengan Campur", price: "16K", image: "/placeholder-food.png" },
      { name: "Perkedel", price: "4K", image: "/placeholder-food.png" },
      { name: "Puding Telur / ½ Mateng (A.Kampung/Bebek)", price: "15K/17K", image: "/placeholder-food.png" },
      { name: "Puding Telur / ½ Mateng (A.Kampung)", price: "8K", image: "/placeholder-food.png" },
    ],
  },
  {
    id: "best-seller",
    name: "Best Seller",
    items: [
      { name: "Teh Tarek", price: "16K", isFeatured: true, image: "/teh-tarek.png" },
      { name: "Kopi Susu Tarek", price: "16K", isFeatured: true, image: "/teh-tarek.png" },
      { name: "Ice Kopi Milo", price: "20K", image: "/placeholder-food.png" },
      { name: "Teh Susu (A.Kampung/Bebek)", price: "17K/21K", image: "/placeholder-food.png" },
      { name: "Kopi Susu (A.Kampung/Bebek)", price: "17K/21K", image: "/placeholder-food.png" },
    ],
  },
  {
    id: "aneka-jus",
    name: "Aneka Jus",
    items: [
      { name: "Jus Jeruk", price: "16K", image: "/placeholder-food.png" },
      { name: "Jus Alpukat / Mangga / Nanas / Naga", price: "17K", image: "/placeholder-food.png" },
      { name: "Jus Ibu Tomat", price: "17K", image: "/placeholder-food.png" },
      { name: "Jus Wortel Susu Jeruk", price: "18K", image: "/placeholder-food.png" },
      { name: "Jus Sawi Nanas Sirsak", price: "20K", image: "/placeholder-food.png" },
    ],
  },
  {
    id: "minuman-lain",
    name: "Minuman (Lainnya)",
    items: [
      { name: "Teh Manis", price: "6K", image: "/teh-tarek.png" },
      { name: "Teh Tawar", price: "7K", image: "/teh-tarek.png" },
      { name: "Mineral Water", price: "7K", image: "/placeholder-food.png" },
      { name: "Milo", price: "13K", image: "/placeholder-food.png" },
      { name: "Capuccino", price: "15K", image: "/placeholder-food.png" },
      { name: "Remix (Nutrisi Artix Ademsari)", price: "15K", image: "/placeholder-food.png" },
      { name: "Coffee", price: "15K", image: "/placeholder-food.png" },
      { name: "Kopi Luwak", price: "15K", image: "/placeholder-food.png" },
      { name: "Lemon Tea", price: "12K", image: "/placeholder-food.png" },
      { name: "Sanger", price: "20K", image: "/placeholder-food.png" },
      { name: "Kopi Aceh", price: "15K", image: "/placeholder-food.png" },
      { name: "Kuku Bima Susu / Ice", price: "15K/10K", image: "/placeholder-food.png" },
    ],
  },
  {
    id: "roti-bakar",
    name: "Roti Bakar",
    items: [
      { name: "Oreo Vanilla Pastry", price: "23K", image: "/placeholder-food.png" },
      { name: "Tiramisu Almond Pastry", price: "23K", image: "/placeholder-food.png" },
      { name: "Choco Crunch Pastry", price: "23K", image: "/placeholder-food.png" },
      { name: "Choco Peanut Pastry", price: "23K", image: "/placeholder-food.png" },
      { name: "Tiramisu Peanut Pastry", price: "23K", image: "/placeholder-food.png" },
      { name: "Choco Crunchy", price: "20K", image: "/placeholder-food.png" },
      { name: "Tiramisu Crunchy", price: "20K", image: "/placeholder-food.png" },
      { name: "Green Tea Crunchy", price: "20K", image: "/placeholder-food.png" },
      { name: "Keju Party Susu", price: "20K", image: "/placeholder-food.png" },
      { name: "Coklat Keju", price: "20K", image: "/placeholder-food.png" },
      { name: "Keju + Keju", price: "20K", image: "/placeholder-food.png" },
      { name: "Roti Bakar Selai (Strawberry/Coklat)", price: "15K", image: "/placeholder-food.png" },
      { name: "Roti Bakar Selai (Srikaya)", price: "17K", image: "/placeholder-food.png" },
    ],
  },
  {
    id: "pisang-bakar",
    name: "Pisang Bakar",
    items: [
      { name: "Pisang Coklat Keju", price: "17K", image: "/placeholder-food.png" },
      { name: "Pisang Meses Ceres Keju", price: "17K", image: "/placeholder-food.png" },
    ],
  },
  {
    id: "extra-topping",
    name: "Extra Topping",
    items: [
      { name: "Almond", price: "5K", image: "/placeholder-food.png" },
      { name: "Keju", price: "5K", image: "/placeholder-food.png" },
      { name: "Ceres", price: "5K", image: "/placeholder-food.png" },
      { name: "Peanut", price: "5K", image: "/placeholder-food.png" },
      { name: "Pastry", price: "5K", image: "/placeholder-food.png" },
    ],
  },
];
