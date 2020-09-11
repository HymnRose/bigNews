$(function () {
    //点击登录按钮
    $('#link_login').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去注册账号按钮
    $('#link_reg').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义表单验证规则
    var form = layui.form    //表单组件
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //username: function(value, item){ }//value：表单的值、item：表单的DOM对象
        //内部的规则实际上就是密码与确认密码输入框的内容是否一致，此处的value是确认密码的输入框文本
        repwd: function (value) {
            var pwd = $('.reg-box [name = password]').val()
            if (pwd !== value) {
                return '两次密码输入不一致'
            }
        }
    })

    // 监听注册表单提交事件
    var layer = layui.layer  //弹出层组件
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            type: 'POST',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！');
                $('#link_reg').click() //触发去登录点击事件
            }
        })
    })

    //监听登录表单提交事件
    $('#form-login').submit(function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        $.post('/api/login', data, function (res) {
            if (res.status != 0) {
                return layer.msg(res.message);  //弹出信息
            }
            layer.msg('登录成功！');
            //将登陆成功得到的token值保存到本地存储
            localStorage.setItem('token',res.token)
            location.href = 'index.html' //跳转页面
        })
    })

})