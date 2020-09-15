$(function () {
  var layer = layui.layer
  var form = layui.form

  // 初始化富文本编辑器
  initEditor()

  $.ajax({
    url: '/my/article/cates',
    method: 'GET',
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      var htmlStr = template('tpl-cate', res)
      $('[name=cate_id]').html(htmlStr)
      form.render() // layui框架里面的内置方法，表格生成后需要用form.render()渲染
    }
  })

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  $('#chooseImg').on('click', function () {
    $('#coverFile').click()
  })


  $('#coverFile').change(function (e) {
    // 1. 拿到用户选择的文件
    var file = e.target.files[0]
    // 2. 根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)
    // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })
  // $image
  //   .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
  //     width: 400,
  //     height: 280  
  //   })
  //   .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
  //     // 得到文件对象后，进行后续的操作
  //   })


  var art_state = '已发布'
  $('#btnSave2').click(function () {
    art_state = '草稿'
  })


  // 为表单绑定submit提交事件
  $('#pubArticle').on('submit', function (e) {
    e.preventDefault()
    // 基于form表单，创建一个FormData对象
    var fd = new FormData($(this)[0])
    //将文章的发布状态，存到fd中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        publishArticle(fd)
      })
  })


  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }

})