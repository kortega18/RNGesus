document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('rollDice');
    const bellCurveCanvas = document.getElementById('bellCurveCanvas');
    const jesusImage = document.getElementById('jesusImage');
    const ctx = bellCurveCanvas.getContext('2d');

    function resizeCanvas() {
        // Set canvas dimensions to fit container width
        bellCurveCanvas.width = bellCurveCanvas.parentElement.clientWidth;
        bellCurveCanvas.height = bellCurveCanvas.width * 0.75; // Maintain aspect ratio (4:3)
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    rollButton.addEventListener('click', () => {
        // Disable the button temporarily
        rollButton.style.pointerEvents = 'none';
        rollButton.style.opacity = '0';

        // Roll a d12 100 times
        const rolls = rollDice(100);

        // Draw the histogram and bell curve
        drawChart(rolls);

        // Wait 3 seconds before starting the fade effects
        setTimeout(() => {
            fadeOutCanvasAndFadeInImage();

            // After 10 seconds, fade the button back in and fade out the Jesus image
            setTimeout(() => {
                fadeInButtonAndFadeOutImage();
            }, 3000); // 3 seconds delay
        }, 3000); // 3 seconds delay
    });

    function rollDice(numberOfDice) {
        const rolls = [];
        for (let i = 0; i < numberOfDice; i++) {
            rolls.push(Math.floor(Math.random() * 12) + 1);
        }
        return rolls;
    }

    function drawChart(rolls) {
        const width = bellCurveCanvas.width;
        const height = bellCurveCanvas.height;
        const numberOfBars = 12; // For d12
        const barWidth = width / numberOfBars;
        const frequencies = Array(numberOfBars).fill(0);

        // Calculate frequencies
        rolls.forEach(roll => frequencies[roll - 1]++);

        const maxFrequency = Math.max(...frequencies);
        const softGreenColor = '#9CE2A1'; // Soft green color
        const axisColor = '#333'; // Color for axis labels
        const fontSize = '16px'; // Slightly larger font size for better readability

        // Clear the canvas
        ctx.clearRect(0, 0, width, height);

        // Draw the histogram of dice rolls (bars)
        frequencies.forEach((frequency, index) => {
            const barHeight = (frequency / maxFrequency) * (height / 2 - 30); // Leave space for labels
            ctx.fillStyle = softGreenColor;
            ctx.fillRect(index * barWidth, height / 2 - barHeight, barWidth, barHeight);
        });

        // Draw the x-axis labels
        ctx.fillStyle = axisColor;
        ctx.font = `${fontSize} Arial`;
        frequencies.forEach((_, index) => {
            const x = index * barWidth + barWidth / 2;
            ctx.fillText(index + 1, x - 8, height - 10); // -8 centers the text under the bar
        });

        // Draw the bell curve (on top of bars)
        const mean = (numberOfBars + 1) / 2; // Mean of d12
        const stdDev = numberOfBars / 6; // Approximate standard deviation

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
            const xNorm = (x - mean * (width / numberOfBars)) / (stdDev * (width / numberOfBars));
            const y = height / 2 * Math.exp(-0.5 * xNorm * xNorm);
            ctx.lineTo(x, height / 2 - y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#007bff'; // Blue color for the bell curve
        ctx.stroke();
    }

    function fadeOutCanvasAndFadeInImage() {
        // Fade out the canvas
        bellCurveCanvas.style.transition = `opacity 2s ease-in-out`;
        jesusImage.style.transition = `opacity 2s ease-in-out`;

        // Fade out the canvas
        bellCurveCanvas.style.opacity = '0';

        // Fade in the Jesus image
        setTimeout(() => {
            jesusImage.style.opacity = '1';
            jesusImage.style.display = 'block'; // Ensure image is displayed
        }, 0); // Start fading in immediately after fading out starts
    }

    function fadeInButtonAndFadeOutImage() {
        // Ensure the button is set to transition
        rollButton.style.transition = `opacity 2s ease-in-out`;

        // Fade in the button
        rollButton.style.opacity = '1';
        rollButton.style.pointerEvents = 'auto'; // Re-enable interaction

        // Fade out the Jesus image
        jesusImage.style.opacity = '0';

        // Hide the image after fade-out to prevent interaction
        setTimeout(() => {
            jesusImage.style.display = 'none';
        }, 2000); // Match the duration of the fade-out
    }
});
