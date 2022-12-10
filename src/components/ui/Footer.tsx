import openMeteo from "../../svgs/open-meteo.svg";
import amChart from "../../svgs/amchart.svg";
import googlemapsicon from "../../svgs/google_maps-icon.svg";
import typsecripticon from "../../svgs/type-script.png";
import tailwind from "../../svgs/tailwind-css-icon.svg";

export default function Footer() {
  return (
    <div className="h-[5vh] flex items-center gap-3 justify-center ">
      <div className="">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://reactjs.org/"
        >
          <img
            className="h-[4vh] transition ease-in-out delay-50 hover:-translate-y-2 hover:scale-150 duration-300"
            src="/logo192.png"
            alt="React"
          />
        </a>
      </div>
      <div className="">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.typescriptlang.org/"
        >
          <img
            className="h-[4vh] transition ease-in-out delay-50 hover:-translate-y-2 hover:scale-150 duration-300"
            src={typsecripticon}
            alt="React"
          />
        </a>
      </div>
      <div className="">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://react-google-maps-api-docs.netlify.app/"
        >
          <img
            className="h-[4vh] transition ease-in-out delay-50 hover:-translate-y-2 hover:scale-150 duration-300"
            src={googlemapsicon}
            alt="React"
          />
        </a>
      </div>
      <div className="">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://open-meteo.com/en"
        >
          <img
            className="h-[4vh] transition ease-in-out delay-50 hover:-translate-y-2 hover:scale-150 duration-300"
            src={openMeteo}
            alt="Open Meteo"
          />
        </a>
        {/* <a className="text-xs" href="https://open-meteo.com/en">
          Open-Meteo
        </a> */}
      </div>
      <div className="">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.amcharts.com/free-animated-svg-weather-icons/"
        >
          <img
            className="h-[4vh] transition ease-in-out delay-50 hover:-translate-y-2 hover:scale-150 duration-300"
            src={amChart}
            alt="AMCHARTS"
          />
        </a>
      </div>
      <div className="">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://tailwindcss.com/"
        >
          <img
            className="h-[4vh] transition ease-in-out delay-50 hover:-translate-y-2 hover:scale-150 duration-300"
            src={tailwind}
            alt="Tailwind"
          />
        </a>
      </div>
    </div>
  );
}
