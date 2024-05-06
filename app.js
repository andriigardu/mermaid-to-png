document.addEventListener('DOMContentLoaded', function() {
    const renderButton = document.getElementById('renderButton');
    const copyButton = document.getElementById('copyButton');
    const inputArea = document.getElementById('mermaidInput');
    const outputDiv = document.getElementById('mermaidChart');

    mermaid.initialize({ startOnLoad: false });

    renderButton.addEventListener('click', function() {
        const input = inputArea.value;
        mermaid.render('generatedGraph', input, function(svgCode) {
            const svgWrapper = document.createElement('div');
            svgWrapper.innerHTML = svgCode;
            const svgElement = svgWrapper.firstChild;
            outputDiv.innerHTML = ''; // Clear previous outputs
            outputDiv.appendChild(svgElement);
            convertSVGToPNG(svgElement);
        });
    });

    function convertSVGToPNG(svgElement) {
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
        // Set canvas size to the size of the loaded image
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG data URL
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const pngImg = document.createElement('img'); // Create a new img element
            pngImg.src = url;
            document.getElementById('mermaidChart').innerHTML = ''; // Clear previous SVG
            document.getElementById('mermaidChart').appendChild(pngImg); // Append the new PNG image

            setupCopyButton(blob); // Enable the copy button with the PNG blob
        }, 'image/png');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
}
mermaid.render('generatedGraph', input, function(svgCode, bindFunctions) {
    const svgWrapper = document.createElement('div');
    svgWrapper.innerHTML = svgCode;
    const svgElement = svgWrapper.firstChild;
    document.getElementById('mermaidChart').innerHTML = ''; // Clear previous contents
    document.getElementById('mermaidChart').appendChild(svgElement); // Append SVG first
    convertSVGToPNG(svgElement); // Convert SVG to PNG
});

    function setupCopyButton(blob) {
    const copyButton = document.getElementById('copyButton');
    copyButton.style.display = 'block'; // Ensure the copy button is visible
    copyButton.onclick = function() {
        navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
            .then(() => alert('Copied to clipboard!'))
            .catch(err => alert('Error copying: ' + err));
    };
}
});
