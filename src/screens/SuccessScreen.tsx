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
  barber, service, date, time, clientName, onNew
}: Props) {
  const dateFormatted = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
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

      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="sub">Agendado com sucesso!</div>
      </div>

      <div id="ss-container">
        <div className="success-card">

          {/* Ícone de sucesso */}
          <div className="success-icon">✓</div>
          <h2 className="success-title">Agendamento confirmado!</h2>
          <p className="success-sub">
            Sua mensagem foi enviada para o WhatsApp da barbearia.
          </p>

          <div className="confirm-divider" />

          {/* Resumo final */}
          <div className="confirm-rows">
            <div className="confirm-row">
              <span className="confirm-label">Cliente</span>
              <span className="confirm-value">{clientName}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Barbeiro</span>
              <span className="confirm-value">{barber.name}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Serviço</span>
              <span className="confirm-value">{service.name}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Valor</span>
              <span className="confirm-value">R$ {service.price}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Data</span>
              <span className="confirm-value">{dateFormatted}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">Horário</span>
              <span className="confirm-value">{time}</span>
            </div>
          </div>

          <button className="lux-btn" style={{ marginTop: 32 }} onClick={onNew}>
            Fazer novo agendamento
          </button>
        </div>
      </div>
    </div>
  );
}