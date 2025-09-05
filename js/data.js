var chest = [
  // {
  //   id: 1,
  //   name: "Bench Press",
  //   favourite: false,
  //   lifts: [
  //     {weight: 50, date: Date.now()},
  //     {weight: 60, date: Date.now()},
  //   ]
  // },
  // This is how the data looks like on the inside for a given exercise
]

var back = []
var legs = []
var shoulders = []
var biceps = []
var triceps = []

// Create registry of muscle groups so this can be looped on while rendering the exercises
var muscleGroups = [
  {name: "chest", data: chest},
  {name: "back", data: back},
  {name: "legs", data: legs},
  {name: "shoulders", data: shoulders},
  {name: "biceps", data: biceps},
  {name: "triceps", data: triceps},
]