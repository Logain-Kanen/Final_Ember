let roomStorage = [
  { id: 0, roomType: "rest" },
  { id: 1, roomType: "puzzle1" },
  { id: 2, roomType: "puzzle2" },
  { id: 3, roomType: "rest" },
  { id: 4, roomType: "puzzle3" },
  { id: 5, roomType: "puzzle4" },
  { id: 6, roomType: "rest" },
  { id: 7, roomType: "puzzle6" },
];
const torchMax = 5; // the maximum number of failures
const entrance1 = document.getElementById("entrance1");
const puzzleBox = document.getElementById("puzzleBox");
let nextRoom = 0;
let torch = 5; // actual amount of torch
let currentRoom;
let closestRest;
let torchImage = document.getElementById("torchImage");
document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("title").innerHTML = `
    <h2>Continue from save?</h2>
    <p>Reaching a rest room will override any old saves</p>
    <button class='saveButton' onclick="setToSave(); document.getElementById('title').style.display = 'none'">YES</button>
    <button class='saveButton' onclick="document.getElementById('title').style.display = 'none'">NO</button
  `;
});
function torchLoss() { //Runs when a puzzle is failed
  torch--;
  if (torch === 4) {
    torchImage.src = "images/Lit.png";
  } else if (torch === 2) {
    torchImage.src = "images/Embers.png";
  } else if (torch === 1) {
    torchImage.src = "images/Out.png";
  } else if (torch <= 0) {
    puzzleBox.innerHTML = `
      <h2> Puzzle Finished </h2>
      <p> You have finished the puzzle, move on to the next room</p>
      <div id="puzzleBoxButton" onclick='puzzleClose()'>CLOSE</div>
    `;
    setToSave();
  }
}
function lossTimer() { //removes the alert after 1 second
  setTimeout(() => {
    document.getElementById("alert").textContent = "";
  }, 1000);
}
function setToSave() { //gets the progress from local storage and sets the room to that room
  closestRest = JSON.parse(localStorage.getItem("closestRestStorage"));
  nextRoom = closestRest;
  roomLoad();
}

function roomLoad() { //loads the current room and increments next room
  currentRoom = nextRoom;
  if (currentRoom === 0) { //first rest room
    puzzleBox.innerHTML = `
        <h2> You have reached a rest room </h2>
        <p> Your torch has been refreshed and if you run out of light you will return here </p>
        <div id="puzzleBoxButton" onclick='restClose(0)'>CLOSE</div>
    `;
    closestRest = 0;
    localStorage.setItem("closestRestStorage", JSON.stringify(closestRest));
    puzzleBox.style.display = "flex";
  } else if (currentRoom === 1) { //first puzzle room
    puzzleBox.innerHTML = `
        <h2> Puzzle 1</h2>
        <p>Drag each shape to an area to reveal what type of area it is, area must match to drop</p>
        <div id="puzzleBoxButton" onclick = 'puzzle1Load()'> BEGIN </div>
    `;
    puzzleBox.style.display = "flex";
  } else if (currentRoom === 2) { //second puzzle room
    puzzleBox.innerHTML = `
        <h2> Puzzle 2</h2>
        <p>The order you must light the braziers is flashed at the top, follow the order correctly to complete the minigame</p>
        <div id="puzzleBoxButton" onclick = 'puzzle2Load()'> BEGIN </div>
    `;
    puzzleBox.style.display = "flex";
  } else if (currentRoom === 3) { //second rest room
    puzzleBox.innerHTML = `
        <h2> You have reached a rest room </h2>
        <p> Your torch has been refreshed and if you run out of light you will return here </p>
        <div id="puzzleBoxButton" onclick='restClose(3)'>CLOSE</div>
    `;
    closestRest = 3;
    localStorage.setItem("closestRestStorage", JSON.stringify(closestRest));
    puzzleBox.style.display = "flex";
  } else if (currentRoom === 4) { //third puzzle room
    puzzleBox.innerHTML = `
        <h2> Puzzle 3 </h2>
        <p> Click and hold on each bar to refill it, do not let the bars reach the left side</p>
        <div id="puzzleBoxButton" onclick='puzzle3Load()'>CLOSE</div>
    `;
    puzzleBox.style.display = "flex";
  } else if (currentRoom === 5) { //fourth puzzle room
    puzzleBox.innerHTML = `
        <h2> Puzzle 4 </h2>
        <p> You have found yourself in a dark maze, find your way out with the arrow keys</p>
        <div id="puzzleBoxButton" onclick='puzzle4Load()'>CLOSE</div>
    `;
    puzzleBox.style.display = "flex";
  } else if (currentRoom === 6) { //finishes the game, when button is clicked it reloads the page to start again
    puzzleBox.innerHTML = `
        <h2> You made it out! </h2>
        <p> As you exit the maze you see light and finally find your way out back to the surface.</p>
        <div id="puzzleBoxButton" onclick='location.reload()'>CLOSE</div>
    `;
    puzzleBox.style.display = "flex";
  }

  console.log(nextRoom);
  nextRoom++;
}

