var QuizGame = function() {

    // Initialize variables and quiz
    var timer = 0; // seconds
    var current = 0;
    var countdown;
    const delay = 1; // seconds
    const penalty = 15; // seconds

    init();

    // Initializes quiz
    function init() {
        timer = questions.length * penalty;
        current = 0;
        stopTimer();
        $("#quiz").empty();
        $("#quiz").append(
            $("<div>").addClass("timer"),
            $("<div>").addClass("main")
        );
        startQuiz();
    }

    // Sets up quiz page
    function startQuiz() {
        $("#quiz .main").empty();
        $("#quiz .main").append(
            $("<h1>")
            .text("Coding Quiz Challenge"),
            $("<p>")
            .text("Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your timer score by " + penalty + " seconds!"),
            $("<button>")
            .addClass("start btn btn-primary")
            .text("Start Quiz")
        );
        // Listen for click event on Start button
        $("#quiz .start").on("click", function() {
            showQuestion(0);
            displayTimer();
        });
    }

    // Sets up question and choices
    function showQuestion(current) {
        $("#quiz .main").empty();
        $("#quiz .main").append(
            $("<h2>")
            .addClass("question")
            .text(questions[current].title)
        );
        $.each(questions[current].choices, function(index, item) {
            $("#quiz .main").append(
                $("<button>")
                .attr("value", item)
                .addClass("choice btn btn-primary")
                .text(item)
            );
        });
        $("#quiz .main").append(
            $("<p>")
            .addClass("result")
        );
        startTimer();

        // Listen for click event on Choice buttons
        $("#quiz .choice").on("click", function() {
            evaluateAnswer(this);
        });
    }

    // Checks answer and display result
    function evaluateAnswer(a) {

        $("#quiz .choice").addClass("fade").attr("disabled", true);
        $(a).removeClass("fade");

        if ($(a).val() == questions[current].answer) {
            $("#quiz .result")
            .text("Correct!")
            .attr("style","color: green;");
        } else {
            timer -= penalty;
            if (timer < 0) {
                timer = 0;
            }
            $("#quiz .result")
            .text("Incorrect!")
            .attr("style","color: red;");
        }

        // Delay the timer to display result
        stopTimer();
        displayTimer();

        current++;
        setTimeout(function() {
            if (current < questions.length && timer > 0) {
                showQuestion(current);
            } else {
                endQuiz();
            }
        }, delay*1000);
    }

    // Ends the quiz and sets up score page
    function endQuiz() {
        $("#quiz .timer").empty();
        $("#quiz .main").empty();
        $("#quiz .main").append(
            $("<h1>")
            .text((timer > 0 ? "All done!" : "Oh no!")),
            $("<p>")
            .text("Your final score is " + timer + "." + (timer === 0 ? " Try again!" : "")),
            $("<button>")
            .addClass("start btn btn-primary")
            .text("Start Over")
        );

        // Listen for click event on Start Over button
        $("#quiz .start").on("click", function() {
            init();
        });
    }


    // Timer functions

    // Show and update timer text
    function displayTimer() {
        $("#quiz .timer").text("Time: " + timer);
    }

    // Start the timer and end quiz if timer runs out
    function startTimer() {
        countdown = setInterval(function() {
            if (timer > 0) {
                timer--;
                displayTimer();
            } else {
                endQuiz();
            }
        }, 1000)
    }

    // Stop the timer
    function stopTimer() {
        clearInterval(countdown);
    }

};

QuizGame();
