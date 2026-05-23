import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const navItems = ['Dashboard', 'AI Mentor', 'Research', 'Simulations', 'Microlearning']

const stats = [
  { label: 'Active Learners', value: '12,840', detail: '+18% this month' },
  { label: 'AI Simulations', value: '426', detail: '89 live cohorts' },
  { label: 'Completion Rate', value: '94%', detail: '8.7 learner NPS' },
  { label: 'Hospitals Connected', value: '82', detail: '14 regions' },
]

const researchCards = [
  {
    title: 'Healthcare Leadership Trends',
    signal: 'High confidence',
    summary: 'Team resilience, digital transformation, and transparent escalation models are driving leadership training priorities.',
  },
  {
    title: 'AI in Hospital Management',
    signal: '42 papers mapped',
    summary: 'Operational AI is strongest in capacity planning, discharge forecasting, patient flow, and workforce allocation.',
  },
  {
    title: 'Emergency Response Leadership',
    signal: 'Live protocol watch',
    summary: 'The highest-performing leaders combine incident command discipline with calm, concise communication rhythms.',
  },
  {
    title: 'Predictive Healthcare Analytics',
    signal: 'Model-ready',
    summary: 'Predictive indicators improve training when linked to clear decision rights, ethics checks, and measurable outcomes.',
  },
]

const simulations = [
  { title: 'ICU Crisis Management', difficulty: 'Advanced', progress: 72, evaluation: 'AI evaluates triage, staffing, escalation, and family communication.' },
  { title: 'Emergency Ward Leadership', difficulty: 'Intermediate', progress: 58, evaluation: 'AI scores speed, clarity, resource allocation, and team safety.' },
  { title: 'Pandemic Response Coordination', difficulty: 'Expert', progress: 46, evaluation: 'AI reviews surge planning, command structure, and public messaging.' },
  { title: 'Patient Safety Decision Making', difficulty: 'Foundational', progress: 84, evaluation: 'AI checks risk framing, disclosure, reporting, and prevention actions.' },
]

const modules = [
  { title: 'Adaptive Rounds Brief', minutes: 7, progress: 88, quiz: '5-question AI quiz ready' },
  { title: 'Crisis Communication Sprint', minutes: 9, progress: 64, quiz: 'Scenario quiz generated' },
  { title: 'Ethical AI Governance', minutes: 12, progress: 42, quiz: 'Policy checks included' },
  { title: 'Quality Improvement Coach', minutes: 8, progress: 76, quiz: 'Root-cause quiz ready' },
]

const leaderboard = [
  ['Dr. Aisha Rao', '2,940 XP'],
  ['Michael Chen', '2,720 XP'],
  ['Nurse Lead Priya', '2,510 XP'],
]

