// Define multiple walls
const walls = {
  Wall1: {
    Before_The_Word_Box: ["Chatter", "Juke", "Shadow", "Soap"],
    Washing_Machine_Cycles: ["Bulky", "Cotton", "Delicate", "Spin"],
    Helpful_Deed: ["Favour", "Kindness", "Service", "Solid"],
    Building_Materials: ["Brick", "Concrete", "Metal", "Stone"]
  },
  Wall2: {
    Follow_The_Word_Light: ["Year", "Bulb", "House", "Weight"],
    Time: ["Day", "Month", "Hour", "Second"],
    Wee: ["Minute", "Little", "Dinky", "Slight"],
    Playing_Cards: ["Ace", "Jack", "King", "Queen"]
  },
  Wall3: {
    Silent_K: ["Knife", "Knight", "Knock", "Knob"],
    JFK_Conspiracy: ["Knoll", "Umbrella", "Ruby", "Oswald"],
    Clothing: ["Shirt", "Trousers", "Shorts", "Hat"],
    Things_In_A_Kitchen: ["Mugs", "Pots", "Kettle", "Toaster"]
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
    btn.classList.remove("selected"); // Remove bold text
    btn.style.backgroundColor = "";
    selected = selected.filter(w => w !== word);
  } else {
    btn.classList.add("selected"); // Add bold text
    btn.style.backgroundColor = "lightgray";
    selected.push(word);
  }

  if (selected.length === 4) checkGroup();
}

// Reset bold text for incorrect selections
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

      // Replace underscores with spaces for display
      alert(`Correct! You found the group: ${cat.replace(/_/g, ' ')}`);
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
      btn.classList.remove("selected"); // Remove bold text for incorrect selections
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
