module.exports = {
    devServer:{
      proxy:{
        '/api':{
          target:'http://127.0.0.1:10086', // 需要代理的域名
          changeOrigin:true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求
          pathRewrite:{ //重写匹配的字段，如果不需要在请求路径上，重写为""
            '^/api':''
          }
        }
      }
    }
  }