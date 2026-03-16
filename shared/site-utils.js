(function (window) {
    function getBasePath() {
        const { hostname, pathname } = window.location;

        if (!hostname.endsWith('github.io')) {
            return '';
        }

        const segments = pathname.split('/').filter(Boolean);
        return segments.length > 0 ? `/${segments[0]}` : '';
    }

    async function fetchSeasonsData() {
        const basePath = getBasePath();
        const candidates = [
            `${basePath}/seasons-data.json`,
            './seasons-data.json',
            '../seasons-data.json'
        ];

        let lastError;

        for (const url of candidates) {
            try {
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) {
                    continue;
                }

                return await response.json();
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('Failed to fetch seasons-data.json');
    }

    function getLatestSeasonNumber(data) {
        const seasons = Array.isArray(data?.seasons) ? data.seasons : [];
        const seasonNumbers = seasons
            .map((season) => Number(season.number))
            .filter((number) => Number.isFinite(number));

        if (!seasonNumbers.length) {
            return null;
        }

        return Math.max(...seasonNumbers);
    }

    window.SiteUtils = {
        fetchSeasonsData,
        getBasePath,
        getLatestSeasonNumber
    };
})(window);
