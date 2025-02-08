// eslint.config.js
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  // 1) Config générale pour tous les fichiers JS/TS
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules', 'wailsjs'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      // Définition manuelle des globals pour simuler l'environnement navigateur et ES2021
      globals: {
        window: 'readonly',
        document: 'readonly',
        // Ajoute ici d'autres globals si nécessaire (ex. navigator, localStorage, etc.)
      },
    },
    // Tu peux ajouter ici des règles globales si besoin
    rules: {},
  },

  // 2) Config ESLint de base (recommandée) pour JS
  js.configs.recommended,

  // 3) Configuration spécifique pour React
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // On étend les règles recommandées de react et react-hooks
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      // Pour React 17+ : inutile d'importer React dans chaque fichier JSX
      'react/react-in-jsx-scope': 'off',
    },
  },

  // 4) Configuration spécifique pour TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Si tu veux activer l'analyse de types avancée, décommente la ligne ci-dessous
        // project: "./tsconfig.json",
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Par exemple, pour ne pas forcer l'usage strict de "any"
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 5) Configuration Prettier pour désactiver les règles en conflit
  prettier,
];
