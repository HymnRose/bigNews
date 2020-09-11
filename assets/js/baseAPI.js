//这个方法用于在发送ajax之前进行配置相关的属性
//每次调用$.get或$.post或$.ajax函数之前都会调用ajaxPrefilter这个函数
//在这个函数中，我们可以拿到给ajax的配置对象，
//调用这个函数之后才会发起请求
$.ajaxPrefilter(function(options){
    console.log(options);
    console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})