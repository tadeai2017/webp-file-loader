# webp-file-loader
可以将小图片转成base64，并且保留源图片，以源文件的hash命名生成新的webp图片
## Features
	1. 开发模式下会在缓存中生成同名的webp图片
	2. 支持传入limit参数，默认限制10k以下的图片转成base64，以上的图片将生成同名的webp图片
	3. 可以结合vue-use-webp插件使用
## Installation
```
npm install --save-dev webp-file-loader
```
## Usage
1. webpack / vue-cli2.0 配置如下
```
{
  test: /\.(png|jpe?g)(\?.*)?$/,
  use: [{
    loader: "webp-file-loader",
    options: {
      limit: 4096,
      quality: 90,
      name: 'static/img/[name].[hash:8].[ext]'
    }
  }]
}
```
2. vue-cli3.0 配置如下
```
module.exports = {
  chainWebpack: config => {
    const imageRule = config.module.rule('images')
    imageRule.uses.clear()
    config.module.rule('webp')
      .test(/\.(jpe?g|png)$/i)
      .use('webp-file-loader')
      .loader('webp-file-loader')
      .options({
        limit: 4096,
        quality: 90,
        name: `static/img/[name].[hash:8].[ext]`
      })
      .end()
  }
}
```
## API
### limit
Type: `string|number`  
Default: `10240`  
默认10k以下的图片转成base64  
### quality  
Type: `string|number`  
Default: `75`  
png或jpg生成的webp图片的质量  
### name
Type: `string`  
Default: `[hash].[ext]`  
生成的webp图片的文件名和相对路径  
### 其他API
其他参数可参考imageminWebp  
## Tips
1. 若有cwebp-bin报错，可检查node_modules下cwebp-bin下是否有vendor文件夹，若没有则需要重新安装该依赖包

