// Character configuration for the educator dashboard
export interface Character {
  id: string;
  name: string;
  fullName: string;
  image: string;
  description: string;
  conversationStyle: string;
  specialization: string;
}

export const CHARACTERS: Record<string, Character> = {
  'koko-panda': {
    id: 'koko-panda',
    name: 'Koko',
    fullName: 'Koko the Panda',
    image: '/assets/characters/koko-panda.gif',
    description: 'A warm, gentle panda who loves making friends and sharing stories',
    conversationStyle: 'calm',
    specialization: 'Emotional Support & Friendship'
  },
  'mochi-cat': {
    id: 'mochi-cat',
    name: 'Mochi',
    fullName: 'Mochi the Cat',
    image: '/assets/characters/mochi-cat.gif',
    description: 'A playful and curious cat who loves adventures and cozy spaces',
    conversationStyle: 'playful',
    specialization: 'Play & Adventure Learning'
  },
  'charlie-dog': {
    id: 'charlie-dog',
    name: 'Charlie',
    fullName: 'Charlie the Dog',
    image: '/assets/characters/charlie-dog.gif',
    description: 'An enthusiastic and loyal dog who loves playing and making friends',
    conversationStyle: 'energetic',
    specialization: 'Social Skills & Friendship'
  },
  'ravi-fox': {
    id: 'ravi-fox',
    name: 'Ravi',
    fullName: 'Ravi the Fox',
    image: '/assets/characters/felix-fox.gif',
    description: 'A clever and witty fox who loves playful challenges and thought-provoking conversations',
    conversationStyle: 'playful_challenger',
    specialization: 'Critical Thinking & Debates'
  },
  'nova-owl': {
    id: 'nova-owl',
    name: 'Nova',
    fullName: 'Nova the Owl',
    image: '/assets/characters/ollie-owl.gif',
    description: 'An encouraging and wise owl mentor who provides academic support and emotional check-ins',
    conversationStyle: 'wise_mentor',
    specialization: 'Academic Learning & Mentorship'
  },
  'dr-clover-goat': {
    id: 'dr-clover-goat',
    name: 'Dr. Clover',
    fullName: 'Dr. Clover the Goat',
    image: '/assets/characters/gigi-goat.gif',
    description: 'A compassionate and validating goat who provides emotional guidance and school counseling',
    conversationStyle: 'emotional_counselor',
    specialization: 'Emotional Counseling & Validation'
  },
  'zenzo-sloth': {
    id: 'zenzo-sloth',
    name: 'Zenzo',
    fullName: 'Zenzo the Sloth',
    image: '/assets/characters/sage-sloth.gif',
    description: 'A calm and mindful sloth who teaches patience and mindfulness',
    conversationStyle: 'calm',
    specialization: 'Mindfulness & Patience'
  }
};

export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS[id];
}

export function getCharacterByLegacyName(legacyName: string): Character | undefined {
  const mapping: Record<string, string> = {
    'panda': 'koko-panda',
    'cat': 'mochi-cat', 
    'dog': 'charlie-dog',
    'fox': 'ravi-fox',
    'owl': 'nova-owl',
    'goat': 'dr-clover-goat',
    'sloth': 'zenzo-sloth'
  };
  
  const characterId = mapping[legacyName.toLowerCase()];
  return characterId ? CHARACTERS[characterId] : undefined;
}

export function getAllCharacters(): Character[] {
  return Object.values(CHARACTERS);
}