

This is a cordova plugin to reduce video size.

* Transcoding
* Creating thumbnails from a video file (now at a specific time in the video)
* Getting info on a video - width, height, orientation, duration, size, & bitrate.

Based on awesome work of [cordova-plugin-video-editor] (https://github.com/jbavari/cordova-plugin-video-editor) and  [Transcoder](https://github.com/natario1/Transcoder)


## Installation
```
cordova plugin add https://github.com/dragermrb/cordova-plugin-video-reducer.git
```
`VideoReducer` and `VideoReducerOptions` will be available in the window after deviceready.

## Usage

### Transcode a video

```javascript
// parameters passed to transcodeVideo
VideoReducer.transcodeVideo(
    success, // success cb
    error, // error cb
    {
        fileUri: 'file-uri-here', // the path to the video on the device
        outputFileName: 'output-name', // the file name for the transcoded video
        saveToLibrary: true, // optional, defaults to true
        deleteInputFile: false, // optional (android only), defaults to false
        progress: function(info) {} // info will be a number from 0 to 100
    }
);
```
#### transcodeVideo example -
```javascript
// options used with transcodeVideo function
// VideoReducerOptions is global, no need to declare it
var VideoReducerOptions = {
    OptimizeForNetworkUse: {
        NO: 0,
        YES: 1
    },
    OutputFileType: {
        M4V: 0,
        MPEG4: 1,
        M4A: 2,
        QUICK_TIME: 3
    }
};
```
```javascript
// this example uses the cordova media capture plugin
navigator.device.capture.captureVideo(
    videoCaptureSuccess,
    videoCaptureError,
    {
        limit: 1,
        duration: 20
    }
);

function videoCaptureSuccess(mediaFiles) {
    // Wrap this below in a ~100 ms timeout on Android if
    // you just recorded the video using the capture plugin.
    // For some reason it is not available immediately in the file system.

    var file = mediaFiles[0];
    var videoFileName = 'video-name-here'; // I suggest a uuid

    VideoReducer.transcodeVideo(
        videoTranscodeSuccess,
        videoTranscodeError,
        {
            fileUri: file.fullPath,
            outputFileName: videoFileName,
            saveToLibrary: true,
            deleteInputFile: true,
            progress: function(info) {
                console.log('transcodeVideo progress callback, info: ' + info);
            }
        }
    );
}

function videoTranscodeSuccess(result) {
	// result is the path to the transcoded video on the device
    console.log('videoTranscodeSuccess, result: ' + result);
}

function videoTranscodeError(err) {
	console.log('videoTranscodeError, err: ' + err);
}
```

### Create a JPEG thumbnail from a video
```javascript
VideoReducer.createThumbnail(
    success, // success cb
    error, // error cb
    {
        fileUri: 'file-uri-here', // the path to the video on the device
        outputFileName: 'output-name', // the file name for the JPEG image
        atTime: 2, // optional, location in the video to create the thumbnail (in seconds)
        width: 320, // optional, width of the thumbnail
        height: 480, // optional, height of the thumbnail
        quality: 100 // optional, quality of the thumbnail (between 1 and 100)
    }
);
// atTime will default to 0 if not provided
// width and height will be the same as the video input if they are not provided
// quality will default to 100 if not provided
```

```javascript
// this example uses the cordova media capture plugin
navigator.device.capture.captureVideo(
    videoCaptureSuccess,
    videoCaptureError,
    {
        limit: 1,
        duration: 20
    }
);

function videoCaptureSuccess(mediaFiles) {
    // Wrap this below in a ~100 ms timeout on Android if
    // you just recorded the video using the capture plugin.
    // For some reason it is not available immediately in the file system.

    var file = mediaFiles[0];
    var videoFileName = 'video-name-here'; // I suggest a uuid

    VideoReducer.createThumbnail(
        createThumbnailSuccess,
        createThumbnailError,
        {
            fileUri: file.fullPath,
            outputFileName: videoFileName,
            atTime: 2,
            width: 320,
            height: 480,
            quality: 100
        }
    );
}

function createThumbnailSuccess(result) {
    // result is the path to the jpeg image on the device
    console.log('createThumbnailSuccess, result: ' + result);
}
```

#### A note on width and height used by createThumbnail
The aspect ratio of the thumbnail created will match that of the video input.  This means you may not get exactly the width and height dimensions you give to `createThumbnail` for the jpeg.  This for your convenience but let us know if it is a problem.  I am considering adding a `maintainAspectRatio` option to `createThumbnail` (and when this option is false you might have stretched, square thumbnails :laughing:).

### Get info on a video (width, height, orientation, duration, size, & bitrate)
```javascript
VideoReducer.getVideoInfo(
    success, // success cb
    error, // error cb
    {
        fileUri: 'file-uri-here', // the path to the video on the device
    }
);
```

```javascript
VideoReducer.getVideoInfo(
    getVideoInfoSuccess,
    getVideoInfoError,
    {
        fileUri: file.fullPath
    }
);

function getVideoInfoSuccess(info) {
    console.log('getVideoInfoSuccess, info: ' + JSON.stringify(info, null, 2));
    // info is a JSON object with the following properties -
    {
        width: 1920,
        height: 1080,
        orientation: 'landscape', // will be portrait or landscape
        duration: 3.541, // duration in seconds
        size: 6830126, // size of the video in bytes
        bitrate: 15429777 // bitrate of the video in bits per second
    }
}
```

## On iOS

[iOS Developer AVFoundation Documentation](https://developer.apple.com/library/ios/documentation/AudioVideo/Conceptual/AVFoundationPG/Articles/01_UsingAssets.html#//apple_ref/doc/uid/TP40010188-CH7-SW8)

[Video compression in AVFoundation](http://www.iphonedevsdk.com/forum/iphone-sdk-development/110246-video-compression-avassetwriter-in-avfoundation.html)

[AVFoundation slides - tips/tricks](https://speakerdeck.com/bobmccune/composing-and-editing-media-with-av-foundation)

[AVFoundation slides #2](http://www.slideshare.net/bobmccune/learning-avfoundation)

[Bob McCune's AVFoundation Editor - ios app example](https://github.com/tapharmonic/AVFoundationEditor)

[Saving videos after recording videos](http://stackoverflow.com/questions/20902234/save-video-to-library-after-capturing-video-using-phonegap-capturevideo)



## On Android

[Android Documentation](http://developer.android.com/guide/appendix/media-formats.html#recommendations)

[Android Media Stores](http://developer.android.com/reference/android/provider/MediaStore.html#EXTRA_VIDEO_QUALITY)

[How to Port ffmpeg (the Program) to Android–Ideas and Thoughts](http://www.roman10.net/how-to-port-ffmpeg-the-program-to-androidideas-and-thoughts/)

[How to Build Android Applications Based on FFmpeg by An Example](http://www.roman10.net/how-to-build-android-applications-based-on-ffmpeg-by-an-example/)



## License

Android: Apache 2.0

iOS: MIT
