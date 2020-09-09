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
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //username: function(value, item){ }//value：表单的值、item：表单的DOM对象
        //内部的规则实际上就是密码与确认密码输入框的内容是否一致，此处的value是确认密码的输入框文本
        repwd: function (value) {
            var pwd = $('.reg-box [name = repassword]')
            if (pwd !== value) {
                return '两次密码输入不一致'
            }
        }
    })
})