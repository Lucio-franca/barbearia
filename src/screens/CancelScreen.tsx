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
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    async function fetchAgendamento() {
      console.log("=== BUSCANDO AGENDAMENTO ===");
      console.log("Token:", token);

      if (!token) {
        console.error("❌ Token não encontrado na URL");
        setStatus("notfound");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("agendamentos")
          .select("*")
          .eq("token", token)
          .maybeSingle();

        console.log("Resposta da busca:", { data, error });

        if (error) {
          console.error("❌ ERRO ao buscar agendamento:", error);
          setStatus("notfound");
          return;
        }

        if (!data) {
          console.error("❌ Nenhum agendamento encontrado com este token");
          setStatus("notfound");
          return;
        }

        console.log("✅ Agendamento encontrado:", data);

        if (data.cancelado) {
          console.log("Agendamento já está cancelado");
          setStatus("already");
          return;
        }

        setAgendamento(data);

        if (data.barbeiro_id) {
          console.log("Buscando barbeiro ID:", data.barbeiro_id);
          const { data: barberData, error: barberError } = await supabase
            .from("barbeiros")
            .select("nome")
            .eq("id", data.barbeiro_id)
            .maybeSingle();
          
          if (barberError) {
            console.error("Erro ao buscar barbeiro:", barberError);
          } else if (barberData) {
            console.log("Barbeiro encontrado:", barberData.nome);
            setBarberName(barberData.nome);
          }
        }

        if (data.servico_id) {
          console.log("Buscando serviço ID:", data.servico_id);
          const { data: serviceData, error: serviceError } = await supabase
            .from("servicos")
            .select("nome")
            .eq("id", data.servico_id)
            .maybeSingle();
          
          if (serviceError) {
            console.error("Erro ao buscar serviço:", serviceError);
          } else if (serviceData) {
            console.log("Serviço encontrado:", serviceData.nome);
            setServiceName(serviceData.nome);
          }
        }

        setStatus("found");
      } catch (err) {
        console.error("❌ ERRO GERAL ao buscar:", err);
        setStatus("notfound");
      }
    }
    fetchAgendamento();
  }, [token]);

  async function handleCancel() {
    if (!agendamento) {
      console.error("❌ Agendamento não encontrado no state");
      alert("Erro: Agendamento não encontrado");
      return;
    }

    setStatus("loading");

    console.log("=== INICIANDO CANCELAMENTO ===");
    console.log("ID do agendamento:", agendamento.id);
    console.log("Cliente:", agendamento.cliente);
    console.log("Data:", agendamento.data);
    console.log("Horário:", agendamento.horario);

    try {
      console.log("Enviando UPDATE para Supabase...");

      const { data, error } = await supabase
        .from("agendamentos")
        .update({ cancelado: true })
        .eq("id", agendamento.id)
        .select();

      console.log("Resposta do Supabase:", { data, error });

      if (error) {
        const errorMsg = `Código: ${error.code} | Mensagem: ${error.message} | Detalhes: ${error.details || "N/A"}`;
        console.error("❌ ERRO AO CANCELAR:", error);
        console.error("Detalhes completos:", errorMsg);

        setErrorDetail(errorMsg);
        alert(`Erro ao cancelar:\n\nCódigo: ${error.code}\nMensagem: ${error.message}`);
        setStatus("error");
        return;
      }

      if (!data || data.length === 0) {
        const errorMsg = "Nenhum dado retornado do UPDATE";
        console.error("❌ ERRO:", errorMsg);
        setErrorDetail(errorMsg);
        alert("Erro: Nenhum dado retornado do servidor");
        setStatus("error");
        return;
      }

      console.log("✅ SUCESSO! Agendamento cancelado:", data);
      alert("✅ Agendamento cancelado com sucesso!");
      setStatus("cancelled");
    } catch (err) {
      const errorStack = err instanceof Error ? err.stack : "N/A";
      const errorMessage = err instanceof Error ? err.message : String(err);

      console.error("❌ ERRO GERAL:", err);
      console.error("Stack:", errorStack);

      setErrorDetail(errorMessage);
      alert(`Erro geral:\n\n${errorMessage}`);
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
              {errorDetail && (
                <div style={{
                  backgroundColor: "rgba(255, 80, 80, 0.1)",
                  border: "1px solid #884444",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 16,
                  marginBottom: 16,
                }}>
                  <p style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "#ff9999",
                    margin: 0,
                    wordBreak: "break-all",
                    lineHeight: 1.6,
                  }}>
                    {errorDetail}
                  </p>
                </div>
              )}
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