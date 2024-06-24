const fs = require('fs');
const path = require('path');

// list of attributes for my customized web
const product_attributes = ["id", "name", "price", "original_price", "discount", "rating_average", "thumbnail_url", "short_description", "description", "review_count", "all_time_quantity_sold", "inventory_status", "images"];

const product_attr_mapping = {
    "inventory_status": "available",
    "rating_average": "rating",
    "price": "new_price",
    "original_price": "old_price",
    "review_count": "review_counts"
}

const comment_attributes = ["product_id", "id", "rating", "created_by", "content", "images"];

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

const extractDesiredAttributes = (type, data, attributes, mapping, category) => {

    // console.log(attributes)

    return data.map(item => {

        // Skip items where "created_by" is not available or is null for comments data
        if ((type === 'comments') && (!item.hasOwnProperty("created_by") || item.created_by === null)) {
            return null; // Return null for skipped items
        }

        let newObject = {};
        attributes.forEach(attr => {
            if (item.hasOwnProperty(attr)) {
                let newAttr = mapping[attr] || attr; // Use new name if it exists, otherwise use the original
                // Special handling for "created_by" attribute
                if (newAttr === "created_by") {
                    console.log(item[newAttr]);

                    // Extract only "id" and "full_name" for "created_by"
                    newObject[newAttr] = {
                        id: item[attr].id,
                        full_name: item[attr].full_name,
                    };
                }
                else if (newAttr === "images") {
                    // Handle "images" attribute and exclude specified attributes
                    newObject[newAttr] = item[attr].map(image => {
                        const { is_gallery, label, position, ...filteredImage } = image;
                        return filteredImage;
                    });
                }
                else if (newAttr === "description" || newAttr === "short_description") {
                    newObject[newAttr] = removeJunkSpaces(removeHTMLTags(item[attr].replace(/\\n/g, "").replace(/\\\"/g, "'").replace(/\"/g, "")));
                }
                else if (newAttr === "name" || newAttr === "thumbnail_url" || newAttr === "available") {
                    newObject[newAttr] = removeJunkSpaces(item[attr].replace(/\"/g, ""));
                }

                else {
                    newObject[newAttr] = item[attr];
                }
            }

        });
        if (category) {
            newObject['category'] = category;
        }
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

            // Check if filename contains "nam" to add "category":"men"
            // Add more attributes: quan, ao
            let category = [];

            // Determine primary category based on filename
            if (file.includes('tre_em')) {
                category.push('kids');
            } else if (file.includes('nam')) {
                category.push('men');
            } else if (file.includes('nu')) {
                category.push('women');
            }

            // Add secondary categories based on filename
            if (file.includes('quan')) {
                category.push('pants');
            } else if (file.includes('ao')) {
                category.push('shirt');
            }

            const extractedContent = extractDesiredAttributes(file.startsWith('comments') ? 'comments' : 'products', content, file.startsWith('comments') ? comment_attributes : product_attributes, file.startsWith('comments') ? {} : product_attr_mapping, file.includes('product') ? category : null);

            // const extractedContent = extractDesiredAttributes(content, comment_attributes, {}, null);

            const variableName = path.parse(file).name; // Variable name based on filename
            const modifiedContent = `const ${variableName} = ${JSON.stringify(extractedContent, null, 2)};\n\nmodule.exports = ${variableName};`; // Modify content

            // Create subdirectories if necessary
            let subdirPath = dirPath;
            if (file.startsWith('comments')) {
                subdirPath = path.join(subdirPath, 'comments');
                if (!fs.existsSync(subdirPath)) {
                    fs.mkdirSync(subdirPath);
                }
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