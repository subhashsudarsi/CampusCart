const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

(async () => {
    try {
        const markdownPath = path.join(process.cwd(), 'SYSTEM_DESIGN.md');
        if (!fs.existsSync(markdownPath)) {
            console.error('SYSTEM_DESIGN.md not found');
            process.exit(1);
        }
        let markdown = fs.readFileSync(markdownPath, 'utf8');

        // Replace mermaid fenced blocks
        markdown = markdown.replace(/```mermaid([\s\S]*?)```/g, '<pre class="mermaid">$1</pre>');

        const content = marked(markdown);

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>System Design</title>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: true });
        window.mermaidInitialized = true;
    </script>
    <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
        pre.mermaid { background: transparent; border: none; }
        .mermaid svg { max-width: 100%; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;

        const tempHtmlPath = path.join(process.cwd(), 'temp_system_design.html');
        fs.writeFileSync(tempHtmlPath, html);

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto('file://' + tempHtmlPath, { waitUntil: 'networkidle0' });

        // Wait for mermaid to finish rendering
        await page.waitForFunction(() => {
            return window.mermaidInitialized && !document.querySelector('.mermaid[data-processed="false"]');
        }, { timeout: 30000 });

        console.log('Mermaid diagrams rendered.');

        await page.pdf({
            path: 'SYSTEM_DESIGN.pdf',
            format: 'A4',
            margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
            printBackground: true
        });

        await browser.close();
        fs.unlinkSync(tempHtmlPath);
        console.log('PDF exported successfully.');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
