var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require('body-parser');
var SSH = require('ssh2').Client;
var config = require('./config.json');

var session = require('express-session')({
  secret: config.session.secret,
	name: config.session.name,
	resave: true,
	saveUninitialized: false,
	unset: 'destroy'
});

// configuration of express
var expressOptions = {

};

// use cache to store some infomation
// var info = {
// 	host: ''
// }

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public'), expressOptions));

// app.post('/ssh/login', function(req, res, next) {
// 	console.log();
// 	res.send({
// 		ok: true
// 	});
// });

// configuration of socket.io 
// io.use(function (socket, next) {
//   (socket.request.res) ? 
// 		session(socket.request, socket.request.res, next) : next();
// });

io.on('connection', function (socket) {
	console.log("可以吗")
	var connection = new SSH();

	// ready for connect
	connection.on('ready', function () {
		console.log('SSH登陆shell');

		connection.shell({
			term: 'xterm-color'
		}, function (err, stream) {
			if(err) {
				connection.end();
				return;
			}
			// attention!
			// never forget the \n

			// client to shell
			// client write on shell
			socket.on('data', function (data) {
				console.log("这里的socket.io可以到达吧")
				console.log(data)
				stream.write(data);
			});

			// 1. 初始化按钮
			socket.on('init', function () {
				console.log('init');
				// stream.write('tmux new -s main\n');

				// transceiver
				// stream.write('cd /OpenBTS\n');
				// stream.write('./transceiver\n');
				stream.write('cd myDir\n');
				stream.write('nohup ping www.baidu.com &\n');

				// // openbts
				// stream.write('cd /OpenBTS');
				// stream.write('./OpenBTS');

				// // smqueue
				// stream.write('\x42');
				// stream.write(':new -s smqueue');
				// stream.write('cd /OpenBTS');
				// stream.write('./smqueue');
				stream.write('nohup ping www.zhihu.com &\n');

				// // sipauthserve
				// stream.write('\x42');
				// stream.write(':new -s sipauthserve');
				// stream.write('cd /OpenBTS');
				// stream.write('./sipauthserve');

				// // asterisk-vvvc
				// stream.write('\x42');
				// stream.write(':new -s asterisk-vvvc');
				// stream.write('asterisk –vvvc');

				// // asterisk-r
				// stream.write('\x42');
				// stream.write(':new -s asterisk-r');
				// stream.write('asterisk –r');

				// // OpenBTS
				// stream.write('\x42');
				// stream.write(':new -s cli');
				// stream.write('cd /OpenBTS');
				// stream.write('./OpenBTSCLI');
				stream.write('jobs\n');
			});

			// 2. Openbts参数配置
			socket.on('setting', function (data) {
				var arr = data.split('-');

				stream.write('python\n');
				stream.write('1+1\n');
				stream.write('1+2\n');
				stream.write('quit()\n');

				// stream.write('config Control.LUR.OpenRegistration .*')
				// stream.write('devconfig GSM.Radio.RxGain ' + arr[0] + '\n')
				// stream.write('config GSM.Radio.Band ' + arr[1] + '\n')
				// stream.write('config Control.LUR.NormalRegistration.Message ' + arr[2] + '\n')
				// stream.write('config GSM.Identity.ShortName ' + arr[3] + '\n')
				// stream.write('config Identity config GSM.Identity.MCC 001')
				// stream.write('config GSM.Identity.MCC 460')
				// stream.write('config GSM.Identity.MNC 01')
				// stream.write('config GSM.Radio.C0 168')
				// stream.write('config GSM.Identity.BSIC.BCC 3')
				// stream.write('config GSM.Identity.LAC 1001')
				// stream.write('config GSM.Identity.CI 11')
				// stream.write('config GPRS.Enable 1')
				stream.write('quit()\n');
			});

			// 3. 添加新用户 
			socket.on('add-new-user', function (data) {
				var arr = data.split('-');
				console.log(arr);
				stream.write('python work.py "' + arr[0] + '" ' + arr[1] + ' ' + arr[2] + '\n');
				// stream.write('\x42');
				// stream.write(':a -s newuser');
				// stream.write('cd /home/yutou/sdr/dev/openbts/NodeManager');
				// stream.write('./nmcli.py sipauthserve subscribers create );
			});

			// 4. 查看用户信息
			socket.on('watch-users', function () {
				// stream.write('\x42');
				// stream.write(':new -s showmsg');
				// stream.write('cd /home/yutou/sdr/dev/openbts/NodeManager');
				// stream.write('./nmcli.py sipauthserve subscribers read');
			});

			// 5. 在控制台查看已经加入的设备
			socket.on('watch-devices', function () {
				stream.write('\x03');
				stream.write('quit()\n');
				stream.write('python\n');
				stream.write('1+1\n');
				stream.write('1+2\n');
				// stream.write('\x42');
				// stream.write(':a -t cli');
				// stream.write('tmsis');
			});

			// 6. 发送短信
			socket.on('send-msg', function (data) {
				var arr = data.split('-');
				console.log(data);
				stream.write('\x42');
				stream.write(':a -t openbts\n');
				stream.write('1+1\n')
				// stream.write('\x42');
				// stream.write(':a -t cli');
				// stream.write('sendsms ' + arr[0] + ' 888888 ' + arr[1] + '"' + arr[2] + '"');
			});

			// 7. 停止
			socket.on('stop', function () {
				console.log('stop');
				stream.write('kill $(jobs -p)\n');
				// stream.write('\x03');
				// stream.write('quit()\n');
				// stream.write('\x42');
				// stream.write(':a -t main\n');
				// stream.write('\x42');
				// stream.write(':kill-session -a\n');
				// stream.write('\x42');
				// stream.write(':kill-session\n');
			});

			// 8. 扫频
			socket.on('sweep-freq', function () {
				// stream.write('\x42');
				// stream.write(':a -t showmsg');
				// stream.write('sh /root/R7-OCM/scripts/curlinit.sh 192.168.1.11');
				// stream.write('sh /root/R7-OCM/scripts/scan.sh 192.168.1.11');
			});

			// 9. 查看进程，方便清除
			socket.on('watch-process', function() {
				stream.write('ps -u ' + config.ssh.username + '\n');
			});

			// 10. 清除垃圾
			socket.on('kill-process', function(pid) {
				var pids = pid.split('-');
				for(var i = 0; i < pids.length; i++) {
					stream.write('kill ' + pids[i] + '\n');
				}
				stream.write('ps -u ' + config.ssh.username + '\n');
			});

			socket.on('disconnecting', function (reason) {
				console.log(reason)
			});

			socket.on('disconnect', function (reason) {
				connection.end();
			});

			socket.on('error', function (err) {
				console.log(err)
			});

			// shell to client
			// shell send output to client
			stream.on('data', function (data) {
				// console.log(data.toString('utf-8'));
				socket.emit('data', data.toString('utf-8'));
			});

			stream.on('close', function () {
				// stream.write('kill $(jobs -p)\n');
				connection.end();
			});

			stream.stderr.on('data', function(err) {
				console.log('STDERR: ', err);
			});

		});
	});

	// connect by ssh
	connection.connect({
		host: config.ssh.host,
		port: config.ssh.port,
		username: config.ssh.username,
		password: config.ssh.password
	});

});



// configuration of server

server.listen(config.listen.port, function () {
	console.log("cb here?")
});

server.on('error', function (err) {
	// 异常处理
	if (err.code === 'EADDRINUSE') {
    config.listen.port++;
    console.warn('端口被占用，现在在新端口开始： ' + config.listen.port);
    setTimeout(function () {
      server.listen(config.listen.port)
    }, 250);
  } else {
    console.log('服务器监听发生异常 ' + err);
  }
});