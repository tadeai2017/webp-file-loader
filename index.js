/***
 * create by porter
 * 这个loader已经包含了url-loader file-loader
 * webp的
 * 参数：options{
 *   name:[name].[hash].[ext] 不传则默认使用hash 这个是url|file|webp
 *   preset 文件类型 default，photo，picture，drawing，icon和text。
 *   quality 质量
 *   alphaQuality 在0和之间设置透明压缩质量100。
 *   method 在0（最快）和6（最慢）之间指定要使用的压缩方法。此参数控制编码速度与压缩文件大小和质量之间的权衡。
 *   sns 在0和之间设置空间噪声整形的幅度100
 *   autoFilter 将解块滤波器强度设置在0（off）和之间100
 *   sharpness 在0（最锐利）和7（最不锐利）之间设置滤镜锐度
 *   lossless 无损编码图像。
 *
 * }
 */
var imagemin = require('imagemin');
var imageminWebp = require('imagemin-webp');
var loaderUtils = require('loader-utils');
var mime = require("mime");

module.exports = function (content) {
  this.cacheable && this.cacheable();
  if (!this.emitFile) throw new Error("emitFile is required from module system");
  //异步调用
  var callback = this.async();
  var called = false;
  //获取配置参数
  var query = loaderUtils.getOptions(this);
  //生成hash
  var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
    content: content,
    regExp: query.regExp
  });

  //拼接为webp的url
  var webpUrl = url.substring(0, url.lastIndexOf('.')) + '.webp';
  //设置默认值
  let limit = 10 * 1024;
  if (query.limit) {
    limit = parseInt(query.limit, 10);
  }
  //获取文件的类型
  var mimetype = query.mimetype || query.minetype || mime.getType(this.resourcePath);
  //如果小于默认10k或者自定义的范围，则直接输出base64
  if (limit <= 0 || content.length < limit) {
    return callback(null, "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64")));
  }

  //定义输出webp文件的参数
  var options = {
    preset: query.preset || 'default',//文件类型 default，photo，picture，drawing，icon和text。
    quality: query.quality || 75,//质量
    alphaQuality: query.alphaQuality || 100,//在0和之间设置透明压缩质量100。
    method: query.method || 1,//在0（最快）和6（最慢）之间指定要使用的压缩方法。此参数控制编码速度与压缩文件大小和质量之间的权衡。
    sns: query.sns || 80,//在0和之间设置空间噪声整形的幅度100
    autoFilter: query.autoFilter || false,//将解块滤波器强度设置在0（off）和之间100
    sharpness: query.sharpness || 0,//在0（最锐利）和7（最不锐利）之间设置滤镜锐度
    lossless: query.lossless || false,//无损编码图像。
    bypassOnDebug: query.bypassOnDebug || false,
  };

  if (query.size) {
    options.size = query.size;//设置目标大小（以字节为单位）。
  }

  if (query.filter) {
    options.filter = query.filter;
  }

  //调式
  if (this.debug === true && options.bypassOnDebug === true) {
    callback(null, "module.exports = __webpack_public_path__ + " + JSON.stringify(url) + ";");
  } else {
    //使用图片压缩
    imagemin.buffer(content, { plugins: [imageminWebp(options)] }).then(file => {
      //输出源文件
      this.emitFile(url, content);
      //输出webp文件
      this.emitFile(webpUrl, file);
      //默认还是显示原图片
      callback(null, "module.exports = __webpack_public_path__ + " + JSON.stringify(url) + ";");
    }).catch(err => {
      callback(err);
    });
  }
};

module.exports.raw = true;
 