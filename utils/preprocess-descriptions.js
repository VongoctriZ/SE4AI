const fs = require('fs');
const path = require('path');

// list of attributes for my customized web
const attributes = ["id","short_description", "description"];


const removeHTMLTags = (htmlString) => {
    // Define the tags to be removed
    const tagsToRemove = ['html', 'head', 'body'];

    // Loop through each tag to remove both start and end tags
    tagsToRemove.forEach(tag => {
        const startTagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
        const endTagRegex = new RegExp(`<\/${tag}>`, 'gi');
        htmlString = htmlString.replace(startTagRegex, '').replace(endTagRegex, '');
    });

    return htmlString;
};

const removeJunkSpaces = (html) => {
    // Remove leading and trailing white spaces
    html = html.trim();

    // Remove excess white spaces between tags
    html = html.replace(/\s{2,}/g, ' ');

    // Remove line breaks
    html = html.replace(/[\r\n]+/g, '');

    // Remove unnecessary spaces around tags
    html = html.replace(/>\s+</g, '><');

    return html;
};

const extractDesiredAttributes = (data, attributes) => {
    return data.map(item => {
        let newObject = {};
        attributes.forEach(attr => {
            if (item.hasOwnProperty(attr)) {
                let newAttr = attr;
                // Remove occurrences of "\\n" and "\\\""
                if (attr === "description" || attr === "short_description") {
                    newObject[newAttr] = removeJunkSpaces(removeHTMLTags(item[attr].replace(/\\n/g, "").replace(/\\\"/g, "'").replace(/\"/g,"")));
                } 
                else {
                    newObject[newAttr] = item[attr];
                }
            }
        });
        return newObject;
    }).filter(Boolean);
};




// Function to modify content of JSON files and convert them to JS files
const modifyAndRenameFiles = (dirPath) => {
    fs.readdirSync(dirPath).forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(dirPath, file);
            console.log(filePath);
            let content = JSON.parse(fs.readFileSync(filePath, 'utf8')); // Load JSON file content


            
            const extractedContent = extractDesiredAttributes(content, attributes);

            
            const variableName = path.parse(file).name; // Variable name based on filename
            const modifiedContent = `const ${variableName} = ${JSON.stringify(extractedContent, null, 2)};\n\nmodule.exports = ${variableName};`; // Modify content

            // Create subdirectories if necessary
            let subdirPath = dirPath;
            if (file.startsWith('comments')) {
            return;    
            }
            
            else if (file.startsWith('product')) {
                subdirPath = path.join(subdirPath, 'products');
                if (!fs.existsSync(subdirPath)) {
                    fs.mkdirSync(subdirPath);
                }
            }

            // rename from json to js
            const newFilePath = path.join(subdirPath, path.parse(file).name + '.js');
            fs.writeFileSync(newFilePath, modifiedContent); // Save modified content
            console.log(`File ${file} renamed to ${path.parse(file).name}.js and modified.`);
        }
    });
}

// Example usage
const dirPath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/new-data/raw';

modifyAndRenameFiles(dirPath);
