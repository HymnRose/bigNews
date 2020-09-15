$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  // 声明查询参数
  var q = {
    pagenum: 1, // 页码值
    pagesize: 2, // 每页显示多少条数据
    cate_id: '', // 文章分类的 Id
    state: '',   // 文章的状态，可选值有：已发布、草稿
  }
  initTable()
  // 获取文章列表
  function initTable() {
    $.ajax({
      url: '/my/article/list',
      method: 'GET',
      data: q,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }


  // 初始化文章分类
  initCate()
  function initCate() {
    $.ajax({
      url: '/my/article/cates/',
      method: 'GET',
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        var htmlStr = template('tpl-form', res)
        $('#form-search [name=cate_id]').html(htmlStr)
        form.render()
        // console.log(12);
      }
    })
  }

  // 筛选表单绑定submit事件
  $('#form-search').submit(function (e) {
    e.preventDefault()
    // 拿到表单的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象中q对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件重新渲染数据
    initTable()
  })

  // 渲染分页方法
  function renderPage(total) {
    // 调用laypage.render()方法
    laypage.render({
      elem: 'renderpage',    // 分页展示区域
      count: total,   // 数据总条数
      limit: q.pagesize,   // 每页显示多少条数据
      curr: q.pagenum,    // 起始页面
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 触发jump函数的方法有两种：
      // 1.初始化的时候，调用laypage.render
      // 2.切换页码值的时候会触发
      jump: function (obj, first) {
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // 把最新的页码值赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        // console.log(q.pagenum);
        // console.log(first);  // 默认值为true
        // console.log(obj.limit); //得到每页显示的条数
        q.pagesize = obj.limit
        // 根据最新的q获取对应的数据列表，并渲染表格
        // 首次不执行，即首次加载页面不调用渲染页面函数
        if (!first) {
          initTable()
        }

      }
    })
  }

  // 删除功能
  $('body').on('click', '.delete-btn', function () {
    var Id = $(this).attr('data-id')
    console.log(Id);
    var delBtnLen = $('.btn-delete').length
    // var articleId = $(this).attr('Id')
    layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: `/my/article/delete/${Id}`,
        data: {},
        method: 'GET',
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg('文章删除成功！')
          layer.close(index);
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (delBtnLen === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })

    });
  })
})