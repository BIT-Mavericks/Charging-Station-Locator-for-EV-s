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
![Home](image/Output/Screenshot%202026-04-15%20144053.png)

### Station Search
![Station Search](image/Output/Screenshot%202026-04-15%20152907.png)

### Route Planner
![Route Planner](image/Output/Screenshot%202026-04-15%20153323.png)

### Traffic Map
![Traffic Map](image/Output/Screenshot%202026-04-15%20153657.png)

### Features and Quick Guide
![Features](image/Output/Screenshot%202026-04-15%20152742.png)

## Run Locally

1. Clone the repository.
2. Open the project folder.
3. Run with any static server (or open `home.html` directly for basic UI testing).
4. Start from `home.html` and navigate to each module.

## Notes

- The current JavaScript files include API keys directly. For production, move keys to a secure backend or environment-based setup.
- Some pages use different visual styles; this is expected based on current implementation.

