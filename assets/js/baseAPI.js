// 这个方法用于在发送ajax之前进行配置相关的属性
// 每次调用$.get或$.post或$.ajax函数之前都会调用ajaxPrefilter这个函数
// 在这个函数中，我们可以拿到给ajax的配置对象，
// 调用这个函数之后才会发起请求
$.ajaxPrefilter(function (options) {
  console.log(options);
  // console.log(options.url);
  options.url = 'http://ajax.frontend.itheima.net' + options.url
  // console.log(options);
  // string.indexOf(str,index) 返回指定字符在字符串中指定位置之后出现的索引，如果没有，则返回-1
  // str 指定字符   index 指定位置
  if (options.url.indexOf('/my/') != -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  options.complete = function (res) {
    console.log(123);
    console.log(res);
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = 'login.html'
    }
  }
})