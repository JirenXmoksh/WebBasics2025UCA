if (!localStorage.getItem("muscleGroups")) {
  localStorage.setItem("muscleGroups", JSON.stringify(muscleGroups))
}

// Get all groups
function getMuscleGroups() {
  return JSON.parse(localStorage.getItem("muscleGroups"));
}
function getMuscle(muscleName) {
  let allGroups = JSON.parse(localStorage.getItem("muscleGroups"));
  return allGroups.find((m) => m.name === muscleName);
}

// 'muscleGroups' is a hashMap with 'name' as the key and 'data' as the value
function updateMuscleGroup(muscleName, newData) {
  let groups =  getMuscleGroups();
  let idx = groups.findIndex(m => m.name === muscleName)
  if (idx !== -1) {
    groups[idx].data = newData;
    localStorage.setItem("muscleGroups", JSON.stringify(groups));
  }
}

(function() {
  // fetch the states of the top 3 lifts
  let deadlift = JSON.parse(localStorage.getItem("deadlift"));
  let deadliftDiv = document.querySelector("#dead");
  if (deadlift) {
      deadliftDiv.innerHTML = `
        ${deadlift} kg
      `
  } else {
    deadliftDiv.innerHTML = `
      null
    `
  }
  renderData();
})();

function renderData() {
  let groups = getMuscleGroups();
  groups.forEach((muscle) => {
    renderExercises(muscle)
  })
}

function renderThisExercise(container, exercise, muscle) {
  console.log(exercise.id);
    
  var div = document.createElement("div")
  div.className = "exerciseDiv flex items-center justify-between bg-white px-5 py-3 border-zinc-300 shadow-md rounded-md";

  div.innerHTML = `
    <div class="exName text-sm sm:text-sm md:text-md lg:text-lg font-[gilLight]">
      ${exercise.name}
    </div>
    <div class="buttons flex items-center justify-center relative">

      <div data-toggle="tooltip" class="mx-2 cursor-pointer hover:scale-120 transition duration-200" data-placement="left" title="Add To Favourites">
        <img src="../assets/images/heart.png" width="15px" height="15px" alt="Add to favourites">
      </div>

      <div data-toggle="tooltip" class="show-history-btn mx-2 cursor-pointer hover:scale-120 transition duration-200" data-placement="left" title="Check History" data-muscle="${muscle.name}" data-id="${exercise.id}">
        <img src="../assets/images/history.png" width="15px" height="15px" alt="Check History">
      </div>
      <ul class="lift-history hidden absolute top-full bg-black shadow-lg z-10 mt-2 text-sm text-zinc-300 px-1 py-2 rounded-md w-[150%] flex flex-col justify-center items-center"></ul>

      <div data-toggle="tooltip" class="add-weight-btn mx-2 cursor-pointer hover:scale-120 transition duration-200" data-placement="left" title="Add New Weight" data-id="${exercise.id}" data-muscle="${muscle.name}">
        <img src="../assets/images/plus.png" width="15px" height="15px" alt="Add New Weight">
      </div>

      <div data-toggle="tooltip" class="mx-2 cursor-pointer hover:scale-120 transition duration-200" data-placement="left" title="Clear data">
        <img src="../assets/images/trash.png" width="15px" height="15px" alt="Clear Data">
      </div>

      <div data-toggle="tooltip" class="delete-btn mx-2 cursor-pointer hover:scale-120 transition duration-200" data-placement="left" title="Delete exercise" data-id="${exercise.id}" data-muscle="${muscle.name}">
        <img src="../assets/images/remove.png" width="15px" height="15px" alt="Delete exercise">
      </div>

    </div>
  `;

  container.appendChild(div);
}

