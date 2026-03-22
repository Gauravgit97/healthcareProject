const questions = [
    'Do you often feel sad?', 'Do you feel happy most of the time?', 'Do your moods change frequently?', 'Do you feel overwhelmed regularly?', 'Do you feel emotionally stable?', 'Do you overthink a lot?', 'Do you have mostly negative thoughts?', 'Do you experience intrusive thoughts?', 'Do you feel hopeful about your future?', 'Do you criticize yourself frequently?', 'Do you have trouble sleeping?', 'Do you feel well-rested after sleep?', 'Do you sleep too much or too little?', 'Do you feel low on energy during the day?', 'Do you feel tired without doing much?', 'Has your appetite changed recently?', 'Do you eat more when stressed?', 'Do you neglect your physical health?', 'Do you exercise regularly?', 'Have you experienced sudden weight changes?', 'Do you feel anxious frequently?', 'Do small things stress you out?', 'Do you experience panic attacks?', 'Do you struggle to manage stress?', 'Do you feel out of control when worried?', 'Do you feel bad about yourself?', 'Do you have low self-esteem?', 'Do you compare yourself to others often?', 'Do you lack confidence in your abilities?', 'Do you feel like you are not good enough?', 'Do you avoid social interactions?', 'Do you feel lonely often?', 'Do you lack someone to talk to?', 'Do you feel unsupported by others?', 'Do you feel uncomfortable around people?', 'Do you lack motivation for daily tasks?', 'Have you lost interest in activities you once enjoyed?', 'Do you find it hard to concentrate?', 'Do you procrastinate frequently?', 'Do you feel like your life lacks purpose?', 'Do you feel hopeless?', 'Do you feel helpless?', 'Do you feel emotionally numb?', 'Do you cry frequently?', 'Do you feel like a burden to others?', 'Have you had thoughts of harming yourself?', 'Do you feel life is not worth living?', 'Have you had thoughts of suicide?', 'Do you feel unsafe with yourself?', 'Are you avoiding seeking professional help despite struggling?'
];

let currentQuestion = 0;
let answers = [];

// -----------------------------
// Load Question
// -----------------------------
function loadQuestion() {
    const qText = document.getElementById("question-text");

    // Smooth fade effect
    qText.style.opacity = 0;

    setTimeout(() => {
        qText.innerText = questions[currentQuestion];
        qText.style.opacity = 1;
    }, 200);

    document.getElementById("progress").innerText =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    updateProgressBar();
}

// -----------------------------
// Progress Bar
// -----------------------------
function updateProgressBar() {
    let progress = ((currentQuestion) / questions.length) * 100;
    document.getElementById("progress-fill").style.width = progress + "%";
}

// -----------------------------
// Handle Answer
// -----------------------------
function answerQuestion(value) {
    answers.push(value);

    // 🔥 If last question → submit immediately
    if (currentQuestion === questions.length - 1) {
        showLoadingState();
        submitAnswers();
        return;
    }

    // Move to next question
    currentQuestion++;
    loadQuestion();
}

// -----------------------------
// Loading UI (NEW 🔥)
// -----------------------------
function showLoadingState() {
    document.querySelector(".card").innerHTML = `
        <h2>Analyzing your responses...</h2>
        <p>Please wait ⏳</p>
    `;
}

// -----------------------------
// Submit Answers
// -----------------------------
function submitAnswers() {
    fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answers })
    })
    .then(res => res.json())
    .then(data => {
        // Save results
        localStorage.setItem("prediction", data.prediction);
        localStorage.setItem("confidence", data.confidence);

        // 🔥 Smooth redirect after slight delay
        setTimeout(() => {
            window.location.href = "/result";
        }, 800);
    })
    .catch(err => {
        console.error("Error:", err);
    });
}

// Initial load
loadQuestion();