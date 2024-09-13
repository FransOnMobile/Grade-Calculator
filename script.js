function createComponentInputs() {
    const numComponents = document.getElementById('numComponents').value;
    const container = document.getElementById('componentsContainer');
    container.innerHTML = ''; // Clear previous inputs

    for (let i = 0; i < numComponents; i++) {
        const componentDiv = document.createElement('div');
        componentDiv.className = 'component';
        componentDiv.innerHTML = `
            <h3>Component ${i + 1}</h3>
            <label for="componentName${i}">Component Name:</label>
            <input type="text" id="componentName${i}" placeholder="Enter component name">

            <label for="weight${i}">Weight (in decimal, e.g., 0.30 for 30%):</label>
            <input type="number" id="weight${i}" step="0.01" min="0" max="1" placeholder="Enter weight">

            <label for="numScores${i}">Number of Scores:</label>
            <input type="number" id="numScores${i}" min="1" placeholder="Enter number of scores" onchange="createScoreInputs(${i})">

            <div id="scoresContainer${i}"></div>
        `;
        container.appendChild(componentDiv);
    }
}

function createScoreInputs(componentIndex) {
    const numScores = document.getElementById(`numScores${componentIndex}`).value;
    const scoresContainer = document.getElementById(`scoresContainer${componentIndex}`);
    scoresContainer.innerHTML = ''; // Clear previous score inputs

    for (let j = 0; j < numScores; j++) {
        scoresContainer.innerHTML += `
            <label for="score${componentIndex}_${j}">Score ${j + 1}:</label>
            <input type="number" id="score${componentIndex}_${j}" min="0" placeholder="Enter score">

            <label for="maxScore${componentIndex}_${j}">Maximum Score ${j + 1}:</label>
            <input type="number" id="maxScore${componentIndex}_${j}" min="0" placeholder="Enter maximum score">
        `;
    }
}

function calculateTotalGrade() {
    const numComponents = document.getElementById('numComponents').value;
    let totalGrade = 0;

    for (let i = 0; i < numComponents; i++) {
        const weight = parseFloat(document.getElementById(`weight${i}`).value);
        const numScores = document.getElementById(`numScores${i}`).value;

        let totalScore = 0;
        let totalMaxScore = 0;

        for (let j = 0; j < numScores; j++) {
            const score = parseFloat(document.getElementById(`score${i}_${j}`).value);
            const maxScore = parseFloat(document.getElementById(`maxScore${i}_${j}`).value);

            totalScore += score;
            totalMaxScore += maxScore;
        }

        if (totalMaxScore > 0) {
            const componentPercentage = (totalScore / totalMaxScore) * 100;
            totalGrade += (componentPercentage * weight);
        }
    }

    document.getElementById('result').innerText = `Your final grade percentage is: ${totalGrade.toFixed(2)}%`;
}

function saveCourse() {
    const courseName = document.getElementById('courseName').value;
    const numComponents = document.getElementById('numComponents').value;
    if (!courseName || !numComponents) {
        alert('Please enter the course name and number of components.');
        return;
    }

    const savedCourses = document.getElementById('savedCourses');
    const listItem = document.createElement('li');
    listItem.textContent = courseName;
    savedCourses.appendChild(listItem);

    listItem.onclick = () => {
        alert(`Course: ${courseName} - Clicked`);
    };

    // Optional: Store course data in a local storage or variable
    // This is where you can save course details if needed
}

function clearCourses() {
    const savedCourses = document.getElementById('savedCourses');
    savedCourses.innerHTML = ''; // Clear all saved courses
}
