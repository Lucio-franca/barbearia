import { useState } from "react";
import bg from "../assets/backgrand.png";
import { motion } from "motion/react";

type Props = { onBack: () => void; onSelect: (date: string) => void };

export default function DayScreen({ onBack, onSelect }: Props) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }),
      value: date.toISOString(),
    };
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
        <div className="sub">Escolha o dia</div>
      </div>

      <div id="ss-container" style={{ paddingLeft: 20, paddingRight: 20 }}>
        <div id="ss-barber-top">
          <h2>Selecione a data</h2>
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

        <div className="day-wrapper-card">
          <div id="ss-services-grid">
            {days.map((day, i) => (
              <motion.div
                key={day.value}
                onClick={() => setSelectedDay(selectedDay === day.value ? null : day.value)}
                className={`ss-service-card day-item ${selectedDay === day.value ? "active-day" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                whileTap={{ scale: 0.96 }}
              >
                <h2 className="ss-service-name">{day.label}</h2>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedDay && (
          <motion.button
            className="lux-btn"
            style={{ marginTop: 32 }}
            onClick={() => onSelect(selectedDay)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.3 }}
          >
            Continuar
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}