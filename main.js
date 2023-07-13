$(document).ready(function() {
      
	  $('#plus').click(function() {
		  $('#prompted').slideToggle();
	  });
	  
	  var sentences = [];
      // Step 1: Handle form submission and store the text
      $("#form1").submit(function(event) {
		event.preventDefault();
		var text = $("#text").val();
		sentences = extractSentences(text);
		$("#form1").hide();
		$("#form2").show();
		$("#instructions").show();
		var bullets = $("#prompt").val();
		if (bullets.length !== 0) {
		  $("#framed").show();
		  $("#framed p").append(bullets);
		  $("#framed h3").append("Reference: the prompt used to generate the text");
		}
		// Generate form fields for each sentence
		sentences.forEach(function(sentence, index) {
		  if (sentence.trim() !== "") {
			var sentenceNumber = index + 1;
			var label = $("<label>").text(sentenceNumber + ". " + sentence);
			var dropdown = $("<select>").attr("name", "sentence" + sentenceNumber);
			dropdown.append($("<option>").text("Make a choice").val("-1"));
			dropdown.append($("<option>").text("True").val("0"));
			dropdown.append($("<option>").text("Mostly True").val("1"));
			dropdown.append($("<option>").text("Cannot say").val("0"));
			dropdown.append($("<option>").text("Mostly False").val("2"));
			dropdown.append($("<option>").text("False").val("3"));
			var checkboxLabel = $("<p class='opi'>").text("Check if this sentence is an opinion or a comment");
			var checkbox = $("<input>").attr("type", "checkbox").attr("name", "opinion" + sentenceNumber);

			var line = $("<div>").addClass("form-line");
			line.append(label);
			line.append(dropdown);
			line.append(checkboxLabel);
			line.append(checkbox);
			$("#form2").append(line);
		  }
		});

		var submitBtn = $("<button class='but butb'>").attr("type", "submit").text("View the result");
		$("#form2").append(submitBtn);
	  });
      // Step 2: Handle form submission and display results
		$("#form2").submit(function(event) {
		  event.preventDefault();
		  var trueCount = 0;
		  var mostlyTrueCount = 0;
		  var falseCount = 0;
		  var mostlyFalseCount = 0;
		  var totalTrueScore = 0;
		  var totalMostlyTrueScore = 0;
		  var totalFalseScore = 0;
		  var totalMostlyFalseScore = 0;
		  var totalAssessedSentences = 0;
		  var totalOpinionCount = 0;

		  // Calculate the scores and counts
		  $("select").each(function() {
			var value = parseInt($(this).val());
			if (value === 0) {
			  trueCount++;
			  totalAssessedSentences++;
			} else if (value === 1) {
			  mostlyTrueCount++;
			  totalAssessedSentences++;
			  totalMostlyTrueScore += value;
			} else if (value === 3) {
			  falseCount++;
			  totalAssessedSentences++;
			  totalFalseScore += value;
			} else if (value === 2) {
			  mostlyFalseCount++;
			  totalAssessedSentences++;
			  totalMostlyFalseScore += value;
			}
		  });

		  // Calculate the total opinion count
		  $("input[type='checkbox']").each(function() {
			if ($(this).is(":checked")) {
			  totalOpinionCount++;
			}
		  });

		  var totalScore = totalMostlyTrueScore + totalFalseScore + totalMostlyFalseScore;
		  var idiIndex = totalScore / (totalAssessedSentences * 3) * 10;
		  idiIndex = Math.round(idiIndex * 10) / 10; // Round to 1 decimal place
		  var idiIndexDisplay = idiIndex.toFixed(1).replace(".0", ""); // Remove decimal if it's zero

		  // Calculate the percentage of opinions
		  var opinionPercentage = (totalOpinionCount / sentences.length) * 100;
		  opinionPercentage = Math.round(opinionPercentage * 10) / 10; // Round to 1 decimal place
		  var opinionrate = opinionPercentage/10;
		  
		  // Hide form 2 and display results
		  $("#form2").hide();
		  $("#instructions").hide();
		  $("#framed").hide();
		  $("#results").html(
			"There are " + trueCount + " " +
			(trueCount > 1 ? "sentences" : "sentence") + " marked as 'True', " +
			mostlyTrueCount + " marked as 'Mostly true', " +
			mostlyFalseCount + " marked as 'Mostly false', and " +
			falseCount + " marked as 'False' out of a total of " +
			totalAssessedSentences + " " +
			(totalAssessedSentences > 1 ? "sentences" : "sentence") + " assessed." +

			
			"<br><p>You marked " + totalOpinionCount + " sentence" +
			(totalOpinionCount > 1 ? "s" : "") + " as opinion or comment (" +
			opinionPercentage + "% of the total amount of sentences)." + 
			"The Opinions/Comments rate is <strong>" + opinionrate + "</strong>.</p>" +
			
			"<h3>The IDL index for this news is " + idiIndexDisplay + "</h3>"

		  );
		  $("#restart").show();
		  $("#chart").show();
		  $("#exp").show();

		  // Update the value label
		  var valueLabel = document.querySelector('.value-label');
		  valueLabel.innerText = "|" + idiIndexDisplay;
		  valueLabel.style.setProperty('--value', idiIndex);
		});

      // Step 3: Handle "Start again"
      $("#restart").click(function() {
        $("#form1").show();
        $("#form2").empty().hide();
        $("#results").empty();
        $(this).hide();
        $("#text").val(""); // Clear the textarea
        $("#prompt").prop("value", "");
        sentences = [];
		bullets = "";
        $("#chart").hide();
        $("#exp").hide();
		
      });
});

//RegEx
function extractSentences(text) {
  var sentences = text.match(/[A-Z][^.!?]*(?:\.(?!\d)|[.!?](?=\s|$))/g);
  if (sentences === null) {
    return [];
  }
  return sentences.map(function(sentence) {
    return sentence.trim();
  });
}
