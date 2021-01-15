/*

原作者：执意ZhiYi-N (github：https://github.com/ZhiYi-N/script)
修改： Kyle

=======================================================
=======================================================


邀请码：
来笑谱，一起领20元现金！￥10.uPg+O1jc9EXq
1.长按【复制】整条信息
2.下载并打开笑谱App：http://jzi7.cn/7szkKX
=======================================================
获取ck方法：

看一个视频弹出金币获取videoheader and videobody(存在一定几率获取不到videobody）多试几次 and 金蛋获取 gold body(第六个视频，最后一圈）

------------------------------ 更新
---------------------------------
header的
traceid: 31348519185679441920时间戳13位00002bfa26fc

new Date().getTime() + 8 * 60 * 60 * 1000 ac跑的话

定时建议2分钟左右自己设置(git ac 用户建议5-6小时执行一次，脚本内置死循环，循环间隔2mins)

=======================================================
[mitm]
hostname = veishop.iboxpay.com
=======================================================
#圈x
[rewrite local]
https:\/\/veishop\.iboxpay\.com\/nf_gateway\/nf_customer_activity\/day_cash\/v1\/give_gold_coin_by_video\.json url script-request-body https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/xp.js
=======================================================
#loon
http-request https:\/\/veishop\.iboxpay\.com\/nf_gateway\/nf_customer_activity\/day_cash\/v1\/give_gold_coin_by_video\.json script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/xp.js, requires-body=true, timeout=10, tag=笑谱
=======================================================
#surge
笑谱 = type=http-request,pattern=^https:\/\/veishop\.iboxpay\.com\/nf_gateway\/nf_customer_activity\/day_cash\/v1\/give_gold_coin_by_video\.json,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/xp.js,script-update-interval=0
=======================================================
小火箭:本地
签到获取ck
笑谱APP = type=http-request,script-path=xiaopusign.js,pattern=^https:\/\/veishop\.iboxpay\.com\/*,max-size=131072,requires-body=true,timeout=10,enable=true



=======================================================
*/
const jsname='笑谱'
const $ = Env(jsname)

const notify = $.isNode() ?require('./sendNotify') : '';


$.idx = ($.idx = ($.getval('xpsetting') || '1') - 1) > 0 ?  ($.idx + 1 + '') : ''; // 账号扩展字符

const videoheaderArr = [];
const videobodyArr=[];
const goldbodyArr=[];


let videoheader = $.getdata('videoheader')
let videobody = $.getdata('videobody')
let goldbody = $.getdata('goldbody')

let notice = true // 通知 true or false

const logs = 0;//0为关闭日志，1为开启

let myDate = ''

let year = ''
let month = ''
let strDate = ''

let hour = ''
let minute = ''

let currentdate = ''

let myTimeStamp = ''

let sep = '-'

let gold = 0

let message = '' // 提示消息


let noLive = '' // 直播是否有
let live = 0

const liveid = '1348602411185672599'

//CK运行
/* let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie();
   $.done()
} */

if ($.isNode()) {
  if (process.env.VIDEOHEADER && process.env.VIDEOHEADER.indexOf('#') > -1) {
   videoheader = process.env.VIDEOHEADER.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.VIDEOHEADER && process.env.VIDEOHEADER.indexOf('\n') > -1) {
   videoheader = process.env.VIDEOHEADER.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   videoheader = [process.env.VIDEOHEADER]
  };

  if (process.env. VIDEOBODY && process.env.VIDEOBODY.indexOf('#') > -1) {
   videobody = process.env.VIDEOBODY.split('#');
  }
  else if (process.env.VIDEOBODY && process.env.VIDEOBODY.split('\n').length > 0) {
   videobody = process.env.VIDEOBODY.split('\n');
  } else  {
   videobody = [process.env.VIDEOBODY]
  };

  if (process.env.GOLDBODY && process.env.GOLDBODY.indexOf('#') > -1) {
   goldbody = process.env.GOLDBODY.split('#');
  }
  else if (process.env.GOLDBODY && process.env.GOLDBODY.split('\n').length > 0) {
   goldbody = process.env.GOLDBODY.split('\n');
  } else  {
   goldbody = [process.env.GOLDBODY]
  };

  Object.keys(videoheader).forEach((item) => {
    if (videoheader[item]) {
      videoheaderArr.push(videoheader[item])
    }
  });
  
  Object.keys(videobody).forEach((item) => {
    if (videobody[item]) {
      videobodyArr.push(videobody[item])
    }
  });

  Object.keys(goldbody).forEach((item) => {
    if (goldbody[item]) {
      goldbodyArr.push(goldbody[item])
    }
  });
 } else {
    videoheaderArr.push($.getdata('videoheader'))
    videobodyArr.push($.getdata('videobody'))
    goldbodyArr.push($.getdata('goldbody'))

    // boxjs中设置多账号数
    let xpcount = ($.getval('xpcount') || '1');
    for (let i = 2; i <= xpcount; i++) {
      if ($.getdata(`videoheader${i}`)) {
        videoheaderArr.push($.getdata(`videoheader${i}`))
        videobodyArr.push($.getdata(`videobody${i}`))
        goldbodyArr.push($.getdata(`goldbody${i}`))
      }
  }
}

