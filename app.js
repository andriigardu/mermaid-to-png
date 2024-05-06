document.addEventListener('DOMContentLoaded', function() {
    const renderButton = document.getElementById('renderButton');
    const copyButton = document.getElementById('copyButton');
    const inputArea = document.getElementById('mermaidInput');
    const outputDiv = document.getElementById('mermaidChart');
    const popupMessage = document.getElementById('popupMessage');

    mermaid.initialize({ startOnLoad: false });

   renderButton.addEventListener('click', function() {
    const input = document.getElementById('mermaidInput').value;
    if (!input.trim()) {
        alert("Please enter some Mermaid code.");
        return;
    }
    mermaid.render('generatedGraph', input, function(svgCode, bindFunctions) {
        const svgWrapper = document.createElement('div');
        svgWrapper.innerHTML = svgCode;
        const svgElement = svgWrapper.firstChild;
        if (svgElement) {
            const outputDiv = document.getElementById('mermaidChart');
            outputDiv.innerHTML = ''; // Clear previous outputs
            outputDiv.appendChild(svgElement);
        } else {
            console.error("No SVG was generated.");
            alert("Failed to generate SVG. Please check your Mermaid syntax.");
        }
    });
});

    function convertSVGToPNG(svg) {
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
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
                outputDiv.appendChild(newImg);
                setupCopyButton(blob);
            });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(svgStr));
    }

    function setupCopyButton(blob) {
        copyButton.style.display = 'block';
        copyButton.onclick = function() {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(
                () => displayPopup('Copied to clipboard!'),
                error => displayPopup('Copy failed: ' + error)
            );
        };
    }

    function displayPopup(message) {
        popupMessage.textContent = message;
        popupMessage.style.display = 'block';
        setTimeout(() => popupMessage.style.display = 'none', 2000);
    }
});
