import boutique1 from "@/assets/work-boutique-1.jpg";
import boutique2 from "@/assets/work-boutique-2.jpg";
import costume1 from "@/assets/work-costume-1.jpg";
import accessories1 from "@/assets/work-accessories-1.jpg";
import aari1 from "@/assets/work-aari-1.jpg";
import aari2 from "@/assets/work-aari-2.jpg";
import embroidery1 from "@/assets/work-embroidery-1.jpg";
import resin1 from "@/assets/work-resin-1.jpg";
import fabric1 from "@/assets/work-fabric-1.jpg";
import brooch1 from "@/assets/work-brooch-1.jpg";
import parlor1 from "@/assets/work-parlor-1.jpg";

export const galleryCategories = [
  "All",
  "Boutique",
  "Custom Costumes",
  "Accessories",
  "Aari Work",
  "Embroidery",
  "Resin Art",
  "Fabric Painting",
  "Brooches",
] as const;

export const galleryAdminCategories = [
  "Boutique",
  "Custom Costumes",
  "Accessories",
  "Aari Work",
  "Embroidery",
  "Resin Art",
  "Fabric Painting",
  "Brooches",
  "Parlor",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: Exclude<GalleryCategory, "All"> | "Parlor";
  description: string;
  width: number;
  height: number;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "boutique-1",
    src: boutique1,
    alt: "Handcrafted green and ivory ethnic outfits on wooden hangers in a boutique",
    title: "Boutique Edit",
    category: "Boutique",
    description: "Boutique pieces in ivory and forest green with hand-finished detailing.",
    width: 1100,
    height: 1400,
  },
  {
    id: "aari-2",
    src: aari2,
    alt: "Emerald green blouse with dense gold aari embroidery laid on ivory fabric",
    title: "Bridal Aari Blouse",
    category: "Aari Work",
    description: "Dense gold aari work stitched by hand on deep green silk.",
    width: 1200,
    height: 1000,
  },
  {
    id: "embroidery-1",
    src: embroidery1,
    alt: "Floral hand embroidery in sage green thread on ivory fabric in a hoop",
    title: "Botanical Embroidery",
    category: "Embroidery",
    description: "Fine floral thread work created stitch by stitch on ivory cotton.",
    width: 1100,
    height: 1400,
  },
  {
    id: "resin-1",
    src: resin1,
    alt: "Handmade resin coasters and tray with pressed flowers",
    title: "Pressed Flower Resin Set",
    category: "Resin Art",
    description: "Resin keepsakes set with real pressed flowers and gold flecks.",
    width: 1200,
    height: 1000,
  },
  {
    id: "costume-1",
    src: costume1,
    alt: "Custom emerald costume with gold trim on a dress form",
    title: "Custom Costume",
    category: "Custom Costumes",
    description: "A costume built to measurement, with hand-applied gold trim.",
    width: 1200,
    height: 1000,
  },
  {
    id: "accessories-1",
    src: accessories1,
    alt: "Handcrafted stone and pearl bangles on beige linen",
    title: "Stone Work Bangles",
    category: "Accessories",
    description: "Stone and pearl accessories, threaded and finished by hand.",
    width: 1100,
    height: 1300,
  },
  {
    id: "aari-1",
    src: aari1,
    alt: "Gold aari embroidery in progress on green fabric in a wooden frame",
    title: "Aari In Progress",
    category: "Aari Work",
    description: "A motif taking shape in gold zari on the aari frame.",
    width: 1200,
    height: 1000,
  },
  {
    id: "fabric-1",
    src: fabric1,
    alt: "Hand-painted botanical motif on an ivory dupatta with brushes beside it",
    title: "Painted Botanical",
    category: "Fabric Painting",
    description: "A botanical motif painted directly onto soft ivory fabric.",
    width: 1100,
    height: 1300,
  },
  {
    id: "brooch-1",
    src: brooch1,
    alt: "Handcrafted pearl and gold wire brooches on ivory silk",
    title: "Pearl Brooches",
    category: "Brooches",
    description: "Wire-worked brooches finished with pearls and stones.",
    width: 1200,
    height: 1000,
  },
  {
    id: "boutique-2",
    src: boutique2,
    alt: "Folded ivory, beige and green garments stacked on a wooden shelf",
    title: "Boutique Shelf",
    category: "Boutique",
    description: "Everyday boutique fabrics chosen for drape and comfort.",
    width: 1100,
    height: 1400,
  },
  {
    id: "parlor-1",
    src: parlor1,
    alt: "Calm parlour corner with ivory towels, brass tray and a green chair",
    title: "Parlor Corner",
    category: "Parlor",
    description: "A quiet corner for parlor and personal grooming services.",
    width: 1100,
    height: 1300,
  },
];
