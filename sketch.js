let dzieckoPlacz, dzieckoHappy, smoczekImg, customCursor, futuraFont;
let soundPlacz, soundHappy, clickSound;
let smoczekX = 100, smoczekY = 300;
let offsetX = 0, offsetY = 0;
let dragging = false;
let dzieckoSpokojne = false;
let dzieckoSpokojnePrev = false;
let glitterParticles = [];

let rawDalejImg, dalejImg;
let btnX, btnY, btnR;
const BTN_DIAMETER = 120;
const HOVER_SCALE = 1.05;

let scene = 0;

function preload() {
  dzieckoPlacz = loadImage('d.placz.png');
  dzieckoHappy = loadImage('d.happy.png');
  smoczekImg = loadImage('smoczek.png');
  customCursor = loadImage('flowerMouse.png');
  futuraFont = loadFont('futura.ttf');

  soundPlacz = loadSound('dziecko_placz_sound.mp3');
  soundHappy = loadSound('dziecko_happy_sound.mp3');
  clickSound = loadSound('glimmer.wav');

  rawDalejImg = loadImage('PrzyciskDALEJ.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  imageMode(CENTER);
  soundPlacz.loop();

  const s = min(rawDalejImg.width, rawDalejImg.height);
  dalejImg = createImage(s, s);
  rawDalejImg.loadPixels();
  dalejImg.copy(
    rawDalejImg,
    (rawDalejImg.width - s) / 2,
    (rawDalejImg.height - s) / 2,
    s, s,
    0, 0, s, s
  );
  const maskG = createGraphics(s, s);
  maskG.noStroke();
  maskG.fill(255);
  maskG.circle(s / 2, s / 2, s);
  dalejImg.mask(maskG);
  btnR = BTN_DIAMETER / 2;
}

function draw() {
  background('#F8DDF5');

  if (scene === 0) {
    let centerX = width / 2;
    let centerY = height / 2;

    // Zarządzanie dźwiękami
    if (dzieckoSpokojne !== dzieckoSpokojnePrev) {
      if (dzieckoSpokojne) {
        if (soundPlacz.isPlaying()) soundPlacz.stop();
        if (!soundHappy.isPlaying()) soundHappy.loop();
      } else {
        if (soundHappy.isPlaying()) soundHappy.stop();
        if (!soundPlacz.isPlaying()) soundPlacz.loop();
      }
      dzieckoSpokojnePrev = dzieckoSpokojne;
    }

    // Obrazek dziecka
    imageMode(CENTER);
    let dzieckoScale = 3;
    let w = 236 * dzieckoScale;
    let h = 164 * dzieckoScale;
    image(dzieckoSpokojne ? dzieckoHappy : dzieckoPlacz, centerX, centerY, w, h);

    // Smoczek
    if (!dzieckoSpokojne) {
      imageMode(CORNER);
      image(smoczekImg, smoczekX, smoczekY, 120, 120);
      imageMode(CENTER);
    }

    // Sprawdzenie pozycji smoczka
    let smoczekCenterX = smoczekX + 60;
    if (!dzieckoSpokojne && abs(smoczekCenterX - centerX) < 20) {
      dzieckoSpokojne = true;
    }

    // Tekst
    textFont(futuraFont);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text(
      dzieckoSpokojne ? "Jesteś do tego stworzona!" : "Daj jej smoczka!",
      width / 2 + 30,
      centerY - 250
    );

    // Przycisk "DALEJ"
    if (dzieckoSpokojne) {
      btnX = width / 2 +25;
      btnY = height-80;
      const over = dist(mouseX, mouseY, btnX, btnY) < btnR;
      const d = over ? BTN_DIAMETER * HOVER_SCALE : BTN_DIAMETER;

      imageMode(CENTER);
      image(dalejImg, btnX, btnY, d, d);
      imageMode(CORNER);
    }
  }

  // Brokat
  for (let i = glitterParticles.length - 1; i >= 0; i--) {
    glitterParticles[i].update();
    glitterParticles[i].show();
    if (glitterParticles[i].finished()) {
      glitterParticles.splice(i, 1);
    }
  }

  // Kursor
  image(customCursor, mouseX, mouseY, 32, 32);
}

function mousePressed() {
  if (
    scene === 0 &&
    dist(mouseX, mouseY, smoczekX + 60, smoczekY + 60) < 60 &&
    !dzieckoSpokojne
  ) {
    dragging = true;
    offsetX = mouseX - smoczekX;
    offsetY = mouseY - smoczekY;
  }

  // Kliknięcie "DALEJ"
  if (
    dzieckoSpokojne &&
    scene === 0 &&
    dist(mouseX, mouseY, btnX, btnY) < btnR
  ) {
    if (!clickSound.isPlaying()) {
      clickSound.play();
    }
    // PRZENIESIENIE NA STRONĘ scena7
    window.location.href = "https://mp123-dot.github.io/scena7/";
  }

    // Brokat
  for (let i = glitterParticles.length - 1; i >= 0; i--) {
    glitterParticles[i].update();
    glitterParticles[i].show();
    if (glitterParticles[i].finished()) {
      glitterParticles.splice(i, 1);
    }
  }

  // Kursor
  image(customCursor, mouseX, mouseY, 32, 32);
}

function mousePressed() {
  if (
    scene === 0 &&
    dist(mouseX, mouseY, smoczekX + 60, smoczekY + 60) < 60 &&
    !dzieckoSpokojne
  ) {
    dragging = true;
    offsetX = mouseX - smoczekX;
    offsetY = mouseY - smoczekY;
  }
  
  if (
    dzieckoSpokojne &&
    scene === 0 &&
    dist(mouseX, mouseY, btnX, btnY) < btnR
  ) {
    if (!clickSound.isPlaying()) {
      clickSound.play();
    }
    // PRZENIESIENIE NA STRONĘ scena7
    window.location.href = "https://mp123-dot.github.io/scena7/";
  }

  // Brokat
  for (let i = 0; i < 18; i++) {
    glitterParticles.push(new Glitter(mouseX, mouseY));
  }
}
function mouseDragged() {
  if (dragging) {
    smoczekX = mouseX - offsetX;
    smoczekY = mouseY - offsetY;
  }
}

function mouseReleased() {
  dragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Glitter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
    this.life = 0;
    this.maxLife = random(20, 40);
    this.size = random(3, 7);
    this.color = color(
      random(180, 255),
      random(120, 200),
      random(200, 255),
      200
    );
  }

  update() {
    this.life++;
    this.x += cos(this.angle) * 1.5;
    this.y += sin(this.angle) * 1.5;
  }

  finished() {
    return this.life > this.maxLife;
  }
  
    show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}