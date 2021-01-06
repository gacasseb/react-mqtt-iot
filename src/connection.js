export default class Connection {

    connect() {

        var mqtt = require('mqtt');
        var client  = mqtt.connect(`ws://${this.host}:${this.port}`);

        client.on('connect', function() {
            this.client = client;
            // console.log(this.client);
        });
    }

    getClient() {
        return this.client;
    }

    setClient( client ) {
        this.client = client;
    }
}

