import { useState } from "react";
import type { Barber, Service } from "../types";
import bg from "../assets/backgrand.png";
import { bookSlot } from "./TimeScreen";

// =============================================
// NÚMERO DO WHATSAPP DO DONO
// Troque pelo número real (só números, com DDI)
// =============================================
const OWNER_WHATSAPP = "5516981669469";

type Props = {
  barber: Barber;
  service: Service;
  date: string;
  time: string;
  onBack: () => void;
  onConfirm: () => void;
};

export default function ConfirmScreen({
  barber,
  service,
  date,
  time,
  onBack,
  onConfirm,
}: Props) {
  const [clientName, setClientName] = useState("");
  const [nameError, setNameError] = useState(false);

  // formata a data para exibição (ex: "terça-feira, 21/04")
  const dateFormatted = new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  function handleConfirm() {
    // valida nome
    if (!clientName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    // bloqueia o horário no array em memória
    bookSlot(date, time);

    // monta mensagem para o WhatsApp
    const msg = [
      `✂️ *NOVO AGENDAMENTO*`,
      ``,
      `👤 *Cliente:* ${clientName}`,
      `💈 *Barbeiro:* ${barber.name}`,
      `✂️ *Serviço:* ${service.name}`,
      `💰 *Valor:* R$ ${service.price}`,
      `📅 *Data:* ${dateFormatted}`,
      `🕐 *Horário:* ${time}`,
    ].join("\n");

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encoded}`;

    // abre WhatsApp numa nova aba
    window.open(url, "_blank");

    // avança para tela de sucesso
    onConfirm();
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

      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="sub">Confirme seu agendamento</div>
      </div>

      <div id="ss-container">

        <div id="ss-barber-top">
          <h2>Resumo</h2>
          <button className="lux-btn" onClick={onBack}>Voltar</button>
        </div>

        <div id="ss-divider" />

        {/* Card de resumo */}
        <div className="confirm-card">

          {/* Foto e nome do barbeiro */}
          <div className="confirm-barber">
            <img src={barber.image} alt={barber.name} className="confirm-barber-img" />
            <span className="confirm-barber-name">{barber.name}</span>
          </div>

          <div className="confirm-divider" />

          {/* Detalhes do agendamento */}
          <div className="confirm-rows">
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

          <div className="confirm-divider" />

          {/* Campo nome do cliente */}
          <div className="confirm-name-wrap">
            <label className="confirm-name-label">Seu nome</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setNameError(false);
              }}
              className={`confirm-name-input ${nameError ? "input-error" : ""}`}
            />
            {nameError && (
              <span className="confirm-name-error">Por favor, informe seu nome.</span>
            )}
          </div>

          {/* Botão enviar */}
          <button className="lux-btn confirm-send-btn" onClick={handleConfirm}>
            📲 Confirmar e enviar no WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}