function appendAddNewExerciseDiv(container, muscle) {
  // append the 'add a new exercise' div after all exercises always
  var addNewExerciseDiv = document.createElement("div");
  
  // give this button a class so that event listener can be attached on it
  addNewExerciseDiv.className = "add-exercise-btn flex items-center justify-center bg-black text-white px-5 py-3 border-zinc-300 shadow-lg rounded-md hover:scale-102 transition duration-200";
  addNewExerciseDiv.dataset.muscle = muscle.name
  addNewExerciseDiv.addEventListener("click", function() {
    let muscleName = this.dataset.muscle;
    
    // Earlier I was using this to take user input.
    // let exName = prompt("Enter the exercise name: ");
    // if (exName && exName.trim() !== "") {
    //   addExercise(muscleName, exName.trim());
    // }

    // To prevent multiple input fields
    if (document.querySelector(`#${muscleName}-input-form`)) {
      return;
    }

    // Find the muscle container (the main div for the muscle)
    let muscleDiv = document.querySelector(`#${muscleName}-container`)
                            .closest("section") // climbs up to the chestDiv section and 
                            .querySelector("div.flex") // gets into the div with flex class which contains the muscle name <h1> tag
    
    // Create the inline input and the buttons
    let form = document.createElement("div")
    form.id = `${muscleName}-input-form`
    form.className = "flex items-center gap-1 ml-3"

    form.innerHTML = `
      <input type="text" class="font-[gilLight] exercise-input border-1 bg-black text-white px-3 py-2 text-sm rounded-lg" placeholder="Enter here" />
      <button class="save-exercise bg-green-600 text-white px-2 py-2 rounded-md text-sm" data-muscle="${muscleName}"> 
        Save
      </button>
      <button class="cancel-exercise bg-red-600 text-white px-2 py-2 rounded-md text-sm" data-muscle="${muscleName}">
        Cancel
      </button>
    `
    muscleDiv.append(form);

    // Save exercise handler
    form.querySelector(".save-exercise").addEventListener("click", function() {
      let input = form.querySelector(".exercise-input")
      let exName = input.value.trim();
      if (exName) {
        addExercise(muscleName, exName)
      }
      form.remove(); // removes itself from the DOM
    })

    // Cancel exercise handler
    form.querySelector(".cancel-exercise").addEventListener("click", function() {
      form.remove(); // removes itself from the DOM
    })
  })

  addNewExerciseDiv.innerHTML = `
    <div class="exName text-md font-[gilLight]">
      <h1>Add a new exercise</h1>
    </div>
  `
  container.appendChild(addNewExerciseDiv)
}

