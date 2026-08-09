export const business = {
  name: "Queens Clozet",
  tagline: "Crafting fashion, art and creativity with a personal touch.",
  phone: "9363994467",
  phoneIntl: "+919363994467",
  whatsapp: "919363994467",
  hours: "9:00 AM – 7:00 PM",
  addressLines: ["26A, Super Nagar,", "Perambalur,", "Tamil Nadu – 621212, India"],
  addressOneLine: "26A, Super Nagar, Perambalur, Tamil Nadu – 621212, India",
} as const;

export const whatsappLink = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
  "Hello Queens Clozet, I would like to know more about your services.",
)}`;


export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "26A, Super Nagar, Perambalur, Tamil Nadu 621212, India",
)}&output=embed`;

export const services = [
  {
    number: "01",
    name: "Boutique",
    description: "Curated boutique fashion and style options.",
  },
  {
    number: "02",
    name: "Costume Customization",
    description: "Customized costumes designed according to customer requirements.",
  },
  {
    number: "03",
    name: "Stone Work Accessories",
    description: "Handcrafted decorative accessories featuring detailed stone work.",
  },
  {
    number: "04",
    name: "Resin Arts",
    description: "Creative handmade resin-based art and decorative pieces.",
  },
  {
    number: "05",
    name: "Aari Work",
    description: "Traditional detailed Aari embroidery and handcrafted work.",
  },
  {
    number: "06",
    name: "Brooches",
    description: "Elegant handcrafted brooches and fashion accessories.",
  },
  {
    number: "07",
    name: "Fabric Painting",
    description: "Custom artistic designs created directly on fabric.",
  },
  {
    number: "08",
    name: "Embroidery",
    description: "Detailed handcrafted embroidery for customized fashion and creative designs.",
  },
  {
    number: "09",
    name: "Parlor",
    description: "Beauty and personal grooming services.",
  },
  {
    number: "10",
    name: "Creative Classes",
    description:
      "Learn various creative skills including Aari work, embroidery, fabric painting, resin art and other handcrafted techniques.",
  },
] as const;

export const serviceOptions = [
  "Boutique",
  "Costume Customization",
  "Stone Work Accessories",
  "Resin Art",
  "Aari Work",
  "Brooches",
  "Fabric Painting",
  "Embroidery",
  "Parlor",
  "Classes",
  "General Enquiry",
] as const;

export const SLOT_MAX_CAPACITY = 3;

/** 1-hour slots inside business hours, 9:00 AM to 6:00 PM. */
export const timeSlots: string[] = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];


export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/collections", label: "Collections" },
  { to: "/classes", label: "Classes" },
  { to: "/contact", label: "Contact" },
] as const;

export const benefits = [
  {
    title: "Personalized Designs",
    description: "Customized work created around your preferences.",
  },
  {
    title: "Handcrafted Details",
    description: "Attention to traditional and modern craftsmanship.",
  },
  {
    title: "Multiple Creative Services",
    description: "Fashion, accessories, art, beauty and learning under one roof.",
  },
  {
    title: "Made With Care",
    description: "Every piece is created with attention to detail.",
  },
  {
    title: "Learn & Create",
    description: "Classes available for those who want to develop creative skills.",
  },
] as const;

export const classCategories = [
  "Aari Work",
  "Embroidery",
  "Fabric Painting",
  "Resin Art",
  "Other Creative Crafts",
] as const;
