import flyers from "@/assets/work-flyers.jpg";
import cards from "@/assets/work-cards.jpg";
import tshirt from "@/assets/work-tshirt.jpg";
import mug from "@/assets/work-mug.jpg";
import stickers from "@/assets/work-stickers.jpg";
import banner from "@/assets/work-banner.jpg";

export type ProductStatus = "disponible" | "agotado" | "promocion";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  status: ProductStatus;
};

export const categories = [
  "Papelería",
  "Promocionales",
  "Ropa personalizada",
  "Letreros",
  "Gran formato",
  "Eventos",
  "Regalos",
] as const;

export const products: Product[] = [
  {
    id: "1",
    name: "Tarjetas de presentación",
    description: "Full color, papel premium 300g, ambos lados.",
    category: "Papelería",
    image: cards,
    status: "disponible",
  },
  {
    id: "2",
    name: "Flyers publicitarios",
    description: "Impresión digital alta calidad, varios tamaños.",
    category: "Papelería",
    image: flyers,
    status: "disponible",
  },
  {
    id: "3",
    name: "Tazas personalizadas",
    description: "Cerámica sublimada full color, regalo perfecto.",
    category: "Regalos",
    image: mug,
    status: "disponible",
  },
  {
    id: "4",
    name: "Stickers / calcomanías",
    description: "Vinilo resistente al agua, troquelados a forma.",
    category: "Promocionales",
    image: stickers,
    status: "disponible",
  },
  {
    id: "5",
    name: "Banners gran formato",
    description: "Lona vinílica con ojales, ideal para eventos.",
    category: "Gran formato",
    image: banner,
    status: "disponible",
  },
  {
    id: "6",
    name: "Letreros corporativos",
    description: "PVC, acrílico, vinilo. Diseño e instalación.",
    category: "Letreros",
    image: banner,
    status: "disponible",
  },
  {
    id: "7",
    name: "Invitaciones",
    description: "Diseño exclusivo para bodas, XV años y eventos.",
    category: "Eventos",
    image: cards,
    status: "disponible",
  },
  {
    id: "8",
    name: "Sellos de hule",
    description: "Personalizados, automáticos o de madera.",
    category: "Papelería",
    image: cards,
    status: "disponible",
  },
];
