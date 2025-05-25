const fs = require("fs");

// Parse data from Content-Website.txt
function parseDataFile() {
    const content = fs.readFileSync("Content-Website.txt", "utf8");
    const lines = content.split("\n");
    const dataMap = {};

    lines.forEach(line => {
        if (line.trim().startsWith("#") || line.trim() === "" || !line.includes(" = ")) {
            return;
        }

        const [key, ...valueParts] = line.split(" = ");
        const value = valueParts.join(" = ");
        dataMap[key.trim()] = value.trim();
    });

    return dataMap;
}

// Replace tokens in content
function replaceTokens(content, dataMap) {
    let result = content;

    // Replace all tokens
    result = result.replace(/\{([^}]+)\}/g, (match, tokenName) => {
        if (dataMap[tokenName]) {
            console.log(`✅ Replaced: ${tokenName}`);
            return dataMap[tokenName];
        } else {
            console.log(`⚠️  Token not found: ${tokenName}`);
            return match;
        }
    });

    return result;
}

// Process HTML files
function processFiles() {
    const dataMap = parseDataFile();
    console.log(`📊 Loaded ${Object.keys(dataMap).length} data entries\n`);

    const htmlFiles = [
        "index.html",
        "about.html",
        "contact.html",
        "menu.html",
        "photos.html",
        "services.html",
        "suggestion.html"
    ];

    htmlFiles.forEach(filename => {
        if (fs.existsSync(filename)) {
            console.log(`\n📄 Processing: ${filename}`);

            const content = fs.readFileSync(filename, "utf8");
            const processedContent = replaceTokens(content, dataMap);

            // // Create backup
            // fs.writeFileSync(`${filename}.backup`, content);

            // Write processed file
            fs.writeFileSync(filename, processedContent);

            console.log(`✅ Completed: ${filename}`);
        } else {
            console.log(`⚠️  File not found: ${filename}`);
        }
    });

    console.log("\n🎉 All files processed!");
}

// Run the script
processFiles();
