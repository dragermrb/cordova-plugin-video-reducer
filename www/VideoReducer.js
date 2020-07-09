//
//  VideoReducer.js
//
//  Created by Josh Bavari on 01-14-2014
//  Modified by Ross Martin on 01-29-15
//

var exec = require('cordova/exec');
var pluginName = 'VideoReducer';

function VideoReducer() {}

VideoReducer.prototype.transcodeVideo = function(success, error, options) {
  var self = this;
  var win = function(result) {
    if (typeof result.progress !== 'undefined') {
      if (typeof options.progress === 'function') {
        options.progress(result.progress);
      }
    } else {
      success(result);
    }
  };
  exec(win, error, pluginName, 'transcodeVideo', [options]);
};

VideoReducer.prototype.createThumbnail = function(success, error, options) {
  exec(success, error, pluginName, 'createThumbnail', [options]);
};

VideoReducer.prototype.getVideoInfo = function(success, error, options) {
  exec(success, error, pluginName, 'getVideoInfo', [options]);
};

module.exports = new VideoReducer();
