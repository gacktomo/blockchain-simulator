module.exports = {
  entry: __dirname + "/js/main.js", //ビルドするファイル
  output: {
    path: __dirname +'/', //ビルドしたファイルを吐き出す場所
    filename: 'bundle.js' //ビルドした後のファイル名
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: __dirname + "/",
    port: 8080
  },
  // module: {
  //   loaders: []
  // }
};