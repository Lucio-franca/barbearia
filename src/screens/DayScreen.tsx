import { useState } from "react";
import bg from "../assets/backgrand.png";

type Props = {
  onBack: () => void;
  onSelect: (date: string) => void;
};

export default function DayScreen({ onBack, onSelect }: Props) {
  // Guarda qual dia está selecionado (null = nenhum ainda)
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Gera array com os próximos 7 dias a partir de hoje
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      label: date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      }),
      value: date.toISOString(),
    };
  });

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

      {/* Cabeçalho padrão igual às outras telas */}
      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="sub">Escolha o dia</div>
      </div>

      {/* Container central com padding lateral (evita colar nas bordas no mobile) */}
      <div id="ss-container" style={{ paddingLeft: 20, paddingRight: 20 }}>

        {/* Título e botão voltar */}
        <div id="ss-barber-top">
          <h2>Selecione a data</h2>
          <button className="lux-btn" onClick={onBack}>Voltar</button>
        </div>

        <div id="ss-divider" />

        {/* ===== CARD PRETO QUE ENVOLVE OS DIAS ===== */}
        <div className="day-wrapper-card">
          <div id="ss-services-grid">
            {days.map((day) => (
              <div
                key={day.value}
                // Ao clicar: se já era o selecionado, desmarca; senão, marca
                onClick={() =>
                  setSelectedDay(selectedDay === day.value ? null : day.value)
                }
                className={`ss-service-card day-item ${
                  selectedDay === day.value ? "active-day" : ""
                }`}
              >
                {/* Nome do dia (ex: "terça-feira, 21/04") */}
                <h2 className="ss-service-name">{day.label}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Continuar — só aparece quando um dia está selecionado */}
        {selectedDay && (
          <button
            className="lux-btn"
            style={{ marginTop: 32 }}
            onClick={() => onSelect(selectedDay)}
          >
            Continuar
          </button>
        )}

      </div>
    </div>
  );
}