import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  globalIgnores(['**/.github/', '**/build/', '**/supabase/', '**/public/', '**/node_modules/']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser }, // 브라우저 환경에 맞춘 전역 변수 환경.
  },
  tseslint.configs.recommended, // TS 사용을 위한 플러그인 적용.
  reactPlugin.configs.flat['jsx-runtime'], // React 사용 시 도움되는 플러그인.
  eslintConfigPrettier, // Prettier 와 충돌을 막기위한 플러그인.
  eslintPluginJsxA11y.flatConfigs.recommended, // JSX 형식에서 웹 접근성을 높이는 HTML attribute 보조 플러그인.
  eslintPluginPrettierRecommended, // Prettier 를 ESLint 에서 처리해줌. Prettier 의 규칙을 지키지 않은 경우, 알림을 줄 수 있다.
]);
