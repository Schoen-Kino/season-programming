document.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('redirect-status');
    const linkEl = document.getElementById('redirect-link');

    try {
        const data = await window.SiteUtils.fetchSeasonsData();
        const latestSeason = window.SiteUtils.getLatestSeasonNumber(data);

        if (!latestSeason) {
            throw new Error('No seasons found in seasons-data.json');
        }

        const basePath = window.SiteUtils.getBasePath();
        const targetUrl = `${basePath}/seasons/season${latestSeason}/`;

        statusEl.textContent = `Redirecting to Season ${latestSeason}...`;
        linkEl.href = targetUrl;
        linkEl.textContent = `Go to Season ${latestSeason}`;

        window.location.replace(targetUrl);
    } catch (error) {
        console.error('Redirect failed:', error);
        statusEl.textContent = 'Could not detect the current season automatically.';

        const basePath = window.SiteUtils?.getBasePath?.() || '';
        linkEl.href = `${basePath}/archive/`;
        linkEl.textContent = 'Open archive';
    }
});
