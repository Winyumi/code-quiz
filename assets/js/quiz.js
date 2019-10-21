var QuizGame = function() {

    // Initialize variables and quiz
    var timer = 0; // seconds
    var current = 0;
    var countdown;
    var highscores = [];
    const delay = 1; // seconds
    const penalty = 15; // seconds

    init();

    // Initializes quiz
    function init() {
        timer = questions.length * penalty;
        current = 0;
        if (localStorage.highscores) {
            highscores = JSON.parse(localStorage.highscores);
        }
        stopTimer();
        $("#quiz").empty();
        $("#quiz").append(
            $("<div>").addClass("timer"),
            $("<div>").addClass("main")
        );
        beginQuiz();
    }

    // Sets up quiz page
    function beginQuiz() {
        $("#quiz .main").empty();
        $("#quiz .main").append(
            $("<h1>")
            .text("Coding Quiz Challenge"),
            $("<p>")
            .text("Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your timer score by " + penalty + " seconds!")
        );

        btnBeginQuiz();
        btnViewHighScores();


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
    function evaluateAnswer(choice) {

        $("#quiz .choice").addClass("fade").attr("disabled", true);
        $(choice).removeClass("fade");

        // Check if answer is correct
        if ($(choice).val() == questions[current].answer) {
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
            .text("Your final score is " + timer + "." + (timer <= 0 ? " Try again!" : ""))
        );
        if (timer > 0)
        $("#quiz .main").append(
            $("<div>")
            .addClass("save")
            .append(
                $("<input>")
                .attr("type","text")
                .attr("placeholder","Your Name")
                .addClass("name form-control"),
                $("<button>")
                .addClass("btn btn-primary")
                .text("Save High Score")
            )
        );
        // Listen for click event on Save High Score button
        $("#quiz .save .btn").on("click", function() {
            highscores.push({
                name: $("#quiz .save .name").val(),
                score: timer
            })
            localStorage.highscores = JSON.stringify(highscores);
            displayHighScores();
        });

        btnStartOver();
    }

    // Shows high scores
    function displayHighScores() {
        $("#quiz .main").empty();
        $("#quiz .main").append(
            $("<div>").addClass("highscores").append(
                $("<h2>").text("High Scores"),
                $("<table>").addClass("table")
            )
        )
        $.each(highscores, function(index, item) {
            $("#quiz .highscores table").prepend(
                $("<tr>").append(
                    $("<td>").text(item.name).addClass("text-left"),
                    $("<td>").text(item.score).addClass("text-right")
                )
            )
        });

        btnStartOver("Return To Title");
        btnClearHighScores();

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


    // Commonly used buttons

    function btnBeginQuiz(label) {
        $("#quiz .main").append(
            $("<button>")
            .addClass("btn-begin-quiz btn btn-primary")
            .text(label ? label : "Begin Quiz")
        );
        $("#quiz .btn-begin-quiz").on("click", function() {
            showQuestion(0);
            displayTimer();
        });
    }

    function btnStartOver(label) {
        $("#quiz .main").append(
            $("<button>")
            .addClass("btn-start-over btn btn-primary")
            .text(label ? label : "Start Over")
        );
        $("#quiz .btn-start-over").on("click", function() {
            init();
        });
    }

    function btnViewHighScores(label) {
        $("#quiz .main").append(
            $("<button>")
            .addClass("view-highscores btn btn-primary")
            .text(label ? label : "View High Scores")
        );
        $("#quiz .view-highscores").on("click", function() {
            displayHighScores();
        });
    }

    function btnClearHighScores(label) {
        $("#quiz .main").append(
            $("<button>")
            .addClass("clear btn btn-primary")
            .text(label ? label : "Clear High Scores")
        );
        $("#quiz .clear").on("click", function() {
            localStorage.highscores = [];
            highscores = [];
            displayHighScores();
        });
    }
};

QuizGame();
