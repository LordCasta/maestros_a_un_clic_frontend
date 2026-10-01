import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,js,mjs}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'docs/figma/**']),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/rules',
    rules: {
      // Componentes de una sola palabra solo con prefijo (BaseButton) o sufijo de vista (LoginView).
      'vue/multi-word-component-names': 'error',
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/require-default-prop': 'off',
      // Un módulo no importa archivos internos de otro: solo su index.ts (ver docs/arquitectura.md).
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/modules/[^/]+/.+',
              message: 'Importa desde el index del módulo: @/modules/<modulo>.',
            },
          ],
        },
      ],
    },
  },

  {
    // Dentro de un módulo sí se importan sus propios archivos (con rutas relativas).
    name: 'app/module-internals',
    files: ['src/modules/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/modules/[^/]+/.+',
              message:
                'Usa rutas relativas dentro del módulo, o el index (@/modules/<modulo>) para otro módulo.',
            },
          ],
        },
      ],
    },
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
