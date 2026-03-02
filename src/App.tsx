/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Sword, 
  BookOpen, 
  CheckCircle2, 
  Play, 
  ChevronRight,
  Trophy,
  Star,
  Layout,
  Palette,
  Code2,
  Github,
  Info,
  RotateCcw,
  ExternalLink,
  Download,
  Terminal,
  User,
  LogIn,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Tipos e Dados ---

type Mission = {
  id: number;
  world: string;
  title: string;
  explanation: string;
  visual: string;
  codeExample: string;
  objective: string;
  rewardXP: number;
  initialCode: string;
  validation: (code: string) => boolean;
};

const MISSIONS: Mission[] = [
  {
    id: 1,
    world: "Mundo 1 — O Reino do HTML",
    title: "O Esqueleto do Mundo",
    explanation: "HTML é a estrutura. Sem ele, seu site é apenas um fantasma!",
    visual: "🦴 Como os ossos de um guerreiro.",
    codeExample: "<html>\n  <body>\n    Olá Mundo\n  </body>\n</html>",
    objective: "Crie a estrutura básica com a mensagem 'Olá Mundo' no body.",
    rewardXP: 50,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('<html>') && clean.includes('<body>') && clean.includes('olámundo');
    }
  },
  {
    id: 2,
    world: "Mundo 1 — O Reino do HTML",
    title: "O Inventário do Herói (Listas)",
    explanation: "Listas <ul> e <li> servem para organizar seus itens de aventura.",
    visual: "🎒 Como uma mochila cheia de poções e espadas.",
    codeExample: "<ul>\n  <li>Espada</li>\n  <li>Escudo</li>\n</ul>",
    objective: "Crie uma lista <ul> com 3 itens <li> (Poção, Mapa, Tocha).",
    rewardXP: 50,
    initialCode: "<ul>\n  \n</ul>",
    validation: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('<ul>') && (clean.match(/<li>/g) || []).length >= 3;
    }
  },
  {
    id: 3,
    world: "Mundo 1 — O Reino do HTML",
    title: "O Portal Mágico (Links)",
    explanation: "A tag <a> cria portais para outros lugares da internet.",
    visual: "🌀 Um portal que te leva para outra dimensão.",
    codeExample: "<a href='https://google.com'>Ir para o Google</a>",
    objective: "Crie um link <a> que aponte para 'https://github.com' com o texto 'Meu Perfil'.",
    rewardXP: 50,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('<a') && clean.includes('href=') && clean.includes('github.com');
    }
  },
  {
    id: 4,
    world: "Mundo 1 — O Reino do HTML",
    title: "O Retrato do Aventureiro (Imagens)",
    explanation: "A tag <img> mostra imagens. Ela não precisa de fechamento!",
    visual: "🖼️ Uma moldura com a sua foto.",
    codeExample: "<img src='https://picsum.photos/100' />",
    objective: "Adicione uma imagem <img> com o endereço 'https://picsum.photos/200'.",
    rewardXP: 50,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('<img') && clean.includes('src=') && clean.includes('200');
    }
  },
  {
    id: 5,
    world: "Mundo 2 — O Reino das Cores (CSS)",
    title: "A Armadura de Vidro (Bordas)",
    explanation: "Bordas protegem seus elementos e dão forma a eles.",
    visual: "🛡️ Uma borda sólida ao redor do seu escudo.",
    codeExample: "<div style='border: 2px solid black;'>Escudo</div>",
    objective: "Crie uma <div> com uma borda de '5px solid green'.",
    rewardXP: 50,
    initialCode: "<div>Meu Escudo</div>",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('border:5pxsolidgreen');
    }
  },
  {
    id: 6,
    world: "Mundo 2 — O Reino das Cores (CSS)",
    title: "O Espaço Pessoal (Padding)",
    explanation: "Padding é o espaço de dentro da caixa. Conforto para o conteúdo!",
    visual: "🛋️ Almofadas dentro de uma caixa para não quebrar o que está dentro.",
    codeExample: "<div style='padding: 20px;'>Conforto</div>",
    objective: "Adicione um 'padding: 50px' a uma <div> para dar espaço ao texto.",
    rewardXP: 50,
    initialCode: "<div style='background: gold;'>Texto Apertado</div>",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('padding:50px');
    }
  },
  {
    id: 7,
    world: "Mundo 3 — O Reino do Layout",
    title: "A Formação de Batalha (Flexbox)",
    explanation: "Flexbox organiza os elementos em linha ou coluna facilmente.",
    visual: "👥 Soldados alinhados em uma fila perfeita.",
    codeExample: "<div style='display: flex;'>\n  <div>1</div>\n  <div>2</div>\n</div>",
    objective: "Ative o Flexbox em uma <div> usando 'display: flex;'.",
    rewardXP: 100,
    initialCode: "<div>\n  <p>Item 1</p>\n  <p>Item 2</p>\n</div>",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('display:flex');
    }
  },
  {
    id: 8,
    world: "Mundo 4 — O Reino Supremo do Flexbox",
    title: "O Centro do Universo",
    explanation: "Centralizar coisas é o maior desafio de um dev. O Flexbox resolve isso!",
    visual: "🎯 Acertar o alvo bem no meio.",
    codeExample: "<div style='display: flex; justify-content: center;'>\n  <span>Alvo</span>\n</div>",
    objective: "Use 'justify-content: center' para centralizar o conteúdo horizontalmente.",
    rewardXP: 100,
    initialCode: "<div style='display: flex;'>\n  <p>Estou no canto...</p>\n</div>",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('justify-content:center') && clean.includes('display:flex');
    }
  },
  {
    id: 9,
    world: "Mundo 4 — O Reino Supremo do Flexbox",
    title: "CHEFE FINAL: O Layout Lendário",
    explanation: "Combine tudo para criar um layout com espaço entre os itens.",
    visual: "👑 O trono real perfeitamente posicionado.",
    codeExample: "<div style='display: flex; justify-content: space-between;'>\n  <div>Menu</div>\n  <div>Login</div>\n</div>",
    objective: "Crie uma <div> com 'display: flex' e 'justify-content: space-between' contendo dois itens.",
    rewardXP: 300,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('display:flex') && clean.includes('justify-content:space-between');
    }
  }
];

