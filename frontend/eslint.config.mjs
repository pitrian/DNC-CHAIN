import nextEslint from 'eslint-config-next';

export default [
  ...(Array.isArray(nextEslint) ? nextEslint : [nextEslint]),
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];
