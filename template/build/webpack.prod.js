const
    path = require('path'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    // 打包压缩所有引入的样式文件
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, '../src/main.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js',
        publicPath: './'
    },
    module: {
        rules: [
            // 解析js文件
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            // 解析css文件
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            // 处理静态资源模块
            {
                test: /\.(jpeg|jpg|png)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 设置小于多少字节才会进行转换成base64格式
                        limit: 15360,
                        outputPath: 'images',
                        name: "[name]_[hash].[ext]",
                    }
                }
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)$/,
                use: 'url-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
            // title:''	用于指定页面标题
            // filename:''	输出的 HTML 文件名，默认是 index.html
            // favicon: 添加特定的 favicon(图标) 路径到输出的 HTML 文件中
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash:8].css'
        }),
        // 删除产出目录中多余文件
        new CleanWebpackPlugin()
    ]
}

