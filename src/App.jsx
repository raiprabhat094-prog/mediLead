import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getJson, postJson } from './services/api'

const roles = ['Nurse manager', 'Hospital administrator', 'Public health officer', 'Department head']

const starterPrompts = [
  'Two nurses called out before a high-acuity night shift and the team is worried about safety.',
  'Nursing and case management are blaming each other after a delayed discharge.',
  'Our oxygen supply may be delayed during a respiratory surge.',
]

const emptyDiagnosis = {
  problemArea: 'Not analyzed yet',
  emotionalTone: 'Not analyzed yet',
  competencyGap: 'Not analyzed yet',
  learningNeed: 'Describe a challenge and run the coaching flow.',
}

function App() {
  const [theme, setTheme] = useState('light')
  const [role, setRole] = useState(roles[0])
  const [difficulty, setDifficulty] = useState(3)
  const [message, setMessage] = useState(starterPrompts[0])
  const [chatReply, setChatReply] = useState('Describe a real healthcare leadership challenge, then run the coach.')
  const [diagnosis, setDiagnosis] = useState(emptyDiagnosis)
  const [simulation, setSimulation] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [learning, setLearning] = useState(null)
  const [selectedDecision, setSelectedDecision] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('Voice assistant ready')
  const [isListening, setIsListening] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const canListen = Boolean(SpeechRecognition)
  const canSpeak = Boolean(window.speechSynthesis)
  const isDark = theme === 'dark'
  const hasDiagnosis = diagnosis.problemArea !== emptyDiagnosis.problemArea
  const hasSimulation = Boolean(simulation)
  const hasEvaluation = Boolean(evaluation)
  const hasLearning = Boolean(learning)

  const overallScore = useMemo(() => {
    if (!evaluation) return 0
    return Math.round(
      (evaluation.score +
        evaluation.communication +
        evaluation.ethics +
        evaluation.crisisLeadership +
        evaluation.emotionalIntelligence) / 5,
    )
  }, [evaluation])

  const workflowSteps = [
    ['1', 'Intake', true],
    ['2', 'Diagnosis', hasDiagnosis],
    ['3', 'Simulation', hasSimulation],
    ['4', 'Feedback', hasEvaluation],
    ['5', 'Learning', hasLearning],
  ]

  useEffect(() => {
    let mounted = true

    getJson('/health')
      .then(() => {
        if (mounted) setBackendStatus('online')
      })
      .catch(() => {
        if (mounted) setBackendStatus('offline')
      })

    return () => {
      mounted = false
    }
  }, [])

  async function generateScenario(currentDiagnosis = diagnosis) {
    if (!currentDiagnosis.problemArea || currentDiagnosis.problemArea === emptyDiagnosis.problemArea) {
      await runCoachingFlow()
      return
    }

    setIsLoading(true)
    setEvaluation(null)
    setLearning(null)
    setSelectedDecision('')

    try {
      const simulationData = await postJson('/simulate', {
        role,
        crisis: currentDiagnosis.problemArea,
        difficulty,
      })

      setSimulation(simulationData)
      setChatReply(`Scenario refreshed for ${role} at Level ${difficulty}. Choose a decision to receive feedback.`)
    } catch (error) {
      setChatReply(error.message || 'Could not regenerate the scenario. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  function resetWorkspace() {
    window.speechSynthesis?.cancel()
    recognitionRef.current?.stop()
    setMessage(starterPrompts[0])
    setChatReply('Describe a real healthcare leadership challenge, then run the coach.')
    setDiagnosis(emptyDiagnosis)
    setSimulation(null)
    setEvaluation(null)
    setLearning(null)
    setSelectedDecision('')
    setVoiceStatus('Voice assistant ready')
    setIsListening(false)
  }

  async function runCoachingFlow(nextMessage = message) {
    const trimmed = nextMessage.trim()
    if (!trimmed) return

    setIsLoading(true)
    setMessage(trimmed)
    setEvaluation(null)
    setLearning(null)
    setSelectedDecision('')

    try {
      const [chatData, diagnosisData] = await Promise.all([
        postJson('/chat', { message: trimmed, history: [] }),
        postJson('/diagnose', { message: trimmed }),
      ])

      const simulationData = await postJson('/simulate', {
        role,
        crisis: diagnosisData.problemArea,
        difficulty,
      })

      setChatReply(chatData.reply)
      setDiagnosis(diagnosisData)
      setSimulation(simulationData)
    } catch (error) {
      setChatReply(error.message || 'The coaching service could not respond. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function evaluateDecision(decision) {
    if (!simulation) return

    setSelectedDecision(decision)
    setIsLoading(true)

    try {
      const evaluationData = await postJson('/evaluate', {
        scenario: simulation.scenario,
        decision,
      })

      const learningData = await postJson('/microlearning', {
        evaluation: evaluationData,
        diagnosis,
        role,
      })

      setEvaluation(evaluationData)
      setLearning(learningData)
    } catch (error) {
      setChatReply(error.message || 'Evaluation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function startListening() {
    if (!canListen) {
      setVoiceStatus('Voice input is not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onstart = () => {
      setIsListening(true)
      setVoiceStatus('Listening...')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setVoiceStatus(`Captured: "${transcript}"`)
      runCoachingFlow(transcript)
    }

    recognition.onerror = () => {
      setVoiceStatus('Could not capture audio clearly. Try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  function speakReply() {
    if (!canSpeak) {
      setVoiceStatus('Voice playback is not supported in this browser.')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(chatReply)
    utterance.rate = 0.95
    utterance.onstart = () => setVoiceStatus('Reading assistant reply...')
    utterance.onend = () => setVoiceStatus('Voice assistant ready')
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className={`app ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <header className="app-header">
        <section className="brand-lockup">
          <div className="brand-mark">HL</div>
          <div>
            <p>HealthLead AI</p>
            <h1>Healthcare leadership coaching workspace</h1>
          </div>
        </section>
        <button className="theme-button" onClick={() => setTheme(isDark ? 'light' : 'dark')} type="button">
          {isDark ? 'Bright mode' : 'Dark mode'}
        </button>
      </header>

      <section className="hero-card">
        <div>
          <span className="eyebrow">Full-stack AI coaching system</span>
          <h2>Turn workplace pressure into scenario practice, feedback, and adaptive learning.</h2>
          <p>
            The backend analyzes the challenge, generates a role-specific scenario, scores the
            decision, and returns personalized microlearning for the learner.
          </p>
        </div>
        <aside className="hero-stats">
          <article>
            <strong>{role}</strong>
            <span>active role</span>
          </article>
          <article>
            <strong>Level {difficulty}</strong>
            <span>difficulty</span>
          </article>
          <article>
            <strong>{overallScore || '--'}</strong>
            <span>latest score</span>
          </article>
          <article>
            <strong className={`backend-dot ${backendStatus}`}>{backendStatus}</strong>
            <span>backend status</span>
          </article>
        </aside>
      </section>

      <nav className="workflow" aria-label="Coaching progress">
        {workflowSteps.map(([number, label, complete]) => (
          <div className={complete ? 'workflow-step complete' : 'workflow-step'} key={label}>
            <span>{number}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </nav>

      <section className="layout">
        <aside className="panel setup-panel accent-panel">
          <h2>Setup</h2>
          <label>
            Role
            <select disabled={isLoading} value={role} onChange={(event) => setRole(event.target.value)}>
              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Difficulty
            <input
              max="5"
              min="1"
              onChange={(event) => setDifficulty(Number(event.target.value))}
              disabled={isLoading}
              type="range"
              value={difficulty}
            />
            <span>Level {difficulty}</span>
          </label>
          <div className="setup-actions">
            <button className="secondary" disabled={isLoading} onClick={() => generateScenario()} type="button">
              Apply setup
            </button>
            <button className="secondary" disabled={isLoading} onClick={resetWorkspace} type="button">
              Reset
            </button>
          </div>
          <div className="status-box">
            <strong>{backendStatus === 'online' ? 'Backend connected' : 'Backend check'}</strong>
            <span>
              {backendStatus === 'online'
                ? 'Express API is ready for chat, simulation, evaluation, and learning.'
                : 'Start the full app with npm run dev:full if actions do not respond.'}
            </span>
          </div>
          <div className="mini-stack">
            <span>Live modules</span>
            <strong>Chat</strong>
            <strong>Diagnosis</strong>
            <strong>Simulation</strong>
            <strong>Microlearning</strong>
          </div>
        </aside>

        <section className="panel chat-panel primary-panel">
          <div className="section-title">
            <div>
              <p>Step 1</p>
              <h2>Describe the leadership challenge</h2>
            </div>
            <div className="button-row">
              <button
                className={isListening ? 'secondary active' : 'secondary'}
                disabled={isLoading}
                onClick={startListening}
                type="button"
              >
                {isListening ? 'Stop' : 'Speak'}
              </button>
              <button className="secondary" disabled={!chatReply} onClick={speakReply} type="button">Read reply</button>
            </div>
          </div>

          <textarea
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Example: I need to manage a staffing shortage while keeping morale and patient safety stable..."
            disabled={isLoading}
            value={message}
          />

          <div className="prompt-list">
            {starterPrompts.map((prompt) => (
              <button disabled={isLoading} key={prompt} onClick={() => runCoachingFlow(prompt)} type="button">
                {prompt}
              </button>
            ))}
          </div>

          <button className="primary" disabled={isLoading} onClick={() => runCoachingFlow()} type="button">
            {isLoading ? 'Working...' : 'Run AI coach'}
          </button>

          <p className={isListening ? 'voice-status listening' : 'voice-status'}>{voiceStatus}</p>
          <article className="assistant-reply">
            <strong>Assistant response</strong>
            <p>{chatReply}</p>
          </article>
        </section>
      </section>

      <section className="grid">
        <article className="panel diagnosis-card">
          <p className="step">Step 2</p>
          <h2>Diagnosis</h2>
          <div className="facts">
            <span>Problem area</span>
            <strong>{diagnosis.problemArea}</strong>
            <span>Emotional tone</span>
            <strong>{diagnosis.emotionalTone}</strong>
            <span>Competency gap</span>
            <strong>{diagnosis.competencyGap}</strong>
            <span>Learning need</span>
            <strong>{diagnosis.learningNeed}</strong>
          </div>
        </article>

        <article className="panel scenario-card">
          <p className="step">Step 3</p>
          <h2>Scenario simulation</h2>
          {simulation ? (
            <>
              <h3>{simulation.title}</h3>
              <p>{simulation.scenario}</p>
              <small>{simulation.stakes}</small>
              <div className="decision-list">
                {simulation.decisions.map((decision) => (
                  <button
                    className={selectedDecision === decision ? 'decision selected' : 'decision'}
                    disabled={isLoading}
                    key={decision}
                    onClick={() => evaluateDecision(decision)}
                    type="button"
                  >
                    {decision}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="empty">Run the AI coach to generate a scenario.</p>
          )}
        </article>
      </section>

      <section className="grid">
        <article className="panel performance-card">
          <p className="step">Step 4</p>
          <h2>Performance</h2>
          {evaluation ? (
            <>
              <div className="score">{overallScore}<span>/100</span></div>
              <p>{evaluation.feedback}</p>
              <div className="metrics">
                {[
                  ['Communication', evaluation.communication],
                  ['Ethics', evaluation.ethics],
                  ['Crisis leadership', evaluation.crisisLeadership],
                  ['Emotional intelligence', evaluation.emotionalIntelligence],
                ].map(([label, value]) => (
                  <span key={label}>
                    <i>{label}</i>
                    <em><b style={{ width: `${value}%` }} /></em>
                    <strong>{value}</strong>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="empty">Choose a decision to receive feedback.</p>
          )}
        </article>

        <article className="panel learning-card">
          <p className="step">Step 5</p>
          <h2>Adaptive microlearning</h2>
          {learning ? (
            <>
              <div className="lesson-list">
                {learning.lessons.map((lesson) => (
                  <section className="lesson" key={lesson.title}>
                    <span>{lesson.type} - {lesson.duration}</span>
                    <strong>{lesson.title}</strong>
                    <p>{lesson.reason}</p>
                  </section>
                ))}
              </div>
              <h3>Recommendations</h3>
              <ul>
                {learning.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty">Microlearning appears after evaluation.</p>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
