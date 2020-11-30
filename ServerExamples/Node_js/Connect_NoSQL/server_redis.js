const redis = require('redis')
// 接続情報
const config = {
    host: '127.0.0.1',
    port: 6379
}
// 接続
const client = redis.createClient(config)
// データの登録
client.set('key', 'value')
// データの取得と表示
client.get('key', (err, reply) => {
    console.log(reply)
})
// データの削除
client.del('key')
// 削除されているか確認
client.get('key', (err, reply) => {
    console.log(reply)
})
// 切断
client.quit()