import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
const config = tseslint.config({
	extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
	files: ['**/*.{ts,tsx}'],
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		globals: globals.node
	},
	plugins: {
		prettier,
		'simple-import-sort': simpleImportSort
	},
	rules: {
		'@typescript-eslint/no-unused-vars': 'off',
		'prettier/prettier': 'error',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error'
	}
});

export default config;
