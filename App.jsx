import { useReducer, useState, useEffect, useCallback } from "react";
import { UI, G } from "./styles/tokens.js";
import { NAV } from "./constants/index.js";
import { AppCtx, reducer, initialState } from "./store/index.js";
import { useProjectStorage } from "./hooks/useProjectStorage.js";
import { ProjetoModal } from "./components/modals/ProjetoModal.jsx";
import { Dashboard }  from "./pages/Dashboard.jsx";
import { Projetos }   from "./pages/Projetos.jsx";
import { Simulador }  from "./pages/Simulador.jsx";
import { MonitorODS } from "./pages/MonitorODS.jsx";

const TITLES = {
  dashboard: "Painel Geral",
  projetos:  "Projetos",
  simulador: "Simulador de Incentivo Fiscal",
  ods:       "Monitor ODS",
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loaded, setLoaded] = useState(false);

  // Storage sync
  useProjectStorage(state.projetos, dispatch);
  useEffect(() => setLoaded(true), []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type:"CLEAR_TOAST" }), 2500);
    return () => clearTimeout(t);
  }, [state.toast]);

  const handleSave = useCallback(p => {
    dispatch({ type:"UPSERT", projeto:p });
    dispatch({ type:"TOAST", msg: p.id ? "Projeto atualizado!" : "Projeto cadastrado!" });
  }, []);

  if (!loaded) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:UI.bgPage, color:UI.textSub, fontSize:13 }}>
      Carregando plataforma...
    </div>
  );

  return (
    <AppCtx.Provider value={{ state, dispatch }}>
      <div style={{ display:"flex", minHeight:"100vh", background:UI.bgPage }}>

        {/* Modal */}
        {state.modal && (
          <ProjetoModal
            projeto={state.modal === "new" ? null : state.modal}
            onSave={handleSave}
            onClose={() => dispatch({ type:"CLOSE_MODAL" })}
          />
        )}

        {/* Toast */}
        {state.toast && (
          <div style={{
            position:"fixed", bottom:20, right:20, zIndex:99999,
            background:`linear-gradient(135deg,${G.green},${G.green2})`,
            color:"#fff", fontSize:13, padding:"11px 20px", borderRadius:9, fontWeight:700,
            boxShadow:"0 4px 16px rgba(0,191,99,0.35)",
          }}>
            {state.toast}
          </div>
        )}

        {/* Sidebar */}
        <aside style={{
          width:200, background:G.blue, display:"flex", flexDirection:"column",
          flexShrink:0, padding:"1.25rem 0", position:"sticky", top:0, height:"100vh",
        }}>
          <div style={{ padding:"0 1.25rem 1.25rem", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:30, height:30, borderRadius:8,
                background:`linear-gradient(135deg,${G.green},${G.green2})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, fontWeight:900, color:"#fff",
              }}>G</div>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:800, color:"#fff", letterSpacing:"0.05em" }}>GIV</p>
                <p style={{ margin:0, fontSize:9, color:"rgba(255,255,255,0.45)" }}>Gestão de ISP</p>
              </div>
            </div>
          </div>

          <nav style={{ display:"flex", flexDirection:"column", gap:2, padding:"0.75rem 8px", flex:1 }}>
            {NAV.map(n => (
              <button
                key={n.id}
                onClick={() => dispatch({ type:"NAV", id:n.id })}
                style={{
                  display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                  borderRadius:7, border:"none", cursor:"pointer",
                  background: state.active === n.id ? "rgba(255,255,255,0.15)" : "transparent",
                  color: state.active === n.id ? "#fff" : "rgba(255,255,255,0.55)",
                  fontSize:13, textAlign:"left",
                }}
              >
                <span style={{ fontSize:13, color: state.active === n.id ? G.green : "rgba(255,255,255,0.35)" }}>
                  {n.icon}
                </span>
                {n.label}
              </button>
            ))}
          </nav>

          <div style={{ padding:"0.75rem 1rem", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:30, height:30, borderRadius:"50%",
                background:`linear-gradient(135deg,${G.green},${G.green2})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:900, color:"#fff", flexShrink:0,
              }}>VS</div>
              <div>
                <p style={{ margin:0, fontSize:12, color:"#fff", fontWeight:700 }}>Vitor S.</p>
                <p style={{ margin:0, fontSize:10, color:"rgba(255,255,255,0.4)" }}>Gestor ISP</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex:1, padding:"1.5rem 1.75rem", overflowY:"auto", minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
            <div>
              <h1 style={{ margin:"0 0 2px", fontSize:20, fontWeight:800, color:UI.text }}>{TITLES[state.active]}</h1>
              <p style={{ margin:0, fontSize:11, color:UI.textSub }}>Ciclo 2025 · {state.projetos.length} projetos cadastrados</p>
            </div>
            {state.active === "projetos" && (
              <button
                onClick={() => dispatch({ type:"OPEN_MODAL", payload:"new" })}
                style={{ fontSize:13, padding:"8px 20px", borderRadius:7, cursor:"pointer", border:"none",
                  background:`linear-gradient(135deg,${G.green},${G.green2})`, color:"#fff", fontWeight:700 }}
              >
                + Novo projeto
              </button>
            )}
          </div>

          {state.active === "dashboard" && <Dashboard />}
          {state.active === "projetos"  && <Projetos />}
          {state.active === "simulador" && <Simulador />}
          {state.active === "ods"       && <MonitorODS />}
        </main>
      </div>
    </AppCtx.Provider>
  );
}
