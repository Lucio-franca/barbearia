import { useState } from "react";
import "./App.css";
import BarberScreen from "./screens/BarberScreen";
import ServiceScreen from "./screens/ServiceScreen";
import DayScreen from "./screens/DayScreen";
import TimeScreen from "./screens/TimeScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import SuccessScreen from "./screens/SuccessScreen";
import type { Barber, Service } from "./types";

function App() {
  const [step, setStep] = useState(1);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");

  // reseta tudo para novo agendamento
  function resetAll() {
    setStep(1);
    setBarber(null);
    setService(null);
    setDate(null);
    setTime(null);
    setClientName("");
  }

  return (
    <>
      {step === 1 && (
        <BarberScreen onSelect={(b) => { setBarber(b); setStep(2); }} />
      )}
      {step === 2 && barber && (
        <ServiceScreen
          barber={barber}
          onBack={() => setStep(1)}
          onSelect={(s) => { setService(s); setStep(3); }}
        />
      )}
      {step === 3 && (
        <DayScreen
          onBack={() => setStep(2)}
          onSelect={(d) => { setDate(d); setStep(4); }}
        />
      )}
      {step === 4 && date && (
        <TimeScreen
          selectedDate={date}
          onBack={() => setStep(3)}
          onSelect={(t) => { setTime(t); setStep(5); }}
        />
      )}
      {step === 5 && barber && service && date && time && (
        <ConfirmScreen
          barber={barber}
          service={service}
          date={date}
          time={time}
          onBack={() => setStep(4)}
          onConfirm={() => setStep(6)}
        />
      )}
      {step === 6 && barber && service && date && time && (
        <SuccessScreen
          barber={barber}
          service={service}
          date={date}
          time={time}
          clientName={clientName}
          onNew={resetAll}
        />
      )}
    </>
  );
}

export default App;