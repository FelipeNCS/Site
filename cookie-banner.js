document.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
        const bannerHtml = `
            <div id="cookie-banner" class="cookie-banner-overlay">
                <div class="cookie-banner-content">
                    <div class="cookie-text-wrapper">
                        <p class="cookie-desc">
                            Utilizamos cookies para melhorar sua experiência, manter o site seguro e entender o uso da plataforma. Ao continuar, você concorda com nossa Política de Cookies.
                        </p>
                    </div>
                    <div class="cookie-actions">
                        <a href="#" class="cookie-policy-link">Ver política</a>
                        <button id="cookie-accept-btn" class="cookie-accept">
                            Aceitar
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
    }
});
