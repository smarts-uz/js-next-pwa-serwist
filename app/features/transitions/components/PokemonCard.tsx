import { Card, CardContent } from "@/components/ui/card";
import { Pokemon, TYPE_COLORS } from "../data";

const PokemonCard: React.FC<{ pokemon: Pokemon; onClick: () => void }> = ({
  pokemon,
  onClick,
}) => {
  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType] || "bg-accent";

  return (
    <Card
      className={`pokemon-card p-4 hover:bg-accent/50 transition-colors ${typeColor}`}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center gap-4">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="pokemon-image w-32 h-32"
        />
        <div className="pokemon-info text-center">
          <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
          <div className="flex gap-2 mt-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`px-2 py-1 rounded-full text-sm ${TYPE_COLORS[type]}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;
