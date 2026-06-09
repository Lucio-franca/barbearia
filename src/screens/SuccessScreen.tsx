import type { Barber, Service } from "../types";
import bg from "../assets/backgrand.png";
import { motion } from "motion/react";

type Props = {
  barber: Barber; service: Service; date: string;
  time: string; clientName: string; onNew: () => void;
};

export default function SuccessScreen({ barber, service, date, time, clientName, onNew }: Props) {
  const dateFormatted = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
  });

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
        <div className="sub">Agendado com sucesso!</div>
      </div>

      <div id="ss-container">
        <motion.div
          className="success-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        >
          {/* Ícone com draw + pulse */}
          <motion.div
            className="success-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.2, 1], rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              ✓
            </motion.span>
          </motion.div>

          {/* Pulse ring ao redor do ícone */}
          <motion.div
            style={{
              position: "absolute",
              width: 70, height: 70,
              borderRadius: "50%",
              border: "2px solid #b0b0b0",
              marginTop: -94,
            }}
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
            transition={{ delay: 0.9, duration: 1, repeat: 2 }}
          />

          <h2 className="success-title">Agendamento confirmado!</h2>
          <p className="success-sub">Sua mensagem foi enviada para o WhatsApp da barbearia.</p>

          <div className="confirm-divider" />

          <div className="confirm-rows">
            {[
              { label: "Cliente", value: clientName },
              { label: "Barbeiro", value: barber.name },
              { label: "Serviço", value: service.name },
              { label: "Valor", value: `R$ ${service.price}` },
              { label: "Data", value: dateFormatted },
              { label: "Horário", value: time },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                className="confirm-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              >
                <span className="confirm-label">{row.label}</span>
                <span className="confirm-value">{row.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="lux-btn"
            style={{ marginTop: 32 }}
            onClick={onNew}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            whileTap={{ scale: 0.94 }}
          >
            Fazer novo agendamento
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}