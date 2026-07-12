#!/usr/bin/env node
/**
 * schön.kino site generator (zero dependencies).
 *
 * Reads data/seasons.json and generates one static page per season from
 * templates/season.html into _site/, alongside the static assets (root
 * redirect, archive, shared css/js, posters). Seasons marked "custom": true
 * (e.g. season 4 "SWIMMING") are copied verbatim from seasons/seasonN/.
 *
 * Usage: node build/build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_site');

const escapeHtml = (text) =>
    String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

function renderShort(short) {
    return `
                        <div class="short-film">
                          <span class="short-title">${escapeHtml(short.title)}</span><br>
                          <span class="short-director">${escapeHtml(short.credit)}</span>
                        </div>`;
}

function renderScheduleItem(item) {
    const parts = [`<strong>${escapeHtml(item.title)}</strong><br>`];

    if (item.credit) {
        parts.push(`                        <span class="director-info">${escapeHtml(item.credit)}</span>`);
    }
    if (item.alert) {
        parts.push(`                        <div class="alert">${escapeHtml(item.alert)}</div>`);
    }
    if (item.shorts) {
        parts.push(item.shorts.map(renderShort).join('\n'));
    }

    return `
                    <div class="schedule-item${item.past ? ' past' : ''}">
                      <div class="movie-date">${escapeHtml(item.date)}</div>
                      <div class="movie-info">
                        ${parts.join('\n').trimStart()}
                      </div>
                    </div>`;
}

function renderAboutContent(season) {
    // Seasons without a program (e.g. a single-event announcement where the
    // poster says it all) show just the blurb below the poster.
    const blurb = `                <p>${escapeHtml(season.blurb || '')}</p>`;
    if (!Array.isArray(season.program) || season.program.length === 0) {
        return blurb;
    }

    const items = season.program.map(renderScheduleItem).join('\n');
    return `${blurb}

                <p class="program-heading">Program</p>

                <div class="schedule">${items}
                </div>`;
}

function renderSeasonPage(template, site, season) {
    const number = season.number;
    const poster = season.poster || `poster-season${number}.jpg`;
    const seasonUrl = `${site.baseUrl}/seasons/season${number}/`;
    const metaDescription = season.metaDescription ||
        `A cozy living room cinema in Vienna showing carefully curated films. Join us every Wednesday at 19h30 for Season ${number}: ${season.theme}.`;

    // Optional page-background override (used by poster-only seasons that
    // want e.g. a white page instead of the default black).
    const styleOverride = season.background
        ? `\n    <style>\n        body, .main-content { background-color: ${season.background}; }\n    </style>`
        : '';

    return template
        .replaceAll('{{META_DESCRIPTION}}', escapeHtml(metaDescription))
        .replaceAll('{{SEASON_URL}}', seasonUrl)
        .replaceAll('{{OG_IMAGE}}', `${seasonUrl}images/${poster}`)
        .replaceAll('{{TITLE}}', escapeHtml(season.title || 'schön.kino'))
        .replaceAll('{{STYLE_OVERRIDE}}', styleOverride)
        .replaceAll('{{POSTER}}', poster)
        .replaceAll('{{SEASON_NUMBER}}', String(number))
        .replaceAll('{{ADDRESS}}', escapeHtml(season.address || site.defaults.address))
        .replaceAll('{{TIME}}', escapeHtml(season.time || site.defaults.time))
        .replaceAll('{{THEME}}', escapeHtml(season.theme))
        .replaceAll('{{ABOUT_CONTENT}}', renderAboutContent(season));
}

function copy(src, dest) {
    fs.cpSync(path.join(ROOT, src), path.join(OUT, dest ?? src), { recursive: true });
}

function main() {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/seasons.json'), 'utf8'));
    const template = fs.readFileSync(path.join(ROOT, 'templates/season.html'), 'utf8');

    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });

    // Static assets shared by the whole site.
    copy('index.html');
    copy('index.js');
    copy('.nojekyll');
    copy('shared');
    copy('archive');
    copy('data');

    for (const season of data.seasons) {
        const dir = `seasons/season${season.number}`;
        if (!fs.existsSync(path.join(ROOT, dir))) {
            throw new Error(`Missing folder ${dir} (poster images live there)`);
        }

        if (season.custom) {
            // Escape hatch: bespoke seasons ship their own html/css/js.
            copy(dir);
            console.log(`season ${season.number}: copied custom page`);
        } else {
            copy(`${dir}/images`);
            const html = renderSeasonPage(template, data.site, season);
            fs.writeFileSync(path.join(OUT, dir, 'index.html'), html);
            console.log(`season ${season.number}: generated`);
        }
    }

    console.log(`\nSite built into ${path.relative(ROOT, OUT)}/`);
}

main();
