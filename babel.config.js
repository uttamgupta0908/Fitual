module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      // Add babel-plugin-module-resolver here
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~': './src', // Example alias: import { Button } from '~/components/Button';
            '@components': './src/components',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@assets': './src/assets',
          },
        },
      ],
    ],
  };
};
