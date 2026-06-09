import { useState } from "react";
import type { Barber, Service } from "../types";
import bg from "../assets/backgrand.png";
import { bookSlot } from "./TimeScreen";
import { motion } from "motion/react";

const OWNER_WHATSAPP = "5569992169957";

type Props = {
  barber: Barber; service: Service; date: string; time: string;
  onBack: () => void; onConfirm: (name: string) => void;
};

export default function ConfirmScreen({ barber, service, date, time, onBack, onConfirm }: Props) {
  const [clientName, setClientName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [shake, setShake] = useState(false);

  const dateFormatted = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
  });

  const priceFormatted = `R$ ${Number(service.price).toFixed(2).replace(".", ",")}`;

  async function handleConfirm() {
    if (!clientName.trim()) {
      setNameError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setNameError(false);

    const token = await bookSlot(date, time, clientName);
    const cancelLink = `${window.location.origin}?token=${token}`;

    const msg = [
      `🗓️ *NOVO AGENDAMENTO*`,
      ``,
      `👤 *Cliente:* ${clientName}`,
      ``,
      `📅 *Data:* ${dateFormatted}`,
      `🕐 *Horário:* ${time}`,
      ``,
      `💈 *Profissional:* ${barber.name}`,
      ``,
      `✂️ *Serviço:* ${service.name}`,
      `💰 *Valor:* ${priceFormatted}`,
      ``,
      `〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️`,
      ``,
      `⚠️ Para cancelar seu agendamento acesse o link abaixo:`,
      ``,
      cancelLink,
      ``,
      `_Agendamento realizado pelo site._`,
    ].join("\n");

    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    onConfirm(clientName);
  }

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
        <div className="sub">Confirme seu agendamento</div>
      </div>

      <div id="ss-container">
        <div id="ss-barber-top">
          <h2>Resumo</h2>
          <motion.button className="lux-btn" onClick={onBack} whileTap={{ scale: 0.94 }}>
            Voltar
          </motion.button>
        </div>

        <motion.div
          id="ss-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ transformOrigin: "center" }}
        />

        <motion.div
          className="confirm-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
        >
          <div className="confirm-barber">
            <motion.img
              src={barber.image}
              alt={barber.name}
              className="confirm-barber-img"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            />
            <span className="confirm-barber-name">{barber.name}</span>
          </div>

          <div className="confirm-divider" />

          <div className="confirm-rows">
            {[
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
                transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
              >
                <span className="confirm-label">{row.label}</span>
                <span className="confirm-value">{row.value}</span>
              </motion.div>
            ))}
          </div>

          <div className="confirm-divider" />

          <div className="confirm-name-wrap">
            <label className="confirm-name-label">Seu nome</label>
            <motion.input
              type="text"
              placeholder="Digite seu nome completo"
              value={clientName}
              onChange={(e) => { setClientName(e.target.value); setNameError(false); }}
              className={`confirm-name-input ${nameError ? "input-error" : ""}`}
              animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
            />
            {nameError && (
              <motion.span
                className="confirm-name-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                Por favor, informe seu nome.
              </motion.span>
            )}
          </div>

          <motion.button
            className="lux-btn confirm-send-btn"
            onClick={handleConfirm}
            whileTap={{ scale: 0.96 }}
          >
            📲 Confirmar e enviar no WhatsApp
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}