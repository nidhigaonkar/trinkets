export interface GiftBasketIdea {
  title: string;
  emoji: string;
  bullets: string[];
}

export const GIFT_BASKET_IDEAS: GiftBasketIdea[] = [
  {
    title: 'Candy gift basket',
    emoji: '🍬',
    bullets: [
      'Sour strips or belts',
      'Hi-Chews',
      'Chocolate-covered pretzels',
      'Small Godiva or See’s box',
      'peanut butter cups',
      "gummy bears"
    ],
  },
  {
    title: 'Snack gift basket',
    emoji: '🍿',
    bullets: [
      'Spicy or limited-run chips',
      'Mini pretzels',
      'Beef jerky or meat sticks',
      'Popcorn',
      'Trail mix',
      'Drinks: sparkling water, a favorite soda, or a refillable water bottle',
      'Trader Joe’s or Target for one-stop variety',
    ],
  },
  {
    title: 'Self-care mini basket',
    emoji: '🧴',
    bullets: [
      'Lip oils and gloss',
      'Mini sheet masks',
      'Hand cream',
      'Hair ties and a claw clip',
      'Vanilla or coconut body mist',
      'Fuzzy socks',
      'Sephora minis, Ulta impulse section, or Bath & Body Works',
    ],
  },
  {
    title: 'Gamer & Tech Kit',
    emoji: '🎮',
    bullets: [
      'Extra-long charging cable (10ft)',
      'Screen cleaning cloth or spray',
      'Blue light glasses',
      'High-protein snacks or energy drinks',
      'Steam, Xbox, or PlayStation gift card',
      'Cable organizers or velcro ties',
    ],
  },
  {
    title: 'Sports & Fitness Set',
    emoji: '🏀',
    bullets: [
      'Cooling towel',
      'Grip strengthener',
      'High-quality athletic socks',
      'Protein bars or electrolyte powder',
      'Insulated water bottle',
      'Gym bag deodorizer balls',
    ],
  },
];
