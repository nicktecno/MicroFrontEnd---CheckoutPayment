const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

const withImages = require("next-images");

module.exports = withImages({
  fileExtensions: ["jpg", "jpeg", "png", "gif", "svg"],
  webpack(config, options) {
    return config;
  },
});

module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: pluginOptions.options,
        },
      ],
    });

    return config;
  },
};

const nextConfig = {
  webpack: (config, options) => {
    const { isServer } = options;
    config.experiments = {
      topLevelAwait: true,
      asyncWebAssembly: true,
      layers: true,
    };
    config.plugins.push(
      new NextFederationPlugin({
        name: "CheckoutPage",
        remotes: {
          loginPage: `loginPage@https://micro-front-login.vercel.app/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
          CartPage: `CartPage@https://micro-front-end-cart.vercel.app//_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
          homePage: `homePage@https://micro-front-home.vercel.app/_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
          productPage: `productPage@https://micro-front-end-product.vercel.app//_next/static/${
            isServer ? "ssr" : "chunks"
          }/remoteEntry.js`,
        },

        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./checkout": "./PagesComponents/Checkout/Checkout.jsx",
        },

        extraOptions: {
          exposePages: true,
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
