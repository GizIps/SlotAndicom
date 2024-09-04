/**
 * Setup
 */

// Mapping of indexes to icons: start from banana in middle of initial position and then upwards
(iconMap = [
  "Badge",
  "melon",
  "banana",
  "ipsum",
  "cherry",
  "purple",
  "serity",
  "lemon",
  "bell",
  "barbarbar",
  "lemon",
  "melon",
]),
  // Width of the icons
  (icon_width = 190),
  // Height of one icon in the strip
  (icon_height = 190.6),
  // Number of icons in the strip
  (num_icons = 5),
  // Max-speed in ms for animating one icon down
  (time_per_icon = 50),
  // Holds icon indexes
  (indexes = [0, 0, 0, 0]),
  //Holds icon indexes from previous resolve
  (rollfix = [0, 0, 0, 0]),
  (iz = 0),
  //Contador para las trampas
  (contador_cheat = 0),
  //Contador de los campos de la traga monedas
  (contador_reel = 1),
  (Wild_cheat = randomIntFromInterval(3, 8)),
  (cheat = false),
  //Premios mayores
  (Certification = 3),
  (ServNow = 2),
  (Serity = 1),
  (Ipsum = 4);
//Elementos de la pagina web
document.querySelector("#spinner").addEventListener("click", rollAll);
const SlotSound = document.getElementById("SlotRandom");
const winwinsound = document.getElementById("winwin");
const winsound = document.getElementById("win");
const losesound = document.getElementById("lose");
const playBtn = document.getElementById("spinner");
const SerityBtn = document.getElementById("SerityBTN");
const IpsumBtn = document.getElementById("IpsumBTN");
const SNBtn = document.getElementById("SNBTN");

//Añadir Sonidos
document.addEventListener("DOMContentLoaded", function () {
  // Cuando se clickea se inicia el sonido de la tragamonedas
  playBtn.addEventListener("click", function () {
    SlotSound.currentTime = 0.0;
    winwinsound.currentTime = 0;
    winsound.currentTime = 0;
    SlotSound.play();
    playBtn.disabled = true;
    playBtn.textContent = "Rolling";
  });
});

//Las Trampas
//Seriti
document.addEventListener("DOMContentLoaded", function () {
  SerityBtn.addEventListener("click", function () {
    iz = Serity;
    cheat = true;
  });
});
//Ipsum
document.addEventListener("DOMContentLoaded", function () {
  IpsumBtn.addEventListener("click", function () {
    iz = Ipsum;
    cheat = true;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  SNBtn.addEventListener("click", function () {
    iz = ServNow;
    cheat = true;
  });
});
/**
 * Girar una casilla, esta funcion se va a utilizar dentro de la funcion grande de generacion de resultados
 */
const roll = (reel, offset = 0) => {
  // Minimum of 2 + the reel offset rounds
  if (cheat === true) {
    //Delta fijo
    deltaProb =
      (offset + 5) * num_icons - (rollfix[offset] - iz) + 8 * num_icons;
  } else {
    //Delta Aleatorio
    deltaProb =
      (offset + 5) * num_icons + Math.round(Math.random() * num_icons);
  }
  const delta = deltaProb;

  // Return promise so we can wait for all reels to finish
  return new Promise((resolve, reject) => {
    const style = getComputedStyle(reel),
      // Current background position
      backgroundPositionY = parseFloat(style["background-position-y"]),
      // Target background position
      targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
      // Normalized background position, for reset
      normTargetBackgroundPositionY =
        targetBackgroundPositionY % (num_icons * icon_height);

    // Delay animation with timeout, for some reason a delay in the animation property causes stutter
    setTimeout(() => {
      // Set transition properties ==> https://cubic-bezier.com/#.41,-0.01,.63,1.09
      reel.style.transition = `background-position-y ${
        (8 + 1 * delta) * time_per_icon
      }ms cubic-bezier(.41,-0.01,.63,1.09)`;
      // Set background position
      reel.style.backgroundPositionY = `${
        backgroundPositionY + delta * icon_height
      }px`;
    }, offset * 150);

    // After animation
    setTimeout(() => {
      // Reset position, so that it doesn't get higher without limit
      reel.style.transition = `none`;
      reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
      // Resolve this promise
      resolve(delta % num_icons);
    }, (8 + 1 * delta) * time_per_icon + offset * 150);
  });
};

/**
 * Roll all reels, when promise resolves roll again
 */
function rollAll() {
  const reelsList = document.querySelectorAll(".slots > .reel");

  if (contador_cheat == Wild_cheat) {
    cheat = true;
    iz = randomIntFromInterval(0, 4);
    console.log("Trampa Time!!!");
    console.log("el iz es" + iz);
    console.log(Wild_cheat);
  }

  Promise

    // Activate each reel, must convert NodeList to Array for this with spread operator
    .all(
      [...reelsList].map((reel, i) => {
        console.log(`Girando la casilla ${i + 1}`);
        return roll(reel, i);
      })
    )

    // When all reels done animating (all promises solve)
    .then((deltas) => {
      // add up indexes
      deltas.forEach((delta, i) => {
        indexes[i] = (indexes[i] + delta) % num_icons;
        console.log("Vamos en el delta: " + i);
        console.log("con valor de: " + delta);
      });

      // Win conditions
      if (indexes[0] == indexes[1] && indexes[1] == indexes[2]) {
        const winCls = "win2";
        document.querySelector(".slots").classList.add(winCls);
        winwinsound.play();
        setTimeout(
          () => document.querySelector(".slots").classList.remove(winCls),
          2500
        );
        setTimeout(() => winwinsound.pause(), 2500);
        contador_cheat = 0;
        Wild_cheat = randomIntFromInterval(3, 8);
      } else if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
        const winCls = "win1";
        document.querySelector(".slots").classList.add(winCls);
        winsound.play();
        setTimeout(
          () => document.querySelector(".slots").classList.remove(winCls),
          2500
        );
        setTimeout(() => winsound.pause(), 2500);
      } else {
        const winCls = "loose";
        lose.play();
        document.querySelector(".slots").classList.add(winCls);
        setTimeout(
          () => document.querySelector(".slots").classList.remove(winCls),
          2000
        );
        setTimeout(() => losesound.pause(), 2000);
      }
      playBtn.disabled = false;
      playBtn.textContent = "Let's Play";
      SlotSound.pause();

      rollfix = indexes;
      iz = 0;
      cheat = false;
      contador_cheat++;
      if (contador_cheat > Wild_cheat) {
        contador_cheat = 0;
        Wild_cheat = randomIntFromInterval(3, 8);
      }
      //Revision de los contadores
      console.log(Wild_cheat);
      console.log(contador_cheat);
    });
}

// Funcion de numero aleatorio
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
