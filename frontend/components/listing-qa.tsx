'use client'
import { authenticatedFetch } from '@/lib/api'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface QA {
  id: number
  question: string
  answer: string | null
  asker_name: string
  answerer_name: string | null
  created_at: string
  answered_at: string | null
}

export function ListingQA({ listingId, isSeller }: { listingId: number, isSeller: boolean }) {
  const [questions, setQuestions] = useState<QA[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetchQuestions()
  }, [listingId])

  const fetchQuestions = async () => {
    try {
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qa/listing/${listingId}`)
      const data = await res.json()
      if (res.ok) {
        setQuestions(data.questions || [])
      } else {
        setQuestions([])
      }
    } catch (err) {
      console.error(err)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleAsk = async () => {
    if (!newQuestion.trim()) return
    if (!isAuthenticated) {
      router.push(`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    try {
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qa/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, question: newQuestion.trim() })
      })
      if (res.ok) {
        setNewQuestion('')
        fetchQuestions()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to ask question')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAnswer = async (qId: number) => {
    const answerText = answers[qId]
    if (!answerText?.trim()) return

    try {
      const res = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qa/${qId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answerText.trim() })
      })
      if (res.ok) {
        setAnswers(prev => ({ ...prev, [qId]: '' }))
        fetchQuestions()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to submit answer')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Loading Q&A...</div>

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-2xl font-bold">Questions & Answers</h3>

      {!isSeller && (
        <div className="space-y-2">
          <Textarea 
            placeholder="Ask the seller a question..." 
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Button onClick={handleAsk}>Post Question</Button>
        </div>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-muted-foreground">No questions asked yet.</p>
        ) : (
          questions.map(q => (
            <div key={q.id} className="border p-4 rounded-lg space-y-2">
              <p className="font-semibold">Q: {q.question}</p>
              <p className="text-sm text-muted-foreground">Asked by {q.asker_name} on {new Date(q.created_at).toLocaleDateString()}</p>
              
              {q.answer ? (
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="font-semibold text-primary">A: {q.answer}</p>
                  <p className="text-xs text-muted-foreground">Answered by Seller on {new Date(q.answered_at!).toLocaleDateString()}</p>
                </div>
              ) : isSeller ? (
                <div className="mt-4 space-y-2">
                  <Textarea 
                    placeholder="Type your answer..." 
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                  <Button variant="secondary" onClick={() => handleAnswer(q.id)}>Submit Answer</Button>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground mt-2">Awaiting seller response...</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}


