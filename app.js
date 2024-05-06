document.addEventListener('DOMContentLoaded', function() {
    const renderButton = document.getElementById('renderButton');
    const copyButton = document.getElementById('copyButton');
    const inputArea = document.getElementById('mermaidInput');
    const outputDiv = document.getElementById('mermaidChart');
    const popupMessage = document.getElementById('popupMessage');

    mermaid.initialize({ startOnLoad: false });

    renderButton.onclick = function() {
        const input = inputArea.value;
        mermaid.render('graphDiv', input, function(svgCode) {
            const svgElement = document.createElement('div');
            svgElement.innerHTML = svgCode;
            const svg = svgElement.firstChild;
            outputDiv.innerHTML = '';
            outputDiv.appendChild(svg);
            convertSVGToPNG(svg);
        });
    };

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
