//On document load for efficiency 
$(document).ready(function() {
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyDWq53ui86CtT618CYkmQIN9TjuFyPIn5E",
    authDomain: "multiplayer-rps-3e2fc.firebaseapp.com",
    databaseURL: "https://multiplayer-rps-3e2fc.firebaseio.com",
    projectId: "multiplayer-rps-3e2fc",
    storageBucket: "multiplayer-rps-3e2fc.appspot.com",
    messagingSenderId: "327833438473"
  };
    firebase.initializeApp(config);
  
    //Declare global variables
    var database = firebase.database();
    var train;
    var destination;
    var frequency;
    var nextArrival;
    var firstTrain;
    var MinutesAway;
  
    //On click/submit
    $(document).on("click", "#submitbtn", function(event){
        //Prevent default so page doesn't reload
        event.preventDefault();
        
        //Set variables to the trimemd values within the form
        train = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#firstTrain").val().trim();
        frequency = $("#frequency").val().trim();
  
      //Converts to time with moment.js
      firstTrain = moment(moment(firstTrain,"hh:mm A").subtract(1, "years"),"hh:mm").format("hh:mm A");
        
        //Push data into firebase
        database.ref().push({
            train:train,
            destination:destination,
            firstTrain:firstTrain,
            frequency: frequency,
            dataAdded: firebase.database.ServerValue.TIMESTAMP
        });
        
        //Empty current train schedual div
      $("#displayTable").empty();
  
        //On child_added...
      database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        
        //Set corresponding variables to the values retrieved from firebase snapshot
        var train = childSnapshot.val().train;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        var frequency = childSnapshot.val().frequency;
  
      //Declare local time variables for time tracking
      var timeDifference = moment().diff(moment(firstTrain,"hh:mm A"),'m');
      //Time remaining before next train
      var timeRemaining = timeDifference % frequency;
      var timeMinsAway = frequency - timeRemaining;  
      //Calculate next arrival
      var MinutesAway = moment().add(timeMinsAway,'m');
      //Set variable
      var nextArrival = moment(MinutesAway).format("hh:mm A");
      //Minutes until the next train
      var MinutesAway = moment(MinutesAway).format('m');

            //Append train times to displayTable div 
            $("#displayTable").append('<tr>'
                + '<td>' + childSnapshot.val().train +'</td>'
                + '<td>' + childSnapshot.val().destination +'</td>'
                + '<td>' + childSnapshot.val().frequency +'</td>'
                + '<td>' + nextArrival +'</td>'
                + '<td>' + MinutesAway +'</td>'                                    
                +'</tr>'
          );
        })
    });
  });