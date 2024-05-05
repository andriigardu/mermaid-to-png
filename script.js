mermaid.initialize({ startOnLoad: false });

function generateChart() {
    const input = document.getElementById('mermaidInput').value;
    // Make sure the temporary rendering element is ready and empty
    const renderDiv = document.getElementById('mermaidTempRender');
    renderDiv.innerHTML = '';
    mermaid.mermaidAPI.render('generatedMermaid', input, (svgCode) => {
        renderDiv.innerHTML = svgCode;
        convertSVGToPNG(document.getElementById('generatedMermaid'));
    });
}

function convertSVGToPNG(svgElement) {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = svgElement.clientWidth;
    canvas.height = svgElement.clientHeight;
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const pngImg = canvas.toDataURL("image/png");
        document.getElementById('mermaidOutput').innerHTML = `<img src="${pngImg}" />`;
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}
