const qs = require("qs");
require("dotenv").config();
const axios = require("axios");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const express = require("express");
var app = express();

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
    console.log(error);
  }
};

const iplocation = require("iplocation").default;

const getWeather = async () => {
  try {
    // Get the ip and the location of the current user
    let responseIp = await axios.get("https://api.ipify.org?format=json");
    // responseIp = await iplocation(responseIp.data.ip);
    responseIp = {
      latitude: "9.756882",
      longitude: "8.336738",
    };
    // Get the current weather
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${responseIp.latitude}&lon=${responseIp.longitude}&appid=${weather_api}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

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
  // console.log(result.response.text());
  return result.response.text();
};

const getAudioFeatures_Track = async (track_id) => {
  const access_token = await getAuth();

  const api_url = `https://api.spotify.com/v1/audio-features/${track_id}`;

  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getRecommendations = async (input) => {
  const access_token = await getAuth();

  const api_url = `https://api.spotify.com/v1/recommendations?`;
  const limit = 10;
  const data = JSON.parse(input);
  data["limit"] = limit;
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
    console.log(error);
  }
};

// getAudioFeatures_Track("07A0whlnYwfWfLQy4qh3Tq")
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));

const connectData = async () => {
  // Get the data from the weather API
  const weatherData = await getWeather();
  // Convert it to a string
  const jsonData =
    JSON.stringify(weatherData.weather) +
    JSON.stringify(weatherData.main) +
    JSON.stringify(weatherData.wind) +
    JSON.stringify(weatherData.rain);
  // Send it to Gemini and get the correct result
  const spotifyData = await changeWeatherToParam(jsonData);

  // Pass it to spotify and get the recommendations
  let tracks = [];
  await getRecommendations(spotifyData).then((data) => {
    data.tracks.forEach((track) => {
      tracks.push({
        title: track.name,
        artist_name: track.artists[0].name,
        image_url: track.album.images[0].url,
        song_uri: track.uri,
        song_url: track.external_urls.spotify,
      });
    });
  });

  return tracks;
};
// connectData();
app.get("/tracks", async (req, res) => {
  try {
    let value = await connectData();

    res.status(200).send(value);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});
// app.use(express.json());

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000...`);
});
