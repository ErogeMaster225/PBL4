/************PROCESS DATA TO/FROM Client****************************/
var socket = io(); //load socket.io-client and connect to the host that serves the page
window.addEventListener("load", function () {
	//when page loads
	if (isMobile.any()) {
		let toggles = document.getElementsByClassName("Toggle");
		for (let toggle of toggles) {
			toggle.addEventListener("touchstart", toggleDevice);
		}
	} else {
		let toggles = document.getElementsByClassName("Toggle");
		for (let toggle of toggles) {
			toggle.addEventListener("click", toggleDevice);
		}
	}
});
function toggleDevice(event) {
	let toggle = event.target;
	while (toggle.className != "Toggle") {
		toggle = toggle.parentElement;
	}
	let checkbox = toggle.previousElementSibling;
	//checkbox.checked = !checkbox.checked;
	let state = toggle.lastElementChild.lastElementChild;
	//state.innerText = toggle.previousElementSibling.checked ? "On" : "Off";
	socket.emit("onoff", checkbox.name, checkbox.id, state.innerText == "Off" ? "ON" : "OFF");
}
socket.on("init", function (data) {
	let devices = data.slice(0, -1).split(";");
	console.log(devices);
	devices.forEach((device) => {
		if (device.endsWith("ON")) {
			let checkbox = document.getElementById(device.slice(0, -3));
			checkbox.checked = true;
			checkbox.nextElementSibling.lastElementChild.lastElementChild.innerText = "On";
		} else if (device.endsWith("OFF")) {
			let checkbox = document.getElementById(device.slice(0, -4));
			checkbox.checked = false;
			checkbox.nextElementSibling.lastElementChild.lastElementChild.innerText = "Off";
		} else if (device.includes("TEMP")) {
			let temp = document.getElementById(device.slice(0, device.indexOf("=")));
			temp.innerText = device.slice(device.indexOf("=") + 1) + "°C";
		} else if (device.includes("HUMID")) {
			let humid = document.getElementById(device.slice(0, device.indexOf("=")));
			humid.innerText = device.slice(device.indexOf("=") + 1) + "%";
		}
	});
});

function ReportMouseDown(e) {
	var y = e.target.previousElementSibling;
	if (y !== null) var x = y.id;
	console.log(x);
	if (x !== null) {
		// Now we know that x is defined, we are good to go.
		if (x === "GPIO26") {
			//     console.log("GPIO26 toggle");
			socket.emit("GPIO26T"); // send GPIO button toggle to node.js server
		} else if (x === "GPIO20") {
			//     console.log("GPIO20 toggle");
			socket.emit("GPIO20T"); // send GPIO button toggle to node.js server
		} else if (x === "GPIO21") {
			//     console.log("GPIO21 toggle");
			socket.emit("GPIO21T"); // send GPIO button toggle to node.js server
		} else if (x === "GPIO16") {
			//     console.log("GPIO16 toggle");
			socket.emit("GPIO16T"); // send GPIO button toggle to node.js server
		}
	}

	if (e.target.id === "GPIO26M") {
		//   console.log("GPIO26 pressed");
		socket.emit("GPIO26", 1);
		document.getElementById("GPIO26").checked = 1;
	} else if (e.target.id === "GPIO20M") {
		//    console.log("GPIO20 pressed");
		socket.emit("GPIO20", 1);
		document.getElementById("GPIO20").checked = 1;
	} else if (e.target.id === "GPIO21M") {
		//    console.log("GPIO21 pressed");
		socket.emit("GPIO21", 1);
		document.getElementById("GPIO21").checked = 1;
	} else if (e.target.id === "GPIO16M") {
		//    console.log("GPIO16 pressed");
		socket.emit("GPIO16", 1);
	}
}
var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function () {
		return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
	},
};
