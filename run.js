const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./config/webpack.config.js');
const devConfig = require('./config/webpack.dev')




// 启动命令
const runServer = async (cwdPath) => {
  const compiler = Webpack(webpackConfig(cwdPath));
  const server = new WebpackDevServer(devConfig().devServer, compiler);
  console.log('Starting server...');
  await server.start();
};

// 构建命令
const build = async (cwdPath) => {
  try {
    Webpack(webpackConfig(cwdPath), (err) => {
      let status = 'success'
      if (err) {
        status = 'fail'
        console.log(err)
      }
      process.send({
        status,
        err
      });
    })
  } catch (e) {
    console.log(e, 'compiler')
  }
}
process.on('message', message => {
  const msg = JSON.parse(message)
  const { cwdPath } = msg
  if (msg.type == 'build') {
    build(cwdPath)
  }
  if (msg.type == 'start') {
    runServer(cwdPath)
  }
})