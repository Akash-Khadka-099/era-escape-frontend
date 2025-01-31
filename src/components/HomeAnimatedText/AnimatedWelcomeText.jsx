import { useEffect } from "react";
import anime from "animejs";
// import "antd/dist/antd.css"; 
import PropTypes from "prop-types";

const AnimatedWelcomeText = ({ text }) => {
  useEffect(() => {
    const textWrapper = document.querySelector(".ml7 .letters");
    if (textWrapper) {
      textWrapper.innerHTML = textWrapper.textContent.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
      );

      anime
        .timeline({ loop: false })
        .add({
          targets: ".ml7 .letter",
          translateY: ["1.1em", 0],
          translateX: ["0.55em", 0],
          translateZ: 0,
          rotateZ: [180, 0],
          duration: 750,
          easing: "easeOutExpo",
          delay: (el, i) => 50 * i,
        })
        // .add({
        //   targets: ".ml7",
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000,
        // });
    }
  }, [text]); // Re-run the effect when the `text` prop changes

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <style>
        {`
          .ml7 {
            position: relative;
            font-weight: 900;
            font-size: 3.7em;
          }
          .ml7 .text-wrapper {
            position: relative;
            display: inline-block;
            padding-top: 0.2em;
            padding-right: 0.05em;
            padding-bottom: 0.1em;
            overflow: hidden;
          }
          .ml7 .letter {
            transform-origin: 0 100%;
            display: inline-block;
            line-height: 1em;
          }
        `}
      </style>
      <h1 className="ml7">
        <span className="text-wrapper">
          <span className="letters">{text}</span>
        </span>
      </h1>
    </div>
  );
};

AnimatedWelcomeText.propTypes = {
  text: PropTypes.string,
};

export default AnimatedWelcomeText;
