import { useState } from "react";
import bg from "../assets/backgrand.png";

type Props = {
  onBack: () => void;
  onSelect: (time: string) => void;
  selectedDate: string; // data selecionada para montar a chave do array
};

// =============================================
// HORÁRIOS DISPONÍVEIS DA BARBEARIA
// Edite aqui para mudar os horários do dia
// =============================================
const ALL_TIMES = [
  "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00",
];

// =============================================
// HORÁRIOS OCUPADOS — array em memória
// Reseta automaticamente quando a semana muda
// Formato da chave: "YYYY-MM-DD|HH:MM"
// =============================================
const getWeekKey = () => {
  const now = new Date();
  // pega o número da semana do ano para detectar virada de semana
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor(
    (now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  return `${now.getFullYear()}-W${week}`;
};

// chave da semana atual salva junto para detectar virada
const STORAGE_KEY = "barber_booked";
const stored = sessionStorage.getItem(STORAGE_KEY);
let bookedData: { week: string; slots: string[] } = stored
  ? JSON.parse(stored)
  : { week: getWeekKey(), slots: [] };

// se virou a semana, reseta tudo
if (bookedData.week !== getWeekKey()) {
  bookedData = { week: getWeekKey(), slots: [] };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookedData));
}

// função para bloquear um horário (chamada após confirmação)
export function bookSlot(dateISO: string, time: string) {
  const key = `${dateISO.slice(0, 10)}|${time}`;
  if (!bookedData.slots.includes(key)) {
    bookedData.slots.push(key);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookedData));
  }
}

// função para checar se está ocupado
export function isSlotBooked(dateISO: string, time: string): boolean {
  const key = `${dateISO.slice(0, 10)}|${time}`;
  return bookedData.slots.includes(key);
}

export default function TimeScreen({ onBack, onSelect, selectedDate }: Props) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSelect(time: string) {
    // verifica se o horário já está ocupado
    if (isSlotBooked(selectedDate, time)) {
      setErrorMsg(`O horário ${time} já está reservado. Escolha outro.`);
      setSelectedTime(null);
      return;
    }
    setErrorMsg(null);
    // se clicar no mesmo, desmarca
    setSelectedTime(selectedTime === time ? null : time);
  }

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
      <div className="overlay" />

      {/* Cabeçalho padrão */}
      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="sub">Escolha o horário</div>
      </div>

      <div id="ss-container">

        {/* Topo com botão voltar */}
        <div id="ss-barber-top">
          <h2>Selecione o horário</h2>
          <button className="lux-btn" onClick={onBack}>Voltar</button>
        </div>

        <div id="ss-divider" />

        {/* Mensagem de erro se horário ocupado */}
        {errorMsg && (
          <div className="time-error">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Grade de horários dentro do card preto */}
        <div className="day-wrapper-card">
          <div className="time-grid">
            {ALL_TIMES.map((time) => {
              const booked = isSlotBooked(selectedDate, time);
              return (
                <div
                  key={time}
                  onClick={() => handleSelect(time)}
                  className={`time-slot ${
                    booked
                      ? "time-booked"          // ocupado — cinza bloqueado
                      : selectedTime === time
                      ? "time-selected"        // selecionado pelo usuário
                      : ""                     // disponível
                  }`}
                >
                  {time}
                  {booked && <span className="time-booked-label">Ocupado</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão continuar — só aparece com horário selecionado */}
        {selectedTime && (
          <button
            className="lux-btn"
            style={{ marginTop: 32 }}
            onClick={() => onSelect(selectedTime)}
          >
            Continuar
          </button>
        )}

      </div>
    </div>
  );
}