~(async () => {
if (!videoheaderArr[0]) {
    $.msg($.name, `♥ 请先获取${jsname}Token`)
    return;
  }
  
  console.log(`-------------共${videoheaderArr.length}个账号----------------\n`)

  // for github ac use
  if ($.isNode()) {
    let count = 0
    while (true) {
      count++
      console.log(`============开始第${count}次执行，完成后将摸鱼2分钟============\n`)

      await beginScript();

      console.log(`============第${count}次执行完毕，2mins💤💤💤💤💤💤============\n`)
      await $.wait(120000);
    }
  } else {
    // 圈x、Loon等手机使用
    await beginScript();
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

// 处理及执行
async function beginScript() {
  for (let i = 0; i < videoheaderArr.length; i++) {
    if (videoheaderArr[i]) {
      videoheader = videoheaderArr[i];

      let videoheaderObj = JSON.parse(videoheader)

      // 增加时间戳
      videoheaderObj.traceid = '31348519185679441920' + (myTimeStamp) + '00002bfa26fc'; // 北京时间戳

      videoheader = JSON.stringify(videoheaderObj)

      videobody = videobodyArr[i];
      goldbody = goldbodyArr[i];
      $.index = i + 1;

      console.log(`开始【${jsname}${$.index}】\n`);


      await genTimeFormat(); // 时间格式化
      await iboxpay(); // 用户信息

      await liveStatus();
      await control(); // 看视频或者金蛋视频

      await profit();
      await balance();
      await SendMsg();
    }
 }
 $.log(`\n`)
}

// 获取基本信息
function iboxpay(timeout=0) {
  return new Promise((resolve) => {

    setTimeout( ()=>{
      let Url = {
        url : `https://veishop.iboxpay.com/nf_gateway/nf_user_center_web/shopkeeper/v1/get_context_info.json`,
        headers : JSON.parse(videoheader),
      }
      $.get(Url, async (err, resp, data) => {
        try {
          if (data) {
            data = JSON.parse(data);
            if(logs==1) console.log(data)
            $.iboxpay = data;
            if($.iboxpay.resultCode==1)
            console.log("...开始执行【"+$.iboxpay.data.customerInfo.nickname+"】账号任务...\n")
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
} 

// 控制看普通视频还是金蛋视频
async function control() {
  if(goldbody && gold == 1) {
    await watch_goldvideo();
  } else {
    await watch_video();
  }

  // 看直播
  if(noLive < 50 && hour >= 8 && hour <= 23) {
    await watch_livevideo()
  }
}

//video
function watch_video() {
  return new Promise((resolve, reject) => {
    let watch_videourl = {
      url: `https://veishop.iboxpay.com/nf_gateway/nf_customer_activity/day_cash/v1/give_gold_coin_by_video.json`,
      headers: JSON.parse(videoheader),
      body: videobody,
      timeout: 30000
    }
    $.post(watch_videourl,(error, response, data) => {
      try {
        if (data) {
          let result = JSON.parse(data)
          if(logs==1)console.log(result)

          message = `📣看视频`

          if(result.resultCode == 1) {
            message += '获得'+result.data.goldCoinNumber+'🎈\n'
          } else {
            message +='⚠️异常'+result.errorDesc+'\n'
          }
        }
      } catch (e) {
        $.logErr(e, response)
      } finally {
        resolve()
      }
    })
  })
}

//goldvideo
function watch_goldvideo() {
  return new Promise((resolve, reject) => {
    let watch_goldvideourl = {
      url: `https://veishop.iboxpay.com/nf_gateway/nf_customer_activity/day_cash/v1/give_gold_coin_by_video.json`,
      headers: JSON.parse(videoheader),
      body: goldbody,
      timeout: 60000
    }

    $.post(watch_goldvideourl,(error, response, data) => {
      try {
        if (data) {
          let result = JSON.parse(data)
          if(logs==1)console.log(result)
          
          message = '📣看金蛋视频'
          if(result.resultCode == 1) {
            message += '获得'+result.data.goldCoinNumber+'🎈\n'
          } else {
            message +='⚠️异常'+result.errorDesc+'\n'
          }
        }
      } catch(e) {
        $.logErr(e, response)
      } finally {
        resolve()
      }
    })
  })
} 

// 收益
function profit() {
  return new Promise((resolve, reject) => {
    let profiturl = {
      url: `https://veishop.iboxpay.com/nf_gateway/nf_customer_activity/day_cash/v1/list_gold_coin.json?date=&actTypeId=0&size=5`,
      headers :JSON.parse(videoheader),
    }
    $.get(profiturl,(error, response, data) => {
      try {
        if (data) {
          let result = JSON.parse(data)
          if(logs==1)console.log(result)
          
          let num = data.match(/"type":1/ig) ? data.match(/"type":1/ig).length : 0
          $.log('视频数量：'+num)

          gold = num >= 5 ? 1 : 0 // 控制看金蛋视频

          if (result && result.data && result.data.length) {
            message = '🎉当前金币余额'+result.data[0].totalCoinAmt+'👆\n'
          }
          
          // message += '现金约'+(Number($.profit.data.balanceSum)/100).toFixed(2)+'元💸'
        }
       } catch(e) {
         $.logErr(e, response)
       } finally {
         resolve()
       }
    })
  })
}

// 汇总
function balance() {
  return new Promise((resolve, reject) => {
    let balanceurl = {
      url: 'https://veishop.iboxpay.com/nf_gateway/nf_customer_activity/day_cash/v1/balance.json?source=WX_APP_KA_HTZP',
      headers :JSON.parse(videoheader)
    }

    $.get(balanceurl,(error, response, data) => {
      try {
       let result = JSON.parse(data)
       if(logs==1)console.log(result)

       if(result.resultCode == 1) {
         message += '金币余额：'+result.data.coinSum+'\n现金余额：'+result.data.balanceSum/100+'\n'
        } else {
          message +='⚠️balance接口异常\n'
        }
      } catch(e) {
       $.logErr(e, response)
      } finally {
       resolve()
      }
     })
  })
}

// 直播状态
function liveStatus() {
  return new Promise((resolve, reject) => {
    let statusurl ={
      url: `https://veishop.iboxpay.com/nf_gateway/nf_customer_activity/day_cash/v1/list_gold_coin.json?date=${currentdate}&actTypeId=10&size=60`,
      headers :JSON.parse(videoheader)
    }

    $.get(statusurl,(error, response, data) => {
      try {
        let result = JSON.parse(data)
        if(logs==1)$.log(result)
      
        noLive = data.match(/"type":1/i) ? data.match(/"type":1/ig).length : 1

        $.log('xplive'+noLive)
      } catch(e) {
        $.logErr(e, response)
      } finally {
        resolve()
      }
    })
  })
}

// 看直播
function watch_livevideo() {
  let liveids = liveid.replace(/\d{3}$/,Math.floor(Math.random()*1000));
  $.log(liveids)
  return new Promise((resolve, reject) => {
    let watch_livevideourl = {
      url: `https://veishop.iboxpay.com/nf_gateway/nf_customer_activity/day_cash/v1/give_redbag_by_live.json`,
      headers: JSON.parse(videoheader),
      //timeout: 60000,
      body: `{"actId":"252","liveId":"${liveids}"}`
    }

    $.post(watch_livevideourl,(error, response, data) => {

      try {
        let result = JSON.parse(data)
        if(logs==1) $.log(data)
        message += '📣看直播\n'

        if(result.resultCode == 1) {
          message += '获得'+result.data.goldCoinAmt+'\n'
        } else {
          message +='⚠️异常'+result.errorDesc+'\n'
          live = 0;
        }
      } catch(e) {
        $.logErr(e, response)
      } finally {
        resolve()
      }
    })
  })

}

// 通知
async function SendMsg() {
  if(notice) {
    $.log(message)

    // 发送通知时间
    if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
      // git ac 云函数等
      if ($.isNode()) await notify.sendNotify($.name,message)

      // 本机圈x等
      if (!$.isNode()) $.msg(jsname,'',message)
    }

  }
}

// 格式化时间
function genTimeFormat() {
  myTimeStamp = $.isNode() ? (new Date().getTime() + 8 * 60 * 60 * 1000) : new Date().getTime()

  myDate = $.isNode() ? new Date(myTimeStamp) : new Date()
  hour = myDate.getHours()
  minute = myDate.getMinutes()
  year = date.getFullYear()
  month = date.getMonth() + 1
  strDate = date.getDate();

  if (month >= 1 && month <= 9) {
    month = '0' + month
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  
  currentdate = year + sep + month + sep + strDate
}


// 圈x等获取CK
function GetCookie() {
  if($request&&$request.url.indexOf("give_gold_coin_by_video")>=0) {
    const videoheader = JSON.stringify($request.headers)
     if(videoheader)    $.setdata(videoheader,`videoheader${$.idx}`)
     $.log(`[${jsname}] 获取video请求: 成功,videoheader: ${videoheader}`)
     $.msg(`videoheader${$.idx}: 成功🎉`, ``)
 }
 if($request&&$request.body.match(/"type":1/ig).length >=3) {
    const videobody = $request.body
     if(videobody)  $.setdata(videobody,`videobody${$.idx}`)
     $.log(`[${jsname}] 获取video请求: 成功,videobody: ${videobody}`)
     $.msg(`videobody${$.idx}: 成功🎉`, ``)
  }
 if($request&&$request.body.indexOf('"type":2')>=0) {
    const goldbody = $request.body
     if(goldbody)  $.setdata(goldbody,`goldbody${$.idx}`)
     $.log(`[${jsname}] 获取goldvideo请求: 成功,goldbody: ${goldbody}`)
     $.msg(`goldbody${$.idx}: 成功🎉`, ``)
  }
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
