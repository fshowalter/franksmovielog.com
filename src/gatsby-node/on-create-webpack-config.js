module.exports = function onCreateWebpackConfig({
  actions,
  stage,
  plugins,
  getConfig,
}) {
  // get current webpack config
  const config = getConfig();

  const miniCssExtractPlugin = config.plugins.find(
    (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
  );

  if (miniCssExtractPlugin) {
    miniCssExtractPlugin.options.ignoreOrder = true;
  }

  // override config only during
  // production JS & CSS build
  if (stage === "build-javascript") {
    // our new cssnano options
    // are still based on default preset
    const options = {
      cssProcessorPluginOptions: {
        preset: [
          "default",
          {
            discardComments: {
              removeAll: true,
            },
            calc: false,
            // reduceTransforms: false,
            // minifySelectors: false,
          },
        ],
      },
    };
    // find CSS minimizer
    const minifyCssIndex = config.optimization.minimizer.findIndex(
      (minimizer) =>
        minimizer.constructor.name === "OptimizeCssAssetsWebpackPlugin"
    );
    // if found, overwrite existing CSS minimizer with the new one
    if (minifyCssIndex > -1) {
      config.optimization.minimizer[minifyCssIndex] =
        plugins.minifyCss(options);
    }
  }

  // replace webpack config with the modified object
  actions.replaceWebpackConfig(config);
};
