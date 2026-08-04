const fs = require('fs');
const b64 = fs.readFileSync('model_base64_clean.txt', 'utf8').trim();
let code = fs.readFileSync('HoloCart3D.jsx', 'utf8');

// The code currently has the corrupted base64 string, so let's match the corrupted string to replace it.
// We can use a regex to match the entire data URI inside useGLTF
code = code.replace(/useGLTF\(`data:application\/octet-stream;base64,([^`]+)`\)/g, "useGLTF(`data:application/octet-stream;base64," + b64 + "`)");

fs.writeFileSync('HoloCart3D.jsx', code);
