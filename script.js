// Define multiple walls
const walls = {
  Wall1: {
    Fruits: ["Apple", "Banana", "Orange", "Grape"],
    Colors: ["Red", "Blue", "Green", "Yellow"],
    Animals: ["Dog", "Cat", "Horse", "Lion"],
    Sports: ["Soccer", "Tennis", "Basketball", "Cricket"]
  },
  Wall2: {
    Countries: ["France", "Spain", "Italy", "Germany"],
    Drinks: ["Tea", "Coffee", "Juice", "Water"],
    Instruments: ["Guitar", "Piano", "Drums", "Violin"],
    Planets: ["Mars", "Venus", "Earth", "Jupiter"]
  },
  Wall3: {
    Shapes: ["Circle", "Square", "Triangle", "Rectangle"],
    Vehicles: ["Car", "Bike", "Train", "Plane"],
    Clothing: ["Shirt", "Pants", "Dress", "Hat"],
    Tech: ["Phone", "Laptop", "Tablet", "Camera"]
  }
}; 

let categories;   // chosen wall
let words = [];
let selected = [];
let solvedGroups = [];
let groupColors = ["lightgreen", "plum", "skyblue", "orange"];
let currentColor = 0;

let startTime;
let penaltyTime = 0;
let timerInterval;

const grid = document.getElementById("grid");
const timerDiv = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Choose wall
function chooseWall(wallName) {
  categories = walls[wallName];
  words = Object.values(categories).flat().sort(() => Math.random() - 0.5);

  document.getElementById("wallSelect").style.display = "none";
  startBtn.style.display = "inline-block";
}

// Build grid
function buildGrid(order) {
  grid.innerHTML = "";
  order.forEach(word => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.className = "word";
    btn.onclick = () => onClick(btn, word);
    grid.appendChild(btn);
  });
}

// Timer
function updateTimer() {
  let elapsed = Math.floor((Date.now() - startTime) / 1000) + penaltyTime;
  let mins = Math.floor(elapsed / 60);
  let secs = elapsed % 60;
  timerDiv.textContent = `Time: ${mins}m ${secs}s`;
}

// Click logic
function onClick(btn, word) {
  if (solvedGroups.flat().includes(word)) return;

  if (selected.includes(word)) {
    btn.style.backgroundColor = "";
    selected = selected.filter(w => w !== word);
  } else {
    btn.style.backgroundColor = "lightgray";
    selected.push(word);
  }

  if (selected.length === 4) checkGroup();
}

// Check group
function checkGroup() {
  for (let [cat, group] of Object.entries(categories)) {
    if (selected.every(w => group.includes(w))) {
      solvedGroups.push(group);
      let color = groupColors[currentColor % groupColors.length];
      currentColor++;

      [...grid.children].forEach(btn => {
        if (group.includes(btn.textContent)) {
          btn.classList.add("solved");
          btn.style.backgroundColor = color;
          btn.disabled = true;
        }
      });

      alert(`Correct! You found the group: ${cat}`);
      selected = [];
      rebuildGrid();

      if (solvedGroups.length === Object.keys(categories).length) {
        clearInterval(timerInterval);
        let elapsed = Math.floor((Date.now() - startTime) / 1000) + penaltyTime;
        let mins = Math.floor(elapsed / 60);
        let secs = elapsed % 60;
        alert(`You Win! Final Time: ${mins}m ${secs}s`);
      }
      return;
    }
  }

  // Wrong guess → add 30s penalty
  penaltyTime += 30;
  alert("Wrong! +30s penalty added.");
  [...grid.children].forEach(btn => {
    if (selected.includes(btn.textContent)) {
      btn.style.backgroundColor = "";
    }
  });
  selected = [];
}

// Rebuild grid with solved groups at top
function rebuildGrid() {
  let solvedWords = solvedGroups.flat();
  let remaining = words.filter(w => !solvedWords.includes(w));
  remaining = remaining.sort(() => Math.random() - 0.5);
  let newOrder = solvedWords.concat(remaining);

  buildGrid(newOrder);

  [...grid.children].forEach(btn => {
    if (solvedWords.includes(btn.textContent)) {
      btn.disabled = true;
      btn.style.backgroundColor = groupColors[solvedGroups.findIndex(g => g.includes(btn.textContent))];
    }
  });
}

// Start button
startBtn.onclick = () => {
  startBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
  grid.style.display = "grid";
  buildGrid(words);
  startTime = Date.now();
  penaltyTime = 0;
  timerInterval = setInterval(updateTimer, 1000);
};

// Reset button
resetBtn.onclick = () => {
  clearInterval(timerInterval);
  selected = [];
  solvedGroups = [];
  currentColor = 0;
  penaltyTime = 0;
  timerDiv.textContent = "Time: 0m 0s";
  grid.style.display = "none";
  startBtn.style.display = "none";
  resetBtn.style.display = "none";
  document.getElementById("wallSelect").style.display = "block";
};
