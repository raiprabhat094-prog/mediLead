import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const navItems = [
  { label: 'Dashboard', href: '#dashboard', marker: 'D' },
  { label: 'AI Mentor', href: '#ai-mentor', marker: 'A' },
  { label: 'Simulations', href: '#simulations', marker: 'S' },
  { label: 'Research', href: '#research', marker: 'R' },
  { label: 'Profile', href: '#profile', marker: 'P' },
]

const roleProfiles = {
  'Nurse manager': {
    context: 'medical-surgical unit',
    concern: 'burnout, short staffing, delegation, and tense shift handoffs',
    scenario: 'Two senior nurses call out before a full census night shift while a new graduate is assigned three high-acuity patients.',
  },
  'Hospital administrator': {
    context: 'multi-department operations huddle',
    concern: 'capacity, patient flow, budget pressure, and executive escalation',
    scenario: 'ED boarding reaches unsafe levels while surgical leadership requests beds for scheduled revenue-generating cases.',
  },
  'Public health officer': {
    context: 'regional outbreak response',
    concern: 'public messaging, equity, emergency coordination, and stakeholder trust',
    scenario: 'A respiratory outbreak is spreading across two districts and community leaders are challenging quarantine guidance.',
  },
  'Department head': {
    context: 'clinical department performance review',
    concern: 'quality improvement, staff accountability, ethics, and interprofessional conflict',
    scenario: 'A preventable safety event exposes gaps between physician practice, nursing escalation, and incident reporting.',
  },
}

const challengeTopics = [
  'Staffing shortage',
  'Conflict management',
  'Emergency response',
  'Patient safety',
  'Communication barrier',
  'Ethical decision',
]

const crisisScenarios = {
  'ICU oxygen crisis': {
    title: 'ICU Oxygen Crisis',
    trigger: 'Oxygen stock falls by 40%, ICU demand rises, and staff are worried about rationing decisions.',
    stakes: 'patient safety, ethical triage, escalation timing',
  },
  'Emergency ward overload': {
    title: 'Emergency Ward Overload',
    trigger: 'The emergency ward has 31 waiting patients, two trauma arrivals, and only one open resuscitation bay.',
    stakes: 'patient flow, team coordination, communication under pressure',
  },
  'Pandemic response': {
    title: 'Pandemic Response Surge',
    trigger: 'Respiratory cases increase 300% over 48 hours while PPE supply and staffing both tighten.',
    stakes: 'public messaging, surge planning, workforce protection',
  },
  'Staff shortage': {
    title: 'Critical Staff Shortage',
    trigger: 'Three senior nurses call out before a full census night shift with multiple high-acuity patients.',
    stakes: 'delegation, scope safety, morale, transparent escalation',
  },
  'Ambulance surge': {
    title: 'Ambulance Surge Command',
    trigger: 'Seven ambulances arrive within 20 minutes after a highway incident and the hospital command center is not yet active.',
    stakes: 'incident command, prioritization, rapid communication',
  },
}

const competencyRubric = [
  { label: 'Communication clarity', score: 82, trend: '+9', color: 'var(--mint)' },
  { label: 'Prioritization', score: 74, trend: '+4', color: 'var(--amber)' },
  { label: 'Ethical reasoning', score: 88, trend: '+11', color: 'var(--teal)' },
  { label: 'Crisis command', score: 69, trend: '+6', color: 'var(--rose)' },
  { label: 'Emotional intelligence', score: 77, trend: '+8', color: 'var(--indigo)' },
]

const learnerTimeline = [
  { step: 'Conversation', detail: 'AI identifies concern, tone, role, context, and competency gaps.' },
  { step: 'Simulation', detail: 'A role-specific scenario is generated from the same leadership challenge.' },
  { step: 'Feedback', detail: 'Decisions are scored for communication, ethics, prioritization, and crisis behavior.' },
  { step: 'Microlearning', detail: 'Short lessons, quizzes, frameworks, and reflections adapt to the score pattern.' },
]

