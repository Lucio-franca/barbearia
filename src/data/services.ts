import type { Service } from "../types";
import combocbImg from "../assets/combocb.jpg";
import corteImg from "../assets/cabelo.jpg";
import barbaImg from "../assets/barba.jpg";
import comboImg from "../assets/combo.jpg";

export const services: Service[] = [
  { id: 1, name: "COMBO (Cabelo + Barba)", price: 90, image: combocbImg },
  { id: 2, name: "Cabelo", price: 45, image: corteImg },
  { id: 3, name: "Barba", price: 45, image: barbaImg },
  { id: 4, name: "COMBO (Cabelo + Sobrancelhas)", price: 60, image: comboImg },
];