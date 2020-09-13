$(function () {
  var layer = layui.layer
  var form = layui.form
  // 获取文章类别
  getCateList()

  function getCateList() {
    $.ajax({
      url: '/my/article/cates',
      method: 'GET',
      data: {},
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var addIndex = null
  $('#btnAddCate').click(function () {
    addIndex = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '添加文章分类'
      , content: $('#dialog-add').html()
    });
  })

  // 添加文章分类
  // 使用事件委托  给body委托
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/my/article/addcates',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('添加分类成功！')
        getCateList() // 添加成功之后重新调用获取分类函数
        layer.close(addIndex);
      }
    })
  })

  // 展示编辑弹框
  // 事件是在模板引擎里面，无法直接注册事件，用事件委托比较适合
  var editIndex = null
  $('body').on('click', '.btn-edit', function () {
    editIndex = layer.open({
      type: 1,
      area: ['500px', '300px'],
      title: '修改文章分类'
      , content: $('#dialog-edit').html()
    });
    var dataId = $(this).attr('data-id')
    $.ajax({
      url: `/my/article/cates/${dataId}`,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        form.val('edit-form', res.data)
      }
    })
  })

  // 编辑文章分类到服务器
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      url: '/my/article/updatecate',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('编辑分类成功')
        getCateList()
        layer.close(editIndex)
      }
    })
  })

  // 删除文章分类
  $('body').on('click', '.btn-delete', function () {
    // 获取删除按钮Id
    var delId = $(this).attr('data-id')
    // 删除弹框
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: '/my/article/deletecate/' + delId,
        method: 'GET',
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('删除成功！')
          getCateList()
          layer.close(index);
        }
      })


    });
  })
})