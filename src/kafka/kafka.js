const kafkaHost = process.env.KAFKA_HOST;
const kafkaPort = process.env.KAFKA_PORT;
const kafkaTopic = process.env.KAFKA_TOPIC;
const kafka = require('kafka-node');

exports.sendEvent = function (id, kmat, mvm1, mvm2, hmotnost, mnozstvi,resp,cb) {
    var mDate = new Date();
    var mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
    var msg = {};
    msg.id = id;
    msg.kmat = kmat;
    msg.mvm1 = mvm1;
    msg.mvm2 = mvm2;
    msg.hmotnost = hmotnost;
    msg.mnozstvi = mnozstvi;
    msg.timestamp = new Date().toISOString();
    let payload = [{
        topic : kafkaTopic,
        messages : JSON.stringify(msg)
    }];
    console.log('Going to use producer ..');
    try {
        // Kafka Producer Configuration 
        console.log('Trying to connect to Kafka server: ' + kafkaHost + ':' + kafkaPort + ', topic: ' + kafkaTopic);
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient({kafkaHost: kafkaHost + ':'+ kafkaPort});
        const producer = new Producer(client);
    
        producer.on('ready', async function() {
            console.log(mDateStr + ': Kafka Producer is Ready to communicate with Kafka on: ' + kafkaHost + ':' + kafkaPort);
            let push_status = producer.send(payload, function (err, data) {
                if (err) {
                    console.log('Broker update failed: ' + err);
                    cb(err);
                } else {
                    console.log('Broker update success.');
                    cb(null,resp);
                }
            });
        })
    
        producer.on('error', function(err) {
            console.log(err);
            console.log(mDateStr + ': [kafka-producer -> '+kafkaTopic+']: connection errored');
            throw err;
        })
    } catch(e) {
        console.log(mDateStr + ': ' + e);
    }

}

exports.sendEventP = function (id, kmat, mvm1, mvm2, hmotnost, mnozstvi) {
    return new Promise(function(resolve, reject) {
        var mDate = new Date();
        var mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
        var msg = {};
        msg.id = id;
        msg.kmat = kmat;
        msg.mvm1 = mvm1;
        msg.mvm2 = mvm2;
        msg.hmotnost = hmotnost;
        msg.mnozstvi = mnozstvi;
        msg.timestamp = new Date().toISOString();
        let payload = [{
            topic : kafkaTopic,
            messages : JSON.stringify(msg)
        }];
        console.log(mDateStr + ': Going to use producer ..');
        try {
            // Kafka Producer Configuration 
            mDate = new Date();
            mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
            console.log(mDateStr + ': Trying to connect to Kafka server: ' + kafkaHost + ':' + kafkaPort + ', topic: ' + kafkaTopic);
            const Producer = kafka.Producer;
            const client = new kafka.KafkaClient({kafkaHost: kafkaHost + ':'+ kafkaPort});
            const producer = new Producer(client);
        
            producer.on('ready', async function() {
                mDate = new Date();
                mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
                console.log(mDateStr + ': Kafka Producer is Ready to communicate with Kafka on: ' + kafkaHost + ':' + kafkaPort);
                let push_status = producer.send(payload, function (err, data) {
                    mDate = new Date();
                    mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
                    if (err) {
                        console.log(mDateStr + ': Broker update failed: ' + err);
                        reject(err);
                    } else {
                        console.log(mDateStr + ': Broker update success.');
                        resolve(data);
                    }
                });
            })
        
            producer.on('error', function(err) {
                mDate = new Date();
                mDateStr = mDate.toString('dddd MMM yyyy h:mm:ss');
                console.log(err);
                console.log(mDateStr + ': [kafka-producer -> '+kafkaTopic+']: connection errored');
                reject(err);
            })
        } catch(e) {
            console.log(mDateStr + ': ' + e);
            reject(err);
        }






    });    
}