function renderExercises(muscle) {
  
  // get the container which has name `${muscle}-container`
  var container = document.getElementById(`${muscle.name}-container`);
  container.innerHTML = ""; // clear before re-render

  muscle.data.forEach((exercise) => {
    renderThisExercise(container, exercise, muscle)
  })

  appendAddNewExerciseDiv(container, muscle)

  // Attach event listeners to all the 'delete-btn' buttons to remove the exercise
  // This returns the array of all the delete buttons 
  // Add event listener to each of them and call the remove exercise button when clicked.

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function() {
      var exerciseID = this.dataset.id; // we gave data-id to the button above. Data is passed as strings 
      var muscleName = this.dataset.muscle;

      removeExercse(muscleName, exerciseID);
    })
  })

  // Attach the event listeners to the 'add-weight-btn' buttons 
  container.querySelectorAll('.add-weight-btn').forEach((btn) => {
    btn.addEventListener("click", function() {
      let exerciseID = this.dataset.id;
      let muscleName = this.dataset.muscle;

      // To prevent multiple forms from opening
      if (document.querySelector(`#${muscleName}-${exerciseID}-weight-form`)) {
        return;
      }

      // get the parent div for the exercise
      let exerciseDiv = this.closest(".exerciseDiv")
      exerciseDiv.querySelector(".buttons").classList.add("hidden")
      // create the form
      let form = document.createElement("div")
      form.id = `${muscleName}-${exerciseID}-weight-form`
      form.className = "flex items-center gap-2 mt-2"
      form.innerHTML = `
        <input 
        type="number" 
        step="0.1"
        class="weight-input px-2 py-1 rounded-md text-xs sm:text-xs md:text-md"
        placeholder="Enter weight (kg)"
        />  

        <button 
        class="save-weight bg-green-600 text-white px-2 py-1 rounded-md text-xs sm:text-xs md:text-md"
        data-muscle="${muscleName}"
        data-id="${exerciseID}"
        >
        Save
        </button>

        <button 
        class="cancel-weight bg-red-600 text-white px-2 py-1 rounded-md text-xs sm:text-xs md:text-md"
        data-muscle="${muscleName}"
        data-id="${exerciseID}"
        >
        Cancel
        </button>
      `

      exerciseDiv.appendChild(form)

      // The save button
      form.querySelector(".save-weight").addEventListener("click", function() {
        let input = form.querySelector(".weight-input")
        let weight = parseFloat(input.value.trim());

        if (weight && !isNaN(weight)) {
          addNewWeight(muscleName, exerciseID, weight);
        }
        form.remove();
        exerciseDiv.querySelector(".buttons").classList.remove("hidden")
      })

      // The cancel button
      form.querySelector(".cancel-weight").addEventListener("click", function() {
        form.remove();
        exerciseDiv.querySelector(".buttons").classList.remove("hidden")
      })
    })
  })

  // Attach the event listener to the 'show-history' buttons
  container.querySelectorAll(".show-history-btn").forEach((btn) => {
    btn.addEventListener("click", function() {
      let muscleName = this.dataset.muscle
      let exID = this.dataset.id

      let groups = getMuscleGroups();
      let muscleGroup = groups.find(m => m.name === muscleName)
      if (!muscleGroup) {
        console.log("Muscle not found")
        return;
      }
      
      let exercise = muscleGroup.data.find(ex => ex.id == exID)
      if (!exercise) {
        console.log("Exercise not found");
        return;
      }

      let historyList = this.parentElement.querySelector('.lift-history')

      if (historyList.classList.contains("hidden")) { // if the list is hidden then unhide it
        renderHistory(exercise, historyList, muscleName, exID);
        // Attach the remove lift event listener to the image
        attachRemoveLiftHandlers(historyList);
        historyList.classList.remove("hidden")
      } else {
        historyList.classList.add("hidden")
      }
    })
  })
}

function renderHistory(exercise, historyList, muscleName, exID) {
  if (exercise.lifts.length === 0) {
    historyList.innerHTML = `
      <li class="my-1 p-2">No lifts yet.</li>
    `
  } else {
    historyList.innerHTML = exercise.lifts
    .map((lift, idx) => {
      return `
        <li class="my-1 p-2 flex items-center justify-around w-full">
        <span>${lift.weight}kg on ${lift.date}</span>
        <img
          src="../assets/images/remove2.png"
          alt="Remove entry"
          width="12px"
          height="12px"
          class="remove-lift cursor-pointer ml-2 hover:scale-120 transition duration-200"
          data-muscle="${muscleName}"
          data-id="${exID}"
          data-index="${idx}"
        />             
        </li>
      `;
    })
    .join("")
  }
}

function attachRemoveLiftHandlers(historyList) {
  historyList.querySelectorAll(".remove-lift").forEach((btn) => {
    btn.addEventListener("click", handleRemoveLift)
  })
}

function handleRemoveLift(evt) {
  const btn = evt.currentTarget
  let muscleName = btn.dataset.muscle
  let exID = btn.dataset.id
  let liftIdx = parseInt(btn.dataset.index, 10);

  let groups = getMuscleGroups()
  let muscleGroup = groups.find(m => m.name === muscleName)
  if (!muscleGroup) {
    return;
  }

  let exercise = muscleGroup.data.find(ex => ex.id == exID)
  if (!exercise) {
    return;
  }

  exercise.lifts.splice(liftIdx, 1);
  localStorage.setItem("muscleGroups", JSON.stringify(groups));
  
  const historyList = btn.closest(".lift-history")
  renderHistory(exercise, historyList, muscleName, exID);
  attachRemoveLiftHandlers(historyList)

  recalcHeaviestLift(groups);
}

