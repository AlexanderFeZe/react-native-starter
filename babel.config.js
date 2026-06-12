module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv'],
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@features': './src/features',
        '@shared': './src/shared',
        '@config': './src/config',
        '@app': './src/app',
      },
    }],
  ],
};
