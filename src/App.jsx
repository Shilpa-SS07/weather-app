import { useEffect, useState } from "react";
import Particles from "react-tsparticles";

export default function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [time, setTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // SEARCH HISTORY

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("cities")) || []
  );

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // LIVE CLOCK

  useEffect(() => {

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // GET WEATHER BY CITY

  const getWeather = async (searchCity = city) => {

    if (!searchCity) {
      setError("Please enter a city");
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      if (response.ok) {

        setWeather(data);

        // SAVE SEARCH HISTORY

        const updatedHistory = [
          searchCity,
          ...history.filter((item) => item !== searchCity)
        ].slice(0, 5);

        setHistory(updatedHistory);

        localStorage.setItem(
          "cities",
          JSON.stringify(updatedHistory)
        );

      } else {

        setError(data.message || "City not found");
        setWeather(null);

      }

    } catch (err) {

      console.log(err);

      setError("Something went wrong");
      setWeather(null);

    }

  };

  // GET WEATHER BY LOCATION

  const getLocationWeather = () => {

    if (!navigator.geolocation) {

      setError("Geolocation not supported");

      return;

    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );

          const data = await response.json();

          if (response.ok) {

            setWeather(data);
            setError("");

          } else {

            setError(data.message);

          }

        } catch (err) {

          console.log(err);

          setError("Failed to fetch location weather");

        }

      },

      (error) => {

        console.log(error);

        setError(error.message);

      }

    );

  };

  // WEATHER TYPE

  const weatherMain = weather?.list[0]?.weather[0]?.main;

  // WEATHER ALERTS

  const getWeatherAlert = () => {

    if (!weather) return null;

    const temp = weather.list[0].main.temp;
    const condition = weather.list[0].weather[0].main;

    if (condition === "Thunderstorm") {
      return {
        text: "⛈ Thunderstorm Warning",
        style: "bg-red-100 border-red-400 text-red-700"
      };
    }

    if (condition === "Rain") {
      return {
        text: "🌧 Heavy Rain Alert",
        style: "bg-red-100 border-red-400 text-red-700"
      };
    }

    if (condition === "Snow") {
      return {
        text: "❄️ Snow Alert",
        style: "bg-blue-100 border-blue-400 text-blue-700"
      };
    }

    if (temp >= 40) {
      return {
        text: "☀️ Heatwave Alert",
        style: "bg-yellow-100 border-yellow-400 text-yellow-700"
      };
    }

    return {
      text: "✅ Weather Conditions Normal",
      style: "bg-green-100 border-green-400 text-green-700"
    };

  };

  const alert = getWeatherAlert();

  // AI WEATHER ADVICE

  const getAdvice = () => {

    if (!weather) return "";

    const temp = weather.list[0].main.temp;
    const condition = weather.list[0].weather[0].main;

    if (condition === "Rain") {
      return "🌂 Carry an umbrella today.";
    }

    if (condition === "Thunderstorm") {
      return "⚡ Stay indoors if possible.";
    }

    if (temp > 35) {
      return "🥵 Drink more water today.";
    }

    if (temp < 10) {
      return "🧥 Wear warm clothes.";
    }

    return "😎 Weather looks great today.";

  };

  // DYNAMIC BACKGROUND

  const hour = new Date().getHours();

  const backgroundClass =
    hour < 6
      ? "from-black via-indigo-900 to-gray-900"
      : hour < 12
      ? "from-yellow-200 via-blue-300 to-sky-500"
      : hour < 18
      ? "from-orange-300 via-pink-400 to-purple-500"
      : "from-indigo-900 via-black to-gray-900";

  return (

    <div className={`min-h-screen overflow-hidden relative bg-gradient-to-br ${backgroundClass} flex items-center justify-center p-6 transition-all duration-700`}>

      {/* NIGHT STARS */}

      {weather?.list[0]?.weather[0]?.icon.includes("n") && (

        <Particles
          options={{
            particles: {
              number: {
                value: 80,
              },
              size: {
                value: 2,
              },
              move: {
                enable: true,
                speed: 0.3,
              },
              opacity: {
                value: 0.6,
              },
            },
          }}
          className="absolute inset-0"
        />

      )}

      {/* MAIN CARD */}

      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10">

        {/* TITLE */}

        <h1 className="text-5xl font-bold text-white text-center">
          Weather Dashboard
        </h1>

        <p className="text-center text-white mt-3 opacity-80">
          React + Docker + Jenkins
        </p>

        {/* LIVE CLOCK */}

        <h2 className="text-center text-white text-2xl mt-5 font-semibold">

          {time.toLocaleTimeString()}

        </h2>

        {/* SEARCH */}

        <div className="flex flex-col md:flex-row gap-4 mt-8">

          <input
            type="text"
            placeholder="Enter city..."
            className="flex-1 px-5 py-3 rounded-2xl outline-none bg-white/80"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            onClick={() => getWeather()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition"
          >
            Search
          </button>

          <button
            onClick={getLocationWeather}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl transition"
          >
            📍 My Location
          </button>

        </div>

        {/* SEARCH HISTORY */}

        {history.length > 0 && (

          <div className="mt-5 flex flex-wrap gap-3">

            {history.map((item, index) => (

              <button
                key={index}
                onClick={() => {
                  setCity(item);
                  getWeather(item);
                }}
                className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl transition"
              >
                {item}
              </button>

            ))}

          </div>

        )}

        {/* ERROR */}

        {error && (

          <p className="text-red-200 mt-6 text-center font-semibold">
            {error}
          </p>

        )}

        {/* WEATHER */}

        {weather && (

          <div className="mt-10 bg-white rounded-3xl p-8 shadow-xl">

            {/* TOP SECTION */}

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              <div>

                <h2 className="text-4xl font-bold text-gray-800">
                  {weather.city.name}
                </h2>

                <p className="text-gray-500 mt-2 capitalize">
                  {weather.list[0].weather[0].description}
                </p>

                {/* DATE & TIME */}

                <p className="text-gray-500 mt-2">

                  {new Date(
                    Date.now() + weather.city.timezone * 1000
                  ).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}

                </p>

                {/* ALERT */}

                <div
                  className={`mt-5 border px-4 py-3 rounded-2xl font-semibold animate-pulse ${alert.style}`}
                >

                  {alert.text}

                </div>

                {/* AI ADVICE */}

                <div className="mt-4 bg-slate-100 p-4 rounded-2xl text-gray-700 font-medium">
                  {getAdvice()}
                </div>

              </div>

              {/* WEATHER ICON */}

              <img
                src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
                alt="weather"
                className="w-32 animate-bounce"
              />

            </div>

            {/* TEMPERATURE */}

            <div className="mt-8 flex items-end gap-3 justify-center md:justify-start">

              <span className="text-7xl font-bold text-gray-800">
                {Math.round(weather.list[0].main.temp)}°
              </span>

              <span className="text-xl text-gray-500 mb-2">
                Celsius
              </span>

            </div>

            {/* WEATHER INFO */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

              <div className="bg-slate-100 p-5 rounded-2xl text-center hover:scale-105 transition">

                <p className="text-2xl">💧</p>

                <p className="font-semibold mt-2">
                  Humidity
                </p>

                <p className="text-gray-600">
                  {weather.list[0].main.humidity}%
                </p>

              </div>

              <div className="bg-slate-100 p-5 rounded-2xl text-center hover:scale-105 transition">

                <p className="text-2xl">🌬️</p>

                <p className="font-semibold mt-2">
                  Wind
                </p>

                <p className="text-gray-600">
                  {weather.list[0].wind.speed} km/h
                </p>

              </div>

              <div className="bg-slate-100 p-5 rounded-2xl text-center hover:scale-105 transition">

                <p className="text-2xl">🌡️</p>

                <p className="font-semibold mt-2">
                  Feels Like
                </p>

                <p className="text-gray-600">
                  {Math.round(weather.list[0].main.feels_like)}°
                </p>

              </div>

            </div>

            {/* SUNRISE SUNSET */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

              <div className="bg-gradient-to-r from-yellow-200 via-orange-300 to-pink-400 p-6 rounded-3xl shadow-lg hover:scale-105 transition">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-2xl font-bold text-white">
                      🌅 Sunrise
                    </h3>

                    <p className="text-white text-lg mt-2">

                      {new Date(
                        weather.city.sunrise * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                      })}

                    </p>

                  </div>

                  <div className="text-6xl animate-pulse">
                    ☀️
                  </div>

                </div>

              </div>

              <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-black p-6 rounded-3xl shadow-lg hover:scale-105 transition">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-2xl font-bold text-white">
                      🌇 Sunset
                    </h3>

                    <p className="text-white text-lg mt-2">

                      {new Date(
                        weather.city.sunset * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                      })}

                    </p>

                  </div>

                  <div className="text-6xl animate-bounce">
                    🌙
                  </div>

                </div>

              </div>

            </div>

            {/* 5 DAY FORECAST */}

            <h2 className="text-3xl font-bold text-gray-800 mt-12 text-center">
              5-Day Forecast
            </h2>

            <div className="flex flex-wrap gap-5 justify-center mt-8">

              {weather.list
                .filter((item, index) => index % 8 === 0)
                .slice(0, 5)
                .map((item, index) => (

                  <div
                    key={index}
                    onClick={() => setSelectedDay(item.dt_txt)}
                    className="bg-blue-100 rounded-2xl p-5 w-40 text-center shadow-md hover:scale-105 hover:rotate-1 transition duration-300 cursor-pointer"
                  >

                    <h3 className="font-bold text-lg">

                      {new Date(item.dt_txt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      )}

                    </h3>

                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="forecast"
                      className="mx-auto"
                    />

                    <p className="text-2xl font-bold">
                      {Math.round(item.main.temp)}°C
                    </p>

                    <p className="text-gray-600 text-sm mt-1">
                      {item.weather[0].main}
                    </p>

                  </div>

                ))}

            </div>

            {/* DETAILED FORECAST */}

            {selectedDay && (

              <div className="mt-12">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                  Full Day Weather Stats
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {weather.list
                    .filter((item) =>
                      item.dt_txt.startsWith(selectedDay.split(" ")[0])
                    )
                    .map((item, index) => (

                      <div
                        key={index}
                        className="bg-white shadow-lg rounded-2xl p-5 hover:scale-105 transition"
                      >

                        <h3 className="text-xl font-bold text-gray-800">

                          {new Date(item.dt_txt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )}

                        </h3>

                        <img
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                          alt="weather"
                          className="w-20 mx-auto"
                        />

                        <p className="text-3xl font-bold text-center">
                          {Math.round(item.main.temp)}°C
                        </p>

                        <p className="text-center text-gray-600 capitalize">
                          {item.weather[0].description}
                        </p>

                        <div className="mt-4 space-y-2 text-gray-700">

                          <p>💧 Humidity: {item.main.humidity}%</p>

                          <p>🌬 Wind: {item.wind.speed} km/h</p>

                          <p>🌡 Feels Like: {Math.round(item.main.feels_like)}°</p>

                          <p>🌧 Rain Chance: {Math.round(item.pop * 100)}%</p>

                          <p>🔽 Pressure: {item.main.pressure} hPa</p>

                        </div>

                      </div>

                    ))}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}