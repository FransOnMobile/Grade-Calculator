document.addEventListener('DOMContentLoaded', loadSavedCourses);

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

    const gwaEquivalent = calculateGWAEquivalent(totalGrade);
    document.getElementById('result').innerText = `Your final grade percentage is: ${totalGrade.toFixed(2)}% (GWA Equivalent: ${gwaEquivalent})`;
}

function calculateGWAEquivalent(grade) {
    if (grade >= 96) return 1.0;
    else if (grade >= 92) return 1.25;
    else if (grade >= 88) return 1.5;
    else if (grade >= 84) return 1.75;
    else if (grade >= 80) return 2.0;
    else if (grade >= 75) return 2.25;
    else if (grade >= 70) return 2.5;
    else if (grade >= 65) return 2.75;
    else if (grade >= 60) return 3.0;
    else return 5.0; // Failing grade
}

function saveCourse() {
    const courseName = document.getElementById('courseName').value;
    const numComponents = document.getElementById('numComponents').value;
    if (!courseName || !numComponents) {
        alert('Please enter the course name and number of components.');
        return;
    }

    const courseData = {
        courseName,
        numComponents,
        components: [],
        gwa: parseFloat(document.getElementById('result').innerText.split('GWA Equivalent: ')[1]) || 5.0
    };

    for (let i = 0; i < numComponents; i++) {
        const componentName = document.getElementById(`componentName${i}`).value;
        const weight = parseFloat(document.getElementById(`weight${i}`).value);
        const numScores = document.getElementById(`numScores${i}`).value;
        const scores = [];

        for (let j = 0; j < numScores; j++) {
            const score = parseFloat(document.getElementById(`score${i}_${j}`).value);
            const maxScore = parseFloat(document.getElementById(`maxScore${i}_${j}`).value);
            scores.push({ score, maxScore });
        }

        courseData.components.push({ componentName, weight, scores });
    }

    let savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    savedCourses.push(courseData);
    localStorage.setItem('courses', JSON.stringify(savedCourses));
    displaySavedCourses();
    calculateCumulativeGWA();
}

function displaySavedCourses() {
    const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const savedCoursesList = document.getElementById('savedCourses');
    savedCoursesList.innerHTML = '';

    savedCourses.forEach((course, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${course.courseName} (GWA: ${course.gwa})`;
        listItem.onclick = () => displayCourseDetails(index);
        savedCoursesList.appendChild(listItem);
    });
}

function displayCourseDetails(index) {
    const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = savedCourses[index];

    let details = `Course: ${course.courseName}\n`;
    course.components.forEach((component, i) => {
        details += `Component ${i + 1}: ${component.componentName}, Weight: ${component.weight}\n`;
        component.scores.forEach((score, j) => {
            details += `  - Score ${j + 1}: ${score.score} out of ${score.maxScore}\n`;
        });
    });

    alert(details);
}

function clearCourses() {
    localStorage.removeItem('courses');
    displaySavedCourses();
    calculateCumulativeGWA();
}

function loadSavedCourses() {
    displaySavedCourses();
    calculateCumulativeGWA();
}

function calculateCumulativeGWA() {
    const savedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    if (savedCourses.length === 0) {
        document.getElementById('cumulativeGwa').innerText = 'No saved courses. Cumulative GWA is N/A.';
        return;
    }

    let totalGradePoints = 0;
    let totalCourses = 0;

    savedCourses.forEach(course => {
        totalGradePoints += course.gwa;
        totalCourses++;
    });

    const cumulativeGwa = totalGradePoints / totalCourses;
    document.getElementById('cumulativeGwa').innerText = `Cumulative GWA: ${cumulativeGwa.toFixed(2)}`;
}
