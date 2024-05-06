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
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const newImg = document.createElement('img');
                newImg.src = url;
                outputDiv.appendChild(newImg); // Display the PNG
                setupCopyButton(blob); // Enable the copy button
            });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(svgStr));
    }

    function setupCopyButton(blob) {
        copyButton.style.display = 'block'; // Make sure the copy button is visible
        copyButton.onclick = function() {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                .then(() => alert('Copied to clipboard!'))
                .catch(error => console.error('Copy failed', error));
        };
    }
});
