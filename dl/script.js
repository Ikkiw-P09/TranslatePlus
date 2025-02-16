document.addEventListener('DOMContentLoaded', () => {
    const downloadBlocks = document.querySelectorAll('.download-block');

    downloadBlocks.forEach(block => {
        block.addEventListener('mousemove', (e) => {
            const rect = block.getBoundingClientRect();
            const x = e.clientX - rect.left;

            const xPercent = x / block.offsetWidth * 100;

            block.style.backgroundPosition = `${xPercent}% center`;
        });

        block.addEventListener('mouseleave', () => {
            block.style.backgroundPosition = '0 center';
        });
    });
});