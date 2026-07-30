import {
  PartyHatIcon,
  CapIcon,
  BowTieIcon,
  ScarfIcon,
  GlassesIcon,
  ChairIcon,
  StoolIcon,
  TableIcon,
  LampIcon,
  PaintingIcon,
  ShelfIcon,
  RugStripesIcon,
  RugDotsIcon,
  BeachBackground,
  SpaceBackground,
  MeadowBackground,
} from './shopRenderers.jsx';

export const SHOP_ITEMS = [
  // clothes
  { id: 'hat_partyhat', category: 'clothes', slot: 'hat', name: 'Party Hat', price: 50, Render: PartyHatIcon },
  { id: 'hat_cap', category: 'clothes', slot: 'hat', name: 'Baseball Cap', price: 40, Render: CapIcon },
  { id: 'outfit_bowtie', category: 'clothes', slot: 'outfit', name: 'Bow Tie', price: 35, Render: BowTieIcon },
  { id: 'outfit_scarf', category: 'clothes', slot: 'outfit', name: 'Cozy Scarf', price: 45, Render: ScarfIcon },
  { id: 'accessory_glasses', category: 'clothes', slot: 'accessory', name: 'Cool Shades', price: 60, Render: GlassesIcon },

  // furniture
  { id: 'furniture_chair', category: 'furniture', slot: 'floorLeft', name: 'Chair', price: 80, Render: ChairIcon },
  { id: 'furniture_stool', category: 'furniture', slot: 'floorLeft', name: 'Stool', price: 55, Render: StoolIcon },
  { id: 'furniture_table', category: 'furniture', slot: 'floorRight', name: 'Side Table', price: 70, Render: TableIcon },
  { id: 'furniture_lamp', category: 'furniture', slot: 'floorRight', name: 'Floor Lamp', price: 65, Render: LampIcon },
  { id: 'furniture_painting', category: 'furniture', slot: 'wall', name: 'Painting', price: 90, Render: PaintingIcon },
  { id: 'furniture_shelf', category: 'furniture', slot: 'wall', name: 'Shelf', price: 75, Render: ShelfIcon },
  { id: 'furniture_rug_stripes', category: 'furniture', slot: 'rug', name: 'Striped Rug', price: 40, Render: RugStripesIcon },
  { id: 'furniture_rug_dots', category: 'furniture', slot: 'rug', name: 'Polka Dot Rug', price: 40, Render: RugDotsIcon },

  // backgrounds
  { id: 'bg_beach', category: 'background', name: 'Beach', price: 150, Render: BeachBackground },
  { id: 'bg_space', category: 'background', name: 'Outer Space', price: 150, Render: SpaceBackground },
  { id: 'bg_meadow', category: 'background', name: 'Meadow', price: 120, Render: MeadowBackground },
];

export const SHOP_ITEMS_BY_ID = Object.fromEntries(SHOP_ITEMS.map((item) => [item.id, item]));

export const SHOP_CATEGORIES = [
  { id: 'clothes', label: 'Clothes' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'background', label: 'Backgrounds' },
];
