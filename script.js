const PRODUCTS = [
  { id: 'wood50', name: 'Bûches 50 cm en vrac', category: 'bois', badge: '50 cm', price: 89, unit: 'stère', image: 'images/chene.jpg', featured: false },
  { id: 'wood40', name: 'Bûches 40 cm en vrac', category: 'bois', badge: '40 cm', price: 95, unit: 'stère', image: 'images/hetre.webp', featured: false },
  { id: 'wood33', name: 'Bûches 33 cm en vrac', category: 'bois', badge: '33 cm', price: 102, unit: 'stère', image: 'images/charme.webp', featured: true },
  { id: 'wood25', name: 'Bûches 25 cm en vrac', category: 'bois', badge: '25 cm', price: 115, unit: 'stère', image: 'images/frene.jpg', featured: false },
  { id: 'wood-palette', name: 'Palette de bois rangé', category: 'bois', badge: 'Sur demande', price: null, unit: 'palette', image: 'images/pallettes.jpg', featured: false },
  { id: 'pellet-sac', name: 'Sac de granulés 15 kg', category: 'granules', badge: '15 kg', price: 5.90, unit: 'sac', image: 'images/05c69ff2-a266-4863-8eaf-58d30fbf2f75.jfif', featured: false },
  { id: 'pellet-palette', name: 'Palette de granulés', category: 'granules', badge: 'ENplus A1', price: 385, unit: 'palette', image: 'images/10f257ce-9b29-49ee-a8a4-07ee7c95473d.jfif', featured: true },
  { id: 'pellet-premium', name: 'Palette de granulés Premium', category: 'granules', badge: 'Premium', price: 425, unit: 'palette', image: 'images/05a12da0-f29b-4afc-813c-e6c41bcba3c2.jfif', featured: false },
  { id: 'day-logs', name: 'Bûches densifiées de jour', category: 'densifie', badge: 'Jour', price: 5.50, unit: 'pack', image: 'images/images (9).jfif', featured: true },
  { id: 'night-logs', name: 'Bûches densifiées de nuit', category: 'densifie', badge: 'Nuit', price: 6.50, unit: 'pack', image: 'images/images (9).jfif', featured: false },
  { id: 'kindling', name: "Bois d'allumage extra-sec", category: 'allumage', badge: 'Extra-sec', price: 7.50, unit: 'filet', image: 'images/0f726f19-8251-444e-8aa5-f65d324781d1.jfif', featured: true },
  { id: 'firelighters', name: 'Allume-feux écologiques', category: 'allumage', badge: 'Naturels', price: 6.90, unit: 'boîte', image: 'images/22b988fe-d9bf-4c1c-a3a1-19ed65007de3.jfif', featured: false },
  { id: 'cover', name: 'Housse de protection pour palette', category: 'allumage', badge: 'Protection', price: 24.90, unit: 'pièce', image: 'images/bbbcc.webp', featured: false }
];
const CATEGORY_LABELS = { bois: 'Bois de chauffage', granules: 'Granulés de bois', densifie: 'Bûches densifiées', allumage: 'Allumage & accessoires' }
const CART_STORAGE_KEY = 'flammeche_request_v1';
const CONTACT_EMAIL = 'boischauffage3fr@gmail.com';
const WHATSAPP_PHONE = '+33759134427';
let activeCategory = 'tout';
let maxPrice = 450;
let activeTranslationLanguage = 'fr';
let visitorTranslationLanguage = 'fr';