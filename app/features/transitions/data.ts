export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

export const POKEMONS: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    types: ["Grass", "Poison"],
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
  },
  {
    id: 4,
    name: "Charmander",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    types: ["Fire"],
    stats: { hp: 39, attack: 52, defense: 43, speed: 65 },
  },
  {
    id: 7,
    name: "Squirtle",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    types: ["Water"],
    stats: { hp: 44, attack: 48, defense: 65, speed: 43 },
  },
  {
    id: 25,
    name: "Pikachu",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    types: ["Electric"],
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
  },
  {
    id: 35,
    name: "Clefairy",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
    types: ["Fairy"],
    stats: { hp: 70, attack: 45, defense: 48, speed: 35 },
  },
  {
    id: 39,
    name: "Jigglypuff",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    types: ["Normal", "Fairy"],
    stats: { hp: 115, attack: 45, defense: 20, speed: 20 },
  },
  {
    id: 52,
    name: "Meowth",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    types: ["Normal"],
    stats: { hp: 40, attack: 45, defense: 35, speed: 90 },
  },
  {
    id: 63,
    name: "Abra",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png",
    types: ["Psychic"],
    stats: { hp: 25, attack: 20, defense: 15, speed: 90 },
  },
  {
    id: 74,
    name: "Geodude",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
    types: ["Rock", "Ground"],
    stats: { hp: 40, attack: 80, defense: 100, speed: 20 },
  },
  {
    id: 92,
    name: "Gastly",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png",
    types: ["Ghost", "Poison"],
    stats: { hp: 30, attack: 35, defense: 30, speed: 80 },
  },
  {
    id: 95,
    name: "Onix",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png",
    types: ["Rock", "Ground"],
    stats: { hp: 35, attack: 45, defense: 160, speed: 70 },
  },
  {
    id: 102,
    name: "Exeggcute",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png",
    types: ["Grass", "Psychic"],
    stats: { hp: 60, attack: 40, defense: 80, speed: 40 },
  },
];

export const TYPE_COLORS: Record<string, string> = {
  Grass: "bg-green-500/20 text-green-500",
  Poison: "bg-purple-500/20 text-purple-500",
  Fire: "bg-red-500/20 text-red-500",
  Water: "bg-blue-500/20 text-blue-500",
  Electric: "bg-yellow-500/20 text-yellow-500",
  Psychic: "bg-pink-500/20 text-pink-500",
  Fighting: "bg-orange-500/20 text-orange-500",
  Rock: "bg-amber-500/20 text-amber-500",
  Ground: "bg-yellow-700/20 text-yellow-700",
  Flying: "bg-indigo-500/20 text-indigo-500",
  Bug: "bg-lime-500/20 text-lime-500",
  Ghost: "bg-violet-500/20 text-violet-500",
  Dragon: "bg-purple-700/20 text-purple-700",
  Dark: "bg-gray-700/20 text-gray-700",
  Steel: "bg-gray-400/20 text-gray-400",
  Fairy: "bg-pink-300/20 text-pink-300",
  Ice: "bg-cyan-500/20 text-cyan-500",
  Normal: "bg-gray-500/20 text-gray-500",
};
