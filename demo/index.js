

/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */

const SMSClient = require('./../index')
var express =require("express");
var app=express();
var MongoClient=require("mongodb").MongoClient;
var url ="mongodb://localhost:27017/mydb";
var bodyParser= require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAIrBvcQkc5IVNu'
const secretAccessKey = 'CeXlg0hNkqeS7QnC4cZOEEIO1hLYsT'

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-'

//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

//短信回执报告
smsClient.receiveMsg(0, queueName).then(function (res) {
    //消息体需要base64解码
    let {code, body}=res
    if (code === 200) {
        //处理消息体,messagebody
        //console.log(body)
    }
}, function (err) {
    //console.log(err)
})

//短信上行报告
smsClient.receiveMsg(1, queueName).then(function (res) {
    //消息体需要base64解码
    let {code, body}=res
    if (code === 200) {
        //处理消息体,messagebody
        //console.log(body)
    }
}, function (err) {
    //console.log(err)
})


//查询短信发送详情
smsClient.queryDetail({
    PhoneNumber: '1500000000',
    SendDate: '20170731',
    PageSize: '10',
    CurrentPage: "1"
}).then(function (res) {
    let {Code, SmsSendDetailDTOs}=res
    if (Code === 'OK') {
        //处理发送详情内容
       // console.log(SmsSendDetailDTOs)
    }
}, function (err) {
    //处理错误
    //console.log(err)
})
var yzm=null;
function suiji(){
		yzm =Math.floor(Math.random()*10000);
		return yzm;
}

//发送短信

function send(phoneNum,yzm){
smsClient.sendSMS({
    PhoneNumbers: phoneNum,
    SignName: '陈峰磊',
    TemplateCode: 'SMS_139465128',
    TemplateParam: `{"code":${yzm}}`
}).then(function (res) {
    let {Code}=res
    if (Code === 'OK') {
        //处理返回参数
        console.log(res)
    }
}, function (err) {
    console.log(err)
})
};

app.post("/user/register",function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    console.log(req.body);
    let phoneNum=req.body.phoneNum;
    let id=req.body.id;
    let reg = /^1[3|4|5|8][0-9]\d{8}$/
      if(id==1){
          if(reg.test(phoneNum)){
	      suiji();
	     // send(phoneNum,yzm);
          console.log(yzm);
          res.send("1"); 
                 }else{

                     res.send("0");  
                 }
      }else{
          let password =req.body.password;
          let code =req.body.yzm;
      if(code==yzm){
	      MongoClient.connect(url,function(err,db){
		      db.collection("yzm",function(err,coll){
		         coll.find({phoneNum:phoneNum}).toArray(function(err,data){
		         if(data.length>0){
		         
		            res.send("0");
		            db.close();
		         }else{
		         coll.save({phoneNum:phoneNum,password:password,money:0,usemoney:0,outmoney:0,arr:[]},function(err,data){
		            res.send("1");
		            db.close();
		              })
		           }
		         })
		      })
	      })
	      }else{
		      res.send("验证码不对");
		      
	      
	      }
	      
      }



});
app.post("/user/login",function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    MongoClient.connect(url,function(err,db){
        db.collection('yzm',function(err,coll){
            coll.find({phoneNum:req.body.phoneNum,password:req.body.password}).toArray(function(err,data){
                if(data.length>=1){
                    res.send(data)
                    db.close();
                }else{
                    res.send("0")
                    db.close();
                }
                
            })
        })
    })  
})

//money
app.post("/user/money",function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    MongoClient.connect(url,function(err,db){
        db.collection('yzm',function(err,coll){
            coll.updateOne({phoneNum:req.body.phoneNum},{$set:{money:req.body.money}},function(data){
                res.send("1");
                db.close();
                })
        })
    })  
})
// outmoney
app.post("/user/outmoney",function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    MongoClient.connect(url,function(err,db){
        db.collection('yzm',function(err,coll){
            coll.updateOne({phoneNum:req.body.phoneNum},{$set:{outmoney:req.body.outmoney}},function(data){
                res.send("1");
                db.close();
                })
        })
    })  
})
//usemoney
app.post("/user/usemoney",function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    MongoClient.connect(url,function(err,db){
        db.collection('yzm',function(err,coll){
            coll.updateOne({phoneNum:req.body.phoneNum},{$set:{usemoney:req.body.usemoney}},function(data){
                res.send("1");
                db.close();
                })
        })
    })  
})

//arr
app.post("/user/usearr",function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    console.log(req.query.arr)
    MongoClient.connect(url,function(err,db){
        db.collection('yzm',function(err,coll){
            coll.updateOne({phoneNum:req.query.phoneNum},{$set:{arr:req.query.arr}},function(data){
                res.send("");
                db.close();
                })
        })
    })  
})





//出借期限数据
app.post('/user/product',function(req,res){
    res.header('Access-Control-Allow-Origin','*');
    MongoClient.connect(url,function(err,db){
        db.collection('product',function(err,coll){
            coll.find({}).toArray(function(err,data){
                res.send(data);
                db.close();
            })
        })
    })
})





app.listen(3000);
