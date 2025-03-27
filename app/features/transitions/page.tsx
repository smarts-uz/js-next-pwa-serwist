'use client';
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import './transitions.css';

interface Pokemon {
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

const TYPE_COLORS: Record<string, string> = {
  Grass: 'bg-green-500/20 text-green-500',
  Poison: 'bg-purple-500/20 text-purple-500',
  Fire: 'bg-red-500/20 text-red-500',
  Water: 'bg-blue-500/20 text-blue-500',
  Electric: 'bg-yellow-500/20 text-yellow-500',
  Psychic: 'bg-pink-500/20 text-pink-500',
  Fighting: 'bg-orange-500/20 text-orange-500',
  Rock: 'bg-amber-500/20 text-amber-500',
  Ground: 'bg-yellow-700/20 text-yellow-700',
  Flying: 'bg-indigo-500/20 text-indigo-500',
  Bug: 'bg-lime-500/20 text-lime-500',
  Ghost: 'bg-violet-500/20 text-violet-500',
  Dragon: 'bg-purple-700/20 text-purple-700',
  Dark: 'bg-gray-700/20 text-gray-700',
  Steel: 'bg-gray-400/20 text-gray-400',
  Fairy: 'bg-pink-300/20 text-pink-300',
  Ice: 'bg-cyan-500/20 text-cyan-500',
  Normal: 'bg-gray-500/20 text-gray-500'
};

const POKEMONS: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    types: ["Grass", "Poison"],
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 }
  },
  {
    id: 4,
    name: "Charmander",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    types: ["Fire"],
    stats: { hp: 39, attack: 52, defense: 43, speed: 65 }
  },
  {
    id: 7,
    name: "Squirtle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    types: ["Water"],
    stats: { hp: 44, attack: 48, defense: 65, speed: 43 }
  },
  {
    id: 25,
    name: "Pikachu",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    types: ["Electric"],
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 }
  },
  {
    id: 35,
    name: "Clefairy",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
    types: ["Fairy"],
    stats: { hp: 70, attack: 45, defense: 48, speed: 35 }
  },
  {
    id: 39,
    name: "Jigglypuff",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    types: ["Normal", "Fairy"],
    stats: { hp: 115, attack: 45, defense: 20, speed: 20 }
  },
  {
    id: 52,
    name: "Meowth",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    types: ["Normal"],
    stats: { hp: 40, attack: 45, defense: 35, speed: 90 }
  },
  {
    id: 63,
    name: "Abra",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png",
    types: ["Psychic"],
    stats: { hp: 25, attack: 20, defense: 15, speed: 90 }
  },
  {
    id: 74,
    name: "Geodude",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
    types: ["Rock", "Ground"],
    stats: { hp: 40, attack: 80, defense: 100, speed: 20 }
  },
  {
    id: 92,
    name: "Gastly",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png",
    types: ["Ghost", "Poison"],
    stats: { hp: 30, attack: 35, defense: 30, speed: 80 }
  },
  {
    id: 95,
    name: "Onix",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png",
    types: ["Rock", "Ground"],
    stats: { hp: 35, attack: 45, defense: 160, speed: 70 }
  },
  {
    id: 102,
    name: "Exeggcute",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png",
    types: ["Grass", "Psychic"],
    stats: { hp: 60, attack: 40, defense: 80, speed: 40 }
  }
];

