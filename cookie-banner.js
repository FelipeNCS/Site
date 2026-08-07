document.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
        const bannerHtml = `
            <div id="cookie-banner" class="cookie-banner-overlay">
                <div class="cookie-banner-content">
                    <div class="cookie-text-wrapper">
                        <div class="cookie-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                                <path d="M8.5 8.5v.01"></path>
                                <path d="M16 15.5v.01"></path>
                                <path d="M12 12v.01"></path>
                                <path d="M11 17v.01"></path>
                                <path d="M7 14v.01"></path>
                            </svg>
                        </div>
                        <div class="cookie-text">
                            <h3 class="cookie-title">Nós usamos cookies</h3>
                            <p class="cookie-desc">
                                Este site utiliza cookies para oferecer a melhor experiência, analisar o uso do site e auxiliar em nossos esforços de marketing. Ao continuar navegando, você concorda com o uso de cookies.
                            </p>
                        </div>
                    </div>
                    <div class="cookie-actions">
                        <button id="cookie-close-btn" class="cookie-close" aria-label="Fechar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <button id="cookie-accept-btn" class="cookie-accept">
                            Aceitar Cookies
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', bannerHtml);

        document.getElementById('cookie-accept-btn').addEventListener('click', () => {
            localStorage.setItem('cookie-consent', 'accepted');
            document.getElementById('cookie-banner').style.display = 'none';
        });

        document.getElementById('cookie-close-btn').addEventListener('click', () => {
            document.getElementById('cookie-banner').style.display = 'none';
        });
    }
});
