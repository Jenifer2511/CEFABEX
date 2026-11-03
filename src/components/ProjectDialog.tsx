import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

type Props = { open: boolean; onClose: () => void; initialService?: string }
type Errors = { name?: string; email?: string; notes?: string }

const serviceOptions = ['Web experiences', 'Mobile applications', 'Custom software', 'Still exploring']

function DiagonalArrow() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function ProjectDialog({ open, onClose, initialService }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const notesRef = useRef<HTMLTextAreaElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('Still exploring')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [prepared, setPrepared] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      if (initialService && serviceOptions.includes(initialService)) setService(initialService)
      dialog.showModal()
    } else if (!open && dialog.open) dialog.close()
  }, [open, initialService])

  useEffect(() => {
    if (prepared && open) resultRef.current?.focus()
  }, [prepared, open])

  const brief = `CEFABEX — Project enquiry\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nInterested in: ${service}\n\nThe idea\n${notes.trim()}\n`

  function prepareBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Please enter your name.'
    if (!email.trim() || !emailRef.current?.validity.valid) next.email = 'Please enter a valid email address.'
    if (notes.trim().length < 10) next.notes = 'Tell us a little more about your idea, in at least 10 characters.'
    setErrors(next)
    if (next.name) nameRef.current?.focus()
    else if (next.email) emailRef.current?.focus()
    else if (next.notes) notesRef.current?.focus()
    else { setPrepared(true); setCopyMessage('') }
  }

  async function copyBrief() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(brief)
      else {
        const area = document.createElement('textarea')
        area.value = brief
        area.style.position = 'fixed'
        area.style.opacity = '0'
        dialogRef.current?.appendChild(area)
        area.select()
        const copied = document.execCommand('copy')
        area.remove()
        if (!copied) throw new Error('Clipboard unavailable')
      }
      setCopyMessage('Brief copied.')
    } catch {
      setCopyMessage('Could not copy the brief. Use Download brief instead.')
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'cefabex-project-brief.txt'
    dialogRef.current?.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return <dialog ref={dialogRef} className="brief-dialog" data-lenis-prevent aria-labelledby="brief-title" onCancel={(event) => { event.preventDefault(); onClose() }} onClose={() => { if (open) onClose() }} onClick={(event) => {
    if (event.target !== event.currentTarget) return
    const box = event.currentTarget.getBoundingClientRect()
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
  }}>
    <button type="button" className="brief-close" onClick={onClose} aria-label="Close project enquiry"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
    {!prepared ? <>
      <h2 id="brief-title">Start something good.</h2>
      <p className="brief-intro">Tell us what you have in mind.<br />Let’s shape the next step.</p>
      <form className="brief-form" onSubmit={prepareBrief} noValidate>
        <div className="brief-form-row">
          <div className="brief-field"><label htmlFor="brief-name">Your name</label><input id="brief-name" ref={nameRef} name="name" autoComplete="name" required maxLength={120} value={name} onChange={(event) => { setName(event.target.value); setErrors((value) => ({ ...value, name: undefined })) }} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'brief-name-error' : undefined} />{errors.name && <p id="brief-name-error" className="brief-error" role="alert">{errors.name}</p>}</div>
          <div className="brief-field"><label htmlFor="brief-email">Email address</label><input id="brief-email" ref={emailRef} name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); setErrors((value) => ({ ...value, email: undefined })) }} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'brief-email-error' : undefined} />{errors.email && <p id="brief-email-error" className="brief-error" role="alert">{errors.email}</p>}</div>
        </div>
        <div className="brief-field"><label htmlFor="brief-service">What are you thinking?</label><select id="brief-service" name="service" value={service} onChange={(event) => setService(event.target.value)}>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="brief-field"><label htmlFor="brief-notes">A little about your idea</label><textarea id="brief-notes" ref={notesRef} name="notes" rows={4} required minLength={10} maxLength={4000} placeholder="The problem, the possibility, the thing you can’t stop thinking about…" value={notes} onChange={(event) => { setNotes(event.target.value); setErrors((value) => ({ ...value, notes: undefined })) }} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'brief-notes-error' : undefined} />{errors.notes && <p id="brief-notes-error" className="brief-error" role="alert">{errors.notes}</p>}</div>
        <p className="brief-privacy">Create a brief to copy or download. Your details stay in this browser until you choose to share them.</p>
        <button type="submit" className="brief-submit">Prepare enquiry <DiagonalArrow /></button>
      </form>
    </> : <div className="brief-result">
      <h2 id="brief-title" ref={resultRef} tabIndex={-1}>Your project brief.</h2>
      <p className="brief-intro">Open your brief in your email app, or copy or download it. Nothing is sent until you send the email.</p>
      <pre className="brief-preview">{brief}</pre>
      <div className="brief-result-actions"><button type="button" className="brief-submit" onClick={copyBrief}>Copy enquiry <DiagonalArrow /></button><button type="button" className="brief-secondary" onClick={downloadBrief}>Download brief</button><a className="brief-secondary" href={`mailto:cefabex.cfb@gmail.com?subject=${encodeURIComponent("CEFABEX project enquiry")}&body=${encodeURIComponent(brief)}`}>Open in email</a></div>
      <p className="brief-copy-status" role="status" aria-live="polite">{copyMessage}</p>
      <button type="button" className="brief-edit" onClick={() => { setPrepared(false); setCopyMessage(''); window.requestAnimationFrame(() => nameRef.current?.focus()) }}>Edit your brief</button>
    </div>}
  </dialog>
}
