"use strict";
exports.__esModule = true;
var src_1 = require("../src");
var client = new src_1.Client("Username", "Stream key");
client.start();
client.onOpen(function () {
    console.log("Connected");
});
client.onDonation(function (donation) {
    console.log(donation);
});
