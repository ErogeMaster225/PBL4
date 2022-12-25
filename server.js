let http = require("http").createServer(handler);
let fs = require("fs"); //require filesystem module
let url = require("url");
let path = require("path");
let io = require("socket.io", "net")(http);
let serial = require("serialport");
/****** CONSTANTS******************************************************/
const WebPort = 80;
/*************** Web Browser Communication ****************************/

// Start http webserver
http.listen(WebPort, function () {
	// This gets call when the web server is first started.
	console.log("Server running on Port " + WebPort);
});

// function handler is called whenever a client makes an http request to the server
// such as requesting a web page.
function handler(req, res) {
	var q = url.parse(req.url, true);
	var filename = "." + q.pathname;
	//console.log("filename=" + filename);
	var extname = path.extname(filename);
	if (filename == "./") {
		console.log("retrieving default index.html file");
		filename = "./index.html";
	}

	// Initial content type
	var contentType = "text/html";

	// Check ext and set content type
	switch (extname) {
		case ".js":
			contentType = "text/javascript";
			break;
		case ".css":
			contentType = "text/css";
			break;
		case ".json":
			contentType = "application/json";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".jpg":
			contentType = "image/jpg";
			break;
		case ".ico":
			contentType = "image/png";
			break;
	}

	fs.readFile(__dirname + "/public/" + filename, function (err, content) {
		if (err) {
			console.log("File not found. Filename=" + filename);
			fs.readFile(__dirname + "/public/404.html", function (err, content) {
				res.writeHead(200, { "Content-Type": "text/html" });
				return res.end(content, "utf8"); //display 404 on error
			});
		} else {
			// Success
			res.writeHead(200, { "Content-Type": contentType });
			return res.end(content, "utf8");
		}
	});
}

// Execute this when web server is terminated
process.on("SIGINT", function () {
	//on ctrl+c
	process.exit(); //exit completely
});

/****** io.socket is the websocket connection to the client's browser********/

io.sockets.on("connection", function (socket) {
	// WebSocket Connection
	console.log("A new client has connectioned. Send LED status");
	socket.on("onoff", function print(id, state) {
		console.log(id, "is", state);
	});
	//Whenever someone disconnects this piece of code executed
	socket.on("disconnect", function () {
		console.log("A user disconnected");
	});
});
