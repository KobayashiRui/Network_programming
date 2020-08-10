var http = require('http');
var server = http.createServer();

server.on('request', function(req, res) {
    let msg;
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    // リクエストされた処理により表示内容を分けてみる
    switch (req.url) {
        case '/about':
            msg = 'welcome about page';
            break;
        case '/company':
            msg = 'welcome my company page';
            break;
        default:
            res.writeHead(404, {'Content-Type' : 'text/plain'});
            msg = 'page not found';
            break;
    }
    res.write(msg);
    res.end();
});

// サーバを待ち受け状態にする
// 第1引数: ポート番号
// 第2引数: IPアドレス
server.listen(3000)