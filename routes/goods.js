var express = require('express');
var router = express.Router();


// 添加公共模块
var connection = require("./gonggongmoban")

/* 添加商品的路由 */
router.post('/add', function (req, res, next) {
  //2. 后端路由接收前端的数据
  let { cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails } = req.body;

  //3. 链接数据库，把数据库写入数据库
  //定义sql语句
  let sqlStr = "insert into goodsTable(cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails) values(?,?,?,?,?,?,?,?,?,?,?,?)"; //占位符
  let sqlParams = [cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails]; //参数数组
  //执行sql语句
  connection.query(sqlStr, sqlParams, function (error, results) {
    if (error) throw error; //出错对象
    //4. 返回处理的结果到前端
    //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "商品信息添加成功!" });
    }
    else {
      res.send({ "isOk": false, "msg": "商品信息失败!" });
    }
  });
});

// 获取商品列表的路由
// 获取分类内容路由
router.get("/list", (req, res) => {
  let sqlStr = "select * from categorygoods order by good_id DESC";
  // let sqlStr = "select t1.*,t2.cg_name as father_name from categorygoods as t1 left join categorygoods as t2 on t1.cg_fatherID=t2.cg_id";
  // let sqlParams = [id];
  connection.query(sqlStr, (error, result) => {
    if (error) throw error;
    res.send(result);
  })
})

// 获取商品的分页+查询数据信息【分页+查询的合并】
router.get("/listPagerSearch", (req, res) => {
  //接收页码\每页大小\关键词\分类id
  let { currentPage, pageSize, keywords, category } = req.query;

  //构造sqlg 
  let sqlStr = "select t1.*,t2.cg_name from goodsTable as t1 left join categorygoods as t2 on t1.cg_id=t2.cg_id where 1=1";
  //执行全表sql查询：获取总的记录条数
  connection.query(sqlStr, (err, goodsList) => {
    if (err) throw err;
    let total = goodsList.length; //总条数
    //关键词
    if (keywords.length > 0) {
      sqlStr += ` and (t1.barcode like '%${keywords}%' or t1.goodsname like '%${keywords}%')`;
    }

    //分类
    if (category.length > 0) {
      sqlStr += ` and cg_id=${category}`;
    }

    //执行查询的sql结果
    if (keywords.length > 0 || category.length > 0) {
      connection.query(sqlStr, (err, searchList) => {
        if (err) throw err;
        //res.send(searchList); //查询的结果
        //修改原来的总记录为查询后的记录数
        total = searchList.length;
      });
    }

    let skip = (currentPage - 1) * pageSize; //跳过的条数
    let sqlParams = [skip, parseInt(pageSize)];
    sqlStr += " limit ?,?";

    //执行查询当前页码应该显示的分页数据
    connection.query(sqlStr, sqlParams, (err, goodsPager) => {
      if (err) throw err;
      res.send({ "total": total, "datalist": goodsPager });
    });
  });
});

// cg_id
// 删除
router.get("/shanchu", (req, res) => {
  let id = req.query.id;
  // good_id
  let sqlStr = "delete from goodstable where good_id=?";
  let sqlParams = [id]
  console.log(sqlParams)
  connection.query(sqlStr, sqlParams, function (error, userData) {
    if (error) throw error;
    if (userData.affectedRows > 0) {
      res.send({ "isOk": true, "gsm": "删除成功" })
    } else {
      res.send({ "isOk": false, "gsm": "删除失败" })
    }
  })
})


// 根据id获取分类数据
router.get("/huoqushuju", (req, res) => {
  let id = req.query.id;
  // console.log(req.query)
  let sqlStr = "select * from goodstable where good_id=?";
  let sqlParams = [id]
  connection.query(sqlStr, sqlParams, function (error, userData) {
    if (error) throw error;
    res.send(userData);
  })
})

// 编辑
router.post("/bianji", function (req, res, next) {
  let { cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails, good_id } = req.body;
  let sqlStr = "update goodstable set cg_id=?,barcode=?,goodsname=?,goodsprice=?,marketprice=?,saleprice=?,stockNum=?,weigth=?,unit=?,promotion=?,discount=?,goodsDetails=? where good_id=?";
  let goo_id = parseInt(good_id);
  let sqlParams = [goo_id, cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails];
  // console.log(req.body)
  connection.query(sqlStr, sqlParams, (error, results) => {
    if (error) throw error;
    // res.send(results)   
    // console.log(results)
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, " msg": "分类修改成功!" });
    }
    else {
      res.send({ "isOk": false, "msg": "分类修改失败!" });
    }
  });
});


// router.post("/bianji", function (req, res, next) {
//   let  { cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails, good_id } = req.body;
//   let sqlStr = "cg_id=?,barcode=?,goodsname=?,goodsprice=?,marketprice=?,saleprice=?,stockNum=?,weigth=?,unit=?,promotion=?,discount=?,goodsDetails=? where good_id=?";
//   let goo_id = parseInt(good_id);
//   let sqlParams = [goo_id, cg_id, barcode, goodsname, goodsprice, marketprice, saleprice, stockNum, weigth, unit, promotion, discount, goodsDetails];
//   // console.log(sqlParams)
//   connection.query(sqlStr, sqlParams, (error, results) => {
//     // if(error) throw error;
//     // res. send(results)
//     if (error) throw error;
//     if (results.affectedRows > 0) {
//       res.send({ "isOk": true, " msg": "分类修改成功!" });
//     }
//     else {
//       res.send({ "isOk": false, "msg": "分类修改失败!" });
//     }
//   });
// });



// 获取下拉框内数据
router.get("/xialakuang", (req, res) => {
  let sqlStr = "select * from goodstable order by good_id DESC";
  // //2. 执行sql语句
  connection.query(sqlStr, function (error, userlist) {
    console.log(userlist)
    if (error) throw error; //出错后面的代码不执行
    //3. 返回查询的结果到前端（对象数组）
    res.send(userlist);
  });
})

module.exports = router;