function restClose(restRoom) { //Specifically for the rest room, resets the torch and changes the rest room
  torch = torchMax;
  closestRest = restRoom;
  puzzleBox.style.display = "none";
  torchImage.src = "images/Well-Lit.png";
}

function puzzle1Load() { //first puzzle
  puzzleBox.innerHTML = `
    <p id="alert"></p>
    <div id='boxContainer'>
      <div id="box1" class="box" draggable="true"></div>
      <div id="box2" class="box" draggable="true"></div>
      <div id="box3" class="box" draggable="true"></div>
      <div id="box4" class="box" draggable="true"></div>
    </div>
    <div id='dropContainer'>
      <div id="dropZone1" class="drop-zone" style="left: ${Math.floor(Math.random() * 900) + 120}px; top:${Math.floor(Math.random() * 600) + 1}px"></div>
      <div id="dropZone2" class="drop-zone" style="left: ${Math.floor(Math.random() * 900) + 120}px; top:${Math.floor(Math.random() * 600) + 1}px"></div>
      <div id="dropZone3" class="drop-zone" style="left: ${Math.floor(Math.random() * 900) + 120}px; top:${Math.floor(Math.random() * 600) + 1}px"></div>
      <div id="dropZone4" class="drop-zone" style="left: ${Math.floor(Math.random() * 900) + 120}px; top:${Math.floor(Math.random() * 600) + 1}px"></div>
    </div>
    `; //Math.random randomizes the position values

  let dropsLeft = 4; 
  let dragElm;
  // finds the drop and stores it in a variable
  document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text", event.target.id);
      dragElm = event.target.id;
    });
  });

  document.querySelectorAll(".drop-zone").forEach((dropZone) => {
    dropZone.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
  });

  document.querySelectorAll(".drop-zone").forEach((dropZone) => {
    dropZone.addEventListener("dragenter", function (event) {
      //runs when the dragged item first enters the drop zone;
      event.preventDefault();
      // helps keep the area as a valid drop target
      dropZone.classList.add("hovered");
      // adds a CSS class so the drop zone changes color
    });

    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("hovered");
    });

    dropZone.addEventListener("drop", function (event) {
      if (dragElm === "box1" && dropZone.id !== "dropZone1") {
        console.log("Successful Failure");
        dropZone.classList.remove("hovered");
        document.getElementById("alert").textContent =
          "Dropped in the wrong place, light lost";
        torchLoss();
        lossTimer();
        return;
      } else if (dragElm === "box2" && dropZone.id !== "dropZone2") {
        console.log("Successful Failure");
        dropZone.classList.remove("hovered");
        document.getElementById("alert").textContent =
          "Dropped in the wrong place, light lost";
        torchLoss();
        lossTimer();
        return;
      } else if (dragElm === "box3" && dropZone.id !== "dropZone3") {
        console.log("Successful Failure");
        dropZone.classList.remove("hovered");
        document.getElementById("alert").textContent =
          "Dropped in the wrong place, light lost";
        torchLoss();
        lossTimer();
        return;
      } else if (dragElm === "box4" && dropZone.id !== "dropZone4") {
        console.log("Successful Failure");
        dropZone.classList.remove("hovered");
        document.getElementById("alert").textContent =
          "Dropped in the wrong place, light lost";
        torchLoss();
        lossTimer();
        return;
      }
      //Runs when the dragged item is dropped into the drop zone
      event.preventDefault();
      // stops the default behavior
      const id = event.dataTransfer.getData("text");
      console.log(id);
      //gets back the saved id from dragstart
      const draggedElement = document.getElementById(id);
      // uses that id to find the real dragged element
      dropZone.textContent = "";
      //removes "Drop here"
      console.log(dragElm, dropZone);

      if (dragElm === "box1" && dropZone.id !== "dropZone1") {
        console.log("Successful Failure");
      }

      dropZone.classList.add("finished");
      //removes the hover background color
      draggedElement.style.margin = "0";
      //removes the old auto margin from the box
      dropZone.appendChild(draggedElement);
      //moved the dragged box into the drop zone
      dropsLeft--;
      if (dropsLeft === 0) {
        puzzleBox.innerHTML = `
        <h2> Puzzle Finished </h2>
        <p> You have finished the puzzle, move on to the next room</p>
        <div id="puzzleBoxButton" onclick='puzzleClose()'>CLOSE</div>
        `;
      }
    });
  });
}

