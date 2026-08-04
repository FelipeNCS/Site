const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('minecraft.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console);

const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole
});
dom.window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('[WINDOW ERROR]', msg, error);
    return false;
};

// Wait for scripts to execute
setTimeout(() => {
    const container = dom.window.document.getElementById('holo-container');
    console.log('Container present?', !!container);
    if (container) {
        console.log('Container innerHTML length:', container.innerHTML.length);
        console.log('Is Canvas inside?', container.innerHTML.includes('<canvas'));
    }
}, 2000);
