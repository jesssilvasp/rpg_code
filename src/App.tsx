/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Code2
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
    title: "Criar seu primeiro artefato HTML",
    explanation: "HTML é o esqueleto de um site. Sem ele, não temos nada!",
    visual: "🦴 HTML é como a estrutura de uma casa (vigas e tijolos).",
    codeExample: "<html>\n  <body>\n    Olá aventureiro\n  </body>\n</html>",
    objective: "Digite a estrutura básica do HTML com a mensagem 'Olá aventureiro' dentro do body.",
    rewardXP: 50,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('<html>') && clean.includes('<body>') && clean.includes('oláaventureiro') && clean.includes('</body>') && clean.includes('</html>');
    }
  },
  {
    id: 2,
    world: "Mundo 1 — O Reino do HTML",
    title: "O Título do Herói",
    explanation: "Títulos (h1) dão nome às coisas e são fáceis de ler.",
    visual: "📜 O <h1> é como o nome de um capítulo em um livro.",
    codeExample: "<h1>Meu Nome de Herói</h1>",
    objective: "Adicione um título <h1> com o seu nome de herói dentro do body.",
    rewardXP: 50,
    initialCode: "<html>\n  <body>\n    \n  </body>\n</html>",
    validation: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('<h1') && clean.includes('</h1>');
    }
  },
  {
    id: 3,
    world: "Mundo 1 — O Reino do HTML",
    title: "A Voz do Povo (Parágrafos)",
    explanation: "O parágrafo <p> é usado para textos comuns, como histórias ou descrições.",
    visual: "📝 O <p> é como uma linha de texto em uma carta.",
    codeExample: "<p>Era uma vez um código...</p>",
    objective: "Adicione um parágrafo <p> com uma breve descrição da sua missão abaixo do título.",
    rewardXP: 50,
    initialCode: "<html>\n  <body>\n    <h1>Meu Herói</h1>\n    \n  </body>\n</html>",
    validation: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('<p') && clean.includes('</p>');
    }
  },
  {
    id: 4,
    world: "Mundo 1 — O Reino do HTML",
    title: "As Caixas Mágicas (Divs)",
    explanation: "A <div> é uma caixa invisível que agrupa outros elementos. É a base de tudo!",
    visual: "📦 A <div> é como uma caixa de papelão onde você guarda seus brinquedos.",
    codeExample: "<div>\n  <h1>Título</h1>\n  <p>Texto</p>\n</div>",
    objective: "Envolva seu título e parágrafo dentro de uma <div>.",
    rewardXP: 50,
    initialCode: "<h1>Herói</h1>\n<p>Missão</p>",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('<div>') && clean.includes('</div>') && clean.indexOf('<div>') < clean.indexOf('<h1') && clean.indexOf('</div>') > clean.indexOf('</p>');
    }
  },
  {
    id: 5,
    world: "Mundo 2 — O Reino das Cores (CSS)",
    title: "Pintando o Mundo",
    explanation: "CSS dá cor e vida ao HTML. Usamos o atributo 'style' para começar.",
    visual: "🎨 CSS é como a tinta que passamos nas paredes da casa.",
    codeExample: "<h1 style='color: blue;'>Céu Azul</h1>",
    objective: "Mude a cor do seu título para 'red' (vermelho) usando style='color: red;'.",
    rewardXP: 50,
    initialCode: "<h1>Título Vermelho</h1>",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('style="color:red"') || clean.includes("style='color:red'");
    }
  },
  {
    id: 6,
    world: "Mundo 1 — O Reino do HTML",
    title: "CHEFE DO MUNDO: Página de Perfil",
    explanation: "Você aprendeu o básico. Agora, crie seu perfil de aventureiro!",
    visual: "🏆 O Chefe do Mundo exige que você use tudo o que aprendeu.",
    codeExample: "<div>\n  <h1>Nome</h1>\n  <p>Bio</p>\n</div>",
    objective: "Crie uma <div> contendo um <h1> com seu nome e um <p> com sua classe (ex: Guerreiro do Código).",
    rewardXP: 300,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase();
      return clean.includes('<div') && clean.includes('</div>') && clean.includes('<h1') && clean.includes('</h1>') && clean.includes('<p') && clean.includes('</p>');
    }
  },
  {
    id: 7,
    world: "Mundo 2 — O Reino das Cores (CSS)",
    title: "Aumentando o Poder (Font-size)",
    explanation: "Podemos mudar o tamanho das letras com 'font-size'.",
    visual: "🔍 É como usar uma lupa para ver as letras maiores.",
    codeExample: "<p style='font-size: 30px;'>Texto Grande</p>",
    objective: "Crie um parágrafo <p> com o texto 'PODER MÁXIMO' e tamanho de fonte '40px'.",
    rewardXP: 50,
    initialCode: "",
    validation: (code) => {
      const clean = code.toLowerCase().replace(/\s/g, '');
      return clean.includes('font-size:40px') && clean.includes('podermáximo');
    }
  }
];

