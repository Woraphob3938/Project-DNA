import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "public/**", "tools/**"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Loading localStorage / URL params into state on mount is an
      // intentional SSR-safe pattern in this codebase; flag but don't fail.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
