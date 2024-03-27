#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

module.exports = function(context) {
    var settingsLine = 'settings.setUserAgentString("Android " + android.os.Build.VERSION.SDK);';
    var domStorageEnabledLine = 'settings.setDomStorageEnabled(true);';
    
    var targetFile = 'InAppBrowser.java';
    var targetPath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'java', 'org', 'apache', 'cordova', 'inappbrowser', targetFile);

    console.log('-- ✅ -- settingsLine: ' + settingsLine);
    console.log('-- ✅ -- targetPath: ' + targetPath);

    if (fs.existsSync(targetPath)) {
        var lines = fs.readFileSync(targetPath, 'utf8').split('\n');
        var foundIndex = lines.findIndex(line => line.includes(domStorageEnabledLine));

        if (foundIndex !== -1 && lines[foundIndex + 1].trim() !== settingsLine) {
            lines.splice(foundIndex + 1, 0, settingsLine);
            var updatedContents = lines.join('\n');
            fs.writeFileSync(targetPath, updatedContents, 'utf8');
            console.log('-- ✅ -- The settingsLine has been added after settings.setDomStorageEnabled(true).');

            // For verification purposes, print out a portion of the file around the insertion point
            var startPrintIndex = Math.max(foundIndex - 3, 0);
            var endPrintIndex = Math.min(foundIndex + 4, lines.length);
            console.log(lines.slice(startPrintIndex, endPrintIndex).join('\n'));
        } else if (foundIndex === -1) {
            console.log('-- ❌ -- The line settings.setDomStorageEnabled(true); was not found.');
        } else {
            console.log('-- ❌ -- The settingsLine is already present after settings.setDomStorageEnabled(true).');
        }
    } else {
        console.log(' -- ❌ -- InAppBrowser.java file not found.');
    }
};
