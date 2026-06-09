import { barbers } from "../data/barbers";
import type { Barber } from "../types";
import bg from "../assets/backgrand.png";
import { motion } from "motion/react";

type Props = { onSelect: (barber: Barber) => void };

export default function BarberScreen({ onSelect }: Props) {
  return (
    <motion.div
      className="page-wrap"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
        <div className="deco">Nosso profissional</div>
        <p className="sub">Clique na foto para agendar</p>
      </div>

      <div className="b-body">
        {barbers.map((barber, i) => (
          <motion.div
            key={barber.id}
            className="b-panel"
            onClick={() => onSelect(barber)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="b-photo">
              <img src={barber.image} alt={barber.name} />
            </div>
            <p className="b-name">{barber.name}</p>
            <span className="b-tag">Agendar agora</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}