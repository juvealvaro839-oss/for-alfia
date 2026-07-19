const matrix = document.getElementById("matrix"); 
const ctx = matrix.getContext("2d"); 
const heart = document.getElementById("heart"); 
const hctx = heart.getContext("2d"); 

let scene = 1; 
let fontSize = 20; 
let columns = 0; 
let drops = []; 

// Variabel untuk animasi bunga di halaman 2
let flowers = [];
let petals = [];
let textOpacity = 0;
let showText = false;

// Menginisialisasi ukuran canvas dan kolom matrix
function initMatrix(){ 
    matrix.width = window.innerWidth; 
    matrix.height = window.innerHeight; 
    heart.width = window.innerWidth; 
    heart.height = window.innerHeight; 
    
    columns = Math.floor(matrix.width / fontSize); 
    drops = []; 
    
    for(let i = 0; i < columns; i++){ 
        drops.push(-Math.random() * 100); 
    } 
} 

window.addEventListener("resize", () => {
    initMatrix();
    if (scene === 2 && flowerCanvas) {
        flowerCanvas.width = window.innerWidth;
        flowerCanvas.height = window.innerHeight;
    }
}); 
initMatrix(); 

const chars = ["I", "L", "O", "V", "E", "Y", "O", "U", "❤"]; 

// Menggambar efek hujan matrix
function drawMatrix(){ 
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; 
    ctx.fillRect(0, 0, matrix.width, matrix.height); 
    
    ctx.fillStyle = "#ff1493"; 
    ctx.font = fontSize + "px monospace"; 
    
    for(let i = 0; i < columns; i++){ 
        const txt = chars[Math.floor(Math.random() * chars.length)]; 
        ctx.fillText(txt, i * fontSize, drops[i]); 
        
        drops[i] += fontSize; 
        
        if(drops[i] > matrix.height){ 
            drops[i] = -Math.random() * 100; 
        } 
    } 
} 

// Menjalankan animasi utama Matrix
function animate(){ 
    if(scene === 1) {
        drawMatrix(); 
        requestAnimationFrame(animate); 
    }
} 
animate(); 

// ========================================== 
// BUTTON & TRANSISI SCENE (Halaman 1 -> Halaman 2)
// ========================================== 
const btn = document.getElementById("nextBtn"); 
const container = document.querySelector(".container"); 
const surprisePage = document.getElementById("surprise"); 
const flowerCanvas = document.getElementById("flowerCanvas"); 
const fctx = flowerCanvas.getContext("2d"); 
const music = document.getElementById("music"); 

if(btn && container) {
    btn.onclick = () => { 
        container.style.transition = "1s"; 
        container.style.opacity = "0"; 
        
        if (music) {
            music.play().catch(error => console.log("Musik tertunda oleh browser:", error));
        }
        
        setTimeout(() => { 
            container.style.display = "none"; 
            scene = 2; // Menghentikan animasi matrix
            
            if(surprisePage) {
                surprisePage.style.display = "block";
            }
            
            if(flowerCanvas) {
                flowerCanvas.style.display = "block"; 
                flowerCanvas.width = window.innerWidth;
                flowerCanvas.height = window.innerHeight;
                
                setTimeout(() => { showText = true; }, 1500);
                startBouquet(); 
            }
        }, 1000); 
    }; 
}

// ==========================================
// ANIMASI BUNGA MAWAR MEKAR & KELOPAK GUGUR
// ==========================================
function startBouquet() {
    // Membuat data kelopak bunga gugur
    for (let i = 0; i < 40; i++) {
        petals.push({
            x: Math.random() * flowerCanvas.width,
            y: Math.random() * -flowerCanvas.height,
            size: Math.random() * 8 + 8,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 2 - 1,
            angle: Math.random() * 360,
            spin: Math.random() * 2 - 1
        });
    }

    // Koordinat mawar tumbuh tepat di tengah layar
    flowers.push({
        x: flowerCanvas.width / 2,
        y: flowerCanvas.height / 2 - 50,
        currentRadius: 0,
        maxRadius: 70, 
        growthSpeed: 0.5
    });

    animateFlowerScene();
}

function drawPetal(c, x, y, size, angle) {
    c.save();
    c.translate(x, y);
    c.rotate((angle * Math.PI) / 180);
    c.fillStyle = "#ff2a75"; 
    
    c.beginPath();
    c.ellipse(0, 0, size, size * 1.5, 0, 0, 2 * Math.PI);
    c.fill();
    
    c.fillStyle = "#cc0044";
    c.beginPath();
    c.ellipse(0, 0, size * 0.6, size * 0.9, 0, 0, 2 * Math.PI);
    c.fill();
    
    c.restore();
}

function drawRose(c, flower) {
    if (flower.currentRadius < flower.maxRadius) {
        flower.currentRadius += flower.growthSpeed;
    }

    c.save();
    c.translate(flower.x, flower.y);

    let layerRadius = flower.currentRadius;
    let petalCount = 8;
    
    while (layerRadius > 5) {
        for (let i = 0; i < petalCount; i++) {
            let angle = (i * 360) / petalCount + (layerRadius * 2);
            let rad = (angle * Math.PI) / 180;
            let px = Math.cos(rad) * (layerRadius * 0.6);
            let py = Math.sin(rad) * (layerRadius * 0.6);
            
            drawPetal(c, px, py, layerRadius * 0.3, angle + 90);
        }
        layerRadius -= 12; 
        petalCount -= 1;   
    }
    
    c.fillStyle = "#800026";
    c.beginPath();
    c.arc(0, 0, 4, 0, 2 * Math.PI);
    c.fill();

    c.restore();
}

function animateFlowerScene() {
    if (scene !== 2) return; 

    fctx.clearRect(0, 0, flowerCanvas.width, flowerCanvas.height);

    flowers.forEach(flower => {
        drawRose(fctx, flower);
    });

    petals.forEach(petal => {
        drawPetal(fctx, petal.x, petal.y, petal.size, petal.angle);
        petal.y += petal.speedY;
        petal.x += petal.speedX;
        petal.angle += petal.spin;

        if (petal.y > flowerCanvas.height) {
            petal.y = -20;
            petal.x = Math.random() * flowerCanvas.width;
        }
    });

    // Menampilkan Teks Romantis di bawah mawar setelah mekar
    if (showText) {
        if (textOpacity < 1) textOpacity += 0.01; 
        
        fctx.save();
        fctx.fillStyle = `rgba(255, 20, 147, ${textOpacity})`; 
        fctx.textAlign = "center";
        
        fctx.font = "bold 28px Arial, sans-serif";
        fctx.fillText("Congratulations Alfia! ❤", flowerCanvas.width / 2, flowerCanvas.height / 2 + 130);
        
        fctx.font = "normal 18px Arial, sans-serif";
        fctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`; 
        fctx.fillText("Semoga hari-harimu selalu penuh dengan kebahagiaan dan sukses selalu apapun yang kamu impikan.", flowerCanvas.width / 2, flowerCanvas.height / 2 + 170);
        

        // 3. TAMPILKAN TEKS BY: ALVARO (Sudah diganti jadi Putih)
        fctx.font = "italic bold 16px 'Courier New', monospace";
        fctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`; // Menggunakan warna putih transparan
        fctx.fillText("By: Alvaro", flowerCanvas.width / 2, flowerCanvas.height / 2 + 210); 
        fctx.restore();
    }

    requestAnimationFrame(animateFlowerScene);
}
