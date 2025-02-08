// src/App.tsx
import React from 'react';
import { useStore } from './store';

export function BearCounter(): React.JSX.Element {
  const bears = useStore((state) => state.bears);
  return (
    <h1
      data-testid="bear-counter"
      className="text-3xl font-bold text-center text-gray-800 mb-4"
    >
      {bears} bears around here...
    </h1>
  );
}

export function Controls(): React.JSX.Element {
  const increasePopulation = useStore((state) => state.increasePopulation);
  return (
    <div className="flex justify-center">
      <button
        data-testid="increase-button"
        onClick={increasePopulation}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors duration-200"
      >
        One up
      </button>
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* En-tête */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Bear Counter App
          </h2>
        </div>
      </header>

      {/* Zone principale */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <BearCounter />
        <Controls />
      </main>

      {/* Pied de page */}
      <footer className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © 2023 Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
