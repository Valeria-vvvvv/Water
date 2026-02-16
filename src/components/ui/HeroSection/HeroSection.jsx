import "swiper/css";
import "./HeroSection.css";
import HeroForm from "../../forms/HeroForm/HeroForm";

const HeroSection = () => {
  const handleLearnMore = () => {
    const element = document.getElementById("cases");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      <video
        className="hero-background-video"
        src="/assets/header/plumber.mp4"
        autoPlay
        muted
        loop
        playsInline
      ></video>
      <div className="hero-container">
        {/* Main Content */}
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Услуги мужа на час</h1>
            <p className="hero-subtitle">
              Наш подход строится на трех принципах: оперативный выезд, честная оценка и безупречное исполнение. Мы понимаем, как важно поддерживать уют и исправность систем в доме, поэтому предлагаем услуги квалифицированных мастеров с многолетним опытом.
            </p>
            <button className="start-btn" onClick={handleLearnMore}>
              ПОДРОБНЕЕ
            </button>
          </div>

          <div className="hero-visual">
            <div className="start-button-container">
              <HeroForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
