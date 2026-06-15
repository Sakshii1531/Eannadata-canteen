const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to change "eAnnadata canteen " (with space) to "eAnnadata canteen"
      let newContent = content.replace(/eAnnadata canteen\s+(['"])/gi, 'eAnnadata canteen$1');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated ' + fullPath);
      }
    }
  }
}
replaceInDir('c:/Users/HP/Desktop/Eannadata-canteen/frontend/src');
