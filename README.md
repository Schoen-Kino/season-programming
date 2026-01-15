# schön.kino Season Programming

![Deploy Status](https://github.com/Schon-Kino/season-programming/actions/workflows/deploy.yml/badge.svg)

## About schön.kino

schön.kino is a living space cinema hosted in Vienna, featuring carefully curated film screenings every Thursday at 19h30. Each season follows a specific theme and presents a selection of films that explore different aspects of that theme.

## Website Overview

This repository hosts the website for schön.kino's seasonal programming. The site provides information about current and past screening seasons, including film schedules, descriptions, and themes.

## Technical Details


### Workflows

#### 1. Create New Season Workflow

The `create-new-season.yml` workflow allows you to create a new season through the GitHub UI:

1. Go to the Actions tab in the repository
2. Select the "Create New Season" workflow
3. Enter the theme for the new season
4. Run the workflow

This will:
- Create a new season directory with the next sequential number
- Copy the template files into this directory
- Update placeholders with the season number and theme
- Add the new season to the `seasons-data.json` file

#### 2. Deploy to GitHub Pages Workflow

The `deploy.yml` workflow handles deployment to GitHub Pages:

1. Finds the latest season number
2. Creates a site structure with:
   - Latest season content at the root
   - Archive page with access to all seasons
   - All seasons in the archive/seasons directory
3. Uploads and deploys the site to GitHub Pages

This workflow runs automatically on pushes to main or can be triggered manually.

## Navigation

- From any season page, click the "Season Archive" button in the top right to view all seasons
- From the archive, click on any season card to view that season's details
- Use the "Current Season" button in the archive to return to the latest season

## Customizing a Season

After creating a new season:

1. Replace the placeholder content in `seasons/seasonX/index.html` with actual program details
2. Update the `seasons/seasonX/images/poster-seasonX.jpg` file with the season poster
4. Modify styles in `seasons/seasonX/styles.css` if needed for season-specific styling
5. Update `index.html` with the correct season (This is not done automatically)
6. Run deployment action
