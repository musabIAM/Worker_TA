let db = require('./app').db
let chanel = require('./app').chenel

let user_collection = db.collection('A1EC19E0A2')
let history_collection

function consume () {
    console.log("connect")
    chanel.assertExchange('amq.topic', 'topic', {
        durable: true
    })
    chanel.assertQueue("pertanian", {exclusive: false}, function (err, res) {
        if (err) {
            console.log('Error ', err)
        } else {
            chanel.consume(res.queue, function (msg) {
                validator(msg.content.toString())
            },
            {
                noAck: true
            })
        }
    })
}
