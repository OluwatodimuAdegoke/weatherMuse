const qs = require("qs");
require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const express = require("express");
const e = require("cors");
const app = express();
app.use(cors());
// Get the API keys
const client_id = process.env.SPOTIFY_ID;
const client_secret = process.env.SPOTIFY_SECRET;
const weather_api = process.env.WEATHER_API;
const gemini_api = process.env.GEMINI_API;

// Initiate Google Generative AI
const genAI = new GoogleGenerativeAI(gemini_api);
// AI Configurations
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    ' ["seed_genres","target_acousticness","target_energy","target_energy", "target_danceability"]seed_genresstringRequiredExample: seed_genres="classical,country"A comma-separated list of any genres in the set of available genre seeds. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. This should be a string separated by comma."genres": ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]Example: seed_genres=classical,countrytarget_acousticnessnumberFor each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request target_energy=0.6 and target_danceability=0.8. All target values will be weighed equally in ranking results.Range: 0 - 1target_valencenumberFor each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request target_energy=0.6 and target_danceability=0.8. All target values will be weighed equally in ranking results.Range: 0 - 1target_energynumberFor each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request target_energy=0.6 and target_danceability=0.8. All target values will be weighed equally in ranking results.Range: 0 - 1target_danceabilitynumberFor each of the tunable track attributes (below) a target value may be provided. Tracks with the attribute values nearest to the target values will be preferred. For example, you might request target_energy=0.6 and target_danceability=0.8. All target values will be weighed equally in ranking results.Range: 0 - 1Based on the Spotify API parameters listed above, turn the weather data provided into appropriate values that match each parameter in the array above only. Do not add any other parameter not listed in the array above, and only return the parameter with its values. No extra text or explanation. The result should be in .JSON() format. The values should be fixed based on the weather data provided. It should not just be 0 and 1 . Vary the values based on the weather data.',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");

const getAuth = async () => {
  try {
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });

    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    throw Error("Failed to get access token");
  }
};

// Get the weather data from the API
let weatherData = {};
const getWeather = async (address) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${address["city"]}&appid=${weather_api}`;
    if (
      weatherData[address["city"]] &&
      Date.now() - weatherData[address["city"]].time < 60000
    ) {
      return weatherData[address["city"]].data;
    } else {
      const response = await axios.get(url);
      weatherData[address["city"]] = {};
      weatherData[address["city"]].data = response.data;
      console.log(response.data);
      weatherData[address["city"]].time = Date.now();
      return response.data;
    }
  } catch (error) {
    if (error.response.data["cod"] === "404") {
      throw Error("City not found", error.response.data);
    } else if (error.response.data["cod"] === "401") {
      throw Error("Invalid API key", error.response.data);
    } else {
      throw Error("Failed to fetch weather data", error.response.data);
    }
  }
};

// Change the weather data to suitable spotify parameters with Google's Gemini
const changeWeatherToParam = async (input) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "[ { id: 500, main: 'Rain', description: 'light rain', icon: '10n' } ] {\n  temp: 293.09,\n  feels_like: 293.59,\n  temp_min: 293.09,\n  temp_max: 293.09,\n  pressure: 1015,\n  humidity: 94,\n  sea_level: 1015,\n  grnd_level: 920\n} { speed: 0.68, deg: 17, gust: 2.06 }",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: '{"seed_genres": "classical,ambient", "target_acousticness": 0.7, "target_energy": 0.2, "target_danceability": 0.1} \n',
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(input);
  return result.response.text();
};

// Get the recommendations from spotify's API
const getRecommendations = async (input, offset = 0) => {
  const access_token = await getAuth();

  const api_url = `https://api.spotify.com/v1/recommendations?`;
  const limit = 50;
  const data = JSON.parse(input);
  data["limit"] = limit;
  data["offset"] = offset;
  console.log(offset);
  try {
    const response = await axios.get(api_url, {
      params: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw Error("Failed to get recommendations", error.response.data);
  }
};

app.get("/tracks", async (req, res) => {
  try {
    if (!req.query.city) throw new Error("City is required");

    // Get the weather data
    const weatherData = await getWeather({ city: req.query.city });
    // Conver to string
    const jsonData =
      JSON.stringify(weatherData.weather) +
      JSON.stringify(weatherData.main) +
      JSON.stringify(weatherData.wind) +
      JSON.stringify(weatherData.rain);

    // Convert to suitable spotify parameters
    const spotifyData = await changeWeatherToParam(jsonData);

    // Get the recommendations
    let tracks = [];
    await getRecommendations(spotifyData).then((data) => {
      data.tracks.forEach((track) => {
        tracks.push({
          title: track.name,
          artist_name: track.artists[0].name,
          image_url: track.album.images[0].url,
          song_uri: track.preview_url,
          song_url: track.external_urls.spotify,
        });
      });
    });

    res.status(200).send(tracks);
  } catch (error) {
    console.log("Tracks", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/weather", async (req, res) => {
  try {
    console.log(req.query.city);
    if (!req.query.city) {
      throw new Error("City is required");
    }

    const value = await getWeather({ city: req.query.city });

    const weather = {
      city: value.name,
      country: value.sys.country,
      temperature: value.main.temp - 273.15, // Convert Kelvin to Celsius
      weather_main: value.weather[0].main,
      weather_description: value.weather[0].description,
      humidity: value.main.humidity,
      pressure: value.main.pressure,
      icon: value.weather[0].icon,
    };
    res.status(200).send(weather);
  } catch (error) {
    console.log("Weather", error.message);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000...`);
});
