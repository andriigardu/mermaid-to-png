mermaid.initialize({ startOnLoad: false });

function generateChart() {
    const input = document.getElementById('mermaidInput').value;
    // Use a hidden div to initially render the SVG
    mermaid.mermaidAPI.render('generatedMermaid', input, function(svgCode, bindFunctions) {
        document.getElementById('mermaidTempRender').innerHTML = svgCode;
        convertSVGToPNG(document.getElementById('generatedMermaid'));
    });
}

function convertSVGToPNG(svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const pngImg = canvas.toDataURL("image/png");
        const outputImg = document.createElement('img');
        outputImg.src = pngImg;
        document.getElementById('mermaidOutput').innerHTML = '';
        document.getElementById('mermaidOutput').appendChild(outputImg);
        copyImageToClipboard(pngImg);
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

function copyImageToClipboard(dataUrl) {
    const img = new Image();
    img.src = dataUrl;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(function() {
                console.log('Image copied to clipboard');
            }, function(error) {
                console.error('Error copying image: ', error);
            });
        });
    };
}
