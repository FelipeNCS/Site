const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, 'minecraft.html'), 'utf-8');
const appJsContent = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf-8');
const bundleJsContent = fs.readFileSync(path.join(__dirname, 'dist', 'bundle.iife.js'), 'utf-8');

const dom = new JSDOM(htmlContent, {
  runScripts: "dangerously",
  resources: "usable",
  url: "file:///" + __dirname.replace(/\\/g, '/') + "/minecraft.html"
});

const window = dom.window;

// Polyfill for RequestAnimationFrame (used by R3F/Three.js)
window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Intercept console
const { VirtualConsole } = require('jsdom');
const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);
dom.virtualConsole = virtualConsole;

// Wait for DOM
window.document.addEventListener('DOMContentLoaded', () => {
  console.log('[+] DOM Loaded');

  // Inject App.js
  const script1 = window.document.createElement('script');
  script1.textContent = appJsContent;
  window.document.body.appendChild(script1);
  console.log('[+] app.js injected');

  // Inject Bundle
  const script2 = window.document.createElement('script');
  script2.textContent = bundleJsContent;
  window.document.body.appendChild(script2);
  console.log('[+] bundle.iife.js injected');

  setTimeout(() => {
    console.log('[+] Emptying Cart (triggering event)');
    window.cart = []; // Empty cart
    window.updateCartUI(); // This should trigger toggleHoloCart

    setTimeout(() => {
      console.log('[+] Checking #holo-container:');
      const holoContainer = window.document.getElementById('holo-container');
      console.log(holoContainer.innerHTML);
      process.exit(0);
    }, 1000);
  }, 1000);
});
