import { motion } from "motion/react";
import type { Barber, Service } from "../types";
import bg from "../assets/backgrand.png";

type Props = {
  barber: Barber;
  service: Service;
  date: string;
  time: string;
  clientName: string;
  onNew: () => void;
};

export default function SuccessScreen({
  barber,
  service,
  date,
  time,
  clientName,
  onNew,
}: Props) {
  const dateFormatted = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const priceFormatted = `R$ ${Number(service.price).toFixed(2).replace(".", ",")}`;

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="overlay" />

      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="sub">Confirmação</div>
      </div>

      <div id="ss-container">
        <motion.div
          className="confirm-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginTop: 40, gap: 24, display: "flex", flexDirection: "column" }}
        >
          {/* Checkmark */}
          <motion.div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "2px solid #b0b0b0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              color: "#b0b0b0",
              margin: "0 auto",
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            ✓
          </motion.div>

          {/* Title */}
          <motion.div
            style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="success-title">Agendamento confirmado!</h2>
            <p className="success-sub">Sua mensagem foi enviada para o whatsapp da barbearia.</p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="confirm-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />

          {/* Details */}
          <motion.div
            className="confirm-rows"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {[
              { label: "Cliente", value: clientName },
              { label: "Barbeiro", value: barber.name },
              { label: "Serviço", value: service.name },
              { label: "Valor", value: priceFormatted },
              { label: "Data", value: dateFormatted },
              { label: "Horário", value: time },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                className="confirm-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.06 }}
              >
                <span className="confirm-label">{row.label}</span>
                <span className="confirm-value">{row.value}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Info Text */}
          <motion.p
            style={{
              fontSize: 12,
              color: "#666",
              textAlign: "center",
              fontFamily: "Oswald",
              letterSpacing: 0.5,
              lineHeight: 1.8,
              margin: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            Você recebera uma confirmação do barbeiro em breve. Guarde o link de cancelamento enviado para sua segurança.
          </motion.p>

          {/* Button */}
          <motion.button
            className="lux-btn"
            onClick={onNew}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileTap={{ scale: 0.94 }}
            style={{ marginTop: 16 }}
          >
            Fazer novo agendamento
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}