const path = require('path')
const htmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const devConfig = require('./webpack.dev.js')


function baseConfig(cwd) {
  return {
    mode: "development",
    entry: './src/index.js',
    output: {
      // TODO 修改打包文件的出口
      path: cwd + "/dist", // 输出文件路径
      // 给打包过后的文件名字加上hash
      // [contenthash:8] - 本应用打包输出文件级别的更新，导致输出文件名变化
      filename: "[name]-[contenthash:8].js",
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: "babel-loader",
        },
        // asset/inline:导出一个资源的 data URI。之前通过使用 url-loader 实现
        {
          test: /\.(png|jpe?g|svg|gif)$/,
          type: "asset/inline",
        },
        //  asset/resource:发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[hash][ext][query]",
          },
        },
      ]
    },
    plugins: [
      // html 模版
      new htmlWebpackPlugin({
        filename: "index.html",
        template: './pubilc/index.html',
      }),
      // 打包前，将本地已有的打包后的资源清空
      new CleanWebpackPlugin()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      mainFiles: ["index", "main"],
    },
  }
}

module.exports = function(path){
  console.log(path,'path')
  return merge(baseConfig(path),devConfig(path))
}