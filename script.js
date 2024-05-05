document.addEventListener('DOMContentLoaded', function() {
    mermaid.initialize({ startOnLoad: false });

    function renderChart() {
        const input = document.getElementById('mermaidInput').value;
        mermaid.render('graphDiv', input, function(svgCode) {
            const svgElement = document.createElement('div');
            svgElement.innerHTML = svgCode;
            document.getElementById('mermaidChart').innerHTML = '';
            document.getElementById('mermaidChart').appendChild(svgElement.firstChild);
            convertSVGToPNG(svgElement.firstChild);
        });
    }

    function convertSVGToPNG(svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgSize = svgElement.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;

        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const newImg = document.createElement('img');
                newImg.src = url;
                document.getElementById('mermaidChart').appendChild(newImg);
                setupCopyButton(blob);
            }, 'image/png');
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }

    function setupCopyButton(blob) {
        const copyButton = document.getElementById('copyButton');
        copyButton.style.display = 'block';
        copyButton.onclick = function() {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(function() {
                displayPopup('Copied to clipboard!');
            }, function(error) {
                displayPopup('Failed to copy: ' + error);
            });
        };
    }

    function displayPopup(message) {
        const popupMessage = document.getElementById('popupMessage');
        popupMessage.textContent = message;
        popupMessage.style.display = 'block';
        setTimeout(() => popupMessage.style.display = 'none', 2000);
    }

    document.querySelector('button').addEventListener('click', renderChart);
});
