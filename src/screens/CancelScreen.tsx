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
        .single();

      if (!data) {
        setStatus("notfound");
        return;
      }
      if (data.cancelado) {
        setStatus("already");
        return;
      }

      setAgendamento(data);

      // Buscar dados do barbeiro e serviço se tiverem IDs
      if (data.barbeiro_id) {
        const { data: barberData } = await supabase
          .from("barbeiros")
          .select("nome")
          .eq("id", data.barbeiro_id)
          .single();
        if (barberData) setBarberName(barberData.nome);
      }

      if (data.servico_id) {
        const { data: serviceData } = await supabase
          .from("servicos")
          .select("nome")
          .eq("id", data.servico_id)
          .single();
        if (serviceData) setServiceName(serviceData.nome);
      }

      setStatus("found");
    }
    fetchAgendamento();
  }, [token]);

  async function handleCancel() {
    if (!agendamento) return;
    setStatus("loading");

    const { error } = await supabase
      .from("agendamentos")
      .update({ cancelado: true })
      .eq("id", agendamento.id);

    if (error) {
      setStatus("error");
      return;
    }
    setStatus("cancelled");
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
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
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* CARREGANDO */}
          {status === "loading" && (
            <p style={{ color: "#aaa", fontFamily: "Oswald", letterSpacing: 2, fontSize: 14, textAlign: "center" }}>
              Carregando...
            </p>
          )}

          {/* NÃO ENCONTRADO */}
          {status === "notfound" && (
            <>
              <div className="success-icon" style={{ borderColor: "#884444", color: "#884444" }}>✕</div>
              <h2 className="success-title" style={{ color: "#ff8888" }}>Link inválido</h2>
              <p className="success-sub">Este link de cancelamento não foi encontrado.</p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 16 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {/* JÁ CANCELADO */}
          {status === "already" && (
            <>
              <div className="success-icon" style={{ borderColor: "#888", color: "#888" }}>✕</div>
              <h2 className="success-title" style={{ color: "#aaa" }}>Já cancelado</h2>
              <p className="success-sub">Este agendamento já foi cancelado anteriormente.</p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 16 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {/* ERRO */}
          {status === "error" && (
            <>
              <div className="success-icon" style={{ borderColor: "#884444", color: "#884444" }}>!</div>
              <h2 className="success-title" style={{ color: "#ff8888" }}>Erro</h2>
              <p className="success-sub">Não foi possível cancelar. Tente novamente.</p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 16 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {/* CANCELADO COM SUCESSO */}
          {status === "cancelled" && (
            <>
              <motion.div
                style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid #b0b0b0", color: "#b0b0b0", fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                ✓
              </motion.div>
              <div style={{ textAlign: "center" }}>
                <h2 className="success-title">Cancelado!</h2>
                <p className="success-sub">Seu agendamento foi cancelado com sucesso.</p>
              </div>
              <div className="confirm-divider" />
              <p style={{
                fontFamily: "Oswald", fontSize: 13, color: "#666",
                letterSpacing: 1, textAlign: "center", lineHeight: 1.7, margin: 0,
              }}>
                O horário foi liberado para outros clientes.
              </p>
              <motion.button
                className="lux-btn"
                style={{ marginTop: 16 }}
                onClick={goHome}
                whileTap={{ scale: 0.94 }}
              >
                Voltar ao início
              </motion.button>
            </>
          )}

          {/* ENCONTRADO — mostra detalhes e botão cancelar */}
          {status === "found" && agendamento && (
            <>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: 16, color: "#fff", margin: 0, fontFamily: "Oswald", letterSpacing: 1 }}>
                  Confirmar cancelamento
                </h2>
              </div>

              <div className="confirm-divider" />

              <div className="confirm-rows" style={{ width: "100%", gap: 12 }}>
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 12,
                      borderBottom: "1px solid #222",
                    }}
                  >
                    <span className="confirm-label" style={{ fontSize: 12, color: "#888", fontFamily: "Oswald", letterSpacing: 1, textTransform: "uppercase" }}>{row.label}</span>
                    <span className="confirm-value" style={{ fontSize: 13, color: "#fff", fontFamily: "Oswald" }}>{row.value}</span>
                  </motion.div>
                ))}
              </div>

              <div className="confirm-divider" />

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