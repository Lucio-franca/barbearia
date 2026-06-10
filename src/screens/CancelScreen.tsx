import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "motion/react";
import bg from "../assets/backgrand.png";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Agendamento = {
  id: string;
  data: string;
  horario: string;
  cliente: string;
  cancelado: boolean;
  barbeiro_id?: string;
  servico_id?: string;
  servico_valor?: number;
};

export default function CancelScreen() {
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [barberName, setBarberName] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "found" | "notfound" | "cancelled" | "already" | "error">("loading");

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    async function fetchAgendamento() {
      if (!token) {
        setStatus("notfound");
        return;
      }

      const { data } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (!data) {
        setStatus("notfound");
        return;
      }
      if (data.cancelado) {
        setStatus("already");
        return;
      }

      setAgendamento(data);

      if (data.barbeiro_id) {
        const { data: barberData } = await supabase
          .from("barbeiros")
          .select("nome")
          .eq("id", data.barbeiro_id)
          .maybeSingle();
        if (barberData) setBarberName(barberData.nome);
      }

      if (data.servico_id) {
        const { data: serviceData } = await supabase
          .from("servicos")
          .select("nome")
          .eq("id", data.servico_id)
          .maybeSingle();
        if (serviceData) setServiceName(serviceData.nome);
      }

      setStatus("found");
    }
    fetchAgendamento();
  }, [token]);

  async function handleCancel() {
    if (!agendamento) return;
    setStatus("loading");

    try {
      const { data, error } = await supabase
        .from("agendamentos")
        .update({ cancelado: true })
        .eq("id", agendamento.id)
        .select();

      if (error) {
        console.error("Erro ao cancelar:", error);
        setStatus("error");
        return;
      }

      console.log("Agendamento cancelado com sucesso:", data);
      setStatus("cancelled");
    } catch (err) {
      console.error("Erro geral:", err);
      setStatus("error");
    }
  }

  function goHome() {
    window.location.href = window.location.origin;
  }

  const dateFormatted = agendamento
    ? new Date(agendamento.data + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const priceFormatted = agendamento && agendamento.servico_valor
    ? `R$ ${Number(agendamento.servico_valor).toFixed(2).replace(".", ",")}`
    : "";

  return (
    <div
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
        <div className="sub">Cancelamento</div>
      </div>

      <div id="ss-container">
        <motion.div
          className="confirm-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ marginTop: 40 }}
        >

          {status === "loading" && (
            <p style={{ color: "#aaa", fontFamily: "Oswald", letterSpacing: 2, fontSize: 14, textAlign: "center" }}>
              Carregando...
            </p>
          )}

          {status === "notfound" && (
            <>
              <div className="success-icon" style={{ borderColor: "#884444", color: "#884444" }}>✕</div>
              <h2 className="success-title" style={{ color: "#ff8888" }}>Link inválido</h2>
              <p className="success-sub">Este link de cancelamento não foi encontrado.</p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 32 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {status === "already" && (
            <>
              <div className="success-icon" style={{ borderColor: "#888", color: "#888" }}>✕</div>
              <h2 className="success-title" style={{ color: "#aaa" }}>Já cancelado</h2>
              <p className="success-sub">Este agendamento já foi cancelado anteriormente.</p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 32 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="success-icon" style={{ borderColor: "#884444", color: "#884444" }}>!</div>
              <h2 className="success-title" style={{ color: "#ff8888" }}>Erro</h2>
              <p className="success-sub">Não foi possível cancelar. Tente novamente.</p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 32 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {status === "cancelled" && (
            <>
              <motion.div
                className="success-icon"
                style={{ borderColor: "#b0b0b0", color: "#b0b0b0" }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                ✓
              </motion.div>
              <h2 className="success-title">Cancelado!</h2>
              <p className="success-sub">Seu agendamento foi cancelado com sucesso.</p>
              <div className="confirm-divider" />
              <p style={{
                fontFamily: "Oswald", fontSize: 13, color: "#666",
                letterSpacing: 1, textAlign: "center", lineHeight: 1.7,
              }}>
                O horário foi liberado para outros clientes.
              </p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 32 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {status === "found" && agendamento && (
            <>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, color: "#fff", margin: 0, fontFamily: "Oswald", letterSpacing: 1 }}>
                  Confirmar cancelamento
                </h2>
              </div>

              <div className="confirm-divider" />

              <div className="confirm-rows" style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
                {[
                  { label: "Cliente", value: agendamento.cliente },
                  ...(barberName ? [{ label: "Barbeiro", value: barberName }] : []),
                  ...(serviceName ? [{ label: "Serviço", value: serviceName }] : []),
                  ...(priceFormatted ? [{ label: "Valor", value: priceFormatted }] : []),
                  { label: "Data", value: dateFormatted },
                  { label: "Horário", value: agendamento.horario.slice(0, 5) },
                ].map((row, i) => (
                  <motion.div
                    key={row.label}
                    className="confirm-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <span className="confirm-label">{row.label}</span>
                    <span className="confirm-value">{row.value}</span>
                  </motion.div>
                ))}
              </div>

              <div className="confirm-divider" />

              <p style={{
                fontFamily: "Oswald", fontSize: 12, color: "#888",
                letterSpacing: 1, textAlign: "center", marginTop: 16, marginBottom: 16,
              }}>
                Deseja cancelar este agendamento?
              </p>

              <motion.button
                className="lux-btn confirm-send-btn"
                onClick={handleCancel}
                whileTap={{ scale: 0.96 }}
                style={{ borderColor: "rgba(200,80,80,0.6)", color: "#ff9999" }}
              >
                ❌ Confirmar cancelamento
              </motion.button>

              <motion.button
                className="lux-btn"
                style={{ marginTop: 12 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

        </motion.div>
      </div>
    </div>
  );
}