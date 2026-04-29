document.addEventListener("DOMContentLoaded", function() {
    // Spatial UI Transitions
    const zones = document.querySelectorAll('.market-zone');
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealZone = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    zones.forEach(zone => revealZone.observe(zone));

    // 3D Tilt for Collector's Corner
    const cards = document.querySelectorAll('.collector-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    console.log("Sentinel: Market Atmosphere Deployed. Night Watch Active.");
});
