import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

// Next.js 16 removed `next lint`; this is the native ESLint 9 flat config.
// `eslint-config-next/core-web-vitals` already bundles the base Next rules,
// `next/typescript`, and the strict core-web-vitals rules.
const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]

export default eslintConfig
