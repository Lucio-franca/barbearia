import { useState } from "react";
import "./App.css";
import { AnimatePresence } from "motion/react";
import BarberScreen from "./screens/BarberScreen";
import ServiceScreen from "./screens/ServiceScreen";
import DayScreen from "./screens/DayScreen";
import TimeScreen from "./screens/TimeScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import SuccessScreen from "./screens/SuccessScreen";
import CancelScreen from "./screens/CancelScreen";
import type { Barber, Service } from "./types";

function App() {
  const isCancelPage = window.location.search.includes("token=");

  const [step, setStep] = useState(1);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");

  function resetAll() {
    setStep(1);
    setBarber(null);
    setService(null);
    setDate(null);
    setTime(null);
    setClientName("");
  }

  if (isCancelPage) return <CancelScreen />;

  return (
    <div style={{ background: "#050505", minHeight: "100vh", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <BarberScreen key="step1" onSelect={(b) => { setBarber(b); setStep(2); }} />
        )}
        {step === 2 && barber && (
          <ServiceScreen
            key="step2"
            barber={barber}
            onBack={() => setStep(1)}
            onSelect={(s) => { setService(s); setStep(3); }}
          />
        )}
        {step === 3 && (
          <DayScreen
            key="step3"
            onBack={() => setStep(2)}
            onSelect={(d) => { setDate(d); setStep(4); }}
          />
        )}
        {step === 4 && date && (
          <TimeScreen
            key="step4"
            selectedDate={date}
            onBack={() => setStep(3)}
            onSelect={(t) => { setTime(t); setStep(5); }}
          />
        )}
        {step === 5 && barber && service && date && time && (
          <ConfirmScreen
            key="step5"
            barber={barber}
            service={service}
            date={date}
            time={time}
            onBack={() => setStep(4)}
            onConfirm={(name) => { setClientName(name); setStep(6); }}
          />
        )}
        {step === 6 && barber && service && date && time && (
          <SuccessScreen
            key="step6"
            barber={barber}
            service={service}
            date={date}
            time={time}
            clientName={clientName}
            onNew={resetAll}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;