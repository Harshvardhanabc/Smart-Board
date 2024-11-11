const canvas = document.getElementById('smartboard');
const ctx = canvas.getContext('2d');

// Set canvas size to match the window
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

let drawing = false;
let removing = false;
let color = '#000000';
let size = 2;
let currentText = "";
let image = null;

// Event listeners for mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousemove', erase);

// Start drawing
function startDrawing(event) {
    drawing = true;
    if (removing) {
        erase(event);
    } else {
        draw(event);
    }
}

// Stop drawing
function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

// Draw on the canvas
function draw(event) {
    if (!drawing) return;

    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
}

// Erase on the canvas
function erase(event) {
    if (!removing || !drawing) return;

    ctx.clearRect(event.clientX - canvas.offsetLeft - size / 2, event.clientY - canvas.offsetTop - size / 2, size * 2, size * 2);
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Remove the current drawing
function removeDrawing() {
    removing = true;
    document.body.style.cursor = "pointer";
}

// Write text on the canvas
function writeText(event) {
    currentText = event.target.value;
}

// Draw text on the canvas
function drawText(text) {
    ctx.font = "20px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, 50, 50); // For simplicity, placing text at (50, 50)
}

// New canvas
function newCanvas() {
    clearCanvas();
    image = null;
}

// Upload an image onto the canvas
function uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    input.click();
}

// Convert the canvas content to PDF and show print dialog
function convertToPDF() {
    const { jsPDF } = window.jspdf;  // Destructure the jsPDF object from the library

    const doc = new jsPDF();
    const imgData = canvas.toDataURL("image/png");

    // Add image to PDF (adjust dimensions as needed)
    doc.addImage(imgData, 'PNG', 10, 10, 180, 160);

    // Instead of saving the PDF, open the print dialog
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');  // Open the PDF in a new tab with a print dialog
}

// Change the color of the stroke
function changeColor(event) {
    color = event.target.value;
}

// Change the size of the stroke
function changeSize(event) {
    size = event.target.value;
}

// Draw text after user input
setInterval(function() {
    if (currentText) {
        drawText(currentText);
    }
}, 100);
