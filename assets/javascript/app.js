$(document).ready(function(){
  $("#mytable #checkall").click(function () {
          if ($("#mytable #checkall").is(':checked')) {
              $("#mytable input[type=checkbox]").each(function () {
                  $(this).prop("checked", true);
              });
  
          } else {
              $("#mytable input[type=checkbox]").each(function () {
                  $(this).prop("checked", false);
              });
          }
      });
  });
  
  
var recordCount = 0;

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBKDHHacq9E-qajNXbWAbLq3HqoVUjJLcg",
    authDomain: "train-scheduler-b55b5.firebaseapp.com",
    databaseURL: "https://train-scheduler-b55b5.firebaseio.com",
    projectId: "train-scheduler-b55b5",
    storageBucket: "train-scheduler-b55b5.appspot.com",
    messagingSenderId: "163248639395"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    recordCount = 0;

    database.ref().push({
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });
    
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

//On load this function is called for each document in firebase
//and it is called again after a record is added
database.ref().on("child_added", function (document) {
  recordCount += 1;

  console.log(document.key);
  console.log(document.val());

  var name = document.val().name;
  var destination = document.val().destination;
  var frequency = document.val().frequency;
  var firstTrain = document.val().firstTrain;
  var arrivalMinutes;
  var arrivalTime;

  var trainTime = moment(firstTrain, "hh:mm").subtract(1, "years");

  //number of minutes between first train and now
  var minuteDifference = moment().diff(moment(trainTime), "minutes");
  var remainder = minuteDifference % frequency;
  arrivalMinutes = frequency - remainder;

  var nextTrain = moment().add(arrivalMinutes, "minutes");
  arrivalTime = moment(nextTrain).format("hh:mm");

  var anchor = "<a href='delete' onclick=deleteDocument('" + document.key + "');>delete</a>";

  $("#train-table > tbody").append(
      $("<tr>").append(
          $("<td>").text(name),
          $("<td>").text(destination),
          $("<td>").text(frequency),
          $("<td>").text(arrivalTime),
          $("<td>").text(arrivalMinutes),
          $("<td>").html(anchor)
      )
  );

  console.log("Record:" + recordCount);
});

function deleteDocument(documentId) {
  database.ref().child(documentId).set(null);
  alert("Train successfully deleted!");
  location.reload();
}