// identify if user is registered in our DB
function log(event) {
	event.preventDefault();
	const date = new Date();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	const str_time = hour + ":" + minute + ":" + second;
	let userIP = "{{ user_ip }}";
	let id = parseInt(document.forms["id_form"]["id"].value);
	if (id === 2) {
		console.log("User logged at " + str_time + " user ip is: " + userIP);
		// document.getElementsByClassName("login")[0].style.visibility = "hidden";
		// document.getElementsByClassName("container-fluid")[0].style.display = "block";
		// return false;
	 	window.location.href = '/main';
	}
	else {
		console.log("User tried to log at " + str_time + " but failed, ID entered was: " + id + " user ip is: " + userIP);
		alert("תעודת זהות לא קיימת במערכת, אנא נסה שנית.");
		document.getElementById("input1").value = '';
		// return false;
	}
};

// document.getElementsByName('id_form').addEventListener('submit',function(event){
// let id = document.getElementById("input1").value;
// const date = new Date();
// const hour = date.getHours();
// const minute = date.getMinutes();
// const second = date.getSeconds();
// const str_time = hour + ":" + minute + ":" + second;
// let userIP = "{{ user_ip }}";
// fetch('/main', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({ msg: rawText })
// 	}).then(response => response.json()
// 	).then(function (data) {
// 		let response = data.response;
// 		console.log("User tried to log at " + str_time + " but failed, ID entered was: " + id + " user ip is: " + userIP);
// 		alert("Incorrect ID. Please try again");
// 	});

// update chat box
document.getElementById('messageArea').addEventListener('submit', function (event) {
	const date = new Date();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const str_time = hour + ":" + minute;

	let rawText = document.getElementById("text").value;

	let userHtml = '<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">' + rawText + '<span class="msg_time_send">' + str_time + '</span></div><div class="img_cont_msg"><img src="static/img/user.png" class="rounded-circle user_img_msg"></div></div>';

	document.getElementById("text").value = "";
	document.getElementById("messageFormeight").insertAdjacentHTML('beforeend', userHtml);

	fetch('/get', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ msg: rawText })
	}).then(response => response.json()
	).then(function (data) {
		let msg = data.response;
		let botHtml = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="static/img/open-ai.png" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + msg + '<span class="msg_time">' + str_time + '</span></div></div>';

		document.getElementById("messageFormeight").insertAdjacentHTML('beforeend', botHtml);


		let chatBox = document.getElementById('messageFormeight');
		chatBox.scrollTop = chatBox.scrollHeight; // auto scroll to the bottom
		if (data === "Chat saved!") {
			let inputBox = document.getElementById('text');
			inputBox.disabled = true;
			inputBox.placeholder = "Chat ended.";
			document.getElementById("send1").disabled = true;
			document.getElementById("send1").type = "button";

			document.getElementById("save1").disabled = true;
			document.getElementById("save1").type = "button";
		}
	});
	event.preventDefault();
});


// save chat
document.getElementById("save1").addEventListener("click", function () {
	const date = new Date();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const str_time = hour + ":" + minute;
	let rawText = "Save chat.";

	let userHtml = '<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">' + "שמור שיחה." + '<span class="msg_time_send">' + str_time + '</span></div><div class="img_cont_msg"><img src="static/img/user.png" class="rounded-circle user_img_msg"></div></div>';

	document.getElementById("text").value = "";
	document.getElementById("messageFormeight").insertAdjacentHTML('beforeend', userHtml);


	fetch('/get', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ msg: rawText })
	}).then(response => response.json()
	).then(function (data) {
		let msg = data.response;
		let botHtml = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="static/img/open-ai.png" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + "השיחה נשמרה!" + '<span class="msg_time">' + str_time + '</span></div></div>';
		document.getElementById("messageFormeight").insertAdjacentHTML('beforeend', botHtml);


		let chatBox = document.getElementById('messageFormeight');
		chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
		if (data.response === "Chat saved!") {
			let inputBox = document.getElementById('text');
			inputBox.disabled = true;
			inputBox.placeholder = "השיחה הסתיימה.";
			document.getElementById("send1").disabled = true;
			document.getElementById("send1").type = "button";

			document.getElementById("save1").disabled = true;
			document.getElementById("save1").type = "button";
		}
	});
	event.preventDefault();
});