const quickPrompts = [
  'How should I lead during an ICU staffing shortage?',
  'Create a patient safety debrief checklist.',
  'Explain AI governance for hospital leaders.',
]

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Welcome to MediLead AI. Ask me about healthcare leadership, crisis coordination, quality improvement, or AI-enabled hospital operations.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('New AI recommendation: complete Crisis Communication Sprint today.')
  const [activeAuth, setActiveAuth] = useState('login')
  const chatEndRef = useRef(null)

  const streak = useMemo(() => Math.max(1, messages.filter((message) => message.role === 'user').length + 14), [messages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const notices = [
      'New AI recommendation: complete Crisis Communication Sprint today.',
      'Research alert: predictive analytics summary refreshed.',
      'Simulation update: ICU Crisis Management cohort improved 12%.',
    ]
    const timer = setInterval(() => {
      setNotice((current) => notices[(notices.indexOf(current) + 1) % notices.length])
    }, 5200)

    return () => clearInterval(timer)
  }, [])

  const sendMessage = async (overrideText) => {
    const text = (overrideText || input).trim()
    if (!text || isLoading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: nextMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'The AI mentor is unavailable.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            error.message ||
            'I could not reach the AI mentor. Check that the Express server is running and OPENAI_API_KEY is set.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setNotice('Voice assistant is not supported in this browser. Text chat is ready.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.onresult = (event) => setInput(event.results[0][0].transcript)
    recognition.start()
    setNotice('Listening for your leadership question...')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#06111f] text-slate-100">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-20%] h-[34rem] w-[34rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-12%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[30%] h-[30rem] w-[30rem] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-72 border-r border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl lg:block">
        <Brand />
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <a
              href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
              key={item}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-white"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.8)] transition group-hover:scale-125" />
              {item}
            </a>
          ))}
        </nav>

        <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">AI Signal</p>
          <p className="mt-2 text-sm text-slate-200">{notice}</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#06111f]/80 px-5 py-4 backdrop-blur-2xl sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <Brand compact />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-slate-400">Healthcare leadership intelligence command center</p>
              <h1 className="text-2xl font-semibold text-white">MediLead AI Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="glass-button" onClick={startVoice}>Voice AI</button>
              <a href="#auth" className="primary-button">Join cohort</a>
            </div>
          </div>
        </header>

        <section className="grid gap-6 px-5 py-8 sm:px-8 xl:grid-cols-[1.1fr_.9fr]" id="dashboard">
          <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <span className="pill">AI + hospital leadership + research learning</span>
            <h2 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl">
              Train decisive healthcare leaders with an AI mentor beside every learner.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              MediLead AI combines GPT-powered mentorship, scenario simulations, adaptive microlearning, research summarization, notes, quizzes, and progress intelligence in one premium learning platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#ai-mentor" className="primary-button">Launch AI mentor</a>
              <a href="#simulations" className="glass-button">Start simulation</a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <MetricCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          <ChatPanel
            input={input}
            isLoading={isLoading}
            messages={messages}
            onChange={setInput}
            onSend={() => sendMessage()}
            onVoice={startVoice}
            quickPrompts={quickPrompts}
            sendPrompt={sendMessage}
            chatEndRef={chatEndRef}
          />
        </section>

        <section className="grid gap-6 px-5 pb-8 sm:px-8 xl:grid-cols-[.95fr_1.05fr]" id="research">
          <Panel title="AI Research Assistant" eyebrow="Evidence intelligence">
            <div className="grid gap-4 sm:grid-cols-2">
              {researchCards.map((card) => (
                <article className="interactive-card" key={card.title}>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{card.signal}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{card.summary}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="AI-Generated Summaries" eyebrow="Research dashboard">
            <div className="grid gap-4 sm:grid-cols-3">
              {['3.8K sources', '91% relevance', '18 insights'].map((value, index) => (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5" key={value}>
                  <p className="text-3xl font-bold text-white">{value}</p>
                  <p className="mt-2 text-sm text-slate-400">{['screened', 'match score', 'this week'][index]}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <h3 className="text-lg font-semibold text-white">PDF Research Summarizer</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Upload-ready workflow for turning leadership papers into executive briefs, discussion prompts, quiz questions, and implementation notes.
              </p>
            </div>
          </Panel>
        </section>

        <section className="px-5 pb-8 sm:px-8" id="simulations">
          <Panel title="Scenario-Based Leadership Simulation" eyebrow="Decision practice">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {simulations.map((simulation) => (
                <SimulationCard key={simulation.title} simulation={simulation} />
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 px-5 pb-8 sm:px-8 xl:grid-cols-[1.2fr_.8fr]" id="microlearning">
          <Panel title="AI Microlearning Modules" eyebrow="Personalized pathways">
            <div className="grid gap-4 md:grid-cols-2">
              {modules.map((module) => (
                <ModuleCard key={module.title} module={module} />
              ))}
            </div>
          </Panel>

          <Panel title="Gamification" eyebrow={`${streak}-day learning streak`}>
            <div className="space-y-4">
              {leaderboard.map(([name, score], index) => (
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={name}>
                  <div>
                    <p className="font-semibold text-white">{index + 1}. {name}</p>
                    <p className="text-sm text-slate-400">Simulation mastery rank</p>
                  </div>
                  <p className="font-bold text-cyan-200">{score}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl border border-blue-300/20 bg-blue-300/10 p-5">
              <h3 className="font-semibold text-white">AI Recommendation Engine</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Next path: emergency response leadership, ethical AI governance, and patient safety decision review.
              </p>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 px-5 pb-10 sm:px-8 xl:grid-cols-[.9fr_1.1fr]" id="auth">
          <AuthPanel activeAuth={activeAuth} setActiveAuth={setActiveAuth} />
          <Panel title="AI Notes & Quiz Generator" eyebrow="Advanced tools">
            <div className="grid gap-4 sm:grid-cols-2">
              {['Voice AI assistant', 'AI-generated healthcare quizzes', 'Real-time notifications', 'AI-powered notes generator'].map((tool) => (
                <div className="interactive-card" key={tool}>
                  <h3 className="text-lg font-semibold text-white">{tool}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Built into the learning workflow for personalized coaching, reinforcement, and leadership reflection.
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  )
}

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,.25)]">
        <span className="text-xl font-black text-cyan-100">M</span>
      </div>
      {!compact && (
        <div>
          <p className="text-xl font-black text-white">MediLead AI</p>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Healthcare mentor OS</p>
        </div>
      )}
    </div>
  )
}

function MetricCard({ label, value, detail }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/10">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-medium text-slate-200">{label}</p>
      <p className="mt-1 text-xs text-cyan-200">{detail}</p>
    </article>
  )
}

function Panel({ eyebrow, title, children }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-cyan-950/20 backdrop-blur-2xl sm:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ChatPanel({ messages, input, isLoading, onChange, onSend, onVoice, quickPrompts, sendPrompt, chatEndRef }) {
  return (
    <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl" id="ai-mentor">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Live OpenAI mentor</p>
          <h2 className="mt-2 text-2xl font-bold text-white">AI Healthcare Leadership Chatbot</h2>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">Online</span>
      </div>

      <div className="mt-5 flex h-[410px] flex-col gap-4 overflow-y-auto rounded-3xl border border-white/10 bg-black/20 p-4">
        {messages.map((message, index) => (
          <div className={message.role === 'user' ? 'message user-message' : 'message ai-message'} key={`${message.role}-${index}`}>
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message flex w-fit items-center gap-2">
            <span className="typing-dot" />
            <span className="typing-dot animation-delay-150" />
            <span className="typing-dot animation-delay-300" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button className="prompt-chip" key={prompt} onClick={() => sendPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button className="glass-button px-4" onClick={onVoice}>Voice</button>
        <input
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSend()}
          placeholder="Ask your AI healthcare mentor..."
          value={input}
        />
        <button className="primary-button" disabled={isLoading} onClick={onSend}>Send</button>
      </div>
    </section>
  )
}

function SimulationCard({ simulation }) {
  return (
    <article className="interactive-card">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white">{simulation.title}</h3>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{simulation.difficulty}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{simulation.evaluation}</p>
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Progress tracking</span>
          <span>{simulation.progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" style={{ width: `${simulation.progress}%` }} />
        </div>
      </div>
      <button className="mt-5 w-full rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20">
        Start simulation
      </button>
    </article>
  )
}

function ModuleCard({ module }) {
  return (
    <article className="interactive-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">{module.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{module.minutes} min adaptive module</p>
        </div>
        <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">{module.progress}%</span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-400" style={{ width: `${module.progress}%` }} />
      </div>
      <p className="mt-4 text-sm text-cyan-100">{module.quiz}</p>
      <button className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
        Continue learning
      </button>
    </article>
  )
}

function AuthPanel({ activeAuth, setActiveAuth }) {
  return (
    <Panel title={activeAuth === 'login' ? 'Welcome Back' : 'Create Account'} eyebrow="Authentication UI">
      <div className="mb-5 grid grid-cols-2 rounded-2xl border border-white/10 bg-black/20 p-1">
        {['login', 'signup'].map((mode) => (
          <button
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${activeAuth === mode ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:text-white'}`}
            key={mode}
            onClick={() => setActiveAuth(mode)}
          >
            {mode === 'login' ? 'Login' : 'Signup'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {activeAuth === 'signup' && <input className="auth-input" placeholder="Full name" />}
        <input className="auth-input" placeholder="Clinical email" />
        <input className="auth-input" placeholder="Password" type="password" />
        <button className="primary-button w-full justify-center">{activeAuth === 'login' ? 'Enter dashboard' : 'Create learning profile'}</button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button className="glass-button justify-center">Google</button>
        <button className="glass-button justify-center">Microsoft</button>
      </div>
    </Panel>
  )
}

export default App
