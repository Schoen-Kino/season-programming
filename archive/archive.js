document.addEventListener('DOMContentLoaded', function() {
    displaySeasons();
});

async function fetchSeasons() {
    try {
        if (window.SiteUtils && typeof window.SiteUtils.fetchSeasonsData === 'function') {
            return await window.SiteUtils.fetchSeasonsData();
        }

        const response = await fetch('../data/seasons.json');
        if (!response.ok) {
            throw new Error('Failed to fetch seasons data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading seasons data:', error);
        document.getElementById('seasons-grid').innerHTML = 
            '<div class="error">Could not load seasons. Please try again later.</div>';
        return { seasons: [] };
    }
}

function posterCandidates(season) {
    const seasonNum = season.number;
    const base = `../seasons/season${seasonNum}/images/`;
    const fromData = season.poster ? [`${base}${season.poster}`] : [];

    return [
        ...fromData,
        `${base}poster-season${seasonNum}.jpg`,
        `${base}poster-season${seasonNum}.png`,
        `${base}poster-season${seasonNum}.jpeg`,
        `${base}poster-season${seasonNum}.webp`,
        `${base}Poster.jpg`,
        `${base}Poster.png`,
        `${base}social-preview.png`
    ];
}

function setImageWithFallback(image, candidates, index = 0) {
    if (index >= candidates.length) {
        image.style.display = 'none';
        return;
    }

    image.onerror = () => setImageWithFallback(image, candidates, index + 1);
    image.src = candidates[index];
}

async function displaySeasons() {
    try {
        const data = await fetchSeasons();
        const seasons = data.seasons || [];
        
        const grid = document.getElementById('seasons-grid');
        grid.innerHTML = '';
        
        // Sort seasons in descending order (newest first)
        const sortedSeasons = [...seasons].sort((a, b) => b.number - a.number);
        
        sortedSeasons.forEach(season => {
            const card = document.createElement('div');
            card.className = 'season-card';
            
            const seasonNum = season.number;
            
            card.innerHTML = `
                <a href="../seasons/season${seasonNum}/">
                    <div class="card-image">
                        <img alt="Season ${seasonNum} Poster">
                    </div>
                    <div class="card-content">
                        <div class="season-number">Season ${seasonNum}</div>
                        <div class="season-theme">${season.theme || ''}</div>
                    </div>
                </a>
            `;

            const image = card.querySelector('img');
            setImageWithFallback(image, posterCandidates(season));
            
            grid.appendChild(card);
        });
        
        // If no seasons found
        if (sortedSeasons.length === 0) {
            grid.innerHTML = '<div class="loading">No seasons found.</div>';
        }
    } catch (error) {
        console.error('Error displaying seasons:', error);
        document.getElementById('seasons-grid').innerHTML = 
            `<div class="error">Error loading seasons: ${error.message}</div>`;
    }
}
