mermaid.initialize({ startOnLoad: false });

function generateChart() {
    const input = document.getElementById('mermaidInput').value;
    mermaid.mermaidAPI.render('mermaidChart', input, function(svgCode) {
        const svgElement = document.createElement('div');
        svgElement.innerHTML = svgCode;
        convertSVGToPNG(svgElement.firstChild);
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
        document.getElementById('mermaidOutput').innerHTML = `<img src="${pngImg}" />`;
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}
