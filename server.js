const net = require('net');
const fs = require('fs');
const path = require('path');



const checkContentType = (pathname) => {
  const type = path.parse(pathname);
  const contentType = {
    '.css': 'text/css',
    '.html': 'text/html',
  }
  return contentType[type.ext];
}

const httpHeader = (url, body) => {
  return [
    'HTTP/1.1 200 OK',
    'Content-Type: ' + checkContentType(url),
    'Content-Length: ' + body.length
  ].join('\r\n') + '\r\n\r\n'
}

const server = net.createServer((socket) => {

  socket.on('data', (data) => {
    const req = data.toString();
    const lines = req.split('\r\n');
    const [method, url, ver] = lines[0].split(" ");
  
    let pathname = url;

    if(url ==='/'){
      pathname = '/index.html';
    }

    fs.readFile(path.join(__dirname, '/public/', pathname), (err, filedata) => {
      if (err) {
        console.log(err);
        socket.write("HTTP/1.1 404");
        socket.write("Content-Type: text/html");
        socket.write("\r\n\r\n");
        socket.write("404 not found")
      } else {
        socket.write(httpHeader(url, filedata));
        socket.write(filedata.toString());
      }
      socket.end();
    });

  });

});

server.on('listening', () => {
  console.log('server start');
  console.log('onListening');
});

server.on('error', (err) => {
  throw err;
});

server.on('close', () => {
  console.log('client disconnected');
});

server.listen(4400, '127.0.0.1');




