const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./config/webpack.config.js');
const compiler = Webpack(webpackConfig);
const devServerOptions = { ...webpackConfig.devServer, open: true };
const server = new WebpackDevServer(devServerOptions, compiler);
// TODO 修改为类调用

// 启动命令
const runServer = async () => {
    console.log('Starting server...');
    await server.start();
};

// 构建命令
const build = async (cwdPath) => {
    try {
        Webpack({
            ...webpackConfig,
            output: {
              // TODO 修改打包文件的出口
              path: cwdPath + "/dist", // 输出文件路径
              // 给打包过后的文件名字加上hash
              // [contenthash:8] - 本应用打包输出文件级别的更新，导致输出文件名变化
              filename: "[name]-[contenthash:8].js",
          },
        },(err)=>{
            let status = 'success'
            if (err){
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
process.on('message',message=>{
    const msg = JSON.parse( message )
    const { cwdPath } = msg
    if (msg.type == 'build'){
        build(cwdPath)
    }
    if (msg.type == 'start'){
        runServer()
    }
})