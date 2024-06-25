# Weather Muse Application

The Weather Muse application is an innovative Angular project that combines weather forecasting with music recommendations. By entering a city name, users can receive current weather information along with a curated list of songs that match the weather mood.

## Features

- **Weather Information**: Displays current weather conditions including temperature, weather conditions, and an icon representation.
- **Music Recommendations**: Suggests music tracks based on the current weather conditions of the specified city.
- **User Input**: Allows users to enter the name of the city for which they want weather information and music recommendations.

## Technical Overview

This project is built using Angular and leverages various modules and services for its functionality:

- **Angular Components**: Utilizes Angular components for structuring the application's UI.
- **Reactive Forms**: Implements Angular's reactive forms for handling user input.
- **RxJS**: Uses RxJS for handling asynchronous operations and event management.
- **External APIs**: Integrates with external APIs for weather data and music recommendations.

### Key Angular Modules and Services

- `CommonModule` and `ReactiveFormsModule` for form handling and common Angular directives.
- `RouterOutlet` for routing within the application.
- `TracksService` for fetching music recommendations based on weather conditions.
- `Weather` and `Song` models for defining the structure of weather data and songs.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
        cd weather-muse
   ```
3. Install dependencies:
   ```bash
       npm install
   ```
4. Create a .env file in the root directory and add your API keys:
   ```bash
     SPOTIFY_ID=your_spotify_id
     SPOTIFY_SECRET=your_spotify_secret
     WEATHER_API=your_openweathermap_api_key
     GEMINI_API=your_google_generative_ai_key
   ```
5. Start the application:
   ```bash
    ng serve
   ```
6. Open your browser and navigate to http://localhost:4200.

## Usage
To use the Weather Muse application:

1. Enter the name of your current city in the input field.
2. Click the "Click Me" button to fetch the weather and music recommendations.
3. View the weather information displayed along with a list of recommended tracks.

## Built With
    Node.js - The runtime environment
    Express - The web application framework
    Angular - The front-end framework
    Spotify API - For fetching music recommendations
    OpenWeatherMap API - For fetching current weather data
    Google Generative AI - For AI-driven features

![Screenshot 2024-06-25 184907](https://github.com/OluwatodimuAdegoke/weatherMuse/assets/22406840/c29dc079-58fc-4c19-9e9e-2f376692758f)

License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments
OpenWeatherMap API for providing weather data.
Spotify API for music recommendations.
Angular team for the Angular framework.
