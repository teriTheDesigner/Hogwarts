"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

// The prototype for all students: 
const Student = {
    firstName: "",
    middleName: null,
    lastName: null,
    nickName: null,
    house: "",
    gender: "",
    image:"",
    bloodType:"",

}; 
  
const settings = {
  filterBy: "All",
  sortBy: "lastName",
  sortDir: "asc"
}

 function start() {
  console.log("ready");
  loadJSON();
  registerButtons();
}

async function loadJSON(){

  //
  let [studentsData, bloodData] = await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then(response => response.json()),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then(response => response.json()),
]);
preapareObjects(studentsData,bloodData);
}

function registerButtons(){
  document.querySelectorAll("[data-action='filter']").forEach(p => p.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));
}



//clean the data
function preapareObjects(data1,data2){
  //dataCollection.forEach(dataCleaningFunction)
  //allStudents.push(cleanedObject)

  data1.forEach((jsonObject) =>{
    const student = Object.create(Student);
      //The trim() method removes whitespace from both ends of a string and returns a new string, without modifying the original string

      //The regular expression /\s+/ matches one or more whitespace characters (e.g., space, tab, newline) in the string. This means that the string will be split wherever there is one or more whitespace characters
      let nameParts = jsonObject.fullname.trim().split(/\s+/);
     // console.log(nameParts);

      // Capitalize the name parts correctly
      student.firstName = capitalizeName(nameParts[0]);
      
      student.house = capitalizeName(jsonObject.house.trim());
      student.gender = capitalizeName(jsonObject.gender.trim());

      if (nameParts.length === 3) {
        if (nameParts[1].startsWith('"') && nameParts[1].endsWith('"')) {
          student.nickName = capitalizeName(nameParts[1].slice(1, -1));
        } else {
          student.middleName = capitalizeName(nameParts[1]);
        }
        student.lastName = capitalizeName(nameParts[2]);
      } else {
        student.lastName = capitalizeName(nameParts[1]);
      }

  if (student.lastName === "Finch-Fletchley"){
    student.image = `images/fletchley_j.png`;
  }   else if (student.firstName === "Padma"){
    student.image = `images/patil_padma.png`;
  } else if (student.firstName === "Parvati"){
    student.image = `images/patil_parvati.png`;
  } else if(student.lastName === "null")  {
      student.image = `images/${student.firstName.toLowerCase()}.png`; 
 } else if (student.lastName) {
      student.image = `images/${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
    } 

    const halfBloods = data2.half;
    const pureBloods = data2.pure;
   
    if (halfBloods.includes(student.lastName)){
       student.bloodType="Half-Blood";
    } else if(pureBloods.includes(student.lastName)){
    student.bloodType= "Pure-Blood";
  } else{
    student.bloodType= "Muggle";
  }

   allStudents.push(student);
  });

  //------------- BUILD LIST ---------

     buildList();     
} 


function capitalizeName(name) {

  //checks whether the name argument is falsy (i.e., null, undefined, false, 0, "", NaN). If it is, the function immediately returns null
  if (!name) return null;

  const hyphenIndex = name.indexOf("-");

  //find the index of the first occurrence of a hyphen (-) in the name. If there is no hyphen, the hyphenIndex variable will be set to -1.
  if (hyphenIndex !== -1) {
    return name.slice(0, hyphenIndex + 1) + name.charAt(hyphenIndex + 1).toUpperCase() + name.slice(hyphenIndex + 2).toLowerCase();
  }

  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}


function displayList(student) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  student.forEach(displayStudent);
}

function displayStudent(student) {
   

  
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  //clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  //clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
 // clone.querySelector("[data-field=bloodType]").textContent = student.bloodType;

  //clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("#image").src = student.image;
  //clone.querySelector('td[data-field="image"]>img').src = student.image;

  //clone.querySelector("[data-field=house]").textContent = student.house;

  clone.querySelector("#image").addEventListener(`click`, () => {displayStudentCard(student)});
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);

}

function displayStudentCard(student){
  let popup = document.querySelector(".modal");
  console.log("I am in display student card",student.bloodType);
  popup.classList.remove("hidden");
  
  popup.querySelector("#picture").src = student.image;
  popup.querySelector("[data-field=firstName]").textContent = student.firstName;
  popup.querySelector("[data-field=middleName]").textContent = student.middleName;
  popup.querySelector("[data-field=nickName").textContent = student.nickName;
  popup.querySelector("[data-field=lastName]").textContent = student.lastName;
  popup.querySelector("[data-field=gender").textContent = student.gender;
  popup.querySelector("[data-field=house]").textContent = student.house;
  popup.querySelector("[data-field=bloodStatus]").textContent = student.bloodType; 

  popup.querySelector(".closebutton").addEventListener('click', closeStudentCard);
  
  function closeStudentCard(){
  popup.classList.add("hidden"); 

  }
}

function buildList(){
  const currentList = filterList(allStudents);

  const sortedList = sortList(currentList);

  displayList(sortedList);
  console.log(sortedList);

  document.querySelector("h2 span").textContent = sortedList.length;
}



// -------------------- FILTERING ---------------------------

function selectFilter(event){

    const filter = event.target.dataset.filter;
    document.querySelector("h2").textContent = filter.toUpperCase();
    
    console.log(event);
   // console.log(`User selected ${filter}`);
    //filterList(filter);
    setFilter(filter);

}

function setFilter(filter){
  settings.filterBy = filter;

  console.log(filter);
    buildList();
}

function filterList(filteredList){
  if (settings.filterBy !=="All"){
    filteredList = allStudents.filter(filterBy);
  } else {
    filteredList = allStudents;
  } 
console.log(filteredList);
  return filteredList;

}

function filterBy(student){
   if (student.house.toLowerCase()=== settings.filterBy){
    console.log(`I am in the filterBy`);
    return true;
   } 

   if (student.bloodType.toLowerCase()=== settings.filterBy){
    return true;
   }
    

}

// -------------------- SORTING ---------------------------

function selectSort(event){
  const sortBy = event.target.dataset.sort;
    //check html for data set
    const sortDir = event.target.dataset.sortDirection;

    console.log(`I am in the selectSort ${sortBy,sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir){
  settings.sortBy= sortBy;
  settings.sortDir = sortDir;
  buildList(sortBy,sortDir);
}

function sortList(sortedList){
  console.log("SORTDIR",settings.sortDir);
  let direction= 1;

  if(settings.sortDir === "desc") {
    direction = -1;
  }
  console.log("DIRECTION",direction)
  sortedList =sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB){
    if (studentA[settings.sortBy]< studentB[settings.sortBy]){
      return -1 * direction;
  } else {
      return 1 * direction;
  }
  }
  return sortedList;

}

 








    
 