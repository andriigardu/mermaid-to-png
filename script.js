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
                    newImg.src = url;
                    document.getElementById('mermaidChart').appendChild(newImg);
                    copyToClipboard(blob);
                });
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }

        function copyToClipboard(blob) {
            try {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(function() {
                    // Show popup message
                    const message = document.getElementById('popupMessage');
                    message.style.display = 'block';
                    setTimeout(() => message.style.display = 'none', 2000); // Hide after 2 seconds
                }, function(err) {
                    console.error('Could not copy image: ', err);
                });
            } catch (error) {
                console.error('Failed to copy: ', error);
            }
        }