// Add exercise
function addExercise(muscleName, exName) {
  let allGroups = getMuscleGroups()
  let idx = allGroups.findIndex(m => m.name === muscleName);

  if (idx !== -1) {
    let newExercise = {
      id: Date.now(), // unique id
      name: exName,
      favourite: false,
      lifts: []
    };

    allGroups[idx].data.push(newExercise);
    localStorage.setItem("muscleGroups", JSON.stringify(allGroups));
    renderExercises(allGroups[idx]);
  }
}

// Recalculate heaviest lift 
function recalcHeaviestLift(groups) {
  let newHeaviestLiftWeight = null;
  let newHeaviestLiftName = null;
  // object with "name" and "data"
  groups.forEach((muscle) => { 
    if (muscle.data.length) { // check if there are any exercises for this muscle
      for (let i in muscle.data) { 
        let exercise = muscle.data[i]; // 1 exercise object = muscle.data[i]
        let lifts = exercise.lifts;
        for (let j in lifts) {
          if (lifts[j].weight > newHeaviestLiftWeight) {
            newHeaviestLiftWeight = lifts[j].weight;
            newHeaviestLiftName = exercise.name
          }
        }
      }
    }
  })

  if (newHeaviestLiftWeight) {
    let newHeaviestLift = {
      liftWeight: newHeaviestLiftWeight,
      liftName: newHeaviestLiftName
    }
    localStorage.setItem("heaviestLift", JSON.stringify(newHeaviestLift));
  } else {
    localStorage.setItem("heaviestLift", JSON.stringify(null));
  }
}

// Remove the exercise
function removeExercse(muscleName, exerciseID) {

  // find the muscle group from the map of muscles (name -> data)
  let groups = getMuscleGroups() // take out all the data

  let idx = groups.findIndex(m => m.name === muscleName);

  // filter out the exercise by ID
  if (idx !== -1) {
    groups[idx].data = groups[idx].data.filter(ex => ex.id != exerciseID); // '!=' instead of '!==' because exerciseID is a string passed from dataset.id
    localStorage.setItem("muscleGroups", JSON.stringify(groups));
    renderExercises(groups[idx]);
  }

  // whenever an exercise is removed, re calculate the heaviestLift and update in localStorage
  // iterate on the whole 'muscleGroups' object
  recalcHeaviestLift(groups);
}

// Add data to that exercise
function addNewWeight(muscleName, exerciseID, weight) {
  let groups = getMuscleGroups();
  let muscleGroupIdx = groups.findIndex(m => m.name === muscleName)
  let exerciseName = "";

  if (muscleGroupIdx !== -1) {
    let exIdx = groups[muscleGroupIdx].data.findIndex(ex => ex.id == exerciseID)
    if (exIdx != -1) {
      let exercise = groups[muscleGroupIdx].data[exIdx]
      exerciseName = exercise.name;
      if (exercise.lifts.length >= 15) {
        exercise.lifts.shift();
      }

      // get a readable date
      let date = new Date();
      let options = { day: "numeric", month: "long", year: "numeric"}
      let readableDate = date.toLocaleDateString("en-US", options)

      let newLift = {
        weight: weight,
        date: readableDate
      }

      exercise.lifts.push(newLift);

      // update the heaviest weight variable if this one is the maximum
      let curHeaviest = JSON.parse(localStorage.getItem("heaviestLift") || "0");
      if (!curHeaviest || weight > curHeaviest.liftWeight) {
        let newHeaviestLift = {
          liftWeight: weight,
          liftName: exerciseName
        }
        localStorage.setItem("heaviestLift", JSON.stringify(newHeaviestLift));
      }

      localStorage.setItem("muscleGroups", JSON.stringify(groups));
      renderExercises(groups[muscleGroupIdx]);
    }
  }
}

// Personal bests of atmax 4 exercises (the 4 heaviest ones)

// Optional - Favourite that exercise


