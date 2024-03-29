// note key frquency: middle C
let first = 262;

// Array of frequencies in C Major.
let notesFreq = [
  first,
  first * 9/8,
  first * 5/4,
  first * 4/3,
  first * 3/2,
  first * 5/3,
  first * 15/8,
  first * 2
];

/* number of notes that can be played (equal to the number of frequencies/oscillators) */
let numNotes = notesFreq.length;

//number of squares in a row
let gridSize; 

// variable for oscillators array
let myOscillators;

//tempo selection list (in beats per min)
let tempoList = ["100", 
                 "110",
                 "120",
                 "130",
                 "140",
                 "150"]

//variable for tempo dropdown
let tempoSelect; 

//variable for name of song
let nameInput; 

//empty melody object
let melody = { name: "Untitled", 
              notesIndex: [], 
              tempo:0,
              duration: 0};

function setup(){
  createCanvas(400,400);
  
  //set grid size based on canvas variables
  gridSize = width / numNotes;
  
  //set color mode to HSB (better for using notes to color squares)
  colorMode(HSB);

  //create oscillators
  myOscillators = createNotes(notesFreq);

  // tempo dropdown text
  let p = createP('Step 1: Select tempo and click on the squares to play notes!');
  p.style("color", "white");
  p.position(10, 385);
  
  //tempo dropdown
  tempoSelect = createSelect();
  tempoSelect.position(10, 425);
  tempoSelect.option(0);
  
  //add tempos to dropdown options
  for (let tempo of tempoList){
    tempoSelect.option(tempo);
  }
  
  // call setTempo() when selected
  tempoSelect.changed(setTempo);

  // input text
  let p2 = createP(`Step 2: Type a name for your melody a click "Set name"`);
  p2.style("color", "white");
  p2.position(10, 450);
  
  //Name of song input
  nameInput = createInput("Type a name and set");
  nameInput.position(10, 490);
  nameInput.size(200);
  
  // name button
  let nameButton = createButton('Set name');
  nameButton.position(250, 490);
  nameButton.mouseClicked(setName);
  
    // Play button
  let playButton = createButton('🎵 Play your song when you are done! 🎶');
  playButton.position(width *0.2, 540);
  playButton.mouseClicked(play);
}

function draw(){
    background(0);
    drawEditor();
}

//sets name of melody
function setName(){
  melody.name = nameInput.value();
}

// Plays notes in a song
function play() {
  if(melody.length!=0){
    //start oscillators
    for (let osc of myOscillators) {
        if(!osc.started){
        osc.start();
        osc.started = true;
        }
    }
    
    //read each note in melody.notesIndex array
    for (let note in melody.notesIndex) {
        //play each note noteDuration * 1000 * i secs after code runs
        setTimeout(playNote, 
                   melody.duration * 1000 * note,
                   note);
        }
  }
}

//update melody object when clicked
function mousePressed() {
    updateMelody();
}

//save notes based on squares on the screen
function updateMelody() {
    for (let i = 0; i < numNotes; i++) {
      //set x,y for each column
      let x = i * gridSize;
      let y = height/2 - gridSize/2;
      
        /* Check if the mouse is 
        over the square */
        if (mouseX > x && 
            mouseX < x + gridSize && 
            mouseY > y && 
            mouseY < y + gridSize) {
          //save notes index array
          let notes = melody.notesIndex;
          
          //add new note index to the array
          notes.push(i);
          
          //reassign to melody object
          melody.notesIndex = notes;
          
          //play note at that index
          playNote(i);
        }
      }
    }
  

//plays a note
function playNote(noteIndex) {
    if(melody.tempo!==0){
    //check if oscilator is started, start it if it hasnt
      let osc = myOscillators[noteIndex]
    if (!osc.started){
        osc.start();
        osc.started = true;
    } 
    // Start playing the note by increasing volume and adding fade in time
    osc.amp(1, 0.01); 
    // Stops playing the note after number of seconds stored in noteDuration
    setTimeout(stopNote, melody.duration * 1000, noteIndex);
    }
}
   
// Stops playing the note
function stopNote(noteIndex) {
  let osc = myOscillators[noteIndex]
    osc.amp(0);
    osc.started = false;
   }

//set tempo details
function setTempo(){
    if(tempoSelect.selected() !== 0){
    melody.tempo = tempoSelect.selected();
    melody.duration = 60 / melody.tempo;
    }
}

//User Interface
function drawEditor() {
    // draw square buttons
    //Column iteration
    for (let i = 0; i < numNotes; i ++) {
      //set x for each column
      let x = i * gridSize;
      let y = height/2 - gridSize/2;
        
        // Set the color based on the note playing.
        if(melody.tempo!==0){
          let osc = myOscillators[i];
          //color as long as the oscillator is playing
          if (melody.notesIndex[i] === i && osc.started) {
           let h = map(i, 0, numNotes, 0, 360);
           fill(h, 100, 100);
        } else {
          fill("white");
        }
    }
        // Draw a rounded square.
        square(x, y, gridSize, 10);
      }
  //name text
  fill("white")
  textSize(20)
  text(`Melody Name: 
${melody.name}`, 50, 50);
    }

//creates oscillator objects
function createNotes(frequenciesArray){
  //empty array for ocsillator objects
  let oscillators = []
  
  // iterate through all notes in frequencies Array
  for (let freq of frequenciesArray) {
    //create oscillator object using key frequency
    let osc = new Oscillator(freq);
    //set oscillator volume to 0 as default
    osc.amp(0);
   //set started property to false
    osc.started = false;
   //add the oscillator to the oscillators array
    oscillators.push(osc);
  }
  return oscillators;
}


   
   