const analytics = [
  { value: '87%', label: 'overall leadership readiness' },
  { value: '12', label: 'adaptive simulations completed' },
  { value: '4.3', label: 'average feedback cycles per case' },
  { value: '92%', label: 'microlearning retention score' },
]

const dashboardCards = [
  { title: 'Next simulation', value: 'ICU oxygen crisis', detail: 'Level 3 adaptive pressure' },
  { title: 'Weakest skill', value: 'Crisis command', detail: 'Needs one guided practice run' },
  { title: 'Recommended lesson', value: 'Safety huddle script', detail: '4 min microlearning' },
]

const decisionOptions = [
  'Open a safety huddle, reassign acuity, escalate staffing risk, and document contingency triggers.',
  'Ask the team to continue while you search for replacement coverage after current tasks are done.',
  'Move available staff from another unit without notifying the house supervisor.',
]

const microLessons = [
  {
    title: 'Two-minute safety huddle script',
    type: 'Communication tip',
    duration: '4 min',
    reason: 'Recommended because your scenario involved emotional tone and unclear escalation.',
  },
  {
    title: 'Acuity-first delegation framework',
    type: 'Leadership framework',
    duration: '6 min',
    reason: 'Targets prioritization, staffing tradeoffs, and transparent decision rights.',
  },
  {
    title: 'Rapid ethical triage quiz',
    type: 'Quiz',
    duration: '5 min',
    reason: 'Reinforces fairness, patient safety, scope of practice, and documentation.',
  },
  {
    title: 'Reflection: pressure without blame',
    type: 'Reflection',
    duration: '3 min',
    reason: 'Builds emotional intelligence after conflict-heavy leadership moments.',
  },
]

const quizQuestions = [
  {
    question: 'In an oxygen shortage, what should a leader do first?',
    answer: 'Activate a safety huddle and use transparent triage criteria.',
  },
  {
    question: 'Which behavior best shows emotional intelligence during staff panic?',
    answer: 'Acknowledge pressure, create role clarity, and communicate next steps calmly.',
  },
  {
    question: 'What makes escalation effective?',
    answer: 'Clear risk level, resource request, time horizon, and documented decision owner.',
  },
]

const researchOutputs = ['Executive summary', 'Key insights', 'Viva questions', 'Flashcards']

const profileStats = [
  ['Current role', 'Nurse leadership track'],
  ['Cohort rank', 'Top 18%'],
  ['Focus area', 'Emergency coordination'],
]

const quickPrompts = [
  'I need to handle a nurse staffing shortage tonight.',
  'Help me respond to conflict between two senior clinicians.',
  'Generate a crisis scenario for an ED surge.',
]

