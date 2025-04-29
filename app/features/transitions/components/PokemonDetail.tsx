import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Pokemon, TYPE_COLORS } from "../data";

const PokemonDetail: React.FC<{ pokemon: Pokemon; onBack: () => void }> = ({
  pokemon,
  onBack,
}) => {
  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType] || "bg-accent";

  return (
    <Card className={`pokemon-detail p-6 ${typeColor}`}>
      <CardContent className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="pokemon-detail-image flex-1 flex justify-center">
            <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48" />
          </div>

          <div className="pokemon-detail-info flex-1 space-y-4">
            <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
            <div className="flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-3 py-1 rounded-full text-sm ${TYPE_COLORS[type]}`}
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pokemon.stats).map(([stat, value]) => (
                  <div key={stat} className="space-y-1">
                    <span className="text-sm text-muted-foreground capitalize">
                      {stat}
                    </span>
                    <div className="h-2 bg-accent rounded-full">
                      <div
                        className={`h-full rounded-full ${typeColor}`}
                        style={{ width: `${(value / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PokemonDetail;
