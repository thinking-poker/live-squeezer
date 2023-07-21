module.exports = {

  //  lintOnSave: false
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    disableHostCheck: true,
    port: 4000,
    public: '0.0.0.0:4000'
  },
  publicPath: "/"

}