function App() {
  const [selectedRole, setSelectedRole] = useState('Nurse manager')
  const [selectedTopic, setSelectedTopic] = useState('Staffing shortage')
  const [selectedCrisis, setSelectedCrisis] = useState('ICU oxygen crisis')
  const [difficulty, setDifficulty] = useState(2)
  const [selectedDecision, setSelectedDecision] = useState(0)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Tell me about a healthcare leadership challenge. I will detect the problem area, emotional tone, competency gaps, and learning needs, then convert it into a simulation and microlearning path.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('Adaptive pathway ready: staffing shortage -> simulation -> huddle script.')
  const chatEndRef = useRef(null)

  const profile = roleProfiles[selectedRole]
  const crisis = crisisScenarios[selectedCrisis]
  const userMessageCount = messages.filter((message) => message.role === 'user').length

  const diagnosis = useMemo(() => {
    const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')?.content || selectedTopic
    const lowerMessage = latestUserMessage.toLowerCase()
    const tone =
      lowerMessage.includes('angry') || lowerMessage.includes('conflict')
        ? 'tense'
        : lowerMessage.includes('urgent') || lowerMessage.includes('emergency')
          ? 'high-pressure'
          : lowerMessage.includes('burnout') || lowerMessage.includes('short')
            ? 'strained'
            : 'focused'

    return {
      problemArea: selectedTopic,
      tone,
      gap:
        tone === 'high-pressure'
          ? 'crisis command'
          : tone === 'tense'
            ? 'conflict communication'
            : 'prioritization under constraint',
      need: 'practice with concise escalation, ethical tradeoffs, and team-facing feedback',
    }
  }, [messages, selectedTopic])

  const simulationScore = useMemo(() => {
    const base = selectedDecision === 0 ? 86 : selectedDecision === 1 ? 61 : 43
    return Math.max(35, Math.min(96, base - difficulty * 3 + userMessageCount * 2))
  }, [difficulty, selectedDecision, userMessageCount])

  const adaptiveDifficulty = simulationScore > 82 ? 'Increase complexity' : simulationScore < 62 ? 'Return to guided practice' : 'Hold current level'

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const notices = [
      'Adaptive pathway ready: staffing shortage -> simulation -> huddle script.',
      'Skill-gap signal: prioritization is improving; crisis command needs one more practice case.',
      'Recommendation: assign the ethical triage quiz after this simulation.',
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

    const matchedTopic = challengeTopics.find((topic) => text.toLowerCase().includes(topic.toLowerCase().split(' ')[0]))
    if (matchedTopic) setSelectedTopic(matchedTopic)

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are a healthcare leadership coach. Diagnose the issue, competency gap, emotional tone, and next learning action. User: ${text}`,
          history: nextMessages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'The AI mentor is unavailable.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            `Detected ${diagnosis.problemArea.toLowerCase()} with a ${diagnosis.tone} emotional tone. I would generate a ${selectedRole.toLowerCase()} simulation focused on ${diagnosis.gap}, then assign microlearning on escalation, ethics, and team communication.`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setNotice('Voice input is not supported in this browser. Text coaching is ready.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.onresult = (event) => setInput(event.results[0][0].transcript)
    recognition.start()
    setNotice('Listening for your healthcare leadership challenge...')
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Brand />
        <nav className="nav-list">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>
              <span>{item.marker}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="profile-mini">
          <div>NY</div>
          <span>
            <strong>Nurse Yadav</strong>
            <small>Hackathon demo learner</small>
          </span>
        </div>
        <div className="signal-card">
          <p>Live AI signal</p>
          <strong>{notice}</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>AI-powered healthcare leadership development</p>
            <h1>Continuous coaching ecosystem</h1>
          </div>
          <div className="topbar-actions">
            <button className="quiet-button" onClick={startVoice}>Voice</button>
            <a className="primary-button" href="#ai-mentor">Start coaching</a>
          </div>
        </header>

        <section className="hero-grid" id="dashboard">
          <div className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">Hackathon MVP: AI crisis leadership simulator</span>
              <h2>Train hospital leaders through AI-scored crisis decisions, not passive chatbot advice.</h2>
              <p>
                MediLead turns a real healthcare workplace problem into a crisis simulation, scores the user's leadership response, and assigns adaptive microlearning for the same competency gap.
              </p>
            </div>

            <div className="control-grid">
              <ControlGroup label="Role">
                <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
                  {Object.keys(roleProfiles).map((role) => <option key={role}>{role}</option>)}
                </select>
              </ControlGroup>
              <ControlGroup label="Problem area">
                <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>
                  {challengeTopics.map((topic) => <option key={topic}>{topic}</option>)}
                </select>
              </ControlGroup>
              <ControlGroup label={`Difficulty level ${difficulty}`}>
                <input min="1" max="5" type="range" value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value))} />
              </ControlGroup>
            </div>

            <div className="dashboard-cards">
              {dashboardCards.map((card) => (
                <article className="dashboard-card" key={card.title}>
                  <span>{card.title}</span>
                  <strong>{card.value}</strong>
                  <p>{card.detail}</p>
                </article>
              ))}
            </div>

            <div className="crisis-picker">
              {Object.entries(crisisScenarios).map(([key, scenario]) => (
                <button
                  className={selectedCrisis === key ? 'crisis-option active' : 'crisis-option'}
                  key={key}
                  onClick={() => {
                    setSelectedCrisis(key)
                    setSelectedTopic(key.includes('staff') ? 'Staffing shortage' : 'Emergency response')
                  }}
                >
                  <strong>{scenario.title}</strong>
                  <span>{scenario.stakes}</span>
                </button>
              ))}
            </div>

            <div className="timeline">
              {learnerTimeline.map((item, index) => (
                <article key={item.step}>
                  <span>{index + 1}</span>
                  <h3>{item.step}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <DiagnosisPanel diagnosis={diagnosis} profile={profile} selectedRole={selectedRole} />
        </section>

        <section className="two-column" id="ai-mentor">
          <ChatPanel
            chatEndRef={chatEndRef}
            input={input}
            isLoading={isLoading}
            messages={messages}
            onChange={setInput}
            onSend={() => sendMessage()}
            onVoice={startVoice}
            quickPrompts={quickPrompts}
            sendPrompt={sendMessage}
          />
          <section className="panel">
            <PanelHeader eyebrow="Skill-gap analysis" title="Competency map" />
            <div className="competency-list">
              {competencyRubric.map((skill) => (
                <div className="competency-row" key={skill.label}>
                  <div>
                    <strong>{skill.label}</strong>
                    <span>{skill.trend} trend</span>
                  </div>
                  <div className="meter">
                    <i style={{ width: `${skill.score}%`, background: skill.color }} />
                  </div>
                  <b>{skill.score}</b>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="simulation-grid" id="simulations">
          <section className="panel simulation-panel">
            <PanelHeader eyebrow="AI crisis simulation" title={`${crisis.title} for ${selectedRole}`} />
            <div className="scenario-brief">
              <p>{crisis.trigger} {profile.scenario}</p>
              <dl>
                <div><dt>Context</dt><dd>{profile.context}</dd></div>
                <div><dt>Adaptive rule</dt><dd>{adaptiveDifficulty}</dd></div>
                <div><dt>Evaluation</dt><dd>{crisis.stakes}, decision quality, communication, ethics, crisis management</dd></div>
              </dl>
            </div>
            <div className="decision-stack">
              {decisionOptions.map((option, index) => (
                <button
                  className={selectedDecision === index ? 'decision active' : 'decision'}
                  key={option}
                  onClick={() => setSelectedDecision(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="score-panel">
            <PanelHeader eyebrow="Real-time feedback" title="Simulation score" />
            <div className="score-ring" style={{ '--score': `${simulationScore * 3.6}deg` }}>
              <strong>{simulationScore}</strong>
              <span>/100</span>
            </div>
            <p>
              {selectedDecision === 0
                ? 'Strong response. You protected patient safety, used transparent escalation, and supported the team under pressure.'
                : 'This response needs clearer escalation, safer staffing logic, and more explicit communication with the team.'}
            </p>
            <div className="feedback-tags">
              <span>Ethics check</span>
              <span>Crisis readiness</span>
              <span>EI signal</span>
            </div>
          </section>
        </section>

        <section className="two-column" id="microlearning">
          <section className="panel">
            <PanelHeader eyebrow="Adaptive microlearning" title="Personalized next path" />
            <div className="lesson-grid">
              {microLessons.map((lesson) => (
                <article className="lesson-card" key={lesson.title}>
                  <span>{lesson.type}</span>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.reason}</p>
                  <b>{lesson.duration}</b>
                </article>
              ))}
            </div>
          </section>

          <section className="panel recommendation-panel">
            <PanelHeader eyebrow="Personalized recommendations" title="Next best actions" />
            <ol>
              <li>Repeat this simulation at level {Math.min(5, difficulty + 1)} with added family communication pressure.</li>
              <li>Complete the rapid ethical triage quiz before the next crisis case.</li>
              <li>Review one mini case study on escalation without blame.</li>
            </ol>
          </section>
        </section>

        <section className="two-column" id="research">
          <section className="panel">
            <PanelHeader eyebrow="AI-generated quiz" title="Rapid readiness check" />
            <div className="quiz-list">
              {quizQuestions.map((item, index) => (
                <article key={item.question}>
                  <strong>Q{index + 1}. {item.question}</strong>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel research-panel">
            <PanelHeader eyebrow="Research summarizer demo" title="PDF-to-learning workflow" />
            <label className="upload-box">
              <input type="file" accept=".pdf" />
              <span>Upload research PDF</span>
              <strong>Generate summary, insights, viva questions, and flashcards</strong>
            </label>
            <div className="research-output">
              {researchOutputs.map((output) => <span key={output}>{output}</span>)}
            </div>
          </section>
        </section>

        <section className="analytics-grid" id="analytics">
          {analytics.map((item) => (
            <article className="analytics-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="profile-section" id="profile">
          <section className="panel profile-card">
            <PanelHeader eyebrow="Learner profile" title="Personalized leadership track" />
            <div className="profile-main">
              <div className="profile-avatar">NY</div>
              <div>
                <h3>Nurse Yadav</h3>
                <p>Training for hospital crisis leadership with emphasis on ethical triage, communication clarity, and team coordination.</p>
              </div>
            </div>
            <div className="profile-stat-grid">
              {profileStats.map(([label, value]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>
      </section>
    </main>
  )
}

function Brand() {
  return (
    <div className="brand">
      <div>ML</div>
      <span>
        <strong>MediLead AI</strong>
        <small>Leadership coaching OS</small>
      </span>
    </div>
  )
}

function PanelHeader({ eyebrow, title }) {
  return (
    <div className="panel-header">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}

function ControlGroup({ label, children }) {
  return (
    <label className="control-group">
      <span>{label}</span>
      {children}
    </label>
  )
}

function DiagnosisPanel({ diagnosis, profile, selectedRole }) {
  return (
    <section className="diagnosis-panel">
      <PanelHeader eyebrow="Chatbot intelligence" title="Detected learner profile" />
      <div className="diagnosis-grid">
        <InfoTile label="Role" value={selectedRole} />
        <InfoTile label="Problem area" value={diagnosis.problemArea} />
        <InfoTile label="Emotional tone" value={diagnosis.tone} />
        <InfoTile label="Likely gap" value={diagnosis.gap} />
      </div>
      <div className="insight-block">
        <h3>Learning need</h3>
        <p>{diagnosis.need} inside a {profile.context}.</p>
      </div>
      <div className="flow-card">
        <span>Conversation input</span>
        <b>automatically influences</b>
        <span>simulation and lesson pathway</span>
      </div>
    </section>
  )
}

function InfoTile({ label, value }) {
  return (
    <article className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function ChatPanel({ messages, input, isLoading, onChange, onSend, onVoice, quickPrompts, sendPrompt, chatEndRef }) {
  return (
    <section className="chat-panel">
      <div className="chat-heading">
        <PanelHeader eyebrow="AI mentor chatbot" title="Leadership conversation" />
        <button className="quiet-button" onClick={onVoice}>Voice</button>
      </div>
      <div className="message-list">
        {messages.map((message, index) => (
          <div className={message.role === 'user' ? 'message user-message' : 'message ai-message'} key={`${message.role}-${index}`}>
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message typing">
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="prompt-row">
        {quickPrompts.map((prompt) => (
          <button key={prompt} onClick={() => sendPrompt(prompt)}>{prompt}</button>
        ))}
      </div>
      <div className="composer">
        <input
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSend()}
          placeholder="Describe a leadership challenge from your healthcare workplace..."
          value={input}
        />
        <button className="primary-button" disabled={isLoading} onClick={onSend}>Send</button>
      </div>
    </section>
  )
}

export default App
