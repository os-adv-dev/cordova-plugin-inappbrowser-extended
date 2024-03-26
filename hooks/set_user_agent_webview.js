#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

module.exports = function(context) {
    var settingsLine = [
        ' settings.setUserAgentString("Android " + android.os.Build.VERSION.SDK);'
    ].join('\n');

    var targetFile = 'InAppBrowser.java';
    var targetPath = path.join(context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'java', 'org', 'apache', 'cordova', 'inappbrowser', targetFile);

    console.log('-- ✅ -- settingsLine: '+settingsLine);
    console.log('-- ✅ -- targetPath: '+targetPath);

    // Verificar se o arquivo existe
    if (fs.existsSync(targetPath)) {
        // Ler o arquivo como um array de linhas
        var lines = fs.readFileSync(targetPath, 'utf8').split('\n');

        // Verificar se a linha já existe para evitar duplicações
        if (lines[1511].trim() !== settingsLine) {
            // Inserir a settingsLine na linha 1512
            lines.splice(1511, 0, settingsLine);
            // Unir o array em uma string para salvar no arquivo
            var updatedContents = lines.join('\n');
            // Escrever o arquivo atualizado
            fs.writeFileSync(targetPath, updatedContents, 'utf8');
            console.log('-- ✅ -- The line of code has been added to InAppBrowser.java at line 1512.');

            // Imprimir o arquivo editado no console
            console.log('-- ✅ -- Edited InAppBrowser.java:');
        } else {
            console.log('-- ❌ -- The line of code is already present at line 1512.');
        }
    } else {
        console.log(' -- ❌ -- InAppBrowser.java file not found.');
    }
};