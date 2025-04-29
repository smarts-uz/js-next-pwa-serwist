"use client";

import { POKEMONS } from "./data";
import PokemonCard from "./components/PokemonCard";
import type { Pokemon } from "./data";
import PokemonDetail from "./components/PokemonDetail";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./transitions.css";

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
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              View Transitions API
            </h1>
            <p className="text-muted-foreground">
              A native-feeling example of the View Transitions API using Pokemon
              cards. Click on any Pokemon to see smooth transitions between grid
              and detail views.
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
                  Comprehensive documentation of the View Transitions API
                  features and usage.
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
                      Initiates a view transition and returns a ViewTransition
                      object.
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
                      <li>
                        finished: Promise that resolves when the transition is
                        complete
                      </li>
                      <li>
                        ready: Promise that resolves when the transition is
                        ready to start
                      </li>
                      <li>
                        updateCallbackDone: Promise that resolves when the
                        update callback is complete
                      </li>
                      <li>skipTransition(): Skips the transition animation</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="css" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">view-transition-name</h4>
                    <p className="text-sm text-muted-foreground">
                      Identifies shared elements between states for transition
                      animation.
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
                      Pseudo-element representing the "old" state of a shared
                      element.
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
                      Pseudo-element representing the "new" state of a shared
                      element.
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
                      <li>
                        viewtransitionstart: Fired when the transition starts
                      </li>
                      <li>viewtransitionend: Fired when the transition ends</li>
                      <li>
                        viewtransitioncancel: Fired when the transition is
                        cancelled
                      </li>
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
          {POKEMONS.map((pokemon) => (
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
                The View Transitions API provides a way to create smooth
                transitions between different states of a page, making web apps
                feel more native and polished.
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
                The API uses the <code>view-transition-name</code> CSS property
                to identify shared elements between states, then automatically
                animates them during transitions.
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
            <h3 className="text-lg font-medium mb-2">
              Documentation & Resources
            </h3>
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
    </>
  );
};

export default TransitionsPage;
