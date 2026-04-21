import { barbers } from "../data/barbers";
import type { Barber } from "../types";
import bg from "../assets/backgrand.png";

type Props = {
  onSelect: (barber: Barber) => void;
};

export default function BarberScreen({ onSelect }: Props) {
  return (
    <div
      className="page-wrap"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay escuro sobre o fundo para melhorar legibilidade */}
      <div className="overlay" />

      {/* Cabeçalho da tela */}
      <div className="b-header">
        <h1>Agendamento</h1>
        <div className="underline" />
        <div className="deco">Nosso profissional</div>
        <p className="sub">Clique na foto para agendar</p>
      </div>

      {/* Grade de barbeiros — cada card chama onSelect ao clicar */}
      <div className="b-body">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="b-panel"
            onClick={() => onSelect(barber)}
          >
            {/* Foto circular do barbeiro */}
            <div className="b-photo">
              <img src={barber.image} alt={barber.name} />
            </div>

            <p className="b-name">{barber.name}</p>
            <span className="b-tag">Agendar agora</span>
          </div>
        ))}
      </div>
    </div>
  );
}