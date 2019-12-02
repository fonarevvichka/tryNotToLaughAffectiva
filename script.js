var detector

window.onload = function () {
    // SDK Needs to create video and canvas nodes in the DOM in order to function
    // Here we are adding those nodes a predefined div.
    var divRoot = document.getElementById("affdex_elements")

    var width = 640;
    var height = 480;

    //Construct a CameraDetector and specify the image width / height and face detector mode.
    detector = new affdex.CameraDetector(divRoot, width, height, affdex.FaceDetectorMode.LARGE_FACES); 

    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions(); 
    detector.detectAllExpressions();  
    detector.detectAllEmojis();  
    detector.detectAllAppearance();  

    //Add a callback to notify when the detector is initialized and ready for runing.
    detector.addEventListener("onInitializeSuccess", function() {
        ////log("logs", "The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        document.getElementById("face_video_canvas").style.display = "block";
        document.getElementById("face_video").style.display = "none";
    });

      //Add a callback to notify when camera access is allowed
    detector.addEventListener("onWebcamConnectSuccess", function() {
        ////log("logs", "Webcam access allowed");
    });

    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", function() {
        ////log("logs", "webcam denied");
        console.log("Webcam access denied");
    });

    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) { 
    
        // document.getElementById("results").innerHTML = ""
        //log("results", "Timestamp: " + timestamp.toFixed(2)); 
        //log("results", "Number of faces found: " + faces.length); 
        if (faces.length > 0) {
            //log("results", "Appearance: " + JSON.stringify(faces[0].appearance)); 
            //log("results", "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) { 
                // return val.toFixed ? Number(val.toFixed(0)) : val;
            // }));
            //log("results", "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) { 
                // return val.toFixed ? Number(val.toFixed(0)) : val;
            // }));
            //log("results", "Emoji: " + faces[0].emojis.dominantEmoji); 
            drawFeaturePoints(image, faces[0].featurePoints);
            console.log("Joy: " + faces[0].emotions["joy"])
            // Primitive UI for happy
            // if (faces[0].emotions["joy"]>75) { 
            //     document.getElementById("myui").innerHTML = "Happy!!!" 
            // }
            // else { 
            //     document.getElementById("myui").innerHTML = "" 
            // }
        }
      });
      //Draw the detected facial feature points on the image
    function drawFeaturePoints(img, featurePoints) {
        var c = document.getElementById("face_video_canvas");
        if (c==null) return;
        var contxt = c.getContext('2d');

        var hRatio = contxt.canvas.width / img.width;
        var vRatio = contxt.canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);

        contxt.strokeStyle = "#FFFFFF";
        for (var id in featurePoints) {
          contxt.beginPath();
          contxt.arc(featurePoints[id].x,
            featurePoints[id].y, 2, 0, 2 * Math.PI);
          contxt.stroke();

        }
    }
}

//function executes when Start button is pushed.
function onStart() {
    if (detector && !detector.isRunning) {
        // document.getElementById("results").innerHTML = ""
        // document.getElementById("logs").innerHTML = ""
        detector.start();
    }
	//log("logs", "Clicked the start button");
}

//function executes when the Stop button is pushed.
// function onStop() {
// 	//log("logs", "Clicked the stop button");
// 	if (detector && detector.isRunning) {
// 		detector.removeEventListener();
// 		detector.stop();
// 	}
// };

//function executes when the Reset button is pushed.
function onReset() {
	// ////log("logs", "Clicked the reset button");
	if (detector && detector.isRunning) {
		detector.reset();
		// document.getElementById("results").innerHTML = ""
	}
};

// function log (node_name, msg) {
// 	document.getElementById(node_name).innerHTML += "<span>" + msg + "</span><br/>"
// }