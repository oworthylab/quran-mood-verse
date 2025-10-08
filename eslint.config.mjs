import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import checkFile from 'eslint-plugin-check-file'
import _import from 'eslint-plugin-import'
import jsxA11Y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactFunc from 'eslint-plugin-react-func'
import reactHooks from 'eslint-plugin-react-hooks'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { configs } from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
  allConfig: pluginJs.configs.all,
})

export default [
  {
    ignores: ['**/.next', '**/node_modules', '**/gql/artifacts', './*.{js,mjs,ts}'],
  },

  ...configs.recommended,

  ...fixupConfigRules(
    compat.extends(
      'next/core-web-vitals',
      'plugin:import/typescript',
      'plugin:jsx-a11y/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended'
    )
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
      react: fixupPluginRules(react),
      'react-func': reactFunc,
      'react-hooks': fixupPluginRules(reactHooks),
      'check-file': checkFile,
      prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'react/react-in-jsx-scope': 0,
      'import/prefer-default-export': 0,
      'no-underscore-dangle': 0,
      'react/jsx-fragments': 0,
      'react/jsx-props-no-spreading': 0,
      'jsx-a11y/no-static-element-interactions': 0,
      'no-plusplus': 0,
      'react/no-danger': 0,
      'no-useless-escape': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'react/destructuring-assignment': 0,
      'jsx-a11y/label-has-associated-control': 0,
      'react/jsx-no-bind': 0,
      'react/require-default-props': 0,
      'react/button-has-type': 0,
      'react/prop-types': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      'react/jsx-no-constructed-context-values': 0,
      'no-void': 0,
      'symbol-description': 0,
      'consistent-return': 0,

      'prettier/prettier': 1,

      '@typescript-eslint/no-unused-vars': [
        1,
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'no-param-reassign': 2,
      '@typescript-eslint/no-floating-promises': 2,
      'prefer-arrow-callback': [2, { allowNamedFunctions: false }],
      'func-style': [2, 'declaration', { allowArrowFunctions: false }],

      '@typescript-eslint/naming-convention': [
        2,
        {
          selector: ['typeLike', 'interface'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
          format: ['PascalCase'],
        },
        {
          selector: 'parameter',
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
      ],

      'max-lines': [2, { max: 200, skipBlankLines: true, skipComments: true }],
      'react-func/max-lines-per-function': [
        2,
        { max: 30, skipBlankLines: true, skipComments: true },
      ],

      'check-file/folder-naming-convention': [2, { '*/**': 'KEBAB_CASE' }],
      'check-file/filename-naming-convention': [
        2,
        { '**/*.*': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],

      'import/no-default-export': 2,
      'no-restricted-syntax': [
        'error',
        {
          selector: "ImportDeclaration[source.value='react'] > ImportDefaultSpecifier",
          message: 'Please remove `import React from "react"`, it is not needed.',
        },
      ],
    },
  },

  {
    files: ['src/app/**'],
    rules: {
      'import/no-default-export': 0,
      'check-file/folder-naming-convention': [2, { '**/*': 'NEXT_JS_APP_ROUTER_CASE' }],
    },
  },

  {
    files: ['src/gql/**', '**/*.store.ts', '**/features/editor/editor-properties/**'],

    rules: {
      'max-lines': 0,
      'react-func/max-lines-per-function': 0,
    },
  },

  {
    files: ['**/*.test.ts', 'prisma/seed.ts'],

    rules: {
      'max-lines': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      '@typescript-eslint/no-unsafe-assignment': 0,
      '@typescript-eslint/no-unsafe-member-access': 0,
      'import/no-extraneous-dependencies': 0,
      '@typescript-eslint/no-require-imports': 0,
      'import/no-anonymous-default-export': 0,
      'react-func/max-lines-per-function': 0,
    },
  },
]
