"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types for Pokemon API
interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  loaded: boolean;
}

// Pokemon types for our tabs
type PokemonType = "fire" | "water" | "grass";

export function ResourcePrefetchExample() {
  const [activeType, setActiveType] = useState<PokemonType>("fire");
  const [prefetching, setPrefetching] = useState(false);
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Pokemon for each type
  const [pokemonByType, setPokemonByType] = useState<
    Record<PokemonType, Pokemon[]>
  >({
    fire: [],
    water: [],
    grass: [],
  });

  // Fetch initial Pokemon for the active type
  useEffect(() => {
    const fetchPokemonForType = async (type: PokemonType) => {
      // If we already have loaded Pokemon for this type, don't fetch again
      if (pokemonByType[type].length > 0 && pokemonByType[type][0].loaded)
        return;

      try {
        setError(null);

        // Fetch Pokemon of the specified type from the PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok)
          throw new Error(`Failed to fetch ${type} type Pokemon`);

        const data = await response.json();

        // Get the first 6 Pokemon of this type
        const pokemonUrls = data.pokemon
          .slice(0, 6)
          .map((p: any) => p.pokemon.url);

        // Fetch details for each Pokemon
        const pokemonDetails = await Promise.all(
          pokemonUrls.map(async (url: string) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch Pokemon details");
            const pokemon = await res.json();
            return {
              ...pokemon,
              loaded: true,
            };
          })
        );

        // Update the Pokemon state for this type
        setPokemonByType((prev) => ({
          ...prev,
          [type]: pokemonDetails,
        }));
      } catch (err) {
        console.error(`Error fetching ${type} Pokemon:`, err);
        setError(`Failed to load ${type} Pokemon. Please try again.`);
      }
    };

    fetchPokemonForType(activeType);
  }, [activeType, pokemonByType]);

  const prefetchAllTypes = async () => {
    setPrefetching(true);
    setPrefetchProgress(0);
    setError(null);

    // Determine which types need prefetching
    const typesToPrefetch = ["water", "grass"].filter(
      (type) =>
        type !== activeType &&
        (pokemonByType[type as PokemonType].length === 0 ||
          !pokemonByType[type as PokemonType][0]?.loaded)
    ) as PokemonType[];

    if (typesToPrefetch.length === 0) {
      setPrefetching(false);
      return;
    }

    // Create a worker for background fetching
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `
            self.onmessage = async function(e) {
              const types = e.data.types;
              const results = {};
              
              for (let i = 0; i < types.length; i++) {
                const type = types[i];
                try {
                  // Fetch Pokemon of this type
                  const response = await fetch('https://pokeapi.co/api/v2/type/' + type);
                  if (!response.ok) throw new Error('Failed to fetch ' + type + ' type Pokemon');
                  
                  const data = await response.json();
                  
                  // Get the first 6 Pokemon of this type
                  const pokemonUrls = data.pokemon.slice(0, 6).map(p => p.pokemon.url);
                  
                  // Fetch details for each Pokemon
                  const pokemonDetails = [];
                  for (const url of pokemonUrls) {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error('Failed to fetch Pokemon details');
                    const pokemon = await res.json();
                    pokemonDetails.push({
                      ...pokemon,
                      loaded: true
                    });
                  }
                  
                  results[type] = pokemonDetails;
                  
                  // Send progress update
                  self.postMessage({ 
                    type: 'progress', 
                    progress: Math.round(((i + 1) / types.length) * 100),
                    pokemonType: type,
                    data: pokemonDetails
                  });
                } catch (err) {
                  self.postMessage({ 
                    type: 'error', 
                    pokemonType: type,
                    error: err.message
                  });
                }
              }
              
              self.postMessage({ type: 'complete' });
            };
            `,
          ],
          { type: "application/javascript" }
        )
      )
    );

    worker.onmessage = (event) => {
      if (event.data.type === "progress") {
        setPrefetchProgress(event.data.progress);

        // Update the Pokemon state for this type
        setPokemonByType((prev) => ({
          ...prev,
          [event.data.pokemonType]: event.data.data,
        }));
      } else if (event.data.type === "error") {
        setError(`Failed to prefetch ${event.data.pokemonType} Pokemon.`);
      } else if (event.data.type === "complete") {
        setPrefetching(false);
        worker.terminate();
      }
    };

    worker.postMessage({ types: typesToPrefetch });
  };

  // Check if all types have been prefetched
  const allTypesPrefetched = Object.keys(pokemonByType).every(
    (type) =>
      pokemonByType[type as PokemonType].length > 0 &&
      pokemonByType[type as PokemonType][0]?.loaded
  );

  // Format Pokemon name
  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Pokémon Gallery with Pre-fetching</h3>
          <p className="text-sm text-muted-foreground">
            Pre-fetch Pokémon data before users need it
          </p>
        </div>
        <Button
          onClick={prefetchAllTypes}
          disabled={prefetching || allTypesPrefetched}
          variant="outline"
        >
          {prefetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Pre-fetching...
            </>
          ) : allTypesPrefetched ? (
            "All Types Loaded"
          ) : (
            <>
              Pre-fetch All Types
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {prefetching && (
        <div className="space-y-2 my-4">
          <div className="flex justify-between text-sm">
            <span>Pre-fetching Pokémon data...</span>
            <span>{prefetchProgress}%</span>
          </div>
          <Progress value={prefetchProgress} />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeType}
        onValueChange={(value) => setActiveType(value as PokemonType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fire" className="text-red-600">
            Fire
          </TabsTrigger>
          <TabsTrigger value="water" className="text-blue-600">
            Water
          </TabsTrigger>
          <TabsTrigger value="grass" className="text-green-600">
            Grass
          </TabsTrigger>
        </TabsList>

        {(["fire", "water", "grass"] as PokemonType[]).map((type) => (
          <TabsContent key={type} value={type} className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pokemonByType[type].length > 0
                ? pokemonByType[type].map((pokemon) => (
                    <Card key={pokemon.id} className="overflow-hidden">
                      <CardHeader className="p-3 pb-0">
                        <CardTitle className="text-base">
                          {formatName(pokemon.name)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 flex justify-center">
                        {pokemon.loaded ? (
                          <Image
                            src={
                              pokemon.sprites.other["official-artwork"]
                                .front_default || pokemon.sprites.front_default
                            }
                            alt={pokemon.name}
                            width={120}
                            height={120}
                            className="h-[120px] w-[120px] object-contain"
                          />
                        ) : (
                          <div className="flex h-[120px] w-[120px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-3 pt-0 bg-muted/30 flex justify-center gap-2">
                        {pokemon.types.map((t) => (
                          <span
                            key={t.type.name}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              t.type.name === "fire"
                                ? "bg-red-100 text-red-800"
                                : t.type.name === "water"
                                ? "bg-blue-100 text-blue-800"
                                : t.type.name === "grass"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {formatName(t.type.name)}
                          </span>
                        ))}
                      </CardFooter>
                    </Card>
                  ))
                : // Show loading placeholders if no Pokemon are loaded yet
                  Array(6)
                    .fill(null)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-0 h-[180px]">
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="rounded-md bg-muted p-4">
        <h4 className="text-sm font-medium mb-2">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          This example demonstrates pre-fetching resources before they're needed
          using the real PokéAPI. When you click "Pre-fetch All Types", the app
          loads Pokémon data for all types in the background using Web Workers,
          even though you're only viewing one type at a time. This provides
          instant loading when you switch tabs.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          In a production application, you would use the Background Fetch API or
          service workers to download resources without impacting the main
          thread. This approach significantly improves perceived performance and
          user experience.
        </p>
      </div>
    </div>
  );
}
