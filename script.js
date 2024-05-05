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
                const newImg = document.createElement('img');
                const url = URL.createObjectURL(blob);
                newImg.onload = function() {
                    URL.revokeObjectURL(url); // Clean up memory
                };
                newImg.src = url;
                document.getElementById('mermaidChart').appendChild(newImg);
                copyToClipboard(blob);
            });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }

    function copyToClipboard(blob) {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(function() {
            // Show popup message
            alert('Copied to the clipboard!');
        }, function(err) {
            console.error('Could not copy image: ', err);
        });
    }

    document.querySelector('button').addEventListener('click', renderChart);
});
