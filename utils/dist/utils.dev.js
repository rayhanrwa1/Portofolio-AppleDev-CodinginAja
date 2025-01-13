"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animationCreate = void 0;

var animationCreate = function animationCreate() {
    if (typeof window !== "undefined") {
        try {
            // Properly require wowjs
            const WOW = require("wowjs").WOW;
            console.log("WOW after require:", WOW); // Log to check the value of WOW

            // Initialize WOW.js
            new WOW({
                live: false,
            }).init();
        } catch (error) {
            console.error("Error while requiring or initializing wowjs:", error);
        }
    } else {
        console.error("window is undefined.");
    }
};

exports.animationCreate = animationCreate;