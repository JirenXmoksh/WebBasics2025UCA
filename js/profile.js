(function init(){
  renderProfile();
})()

window.addEventListener("storage", (e) => {
  if (e.key === "heaviestLift" || e.key === "muscleGroups") {
    renderProfile();
  }
})

function renderProfile(){
  showTotalExercises();
  showHeaviestWeight();
  showTotalWeight();
  // showFavouriteExercises();
  setupClearDataButton();
};

// total exercises
function showTotalExercises() {
  // get the musclegroup object from localStorage
  let muscleGroups = JSON.parse(localStorage.getItem("muscleGroups"))
  let totalExercises = 0;

  // object with "name" and "data"
  muscleGroups.forEach((muscle) => { 
    if (muscle.data.length) { // check if there are any exercises for this muscle
      totalExercises += muscle.data.length;
    }
  })

  let totalExerciseDiv = document.querySelector("#total-exercises")
  totalExerciseDiv.innerHTML = `
    ${totalExercises}
  `
}

// Heaviest weight lifted
function showHeaviestWeight() {  
  let heaviestLift = JSON.parse(localStorage.getItem("heaviestLift") || "0")

  if (!heaviestLift) {
    let heaviestWeightDiv = document.querySelector("#heaviest-weight")
    heaviestWeightDiv.innerHTML = `null`
    return;
  }

  console.log(heaviestLift);
  
  let heaviestWeight = heaviestLift.liftWeight;
  let heaviestExercise = heaviestLift.liftName;
  let heaviestWeightDiv = document.querySelector("#heaviest-weight")
  heaviestWeightDiv.innerHTML = `
    ${heaviestWeight}kg in ${heaviestExercise}
  `
}

// Total weight lifted
function showTotalWeight() {
   // get the musclegroup object from localStorage
  let muscleGroups = JSON.parse(localStorage.getItem("muscleGroups"))
  let totalWeight = 0;

  // object with "name" and "data"
  muscleGroups.forEach((muscle) => { 
    if (muscle.data.length) { // check if there are any exercises for this muscle
      for (let i in muscle.data) { 
        let exercise = muscle.data[i]; // 1 exercise object = muscle.data[i]
        let lifts = exercise.lifts;
        for (let j in lifts) {
          totalWeight += lifts[j].weight;
        }
      }
    }
  })

  let totalWeightDiv = document.querySelector("#total-weight")
  totalWeightDiv.innerHTML = `
    ${totalWeight}kg
  `
}
// Favourite movements

// Clear all data from website
function setupClearDataButton() {
  document.querySelector("#clear-data").addEventListener("click", () => {
    localStorage.setItem("muscleGroups", JSON.stringify(muscleGroups))
    localStorage.setItem("heaviestLift", JSON.stringify(null))
    renderProfile(); // re-render the profile after clearing data
  })
}