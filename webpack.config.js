module.exports = {
  entry: __dirname + "/src/main.js", //ビルドするファイル
  output: {
    path: __dirname +'/dist', //ビルドしたファイルを吐き出す場所
    filename: 'bundle.js' //ビルドした後のファイル名
  },
  devServer: {
    contentBase: __dirname + "/src",
    port: 8080
  },
  // module: {
  //   loaders: []
  // }
};