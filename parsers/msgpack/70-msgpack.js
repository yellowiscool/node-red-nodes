
module.exports = function(RED) {
    "use strict";
    var msgpack = require('msgpack-lite');

    function MsgPackNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (Buffer.isBuffer(msg.payload)) {
                    var l = msg.payload.length;
                    try {
                        msg.payload = msgpack.decode(msg.payload);
                        node.send(msg);
                    }
                    catch (e) {
                        node.error("Bad decode",msg);
                        node.status({text:"not a msgpack buffer"});
                    }
                }
                else {
                    msg.payload = msgpack.encode(msg.payload);
                    node.send(msg);
                }
            }
            else { node.warn("No payload found to process"); }
        });
    }
    RED.nodes.registerType("msgpack",MsgPackNode);
}
