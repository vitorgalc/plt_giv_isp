# ISP GIV — Plataforma de Gestão de Investimento Social Privado

## Requisitos

- Node.js 18+
- npm 9+

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Build para produção

```bash
npm run build       # gera /dist
npm run preview     # serve o build localmente
```

## Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
```

O Vite já gera os arquivos estáticos corretos. Nenhuma configuração adicional é necessária no Vercel.

---

## Estrutura do projeto

```
src/
├── main.jsx                        # Bootstrap React
├── App.jsx                         # Roteamento + estado global + sidebar
│
├── styles/
│   └── tokens.js                   # Cores GIV (G), paleta UI, objetos S compartilhados
│
├── constants/
│   └── index.js                    # LEIS, ODS_LIST, STATUS_META, NAV, SEED
│
├── utils/
│   └── index.js                    # fmtBRL, fmtK, getLei, genId
│
├── store/
│   └── index.js                    # AppCtx, useApp, reducer, initialState
│
├── hooks/
│   ├── useProjectStorage.js        # Persistência via localStorage
│   ├── useProjectDocs.js           # Docs e notas por projeto
│   ├── useDashboardMetrics.js      # Métricas do painel (memoizadas)
│   ├── useSimuladorMetrics.js      # Cálculos fiscais (memoizados)
│   └── useOdsStats.js              # Estatísticas por ODS (memoizadas)
│
├── components/
│   ├── Badge.jsx                   # Badge de status
│   ├── PBar.jsx                    # Barra de progresso
│   ├── LeiChip.jsx                 # Chip de lei de incentivo
│   ├── MCard.jsx                   # Metric card
│   ├── CurrencyInput.jsx           # Input com formatação BRL
│   ├── BrazilMap.jsx               # Mapa D3 com topojson-client
│   ├── FilterPanel.jsx             # Dropdown de filtros
│   └── modals/
│       ├── ProjetoModal.jsx        # Cadastro / edição de projeto
│       └── InfoModal.jsx           # Detalhes, documentos e notas
│
└── pages/
    ├── Dashboard.jsx               # Painel geral
    ├── Projetos.jsx                # Portfólio de projetos
    ├── Simulador.jsx               # Simulador de incentivo fiscal
    └── MonitorODS.jsx              # Monitor de ODS
```

## Decisões de arquitetura

| Decisão | Justificativa |
|---|---|
| `useReducer` + `Context` | Elimina prop drilling entre App → páginas → modais |
| Hooks customizados | Separa lógica de negócio dos componentes de UI |
| `useMemo` nas derivações | Evita recálculo de métricas a cada re-render |
| `localStorage` | Persistência simples sem backend; troca direta por Supabase/Firebase |
| Objeto `S` de tokens | Estilos compartilhados definidos uma vez, sem repetição |
| Vite | Build rápido, HMR nativo, zero configuração para React |
