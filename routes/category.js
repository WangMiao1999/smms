var express = require('express');
var router = express.Router();


var md5 = require('crypto');
// 添加公共模块
var connection = require("./gonggongmoban")
// 添加用户路由
router.post('/tianjiafenlei', function (req, res, next) {
  // // 2.后端路由接收前端数据
  let { cg_fatherID, cg_name, cg_isLocked } = req.body;
  // // 3.链接数据库，把数据库写入数据库
  // //执行sql语句
  let sqlStr = `insert into categorygoods(cg_fatherID,cg_name,cg_isLocked) values(?,?,?)`;
  let sqlParams = [cg_fatherID, cg_name, cg_isLocked];
  connection.query(sqlStr, sqlParams, function (error, results) {
    if (error) throw error; //出错对象
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "分类添加成功" })
    } else {
      res.send({ "isOk": false, "msg": "分类添加失败" })
    }
  });
});

// 获取下拉框内数据
router.get("/xialakuang", (req, res) => {
  let sqlStr = "select * from categorygoods order by cg_id DESC";
  // //2. 执行sql语句
  connection.query(sqlStr, function (error, userlist) {
    console.log(userlist)
    if (error) throw error; //出错后面的代码不执行
    //3. 返回查询的结果到前端（对象数组）
    res.send(userlist);
  });
})

// fenleiguanli
// 获取分类内容路由
router.get("/list", (req, res) => {
  let sqlStr = "select * from categorygoods order by cg_id DESC";
  // let sqlStr = "select t1.*,t2.cg_name as father_name from categorygoods as t1 left join categorygoods as t2 on t1.cg_fatherID=t2.cg_id";
  // let sqlParams = [id];
  connection.query(sqlStr, (error, result) => {
    if (error) throw error;
    res.send(result);

  })
})
// list

// 分类管理删除
router.get("/shanchu", (req, res) => {
  let id = req.query.id;
  let sqlStr = "delete from categorygoods where cg_id=?";
  let sqlParams = [id]
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
  let sqlStr = "select * from categorygoods where cg_id=?";
  let sqlParams = [id]
  connection.query(sqlStr, sqlParams, function (error, userData) {
    if (error) throw error;
    res.send(userData);
  })
})

// 编辑
router.post("/bianji", function (req, res, next) {
  let { cg_name, cg_fatherID, cg_isLocked, cg_id } = req.body;
  let sqlStr = "update categorygoods set cg_name=?,cg_fatherID=?,cg_isLocked=? where cg_id=?";
  let c_id = parseInt(cg_id);
  let sqlParams = [cg_name, cg_fatherID, cg_isLocked, c_id];
  console.log(sqlParams)
  connection.query(sqlStr, sqlParams, (error, results) => {
    // if(error) throw error;
    // res. send(results)
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, " msg": "分类修改成功!" });
    }
    else {
      res.send({ "isOk": false, "msg": "分类修改失败!" });
    }
  });
});


// 登录路由
router.post("/denglu", (req, res) => {
  // // 2.后端路由接收前端传入的用户名和密码，并根据用户名和密码做数据库查询
  // let { pass, checkPass } = req.body;

  // checkPass = md5.createHash("md5").update(checkPass).digest("hex");
  // let sqlStr = "select u_id from usertable  where usercg_name =? and userPwd = ?";
  // let sqlParams = [pass, checkPass];

  // // 3）后端如果查询到结果说明成功，否则失败，验证登录成功要写入cookie
  // connection.query(sqlStr, sqlParams, function (err, result) {
  //   if (err) throw err;
  //   // console.log(result[0].u_id)
  //   // 如果result数组是空数组那说明用户名或者密码错误
  //   res.cookie("pass",pass);
  //   res.cookie("u_id",result[0].u_id);
  //   // 4）后端根据成功还是失败返回结果到前端
  //     if(result.length>0){
  //       res.send({isOk:true,msg:"账号登录成功"})
  //     }else{
  //       res.send({isOk:false,msg:"账号登录失败"})
  //     }
  // })

})

// 退出系统路由
router.get("/tuichu", (req, res) => {
  // res.clearCookie("pass");
  // res.clearCookie("u_id");
  //   res.redirect("/souye.html");
})


// 验证非法进入
router.get("/feifa", (req, res) => {
  // let pass=req.cookies.pass;
  // if(!pass){
  //   res.send("alert('非法入侵');location.href='souye.html';")
  // }
  // else{
  //   res.send("")
  // }
})


// 分类管理
router.get("/fenleiguanli", (req, res) => {
  // let {date}=req.body
})

module.exports = router;
