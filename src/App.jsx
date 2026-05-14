import { useState } from "react";

export default function WeatherApp() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {

    if (!city) {
      setError("Please enter a city");
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );

      const data = await response.json();

      console.log(data);

      if (data.error) {
        setError(data.error.message);
        setWeather(null);
      } else {
        setWeather(data);
      }

    } catch (err) {

      setError("Something went wrong");

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300 flex items-center justify-center p-6">

      <div className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">

        <h1 className="text-5xl font-bold text-white text-center">
          Weather App
        </h1>

        <p className="text-center text-white mt-3 opacity-80">
          Real-time Weather with React + Docker + Jenkins
        </p>

        <div className="flex gap-4 mt-8">

          <input
            type="text"
            placeholder="Enter city..."
            className="flex-1 px-5 py-3 rounded-2xl outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            onClick={getWeather}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl"
          >
            Search
          </button>

        </div>

        {error && (
          <p className="text-red-200 mt-6 text-center font-semibold">
            {error}
          </p>
        )}

        {weather && (

          <div className="mt-10 bg-white rounded-3xl p-8 shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-4xl font-bold text-gray-800">
                  {weather.location.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {weather.current.condition.text}
                </p>

              </div>

              <img
                src={weather.current.condition.icon}
                alt="weather"
                className="w-20"
              />

            </div>

            <div className="mt-8 flex items-end gap-3">

              <span className="text-7xl font-bold text-gray-800">
                {weather.current.temp_c}°
              </span>

              <span className="text-xl text-gray-500 mb-2">
                Celsius
              </span>

            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">

              <div className="bg-slate-100 p-5 rounded-2xl text-center">

                <p className="text-2xl">💧</p>

                <p className="font-semibold mt-2">
                  Humidity
                </p>

                <p className="text-gray-600">
                  {weather.current.humidity}%
                </p>

              </div>

              <div className="bg-slate-100 p-5 rounded-2xl text-center">

                <p className="text-2xl">🌬️</p>

                <p className="font-semibold mt-2">
                  Wind
                </p>

                <p className="text-gray-600">
                  {weather.current.wind_kph} km/h
                </p>

              </div>

              <div className="bg-slate-100 p-5 rounded-2xl text-center">

                <p className="text-2xl">🌡️</p>

                <p className="font-semibold mt-2">
                  Feels Like
                </p>

                <p className="text-gray-600">
                  {weather.current.feelslike_c}°
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}