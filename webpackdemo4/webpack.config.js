const path = require('path');
// 压缩配置引入uglifyJsPlugin
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
// css分离
const extractTextPlugin = require("extract-text-webpack-plugin");
//消除未使用的css
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");

//webpack entry 模块化开发引入
const entry = require("./webpack_config/entry_webpack.js")
//webpack引入
const webpack = require('webpack');

console.log(encodeURIComponent(process.env.type));
// 声明公共路径，与host一致
if (process.env.type == "build") {//生产环境配置
    var website = {
        publicPath: "http://jspang.com:1717/"
    }
} else {//开发环境
    var website = {
        publicPath: "http://127.0.0.1:1717/"
    }
}

// var website = {
//     publicPath: "http://127.0.0.1:1717/"
// }


module.exports = {
    //打包调试配置devtool，只用于开发阶段，上线前删除
    devtool: 'eval-source-map',
    mode: 'development',
    // 生产环境(未压缩)
    // mode: 'production' ,
    // 开发环境(压缩)

    //entry配置
    // entry: {
    //     entery: './src/entery.js',
    //     // entery2: './src/entery2.js'
    //     // test:'./src/test.js'
    // },

    //使用模块化开发entry后配置
    entry: entry.path,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // 公共路径配置
        publicPath: website.publicPath
        // publicPath:'/assets/'
        // libraryTarget:'umd',
        // library:'myfirstlibrary'
    },
    module: {
        rules: [
            {//css
                test: /\.css$/,
                // css直接打包进js
                // use: [{
                //     loader: 'style-loader'
                // }, {
                //     loader: 'css-loader',
                //     options: {
                //         modules: true
                //     }
                // }, {
                //     loader: "postcss-loader"
                // }
                // ],
                // css分离打包
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: "css-loader", options: { importLoaders: 1 } },
                        //自动处理css3属性前缀载入postcss-loader
                        "postcss-loader"
                    ]
                })
            },
            {//图片
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath: 'images/',
                        //添加esModule为false,才能用html-withimg-loader配置压缩src路径
                        esModule: false,
                    }
                }]
            },
            {//html-withimg-loader插件，配置压缩src引入的图片
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            {//配置less
                // 未分离less（压缩后less在压缩的js文件中）
                // test: /\.less$/,
                // use: [{
                //     loader: "style-loader" // creates style nodes from JS strings
                // }, {
                //     loader: "css-loader" // translates CSS into CommonJS
                // }, {
                //     loader: "less-loader" // compiles Less to CSS
                // }]

                //less文件分离
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {//配置scss
                // 未分离scss（压缩后scss在压缩的js文件中）
                // test: /\.scss$/,
                // use: [{
                //     loader: "style-loader" // creates style nodes from JS strings
                // }, {
                //     loader: "css-loader" // translates CSS into CommonJS
                // }, {
                //     loader: "sass-loader" // compiles Sass to CSS
                // }]
                // scss分离文件
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {//babel配置
                test: /\.js$/,   //匹配JS文件  
                loader: 'babel-loader',
                exclude: /node_modules/   //排除node_modules目录
            }
        ]
    },
    // 插件，用于生产模版和各项功能
    plugins: [
        // new uglifyJsPlugin()
        new htmlPlugin({
            // minify: {
            //      removeAttributeQuotes: true //去掉属性的双引号
            // },
            minify: false, //插入图片src html-withimg-loader插件报错，改为false
            hash: true,  //开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            template: './src/index.html' //要打包的html模版路径和文件名称
        }),
        // 分离css目录及名称设置
        new extractTextPlugin("css/index.css"),
        //清除未使用的css
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        //优雅打包ProvidePlugin插件引入
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        //为每个 chunk 文件头部添加 banner
        new webpack.BannerPlugin('king版权所有~~~')
    ],
    // devServer:{}
    // 配置webpack开发服务功能：服务和热更新
    devServer: {
        //设置基本目录结构
        contentBase: path.join(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost(通过ipconfig可查看ip)
        // host:'192.168.43.236',
        // host:'0.0.0.0',
        host: '127.0.0.1',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1717,
        // writeToDisk:true
    },
    //watch监听更新配置，此处设置报错，直接用webpack --watch 监听不配置
    // watch: true,
    // watchOptions: {
    //     poll: 1000,//监测修改的时间(ms)
    //     aggregeateTimeout: 500, //防止重复按键，500毫米内算按键一次
    //     ignored: /node_modules/,//不监测
    // }
}
