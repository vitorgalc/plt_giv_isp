import { LEIS } from "../constants/index.js";

export const fmtBRL = v =>
  `R$ ${Number(v).toLocaleString("pt-BR")}`;

export const fmtK = v =>
  v >= 1e6
    ? `R$ ${(v / 1e6).toFixed(1).replace(".", ",")}M`
    : `R$ ${(v / 1e3).toFixed(0)}k`;

export const getLei = id =>
  LEIS.find(l => l.id === id) || { label: id, cor: "#888", modalidade: "doação" };

export const genId = () => "p" + Date.now();
