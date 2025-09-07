export const RARITY_RANGES = [
  {
    min: 0,
    max: 1,
    label: 'Ultra Rare',
    emoji: '🔥',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
  {
    min: 1,
    max: 5,
    label: 'Super Rare',
    emoji: '⭐',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
  },
  {
    min: 5,
    max: 10,
    label: 'Rare',
    emoji: '💎',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
  },
  {
    min: 10,
    max: 25,
    label: 'Uncommon',
    emoji: '✨',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  {
    min: 25,
    max: Infinity,
    label: 'Common',
    emoji: '',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
  },
];

export const getRarity = (percentage) => {
  for (const range of RARITY_RANGES) {
    if (percentage >= range.min && percentage < range.max) {
      return range;
    }
  }
  return null;
};
