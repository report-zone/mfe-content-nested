const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3005,
    open: false,
  },
  output: {
    publicPath: "http://localhost:3005/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "visualization",
      library: { type: "var", name: "visualization" },
      filename: "visualizationRemoteEntry.js",
      exposes: {
        // expose each component
        "./Visualization": "./src/components/Visualization",
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        uuid: { singleton: true, eager: true, requiredVersion: deps.uuid },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
        "@mui/material": {
          singleton: true,
          eager: true,
          requiredVersion: deps["@mui/material"],
        },
        "@mui/x-data-grid": {
          singleton: true,
          eager: true,
          requiredVersion: deps["@mui/x-data-grid"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.dev.html",
    }),
  ],
  performance: { hints: false },
};