function puzzle2Load() { // puzzle 2, the 'simon says' style minigame
  puzzleBox.innerHTML = `
    <div id = 'puzzleBox2'>
      <div id='showBox'>
        <div id="show1" class="show set1"></div>
        <div id="show2" class="show set2"></div>
        <div id="show3" class="show set3"></div>
        <div id="show4" class="show set4"></div>
      </div>
      <div id='clickBox'>
        <div id="click1" class="click set1"></div>
        <div id="click2" class="click set2"></div>
        <div id="click3" class="click set3"></div>
        <div id="click4" class="click set4"></div>
      </div>
      <div id="alert"></div>
      <div id="startSequence" onclick='startSequence()'>Start Sequence</div>
    </div>
    `;
}
let flashed = [];
function startSequence() { //the demonstration sequence
  let showBoxArray = Array.from(document.getElementsByClassName("show"));
  console.log(showBoxArray);
  document.getElementById("startSequence").style.display = "none";
  let sequenceInterval = setInterval(() => {
    if (showBoxArray.length) {
      let box = showBoxArray.splice(
        Math.floor(Math.random() * showBoxArray.length),
        1,
      )[0];
      let boxClass = box.classList[1];
      flashed.push(boxClass);
      console.log(flashed);
      // put ID in flashed
      box.style.background = "red";
      // css flash
      setTimeout(() => {
        box.style.background = "rgb(161, 161, 161)";
      }, 1000);
    } else {
      clearInterval(sequenceInterval);
      document.querySelectorAll(".click").forEach((click) => {
        click.addEventListener("click", storeClick);
        console.log();
      });
      console.log(document.querySelectorAll(".click"));
    }
  }, 1000);
}
let clickedArray = [];
function storeClick() { // stores the player's click value
  console.log(this.classList);
  this.classList.add("clicked");
  console.log(flashed);
  clickedArray.push(this.classList[1]);
  console.log(clickedArray);
  if (clickedArray.length === 4) {
    if (
      clickedArray[0] === flashed[0] &&
      clickedArray[1] === flashed[1] &&
      clickedArray[2] === flashed[2] &&
      clickedArray[3] === flashed[3]
    ) {
      console.log("success");
      puzzleBox.innerHTML = `
             <h2> Puzzle Finished </h2>
             <p> You have finished the puzzle, move on to the next room</p>
             <div id="puzzleBoxButton" onclick='puzzleClose()'>CLOSE</div>
            `;
    } else {
      console.log("failed successfully");
      document.getElementById("alert").textContent =
        "Puzzle failed, your torch loses light";
      document.getElementById("startSequence").style.display = "block";
      flashed = [];
      clickedArray = [];
      document.querySelectorAll(".click").forEach((clickBox) => {
        clickBox.classList.remove("clicked");
      });
      torchLoss();
      lossTimer();
    }
  }
}
let barWidth1 = 100;
let barWidth2 = 100;
let barTimer1;
let barTimer2;
let completionTimer;
let barDownTimer1;
let barDownTimer2;
let activeBar;
function puzzle3Load() { // loads the third puzzle, the bar controller
  puzzleBox.innerHTML = `
    <div id="puzzleBox3" onmouseup="barUp(3)">
      <div id="alert"></div>
      <div id="bar1" onmousedown="barDown(1)" onmouseup="barUp(1)" mouseleave="barUp(1)">
        <div id="innerBar1"></div>
      </div>
      <div id="bar2" onmousedown="barDown(2)" onmouseup="barUp(2)" mouseleave="barUp(2)">
        <div id="innerBar2"></div>
      </div>
    </div>
    `;
  let innerBar1 = document.getElementById("innerBar1");
  let innerBar2 = document.getElementById("innerBar2");
  completionTimer = setTimeout(function () {
    clearInterval(barTimer1);
    clearInterval(barTimer2);
    clearInterval(barDownTimer1);
    clearInterval(barDownTimer2);
    puzzleBox.innerHTML = `
      <h2> Puzzle Finished </h2>
      <p> You have finished the puzzle, move on to the next room</p>
      <div id="puzzleBoxButton" onclick='puzzleClose()'>CLOSE</div>
    `;
  }, 10000);
  barTimer1 = setInterval(function () {
    console.log("barWidth1", barWidth1);
    if (barWidth1 > 0) {
      barWidth1 -= 5;
      innerBar1.style.width = barWidth1 + "%";
    } else {
      document.getElementById("alert").textContent = "Game Lost!";
      clearInterval(barTimer1);
      clearInterval(barTimer2);
      puzzle3Fail();
    }
  }, 400);
  barTimer2 = setInterval(function () {
    if (barWidth2 > 0) {
      barWidth2 -= 5;
      innerBar2.style.width = barWidth2 + "%";
    } else {
      document.getElementById("alert").textContent = "Game Lost!";
      clearInterval(barTimer1);
      clearInterval(barTimer2);
      puzzle3Fail();
    }
  }, 300);
}
function barLeave(bar) {
  clearInterval(barDownTimer1);
  clearInterval(barDownTimer2);
  if (bar === 1) {
    clearInterval(barTimer1);
    barTimer1 = setInterval(function () {
      if (barWidth1 > 0) {
        barWidth1 -= 5;
        innerBar1.style.width = barWidth1 + "%";
      } else {
        puzzle3Fail();
      }
    }, 400);
  } else if (bar === 2) {
    clearInterval(barTimer2);
    barTimer2 = setInterval(function () {
      if (barWidth2 > 0) {
        barWidth2 -= 5;
        innerBar2.style.width = barWidth2 + "%";
      } else {
        puzzle3Fail();
      }
    }, 300);
  }
}
function barDown(bar) {
  activeBar = bar;
  if (bar === 1) {
    clearInterval(barDownTimer1);
    clearInterval(barTimer1);
    barDownTimer1 = setInterval(function () {
      if (barWidth1 < 100) {
        barWidth1 += 5;
        innerBar1.style.width = barWidth1 + "%";
      }
    }, 300);
  } else if (bar === 2) {
    clearInterval(barDownTimer2);
    clearInterval(barTimer2);
    barDownTimer2 = setInterval(function () {
      if (barWidth2 < 100) {
        barWidth2 += 5;
        innerBar2.style.width = barWidth2 + "%";
      }
    }, 300);
  }
}
function barUp(bar) {
  console.log(bar);
  clearInterval(barDownTimer1);
  clearInterval(barDownTimer2);
  if (bar === 1) {
    clearInterval(barTimer1);
    barTimer1 = setInterval(function () {
      if (barWidth1 > 0) {
        barWidth1 -= 5;
        innerBar1.style.width = barWidth1 + "%";
      } else {
        puzzle3Fail();
      }
    }, 400);
  } else if (bar === 2) {
    clearInterval(barTimer2);
    barTimer2 = setInterval(function () {
      if (barWidth2 > 0) {
        barWidth2 -= 5;
        innerBar2.style.width = barWidth2 + "%";
      } else {
        puzzle3Fail();
      }
    }, 300);
  } else {
    if (activeBar !== null) {
      barUp(activeBar);
      activeBar = null;
    }
  }
}
function puzzle3Fail() { //how the puzzle resets back to full and clears all original timers to reset them
  torchLoss();
  lossTimer();
  clearTimeout(completionTimer);
  clearInterval(barTimer1);
  clearInterval(barTimer2);
  barWidth1 = 100;
  barWidth2 = 100;
  document.getElementById("alert").textContent = "Game Lost";
  failTimer = setTimeout(() => {
    barTimer1 = setInterval(function () {
      if (barWidth1 > 0) {
        barWidth1 -= 5;
        innerBar1.style.width = barWidth1 + "%";
      } else {
        puzzle3Fail();
      }
    }, 400);
    barTimer2 = setInterval(function () {
      if (barWidth2 > 0) {
        barWidth2 -= 5;
        innerBar2.style.width = barWidth2 + "%";
      } else {
        puzzle3Fail();
      }
    }, 300);
    completionTimer = setTimeout(function () {
      clearInterval(barTimer1);
      clearInterval(barTimer2);
      clearInterval(barDownTimer1);
      clearInterval(barDownTimer2);
      puzzleBox.innerHTML = `
        <h2> Puzzle Finished </h2>
        <p> You have finished the puzzle, move on to the next room</p>
        <div id="puzzleBoxButton" onclick='puzzleClose()'>CLOSE</div>
      `;
    }, 10000);
  }, 1000);
}
// Maze puzzle
class Cell { // creates the object with the id, row, col, and then boolean values for whether or not the side is possible to go through or not
  constructor(row, col, top, right, bottom, left) {
    this.id = `${row}-${col}`;
    this.row = row;
    this.col = col;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
  }
}
maze = [
  new Cell(0, 0, false, true, true, false),
  new Cell(0, 1, false, true, false, true),
  new Cell(0, 2, false, true, false, true),
  new Cell(0, 3, false, true, false, true),
  new Cell(0, 4, false, true, true, true),
  new Cell(0, 5, false, false, true, true),
  new Cell(1, 0, true, true, true, false),
  new Cell(1, 1, false, true, true, true),
  new Cell(1, 2, false, false, true, true),
  new Cell(1, 3, false, true, false, false),
  new Cell(1, 4, true, false, true, true),
  new Cell(1, 5, true, false, true, false),
  new Cell(2, 0, true, false, true, false),
  new Cell(2, 1, true, false, false, false),
  new Cell(2, 2, true, false, true, false),
  new Cell(2, 3, false, false, true, false),
  new Cell(2, 4, true, false, true, false),
  new Cell(2, 5, true, false, true, false),
  new Cell(3, 0, true, false, true, false),
  new Cell(3, 1, false, false, true, false),
  new Cell(3, 2, true, true, true, false),
  new Cell(3, 3, true, false, false, true),
  new Cell(3, 4, true, false, true, false),
  new Cell(3, 5, true, false, false, false),
  new Cell(4, 0, true, false, true, false),
  new Cell(4, 1, true, true, false, false),
  new Cell(4, 2, true, false, true, true),
  new Cell(4, 3, false, true, true, false),
  new Cell(4, 4, true, true, true, true),
  new Cell(4, 5, true, false, true, true),
  new Cell(5, 0, true, false, true, false),
  new Cell(5, 1, false, true, true, false),
  new Cell(5, 2, true, false, true, true),
  new Cell(5, 3, true, false, false, false),
  new Cell(5, 4, true, false, true, false),
  new Cell(5, 5, true, false, false, false),
  new Cell(6, 0, true, false, false, false),
  new Cell(6, 1, true, false, false, false),
  new Cell(6, 2, true, false, false, false),
  new Cell(6, 3, false, true, false, false),
  new Cell(6, 4, true, true, false, true),
  new Cell(6, 5, false, true, false, true),
  new Cell(6, 6, true, false, false, true),
];
console.log(maze);
let userXPosition = 0;
let userYPosition = 0;
let userLeftInset = -150;
let userTopInset = -150;
let cellSize = 50;
let mask;

