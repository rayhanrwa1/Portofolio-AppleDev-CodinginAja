"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.database = exports.auth = exports.storage = exports.app = void 0;

var _app = require("firebase/app");

var _storage = require("firebase/storage");

var _auth = require("firebase/auth");

var _database = require("firebase/database");

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
var app = (0, _app.initializeApp)(firebaseConfig);
exports.app = app;
var storage = (0, _storage.getStorage)(app);
exports.storage = storage;
var auth = (0, _auth.getAuth)(app);
exports.auth = auth;
var database = (0, _database.getDatabase)(app);
exports.database = database;