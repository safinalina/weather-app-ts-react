import { FormEvent, useState } from "react";
import "./WeatherApp.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import { WeatherDataResponse } from "./WeatherData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { InfoDataResponse } from "./InfoData"

const iconByCode: Record<string, string> = {
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
};

const WeatherApp = () => {
  const api_key = "0226cb7b7d290af6382566f26b48403f";

  const [loading, setLoading] = useState(false);

  const [cityInput, setCityInput] = useState("");

  const [info, setInfo] = useState({
    humidity: 0,
    wind: 0,
    temperature: 0,
    location: "",
  });

  const [wicon, setIcon] = useState(clear_icon);

  const getData = async (cityInput: string) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${api_key}&units=metric`;
    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json() as Promise<WeatherDataResponse>;
      })
      .then((data) => {
        setInfo({
          ...info,
          humidity: data.main.humidity,
          wind: Math.floor(data.wind.speed),
          temperature: Math.floor(data.main.temp),
          location: data.name,
        });

        const code = data.weather[0].icon;
        const icon = iconByCode[code];

        if (icon) {
          setIcon(icon);
        }
      })
      .catch((error: Error) => {
        toast(`No results for "${cityInput}"`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        throw error;
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <h1>Loading...</h1>;

  const search = async () => {
    if (cityInput === "") {
      return;
    }

    getData(cityInput);
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search();
  };

  return (
    <div className="container">
      <div className="top-bar">
        <form className="commentForm" onSubmit={onFormSubmit}>
          <input
            type="text"
            className="cityInput"
            placeholder="Search"
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button
            type="submit"
            className="search-icon"
            // onClick={() => search()}
          >
            <img src={search_icon} alt="" />
          </button>
        </form>
      </div>
      <div className="weather-image">
        <img src={wicon} alt="" />
      </div>
      <div className="weather-temp">{info.temperature}°C</div>
      <div className="weather-location">{info.location}</div>
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="" className="icon" />
          <div className="data">
            <div className="humidity-percent">{info.humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="" className="icon" />
          <div className="data">
            <div className="wind-rate">{info.wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
