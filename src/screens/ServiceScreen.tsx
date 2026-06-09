import { services } from "../data/services";
import type { Barber, Service } from "../types";
import bg from "../assets/backgrand.png";
import { motion } from "motion/react";

type Props = {
  barber: Barber;
  onBack: () => void;
  onSelect: (service: Service) => void;
};

export default function ServiceScreen({ barber, onBack, onSelect }: Props) {
  return (
    <motion.div
      id="service-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
      }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div className="overlay" />

      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="sub">Escolha o serviço</div>
      </div>

      <div id="ss-container">
        <div id="ss-barber-top">
          <motion.img
            src={barber.image}
            alt={barber.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <h2>{barber.name}</h2>
          <motion.button
            className="lux-btn"
            onClick={onBack}
            whileTap={{ scale: 0.94 }}
          >
            Trocar barbeiro
          </motion.button>
        </div>

        <motion.div
          id="ss-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: "center" }}
        />

        <div id="ss-services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              className="ss-service-card"
              onClick={() => onSelect(service)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.45, ease: "easeOut" }}
              whileTap={{ scale: 0.97 }}
            >
              <div style={{
                width: "100%", height: "220px", background: "#111",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                <img src={service.image} style={{
                  position: "absolute", width: "120%", height: "120%",
                  objectFit: "cover", filter: "blur(20px)", opacity: 0.4,
                }} />
                <img src={service.image} alt={service.name} style={{
                  width: "100%", height: "100%", objectFit: "contain",
                  position: "relative", zIndex: 1,
                }} />
              </div>
              <h2 className="ss-service-name">{service.name}</h2>
              <p className="ss-service-price">R$ {service.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}