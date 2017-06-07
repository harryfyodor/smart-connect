// jquery socket.io

var socket = io.connect();

socket.on('connect', function () {
	// 
	socket.on('status', function (status) {
		$('#status').text(status)
	}).on('data', function (data) {
		$('#log-msg').val($('#log-msg').val() + data); 
		var d = $('#log-msg')[0].scrollHeight;
		$('#log-msg').scrollTop(d);
		console.log(data);
	}).on('disconnect', function (err) {
		console.log(err);
	}).on('error', function (err) {
		console.log(err);
	});

});

// 
function addToTerm(msg) {
	socket.emit("data", msg);
}

var working = false,
		waiting = 5000;

function enough() {
	working = true;
	return setTimeout(function() {
		working = false;
	}, waiting);
}

// 1. 初始化按钮
$('#init').on('click', function (evt) {
	if(working) return;
	enough();
	console.log('init');
	socket.emit('init', 'ok');
	setTimeout( function() {
		setAbled('#setting');
		setDisabled('#init');
	}, waiting);
});

// 2. Openbts参数配置
$('#setting').on('click', function (evt) {
	if(working) return;
	enough();

	var power = $('#setting-power').val(),
			freq = $('#setting-freqency-range').val(),
			wel = $('#setting-welcome').val(),
			name = $('#setting-name').val();

	if(!power || !freq || !wel || !name) {
		alert("不能留空");
		return;
	}

	var str = power + '-' + freq + '-' + wel + '-' + name;
	console.log(str);
	socket.emit('setting', str);
	setTimeout(function() {
		setDisabled('#setting');
		setAbled('#add-new-user');
		setAbled('#stop');
	}, waiting);
});

// 3. 添加新用户
$('#add-new-user').on('click', function (evt) {
	if(working) return;
	enough();

	var phone = $('#add-phone').val(),
			code1 = $('#add-code-1').val(),
			code2 = $('#add-code-2').val();	

	if(!phone || !code1 || !code2) {
		alert('不能为空');
		return;
	}

	var str = phone + '-' + code1 + '-' + code2;
	socket.emit('add-new-user', str);
	setTimeout(function() {
		setAbled('#watch-users');
		setAbled('#watch-devices');
		setAbled('#send-msg');
	}, waiting);
});

// 4. 查看用户信息
$('#watch-users').on('click', function (evt) {
	if(working) return;
	enough();

	console.log('watch-users');
	// socket.emit('watch-users', 'ok');
});

// 5. 在控制台查看已经加入的设备
$('#watch-devices').on('click', function (evt) {
	if(working) return;
	enough();
	console.log('watch-devices');
	socket.emit('watch-devices', 'ok');
});

// 6. 发送短信
$('#send-msg').on('click', function (evt) {
	if(working) return;
	enough();
	
	var code1 = $('#msg-code-1').val(),
			code2 = $('#msg-code-2').val(),
			content = $('#msg-content').val();	

	if(!content || !code1 || !code2) {
		alert('不能为空');
		return;
	}

	var str = code1 + '-' + code2 + '-' + content;
	console.log(str);
	// socket.emit('send-msg', 'ok');
});

// 7. 停止
$('#stop').on('click', function (evt) {
	if(working) return;
	enough();
	console.log('stop')
	socket.emit('stop', 'ok');
	setTimeout(function() {
		setDisabled('#setting');
		setDisabled('#add-new-user');
		setDisabled('#watch-users');
		setDisabled('#watch-devices');
		setDisabled('#send-msg');
	}, waiting);
});

// 8. 扫频
$('#sweep-freq').on('click', function () {
	if(working) return;
	enough();
	console.log('sweep-freq');
});

// 9. 查看进程，方便清除
$('#watch-process').on('click', function () {
	if(working) return;
	enough();
	socket.emit('watch-process', 'ok');
});

// 10. 清除垃圾
$('#kill-process').on('click', function () {
	if(working) return;
	enough();
	var pid = $('#kill-pid').val();
	if(!pid) return;
	socket.emit('kill-process', pid);
});

function setDisabled(s) {
	$(s).attr('disabled', true);
	$(s).addClass('disabled');
}

function setAbled(s) {
	$(s).attr('disabled', false);
	$(s).removeClass('disabled');
}

