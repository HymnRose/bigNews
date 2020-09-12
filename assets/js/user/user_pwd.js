$(function () {
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('.layui-form [name=oldPwd]').val()) {
                return '新旧密码不能一致'
            }
        },
        rePwd: function (value) {
            if (value !== $('.layui-form [name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                $('.layui-form')[0].reset()
                localStorage.removeItem('token')
                top.window.location.href = '/login.html'
            }
        })
    })


})