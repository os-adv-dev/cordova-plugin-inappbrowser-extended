#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

function getProjectName() {
    var config = fs.readFileSync('config.xml').toString();
    var parseString = require('xml2js').parseString;
    var name;
    parseString(config, function (err, result) {
        name = result.widget.name.toString();
        const r = /\B\s+|\s+\B/g;  //Removes trailing and leading spaces
        name = name.replace(r, '');
    });
    return name || null;
}

module.exports = function(context) {
    var projectName = getProjectName();
    var userAgentLine = 'self.webView.customUserAgent = @"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1";';
    var targetFile = 'CDVWKInAppBrowser.m';
    var targetPath = path.join(context.opts.projectRoot, 'platforms', 'ios', projectName, 'Plugins', 'cordova-plugin-inappbrowser', targetFile);

    console.log('-- ✅ -- userAgentLine: ' + userAgentLine);
    console.log('-- ✅ -- targetPath: ' + targetPath);

    if (fs.existsSync(targetPath)) {
        var lines = fs.readFileSync(targetPath, 'utf8').split('\n');
        var foundIndex = lines.findIndex(line => line.includes('self.webView.clearsContextBeforeDrawing = YES;')); // Find an appropriate place to insert the line

        if (foundIndex !== -1 && lines[foundIndex + 1].trim() !== userAgentLine) {
            lines.splice(foundIndex + 1, 0, userAgentLine);
            var updatedContents = lines.join('\n');
            fs.writeFileSync(targetPath, updatedContents, 'utf8');
            console.log('-- ✅ -- The userAgentLine has been added after self.webView.clearsContextBeforeDrawing = YES;');

            // For verification purposes, print out a portion of the file around the insertion point
            var startPrintIndex = Math.max(foundIndex - 3, 0);
            var endPrintIndex = Math.min(foundIndex + 4, lines.length);
            console.log(lines.slice(startPrintIndex, endPrintIndex).join('\n'));
        } else if (foundIndex === -1) {
            console.log('-- ❌ -- The line [self.view addSubview:self.webView]; was not found.');
        } else {
            console.log('-- ❌ -- The userAgentLine is already present.');
        }
    } else {
        console.log(' -- ❌ -- CDVWKInAppBrowser.m file not found.');
    }
};