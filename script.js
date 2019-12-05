var detector

window.onload = function () {
    // SDK Needs to create video and canvas nodes in the DOM in order to function
    // Here we are adding those nodes a predefined div.
    var divRoot = document.getElementById("affdex_elements")

    var width = 640
    var height = 480
    var startTime = 0
    //Construct a CameraDetector and specify the image width / height and face detector mode.
    detector = new affdex.CameraDetector(divRoot, width, height, affdex.FaceDetectorMode.LARGE_FACES); 

    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions(); 
    detector.detectAllExpressions();  
    detector.detectAllAppearance();  

    //Add a callback to notify when the detector is initialized and ready for runing.
    detector.addEventListener("onInitializeSuccess", function() {
        document.getElementById("face_video_canvas").style.display = "block"
        document.getElementById("face_video").style.display = "none"
    });


    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", function() {
        console.log("Webcam access denied")
    });

    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) { 
        if (faces.length > 0) {
            drawFeaturePoints(image, faces[0].featurePoints);
            var expressions = faces[0].expressions

            var smile = expressions["smile"]
            var mouthOpen = expressions["mouthOpen"]
            if (smile > 0.9 && mouthOpen > 0.9) {
                console.log("you lose")
                startTime = timestamp
            } else {
                document.getElementById("scoreBoard").innerHTML = (timestamp - startTime).toFixed(1)
            }
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
        detector.start();
    }
}

//function executes when the Reset button is pushed.
function onReset() {
	if (detector && detector.isRunning) {
		detector.reset();
	}
};