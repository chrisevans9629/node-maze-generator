const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  devtool: "source-map",
  target: "node",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "MazeGen"
  },
  watch: true,
};
