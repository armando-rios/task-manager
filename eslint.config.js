import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  // 1. Reglas base de TypeScript
  tseslint.configs.recommended,

  // 2. Reglas específicas para archivos .astro
  ...eslintPluginAstro.configs.recommended,

  // 3. Configuración avanzada para React (archivos .jsx y .tsx)
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect", // Detecta automáticamente React 19
      },
    },
    rules: {
      // Reglas recomendadas de React
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // No necesario en React moderno
      "react/prop-types": "off", // Usamos TS para esto

      // Reglas de Hooks (Vital para evitar bugs de estado)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Reglas de accesibilidad (SEO y UX)
      ...jsxA11yPlugin.configs.recommended.rules,
    },
  },

  // 4. Personalizaciones globales
  {
    rules: {
      "astro/no-set-html-directive": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // 5. Directorios que el linter debe ignorar
  {
    ignores: ["dist/", ".astro/", "node_modules/", ".vercel/"],
  },
);
