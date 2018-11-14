var express = require('express');
var router = express.Router();


var md5 = require('crypto');

// 添加公共模块
var connection=require("./gonggongmoban")

// 添加用户路由
router.post('/add', function (req, res, next) {
  // 2.后端路由接收前端数据
  let { pass, yonghum, region } = req.body;
  pass = md5.createHash("md5").update(pass).digest("hex");
  // 3.链接数据库，把数据库写入数据库
  let sqlStr = `insert into userTable(userName,userPwd,userGroup) values('${yonghum}','${pass}','${region}')`;
  //执行sql语句
  connection.query(sqlStr, function (error, results) {
    if (error) throw error; //出错对象
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号添加成功" })
    } else {
      res.send({ "isOk": false, "msg": "账号添加失败" })
    }
  });
});

// 获取用户列表的路由
router.get("/list", (req, res) => {
  let sqlStr = "select * from usertable order by u_id DESC";
  //2. 执行sql语句
  connection.query(sqlStr, function (error, userlist) {
    if (error) throw error; //出错后面的代码不执行
    //3. 返回查询的结果到前端（对象数组）
    res.send(userlist);
  });
})

// 删除用户路由
router.get("/del", (req, res) => {
  let id = req.query.id;
  // console.log(req.query)
  let sqlStr = "delete from userTable where u_id=?";
  let sqlParams = [id];
  connection.query(sqlStr, sqlParams, (error, result) => {
    if (error) throw error;
    if (result.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号删除成功!" });
    }
    else {
      res.send({ "isOk": false, "msg": "账号删除失败!" });
    }
  })
})


// 根据id获取获取用户数据路由
router.get("/getUserByID", (req, res) => {
  let id = req.query.id;
  let sqlStr = "select * from userTable where u_id=?";
  let sqlParams = [id]

  connection.query(sqlStr, sqlParams, function (error, userData) {
    if (error) throw error;
    res.send(userData);
  })
})

router.post('/save', function (req, res, next) {
  let { pass, username, region, u_id, oldPwd } = req.body;
  let newPass = pass;

  if (oldPwd != newPass) {
    pass = md5.createHash("md5").update(newPass).digest("hex");
  }
  let sqlStr = "update userTable set userName=?,userPwd=?,userGroup=? where u_id=?";
  let sqlParams = [username, pass, region, u_id];

  connection.query(sqlStr, sqlParams, function (error, results) {
    if (error) throw error;
    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号修改成功!" });
    }
    else {
      res.send({ "isOk": false, "msg": "账号修改失败!" });
    }
  });
});


// 登录路由
router.post("/denglu", (req, res) => {
  // 2.后端路由接收前端传入的用户名和密码，并根据用户名和密码做数据库查询
  let { pass, checkPass } = req.body;

  checkPass = md5.createHash("md5").update(checkPass).digest("hex");
  let sqlStr = "select u_id from usertable  where userName =? and userPwd = ?";
  let sqlParams = [pass, checkPass];

  // 3）后端如果查询到结果说明成功，否则失败，验证登录成功要写入cookie
  connection.query(sqlStr, sqlParams, function (err, result) {
    if (err) throw err;
    // console.log(result[0].u_id)
    // 如果result数组是空数组那说明用户名或者密码错误
    res.cookie("pass",pass);
    res.cookie("u_id",result[0].u_id);
    // 4）后端根据成功还是失败返回结果到前端
      if(result.length>0){
        res.send({isOk:true,msg:"账号登录成功"})
      }else{
        res.send({isOk:false,msg:"账号登录失败"})
      }
  })

})

// 退出系统路由
router.get("/tuichu",(req,res)=>{
  res.clearCookie("pass");
  res.clearCookie("u_id");
    res.redirect("/souye.html");
})


// 验证非法进入
router.get("/feifa",(req,res)=>{
  let pass=req.cookies.pass;
  if(!pass){
    res.send("alert('非法入侵');location.href='souye.html';")
  }
  else{
    res.send("")
  }
})


// // 分类管理
// router.get("/fenleiguanli",(req,res)=>{
//   let {date}=req.body
// })

module.exports = router;
