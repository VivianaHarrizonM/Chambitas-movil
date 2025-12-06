module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // 👇 necesario para que React Native Reanimated funcione (tabs, etc.)
    plugins: ['react-native-reanimated/plugin'],
  };
};
