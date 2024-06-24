const fs = require('fs');
const path = require('path');

description = require("../data/raw/products/product_ao_nam_nguoi_lon");


function normalizeText(text) {
    // Remove multiple hyphens and special characters, but keep Vietnamese characters
    text = text.replace(/-{2,}/g, ' ')
        .replace(/\\{2,}/g, ' ')
        .replace(/\\n|\\r/g, ' ')
        .replace(/[^\x00-\x7F]+/g, (char) => char) // Keep non-ASCII characters
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim(); // Trim leading and trailing spaces

    // Ensure first character of sentences are capitalized
    text = text.split('. ').map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('. ');

    return text;
}

function normalizeProductDescriptions(product) {
    if (product.short_description) {
        product.short_description = normalizeText(product.short_description);
    }
    if (product.description) {
        product.description = normalizeText(product.description);
    }
    return product;
}

const normalizedProducts = description.map(normalizeProductDescriptions);
console.log(normalizedProducts);

// Define the output file path
const outputFilePath = path.join(__dirname, 'normalized_products.json');

// Write the normalized products to a JSON file
fs.writeFile(outputFilePath, JSON.stringify(normalizedProducts, null, 2), (err) => {
  if (err) {
    console.error('Error writing to file', err);
  } else {
    console.log('Normalized products successfully written to', outputFilePath);
  }
});