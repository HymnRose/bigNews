$(function () {
  // $(function(){})是局部方法，需要挂载到window上才可以调用
  window.getUserInfo = getUserInfo
  //获取用户的基本信息 

  getUserInfo()

  // 退出登录
  $('#btnLogout').click(function () {
    layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token')
      location.href = 'login.html'
      layer.close(index);
    });
  })
  // 获取用户的输入信息
  function getUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      // headers: {
      //     Authorization: localStorage.getItem('token') || ''
      // },
      success: function (res) {
        // console.log(res);  
        if (res.status !== 0) {
          return layui.layer.msg('获取用户信息失败！')
        }
        renderAvatar(res.data)
      },
      // 不论获取请求成功还是失败，最终都会调用complete函数
      // complete: function (res) {
      //   console.log(123);
      //   console.log(res);
      //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //     localStorage.removeItem('token')
      //     location.href = 'login.html'
      //   }

      // }
    })
  }
  // 渲染用户头像
  function renderAvatar(user) {
    //获取用户名称
    var name = user.username || user.nickname
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic !== null) {
      $('.layui-nav-img').attr('src', user.user_pic).show()
      $('.text-avatar').hide()
    } else {
      $('.layui-nav-img').hide()
      $('.text-avatar').html(user.username[0].toUpperCase()).show()
    }
  }
})
