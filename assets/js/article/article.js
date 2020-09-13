$(function () {
  var layer = layui.layer
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
  var addIndex
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

})