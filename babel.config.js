module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@/components': './src/components',
          '@/pages': './src/pages',
          '@/views': './src/views',
          '@/App': './src/App',
          '@/assets': './src/assets',
          '@/contexts': './src/contexts',
          '@/screens': './src/screens',
          '@/styles': './src/styles',
          '@/routes': './src/routes',
          '@/services': './src/services',
          '@/helpers': './src/helpers',
          '@/hooks': './src/hooks',
          '@/shared': './src/shared',
        },
      },
    ],
  ],
};