// --- Componentes ---

export default function App() {
  const [level, setLevel] = useState(() => Number(localStorage.getItem('rpg_level')) || 1);
  const [xp, setXp] = useState(() => Number(localStorage.getItem('rpg_xp')) || 0);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(() => Number(localStorage.getItem('rpg_mission_index')) || 0);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [code, setCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState(() => localStorage.getItem('rpg_token'));
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const currentMission = MISSIONS[currentMissionIndex] || MISSIONS[MISSIONS.length - 1];

  // Sync with Backend
  useEffect(() => {
    if (token) {
      fetch('/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.level) {
          setLevel(data.level);
          setXp(data.xp);
          setCurrentMissionIndex(data.mission_index);
          setUser({ username: localStorage.getItem('rpg_username') || 'Aventureiro' });
        }
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('rpg_token');
      });
    }
  }, [token]);

  const syncProgress = async (newLvl: number, newXp: number, newIdx: number) => {
    if (token) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ level: newLvl, xp: newXp, mission_index: newIdx })
      });
    }
  };

  // Persistência Local
  useEffect(() => {
    localStorage.setItem('rpg_level', level.toString());
    localStorage.setItem('rpg_xp', xp.toString());
    localStorage.setItem('rpg_mission_index', currentMissionIndex.toString());
    if (token) syncProgress(level, xp, currentMissionIndex);
  }, [level, xp, currentMissionIndex, token]);

  // Lógica de XP e Nível
  useEffect(() => {
    if (xp >= 100) {
      setLevel(prev => prev + 1);
      setXp(prev => prev - 100);
    }
  }, [xp]);

  const handleAcceptMission = () => {
    setMissionAccepted(true);
    setCode(currentMission.initialCode || "");
  };

  const handleReset = () => {
    if (confirm("Deseja resetar sua jornada, aventureiro?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSubmit = () => {
    if (currentMission.validation(code)) {
      setXp(prev => prev + currentMission.rewardXP);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setMissionAccepted(false);
        if (currentMissionIndex < MISSIONS.length - 1) {
          setCurrentMissionIndex(prev => prev + 1);
        } else {
          alert("Parabéns! Você completou todas as missões disponíveis. Você é um Mestre!");
        }
      }, 3000);
    } else {
      alert("O código ainda não está correto, aventureiro! Verifique se digitou exatamente como no objetivo.");
    }
  };

  const getTitle = (lvl: number) => {
    if (lvl >= 10) return "Mestre do Flexbox";
    if (lvl >= 5) return "Estilista do Código";
    if (lvl >= 3) return "Construtor de Estruturas";
    return "Aprendiz do Código";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (data.error) {
        setAuthError(data.error);
      } else {
        setToken(data.token);
        setUser({ username: data.user.username });
        localStorage.setItem('rpg_token', data.token);
        localStorage.setItem('rpg_username', data.user.username);
        setLevel(data.user.level);
        setXp(data.user.xp);
        setCurrentMissionIndex(data.user.mission_index);
        setShowAuth(false);
      }
    } catch (err) {
      setAuthError('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rpg_token');
    localStorage.removeItem('rpg_username');
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6 font-sans selection:bg-emerald-500/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center space-y-8"
        >
          <div className="flex justify-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Sword className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Github className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white italic font-serif">
            RPG DO CÓDIGO
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-lg mx-auto">
            Uma aventura épica para aprender <span className="text-emerald-400 font-bold underline decoration-emerald-500/30">Desenvolvimento Web</span>. 
            Focado em TDAH e TEA, com micro-missões e recompensas imediatas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setGameStarted(true)}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3"
            >
              INICIAR JORNADA <ChevronRight className="w-6 h-6" />
            </button>
            {!user ? (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => { setShowAuth(true); setAuthMode('login'); }}
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3"
                >
                  ENTRAR / CRIAR CONTA <LogIn className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setGameStarted(true)}
                  className="px-6 py-2 text-slate-500 hover:text-slate-300 text-sm font-bold transition-all"
                >
                  JOGAR COMO CONVIDADO (SEM SALVAR NA NUVEM)
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setGameStarted(true)}
                className="w-full sm:w-auto px-10 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3"
              >
                CONTINUAR COMO {user.username.toUpperCase()}
              </button>
            )}
          </div>

          <div className="pt-12 flex items-center justify-center gap-8 text-slate-500 grayscale opacity-50">
            <div className="flex items-center gap-2"><Code2 className="w-5 h-5" /> HTML5</div>
            <div className="flex items-center gap-2"><Palette className="w-5 h-5" /> CSS3</div>
            <div className="flex items-center gap-2"><Layout className="w-5 h-5" /> Flexbox</div>
          </div>
        </motion.div>

        {/* Modal Auth */}
        <AnimatePresence>
          {showAuth && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">
                    {authMode === 'login' ? 'Entrar na Guilda' : 'Criar Novo Herói'}
                  </h2>
                  <button onClick={() => setShowAuth(false)} className="text-slate-500 hover:text-white">✕</button>
                </div>
                
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1 uppercase">Nome de Usuário</label>
                    <input 
                      type="text" 
                      required
                      value={authForm.username}
                      onChange={e => setAuthForm({...authForm, username: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Ex: GuerreiroDoCodigo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1 uppercase">Senha Mágica</label>
                    <input 
                      type="password" 
                      required
                      value={authForm.password}
                      onChange={e => setAuthForm({...authForm, password: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {authError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {authError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
                  >
                    {authMode === 'login' ? 'ENTRAR AGORA' : 'CRIAR CONTA'}
                  </button>
                </form>

                <div className="space-y-4 text-center">
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors block w-full"
                  >
                    {authMode === 'login' ? 'Não tem conta? Crie uma agora!' : 'Já tem conta? Entre aqui!'}
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1e293b] px-2 text-slate-500 tracking-widest">OU</span></div>
                  </div>

                  <button 
                    onClick={() => { setShowAuth(false); setGameStarted(true); }}
                    className="w-full py-3 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                  >
                    CONTINUAR COMO CONVIDADO
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Sobre */}
        <AnimatePresence>
          {showAbout && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 max-w-2xl w-full space-y-6 shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-white">Sobre o RPG do Código</h2>
                  <button onClick={() => setShowAbout(false)} className="text-slate-500 hover:text-white">✕</button>
                </div>
                <div className="space-y-4 text-slate-400 leading-relaxed">
                  <p>Este projeto foi criado para transformar o aprendizado técnico em uma experiência lúdica e acessível.</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><span className="text-emerald-400 font-bold">Foco em TDAH:</span> Missões curtas, objetivos claros e feedback visual constante evitam a sobrecarga cognitiva.</li>
                    <li><span className="text-blue-400 font-bold">Foco em TEA:</span> Analogias visuais diretas e estrutura previsível facilitam a compreensão de conceitos abstratos.</li>
                    <li><span className="text-yellow-400 font-bold">Gamificação:</span> O sistema de XP e Nível estimula a dopamina de forma saudável através da conquista.</li>
                  </ul>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Github className="w-4 h-4" /> Como colocar no seu GitHub?</h3>
                    <p className="text-sm">Para ver este projeto no seu GitHub, você pode baixar o código fonte e fazer o upload para um novo repositório. Use o botão <strong>Exportar</strong> no menu principal do jogo!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAbout(false)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all"
                >
                  ENTENDI, VAMOS JOGAR!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* GITHUB STYLE HEADER */}
      <header className="border-b border-slate-800 bg-[#1e293b]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setGameStarted(false)}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Sword className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white hidden sm:block">RPG DO CÓDIGO</span>
            </div>
            
            <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-emerald-400">
                <Star className="w-3 h-3 fill-current" /> {currentMission.world}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">NÍVEL {level}</span>
                <span className="text-emerald-400 font-black">{getTitle(level)}</span>
              </div>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${xp}%` }}
                />
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-800 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">HERÓI</p>
                    <p className="text-xs font-bold text-white">{user.username}</p>
                  </div>
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setShowAuth(true); setAuthMode('login'); }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                >
                  <LogIn className="w-3 h-3" /> ENTRAR
                </button>
              )}
            </div>

            <button 
              onClick={handleReset}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
              title="Resetar Progresso"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LADO ESQUERDO: MISSÃO (COL 5) */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {!missionAccepted ? (
              <motion.div 
                key="mission-brief"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#1e293b] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                    MISSÃO {currentMission.id}
                  </div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4 fill-current" /> +{currentMission.rewardXP} XP
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white leading-tight">
                  {currentMission.title}
                </h2>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> O CONCEITO
                    </h3>
                    <p className="text-lg text-slate-300 leading-relaxed">{currentMission.explanation}</p>
                  </section>

                  <section>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                      <Play className="w-3 h-3" /> ANALOGIA VISUAL
                    </h3>
                    <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 text-emerald-300 italic text-lg shadow-inner">
                      {currentMission.visual}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-2">
                      <Code2 className="w-3 h-3" /> PERGAMINHO DE REFERÊNCIA
                    </h3>
                    <div className="relative group">
                      <pre className="p-5 bg-black/60 rounded-2xl border border-slate-800 font-mono text-sm text-blue-300 overflow-x-auto">
                        {currentMission.codeExample}
                      </pre>
                    </div>
                  </section>
                </div>

                <button 
                  onClick={handleAcceptMission}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/30"
                >
                  ACEITAR DESAFIO <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="mission-active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e293b] rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-900/20 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Forjando Código</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Ativo</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                  <h3 className="text-xs uppercase font-bold text-emerald-500/60 mb-1">OBJETIVO DA MISSÃO</h3>
                  <p className="text-lg text-white font-bold leading-snug">{currentMission.objective}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase font-bold text-slate-500">SEU EDITOR</h3>
                    <span className="text-[10px] font-mono text-slate-600">UTF-8 / React / RPG</span>
                  </div>
                  <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-80 bg-black/60 border border-slate-700 rounded-2xl p-5 font-mono text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none text-base leading-relaxed shadow-inner"
                    placeholder="Escreva seu código aqui..."
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-3"
                  >
                    CONCLUIR <CheckCircle2 className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setMissionAccepted(false)}
                    className="px-6 py-5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl font-bold transition-all"
                  >
                    VOLTAR
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LADO DIREITO: PREVIEW / FEEDBACK (COL 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[500px] shadow-2xl">
            <div className="bg-slate-800/50 px-6 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-xs font-mono text-slate-500 tracking-widest uppercase">Visualizador de Artefatos</span>
              </div>
              <div className="flex items-center gap-4">
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <div className="flex-1 bg-white p-8 overflow-auto relative">
              {/* Renderização segura do HTML do usuário */}
              <div className="all-unset" dangerouslySetInnerHTML={{ __html: code }} />
              {code === "" && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-serif italic text-xl pointer-events-none">
                  O resultado da sua magia aparecerá aqui...
                </div>
              )}
            </div>
          </div>

          {/* CONQUISTAS E INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs uppercase font-bold text-slate-500 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> CONQUISTAS
              </h3>
              <div className="flex flex-wrap gap-2">
                {level >= 1 && <Badge icon={<Sword className="w-3 h-3" />} text="Iniciante" color="bg-emerald-500/10 text-emerald-400" />}
                {level >= 3 && <Badge icon={<Layout className="w-3 h-3" />} text="Construtor" color="bg-blue-500/10 text-blue-400" />}
                {level >= 5 && <Badge icon={<Palette className="w-3 h-3" />} text="Estilista" color="bg-purple-500/10 text-purple-400" />}
                {level >= 10 && <Badge icon={<Zap className="w-3 h-3" />} text="Mestre" color="bg-yellow-500/10 text-yellow-400" />}
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs uppercase font-bold text-slate-500 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-500" /> EXPORTAR
              </h3>
              <button 
                onClick={() => setShowExport(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                Ver Instruções GitHub <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL EXPORTAR */}
      <AnimatePresence>
        {showExport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 max-w-2xl w-full space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Github className="w-8 h-8" /> Como levar para o seu GitHub</h2>
                <button onClick={() => setShowExport(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              <div className="space-y-4 text-slate-400">
                <p>Para que este projeto apareça no seu perfil do GitHub, siga estes passos:</p>
                <div className="bg-black/40 p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold">1.</span>
                    <span>Crie um novo repositório no seu GitHub chamado <code className="text-white">rpg-do-codigo</code>.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold">2.</span>
                    <span>No seu computador, abra o terminal e rode:</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg text-blue-300 select-all">
                    git clone [URL_DO_SEU_REPO]<br/>
                    cd rpg-do-codigo
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold">3.</span>
                    <span>Copie os arquivos deste projeto para a pasta.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold">4.</span>
                    <span>Suba as alterações:</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg text-blue-300 select-all">
                    git add .<br/>
                    git commit -m "Iniciando minha jornada no RPG do Código"<br/>
                    git push origin main
                  </div>
                </div>
                <p className="text-sm italic">Dica: Você pode usar o <span className="text-white">GitHub Desktop</span> se preferir uma interface visual!</p>
              </div>
              <button 
                onClick={() => setShowExport(false)}
                className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all"
              >
                FECHAR INSTRUÇÕES
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 mt-12 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span className="font-bold text-slate-400">RPG DO CÓDIGO</span>
            <span>© 2026</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Feito para mentes extraordinárias</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-bold">Documentação</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-bold">Comunidade</a>
          </div>
        </div>
      </footer>

      {/* OVERLAY DE SUCESSO */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1e293b] border-2 border-emerald-500 rounded-[2.5rem] p-12 text-center space-y-8 max-w-md shadow-2xl shadow-emerald-500/30"
            >
              <div className="flex justify-center">
                <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-xl shadow-emerald-500/40">
                  <Trophy className="w-14 h-14 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-white italic tracking-tighter">VITÓRIA!</h2>
                <p className="text-2xl text-emerald-400 font-bold">+{currentMission.rewardXP} XP</p>
              </div>
              <div className="text-slate-400 text-lg leading-relaxed">
                Seu pergaminho brilha com sabedoria. <br/>
                Você está um passo mais próximo do domínio total.
              </div>
              <div className="pt-4">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: `${xp - currentMission.rewardXP}%` }}
                    animate={{ width: `${xp}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Badge({ icon, text, color }: { icon: React.ReactNode, text: string, color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-current/10 text-xs font-bold ${color}`}>
      {icon} {text}
    </div>
  );
}
