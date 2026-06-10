import { useState, useEffect } from "react";
import bg from "../assets/backgrand.png";
import { createClient } from "@supabase/supabase-js";
import { motion } from "motion/react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Props = { onBack: () => void; onSelect: (time: string) => void; selectedDate: string };

const ALL_TIMES = [
  "09:00","09:30","10:00","10:30",
  "11:00","11:30","14:00","14:30",
  "15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30",
  "19:00","19:30","20:00",
];

export async function bookSlot(dateISO: string, time: string, cliente: string): Promise<string> {
  const { data, error } = await supabase
    .from("agendamentos")
    .insert({ data: dateISO.slice(0, 10), horario: time, cliente })
    .select("token")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: existing } = await supabase
        .from("agendamentos")
        .select("token")
        .eq("data", dateISO.slice(0, 10))
        .eq("horario", time)
        .single();
      if (existing) return existing.token;
    }
    throw new Error("Erro ao agendar");
  }

  return data.token;
}

export default function TimeScreen({ onBack, onSelect, selectedDate }: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [shakeInput, setShakeInput] = useState(false);

  useEffect(() => {
    async function fetchBooked() {
      setLoading(true);
      const { data } = await supabase
        .from("agendamentos")
        .select("horario")
        .eq("data", selectedDate.slice(0, 10))
        .eq("cancelado", false);
      setBookedSlots((data ?? []).map((r) => r.horario.slice(0, 5)));
      setLoading(false);
    }
    fetchBooked();
  }, [selectedDate]);

  function handleSelect(time: string) {
    if (bookedSlots.includes(time)) {
      setErrorMsg(`O horário ${time} já está reservado. Escolha outro.`);
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      setSelectedTime(null);
      return;
    }
    setErrorMsg(null);
    setSelectedTime(selectedTime === time ? null : time);
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
        <div className="sub">Escolha o horário</div>
      </div>

      <div id="ss-container">
        <div id="ss-barber-top">
          <h2>Selecione o horário</h2>
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

        {errorMsg && (
          <motion.div
            className="time-error"
            animate={shakeInput ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            ⚠️ {errorMsg}
          </motion.div>
        )}

        <div className="day-wrapper-card">
          {loading ? (
            <p style={{ textAlign: "center", padding: 24, color: "#aaa" }}>
              Carregando horários...
            </p>
          ) : (
            <div className="time-grid">
              {ALL_TIMES.map((time, i) => {
                const booked = bookedSlots.includes(time);
                return (
                  <motion.div
                    key={time}
                    onClick={() => handleSelect(time)}
                    className={`time-slot ${booked ? "time-booked" : selectedTime === time ? "time-selected" : ""}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: "easeOut" }}
                    whileTap={!booked ? { scale: 0.93 } : {}}
                  >
                    {time}
                    {booked && <span className="time-booked-label">Ocupado</span>}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {selectedTime && (
          <motion.button
            className="lux-btn"
            style={{ marginTop: 32 }}
            onClick={() => onSelect(selectedTime)}
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