const PokemonCard: React.FC<{ pokemon: Pokemon; onClick: () => void }> = ({ pokemon, onClick }) => {
  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType] || 'bg-accent';

  return (
    <Card className={`pokemon-card p-4 hover:bg-accent/50 transition-colors ${typeColor}`} onClick={onClick}>
      <CardContent className="flex flex-col items-center gap-4">
        <img 
          src={pokemon.image} 
          alt={pokemon.name}
          className="pokemon-image w-32 h-32"
        />
        <div className="pokemon-info text-center">
          <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
          <div className="flex gap-2 mt-2">
            {pokemon.types.map(type => (
              <span key={type} className={`px-2 py-1 rounded-full text-sm ${TYPE_COLORS[type]}`}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PokemonDetail: React.FC<{ pokemon: Pokemon; onBack: () => void }> = ({ pokemon, onBack }) => {
  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType] || 'bg-accent';

  return (
    <Card className={`pokemon-detail p-6 ${typeColor}`}>
      <CardContent className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="pokemon-detail-image flex-1 flex justify-center">
            <img 
              src={pokemon.image} 
              alt={pokemon.name}
              className="w-48 h-48"
            />
          </div>
          
          <div className="pokemon-detail-info flex-1 space-y-4">
            <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
            <div className="flex gap-2">
              {pokemon.types.map(type => (
                <span key={type} className={`px-3 py-1 rounded-full text-sm ${TYPE_COLORS[type]}`}>
                  {type}
                </span>
              ))}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pokemon.stats).map(([stat, value]) => (
                  <div key={stat} className="space-y-1">
                    <span className="text-sm text-muted-foreground capitalize">{stat}</span>
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

const TransitionsPage: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const handlePokemonClick = (pokemon: Pokemon) => {
    if (!document.startViewTransition) {
      setSelectedPokemon(pokemon);
      return;
    }

    document.startViewTransition(() => {
      setSelectedPokemon(pokemon);
    });
  };

  const handleBack = () => {
    if (!document.startViewTransition) {
      setSelectedPokemon(null);
      return;
    }

    document.startViewTransition(() => {
      setSelectedPokemon(null);
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">View Transitions API</h1>
            <p className="text-muted-foreground">
              A native-feeling example of the View Transitions API using Pokemon cards. 
              Click on any Pokemon to see smooth transitions between grid and detail views.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                API Reference
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>View Transitions API Reference</DialogTitle>
                <DialogDescription>
                  Comprehensive documentation of the View Transitions API features and usage.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="methods" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="methods">Methods</TabsTrigger>
                  <TabsTrigger value="css">CSS Properties</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>
                <TabsContent value="methods" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">startViewTransition()</h4>
                    <p className="text-sm text-muted-foreground">
                      Initiates a view transition and returns a ViewTransition object.
                    </p>
                    <pre className="bg-muted p-3 rounded-lg text-sm">
                      <code>{`const transition = document.startViewTransition(() => {
  // DOM updates
});`}</code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">ViewTransition Object</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>finished: Promise that resolves when the transition is complete</li>
                      <li>ready: Promise that resolves when the transition is ready to start</li>
                      <li>updateCallbackDone: Promise that resolves when the update callback is complete</li>
                      <li>skipTransition(): Skips the transition animation</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="css" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">view-transition-name</h4>
                    <p className="text-sm text-muted-foreground">
                      Identifies shared elements between states for transition animation.
                    </p>
                    <pre className="bg-muted p-3 rounded-lg text-sm">
                      <code>{`.shared-element {
  view-transition-name: unique-name;
}`}</code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">::view-transition-old()</h4>
                    <p className="text-sm text-muted-foreground">
                      Pseudo-element representing the "old" state of a shared element.
                    </p>
                    <pre className="bg-muted p-3 rounded-lg text-sm">
                      <code>{`::view-transition-old(root) {
  animation: fade-out 0.5s;
}`}</code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">::view-transition-new()</h4>
                    <p className="text-sm text-muted-foreground">
                      Pseudo-element representing the "new" state of a shared element.
                    </p>
                    <pre className="bg-muted p-3 rounded-lg text-sm">
                      <code>{`::view-transition-new(root) {
  animation: fade-in 0.5s;
}`}</code>
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="events" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">ViewTransition Events</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>viewtransitionstart: Fired when the transition starts</li>
                      <li>viewtransitionend: Fired when the transition ends</li>
                      <li>viewtransitioncancel: Fired when the transition is cancelled</li>
                    </ul>
                    <pre className="bg-muted p-3 rounded-lg text-sm">
                      <code>{`document.addEventListener('viewtransitionstart', (e) => {
  console.log('Transition started');
});`}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectedPokemon ? (
        <PokemonDetail pokemon={selectedPokemon} onBack={handleBack} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POKEMONS.map(pokemon => (
            <PokemonCard 
              key={pokemon.id} 
              pokemon={pokemon} 
              onClick={() => handlePokemonClick(pokemon)} 
            />
          ))}
        </div>
      )}

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">About View Transitions API</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">What is it?</h3>
              <p className="text-muted-foreground">
                The View Transitions API provides a way to create smooth transitions between different states of a page, 
                making web apps feel more native and polished.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Native-feeling transitions</li>
                <li>Automatic handling of shared elements</li>
                <li>Fallback support for older browsers</li>
                <li>Customizable animations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">How it Works</h3>
              <p className="text-muted-foreground">
                The API uses the <code>view-transition-name</code> CSS property to identify shared elements between states, 
                then automatically animates them during transitions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Browser Support</h3>
              <p className="text-muted-foreground">
                Currently supported in Chrome and other Chromium-based browsers. 
                The API gracefully degrades in unsupported browsers.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Example Implementation</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// Start a view transition
document.startViewTransition(() => {
  // Update the DOM
  setSelectedPokemon(pokemon);
});

// CSS for shared elements
.pokemon-card {
  view-transition-name: pokemon-card;
}

.pokemon-image {
  view-transition-name: pokemon-image;
}`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Documentation & Resources</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Official Documentation</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a 
                      href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      MDN Web Docs
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://web.dev/view-transitions/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      web.dev Guide
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Related Resources</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a 
                      href="https://caniuse.com/view-transitions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Browser Support
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/WICG/view-transitions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub Spec
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransitionsPage;
