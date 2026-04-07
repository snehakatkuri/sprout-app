export interface Activity {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  address: string;
  distanceMiles: number;
  driveMinutes: number;
  ageMin: number;
  ageMax: number | null; // null = no upper limit
  cost: number | null;   // null = free
  costLabel: string;
  tags: string[];
  schedule?: string;
  duration?: string;
  lat: number;
  lng: number;
}

export interface SearchFilters {
  location: string;
  childName?: string;
  childAge: string;
  interests: string[];
  distanceMiles: number;
  travelMinutes: number;
  budget: "free" | "low" | "medium" | "any";
}

export const INTERESTS = [
  { label: "Sports",       emoji: "⚽" },
  { label: "Arts & Crafts",emoji: "🎨" },
  { label: "Science",      emoji: "🔬" },
  { label: "Outdoors",     emoji: "🌲" },
  { label: "Music",        emoji: "🎵" },
  { label: "Animals",      emoji: "🐾" },
  { label: "Cooking",      emoji: "🍳" },
  { label: "Swimming",     emoji: "🏊" },
  { label: "Theatre",      emoji: "🎭" },
  { label: "Technology",   emoji: "💻" },
  { label: "Reading",      emoji: "📚" },
  { label: "Fitness",      emoji: "🏋️" },
];