// --- Componentes ---

export default function App() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [title, setTitle] = useState("Aprendiz do Código");
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [code, setCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const currentMission = MISSIONS[currentMissionIndex];

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
          // Fim da demo ou loop
          alert("Parabéns! Você completou as missões disponíveis nesta demo.");
        }
      }, 3000);
    } else {
      alert("O código ainda não está correto, aventureiro! Tente novamente.");
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-6 font-sans selection:bg-emerald-500/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Sword className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white italic font-serif">
            RPG DO CÓDIGO
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Bem-vindo, <span className="text-emerald-400 font-bold">Aprendiz do Código</span>.<br/>
            Sua jornada para se tornar o <span className="text-emerald-400 font-bold">Mestre do Flexbox</span> começa agora.
          </p>
          <button 
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/20 flex items-center gap-2 mx-auto"
          >
            INICIAR AVENTURA <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* STATUS BAR */}
      <header className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center">
              <Shield className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">STATUS DO JOGADOR</p>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">Nível: {level}</span>
                <span className="text-slate-400">|</span>
                <span className="text-emerald-400 font-bold">XP: {xp} / 100</span>
                <span className="text-slate-400">|</span>
                <span className="text-white italic">{title}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${xp}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LADO ESQUERDO: MISSÃO */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!missionAccepted ? (
              <motion.div 
                key="mission-brief"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#1e293b] rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-tighter text-sm">
                  <Star className="w-4 h-4" /> {currentMission.world}
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  MISSÃO {currentMission.id} — {currentMission.title}
                </h2>
                
                <div className="space-y-4">
                  <section>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-2 flex items-center gap-2">
                      <BookOpen className="w-3 h-3" /> EXPLICAÇÃO CURTA
                    </h3>
                    <p className="text-lg text-slate-300">{currentMission.explanation}</p>
                  </section>

                  <section>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-2 flex items-center gap-2">
                      <Play className="w-3 h-3" /> EXEMPLO VISUAL
                    </h3>
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-emerald-300 italic">
                      {currentMission.visual}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-2 flex items-center gap-2">
                      <Code2 className="w-3 h-3" /> CÓDIGO DE REFERÊNCIA
                    </h3>
                    <pre className="p-4 bg-black/40 rounded-xl border border-slate-800 font-mono text-sm text-blue-300 overflow-x-auto">
                      {currentMission.codeExample}
                    </pre>
                  </section>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-emerald-400 font-bold">
                    RECOMPENSA: +{currentMission.rewardXP} XP
                  </div>
                  <button 
                    onClick={handleAcceptMission}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                  >
                    ACEITAR MISSÃO <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="mission-active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e293b] rounded-2xl p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-900/10 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Missão Ativa</h2>
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                    EM PROGRESSO
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-slate-500">OBJETIVO</h3>
                  <p className="text-lg text-white font-medium">{currentMission.objective}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-slate-500">SEU PERGAMINHO DE CÓDIGO</h3>
                  <textarea 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-64 bg-black/40 border border-slate-700 rounded-xl p-4 font-mono text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                    placeholder="Escreva seu código aqui..."
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    CONCLUIR MISSÃO <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setMissionAccepted(false)}
                    className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all"
                  >
                    DESISTIR
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LADO DIREITO: PREVIEW / FEEDBACK */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-slate-400">VISUALIZADOR DE ARTEFATOS</span>
            </div>
            <div className="flex-1 bg-white p-6 overflow-auto">
              {/* Renderização segura do HTML do usuário */}
              <div dangerouslySetInnerHTML={{ __html: code }} />
            </div>
          </div>

          {/* CONQUISTAS / PROGRESSO */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs uppercase font-bold text-slate-500 flex items-center gap-2">
              <Trophy className="w-3 h-3" /> CONQUISTAS DESBLOQUEADAS
            </h3>
            <div className="flex flex-wrap gap-3">
              {level > 1 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" /> Nível 2 Alcançado
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-500 rounded-lg border border-slate-700 text-sm font-bold opacity-50">
                <Layout className="w-4 h-4" /> Construtor de Estruturas
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-500 rounded-lg border border-slate-700 text-sm font-bold opacity-50">
                <Palette className="w-4 h-4" /> Estilista do Código
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OVERLAY DE SUCESSO */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1e293b] border-2 border-emerald-500 rounded-3xl p-10 text-center space-y-6 max-w-md shadow-2xl shadow-emerald-500/20"
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white italic">MISSÃO CUMPRIDA!</h2>
              <p className="text-xl text-emerald-400 font-bold">+{currentMission.rewardXP} XP ADQUIRIDOS</p>
              <div className="text-slate-400">
                Você está mais próximo de se tornar um Mestre.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
