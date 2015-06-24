'use strict'

function TestCase(name, weight, options) {
  this.name = name;
  this.weight = weight;
  if (options) {
    this.target = options.target || null;  
    this.CSS = options.CSS || {};
    this.init = options.init || null;
    this.callback = options.callback || null;
    this.otherData = options.other || {};
  }
};

function ABTest(name, identifier, testcases, options) {
  if (arguments.length !== 3 && arguments.length !== 4) {
    throw "Incorrect number of arguments.";
  }
  this.testName = name;
  this.identifier = identifier;
  this.testcases = testcases;
  this.formData = new FormData();
  this.formData.name = name;
  if (options) {
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        this[prop] = options[prop];
      }
    }
  }
  
  this.initTest = function() {
    var weights = this.testcases.map(function(x) {return x.weight});
    var sum = weights.reduce(function(x,y) {return x + y});
    var groupVal = this.identifier % sum;
    var total = 0;
    var group = 0;
    for (var i = 0; i < weights.length; i++) {
      total += weights[i];
      if (groupVal <= total) {
        group = i;
        break;
      }
    }
    var testcase = this.testcases[group];
    this.groupName = testcase.name;
    if (testcase.target !== null) {
      for (var prop in testcase.CSS) {
        testcase.target.style[prop] = testcase.CSS[prop];
      }
    }
    if (testcase.init !== null) {
      testcase.init();
    }
    this.callback = testcase.callback;
  }

  this.sendTestData = function(otherData) {
    if (this.callback) {
      this.callback()
    }
    this.formData.identifier = this.identifier;
    this.formData.group = this.groupName;
    if (this.timestamp) {
      this.formData.timestamp = (new Date()).toUTCString();
    }
    if (this.viewport) {
      this.formData.viewport = {width: window.innerWidth, height: window.innerHeight}
    }
    if (this.userAgent) {
      this.formData.userAgent = navigator.userAgent;
    }
    if (this.URL) {
      this.formData.URL = window.location.href
    }
    if (otherData) {
      for (var prop in otherData) {
        this.formData[prop] = otherData[prop];
      }
    }
    if (this.endpoint) {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, JSON.stringify(this.formData));
      }
      else {
        var request = new XMLHttpRequest();
        request.open('POST', this.endpoint, true);
        request.send(this.formData);
      }
    }
    return this.formData;
  }
}
