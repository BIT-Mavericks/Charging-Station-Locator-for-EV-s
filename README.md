# EV Charging Station Locator

A simple web app to help EV users:
- find nearby charging stations,
- plan routes between two locations,
- and check live traffic layers on an interactive map.

## Features

- `Home`: quick intro, feature cards, and navigation.
- `Station Search`: search charging stations by location and distance radius.
- `Route Planner`: calculate route between start and destination with EV route summary.
- `Traffic Map`: view traffic incidents and traffic flow layers with incident details.

## Tech Stack

- HTML, CSS, JavaScript
- [TomTom Maps SDK for Web](https://developer.tomtom.com/maps-sdk-web)
- TomTom Search / Routing / Traffic services
- Bootstrap (used in traffic page UI)

## Project Structure

- `home.html` - landing page
- `ev_search.html`, `ev_search.js` - charging station search
- `ev_routing.html`, `ev_routing.js` - EV route planning
- `traffic.html`, `traffic.js`, `styles.css` - traffic dashboard
- `chargingAvailability.js`, `calculateLongDistanceEVRoute.js`, `ev_model.js` - EV helper logic
- `image/` - static images used by pages

## Screenshots

### Home
This is the landing page of the application.
It gives a quick overview of the platform and direct navigation to key modules.
Users can jump to station search or route planning in one click.
![Home](image/Output/Screenshot%202026-04-15%20144053.png)

### Station Search
This screen helps users find nearby EV charging stations.
The user enters a location and distance radius, then the map displays matching stations.
Each marker provides quick station details for easier decision making.
![Station Search](image/Output/Screenshot%202026-04-15%20152907.png)

### Route Planner
This page calculates a route between starting point and destination.
It shows the route path on map along with travel distance, time, and EV-related summary values.
The layout is designed for quick route checks before a trip.
![Route Planner](image/Output/Screenshot%202026-04-15%20153323.png)

### Traffic Map
This dashboard focuses on live traffic conditions.
Users can toggle traffic incidents and traffic flow layers to understand road status.
It also includes incident list details and a bounding-box option for focused analysis.
![Traffic Map](image/Output/Screenshot%202026-04-15%20153657.png)

### Features and Quick Guide
This section summarizes the three core modules of the project.
It gives a short guided flow for first-time users to understand how to use the app.
The cards and quick guide keep the experience simple and easy to follow.
![Features](image/Output/Screenshot%202026-04-15%20152742.png)

## Run Locally

1. Clone the repository.
2. Open the project folder.
3. Run with any static server (or open `home.html` directly for basic UI testing).
4. Start from `home.html` and navigate to each module.

## Notes

- The current JavaScript files include API keys directly. For production, move keys to a secure backend or environment-based setup.
- Some pages use different visual styles; this is expected based on current implementation.