function puzzle4Load() { // loads the maze onto the page
  puzzleBox.innerHTML = `
  <div id="puzzleBox4">
    <div id="mask"></div>
    <canvas id="maze"></canvas>
    <p id='alert'></p>
  </div>
  `;
  mazeTimer = setInterval(() => { //every 10 seconds the player loses torch light
    document.getElementById("alert").innerHTML =
      `You have lost some light in your torch, quickly find a way out.`;
    torchLoss();
    lossTimer();
    if (torch <= 0) {
      clearInterval(mazeTimer);
    }
  }, 10000);
  const mazeCanvas = document.getElementById("maze");
  const ctx = mazeCanvas.getContext("2d");
  mazeCanvas.width = 7 * 50;
  mazeCanvas.height = 7 * 50;
  let cell = maze.find((c) => c.id == `${userYPosition}-${userXPosition}`);
  mask = document.getElementById("mask");
  maze.forEach((cell) => drawCell(cell));
  document.addEventListener("keydown", (event) => { //checks if the cell is able to be passed through, if yes, then moves the mask to keep track of the player
    switch (event.key) {
      case "ArrowLeft":
        if (cell.left) {
          userXPosition--;
          userLeftInset -= 50;
          cell = maze.find((c) => c.id == `${userYPosition}-${userXPosition}`);
          console.log(cell);
          mask.style.boxShadow = `inset ${userLeftInset}px ${userTopInset}px 0px 147px rgb(0, 0, 0, 1)`;
        }
        break;
      case "ArrowRight":
        console.log("right");
        if (cell.right) {
          userXPosition++;
          userLeftInset += 50;
          cell = maze.find((c) => c.id == `${userYPosition}-${userXPosition}`);
          console.log(cell);
          mask.style.boxShadow = `inset ${userLeftInset}px ${userTopInset}px 0px 147px rgb(0, 0, 0, 1)`;
          if (userXPosition === 6 && userYPosition === 6) {
            console.log("Yipee");
            puzzleBox.innerHTML = `
              <h2> Puzzle Finished </h2>
              <p> You have finished the puzzle, move on to the next room</p>
              <div id="puzzleBoxButton" onclick='puzzleClose()'>CLOSE</div>
            `;
            document.removeEventListener("keydown", movementTrack);
          }
        }
        break;
      case "ArrowUp":
        console.log("up");
        if (cell.top) {
          userYPosition--;
          userTopInset -= 50;
          cell = maze.find((c) => c.id == `${userYPosition}-${userXPosition}`);
          console.log(cell);
          mask.style.boxShadow = `inset ${userLeftInset}px ${userTopInset}px 0px 147px rgb(0, 0, 0, 1)`;
        }
        break;
      case "ArrowDown":
        console.log("down");
        if (cell.bottom) {
          userYPosition++;
          userTopInset += 50;
          cell = maze.find((c) => c.id == `${userYPosition}-${userXPosition}`);
          console.log(cell);
          mask.style.boxShadow = `inset ${userLeftInset}px ${userTopInset}px 0px 147px rgb(0, 0, 0, 1)`;
        }
        break;
    }
  });
  function drawCell(c) {
    let x = c.col * cellSize;
    let y = c.row * cellSize;
    ctx.beginPath();

    // t, r, b, l
    // ctx.moveTo(x, y)
    if (!c.top) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
    }

    if (!c.right) {
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
    }

    if (!c.bottom) {
      ctx.moveTo(x + cellSize, y + cellSize);
      ctx.lineTo(x, y + cellSize);
    }

    if (!c.left) {
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function puzzleClose() {
  puzzleBox.style.display = "none";
}
