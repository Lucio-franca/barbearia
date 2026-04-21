import { services } from "../data/services";
import type { Barber, Service } from "../types";
import bg from "../assets/backgrand.png";

type Props = {
  barber: Barber;
  onBack: () => void;
  onSelect: (service: Service) => void;
};

export default function ServiceScreen({ barber, onBack, onSelect }: Props) {
  return (
    <div
      id="service-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div className="overlay"></div>

      {/* HEADER */}
      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline"></div>
        <div className="sub">Escolha o serviço</div>
      </div>

      {/* CONTAINER CENTRAL */}
      <div id="ss-container">
        {/* BARBEIRO */}
        <div id="ss-barber-top">
          <img src={barber.image} alt={barber.name} />
          <h2>{barber.name}</h2>

          <button className="lux-btn" onClick={onBack}>
            Trocar barbeiro
          </button>
        </div>

        {/* DIVISOR */}
        <div id="ss-divider"></div>

        {/* SERVIÇOS */}
        <div id="ss-services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelect(service)}
              className="ss-service-card"
            >
              <div
                style={{
                  width: "100%",
                  height: "220px",
                  background: "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* fundo blur da própria imagem */}
                <img
                  src={service.image}
                  style={{
                    position: "absolute",
                    width: "120%",
                    height: "120%",
                    objectFit: "cover",
                    filter: "blur(20px)",
                    opacity: 0.4,
                  }}
                />

                {/* imagem principal */}
                <img
                  src={service.image}
                  alt={service.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </div>
              <h2 className="ss-service-name">{service.name}</h2>
              <p className="ss-service-price">R$ {service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
