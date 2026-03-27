'use client'

import { format } from 'date-fns'

interface Session {
  id: string
  start_time: string
  duration: number
  focus_rating?: number | null
  notes?: string | null
}

interface SkillSessionHistoryProps {
  sessions: Session[]
}

export default function SkillSessionHistory({ sessions }: SkillSessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-surface-container border border-surface-container-highest">
        <div className="px-6 py-4 border-b border-surface-container-highest">
          <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Session History</p>
        </div>
        <div className="px-6 py-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">No sessions yet. Start practicing to see your history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container border border-surface-container-highest">
      <div className="px-6 py-4 border-b border-surface-container-highest">
        <p className="text-xs uppercase tracking-widest font-sans text-on-surface-variant">Session History (Recent 20)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-container-highest">
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Date</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Duration</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Rating</th>
              <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-sans text-on-surface-variant">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-surface-container-high transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-sans text-sm text-on-surface">{format(new Date(session.start_time), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-on-surface-variant">{format(new Date(session.start_time), 'h:mm a')}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-mono text-sm text-on-surface">{session.duration}m</p>
                </td>
                <td className="px-6 py-4">
                  {session.focus_rating ? (
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-secondary">{'★'.repeat(session.focus_rating)}</p>
                      <p className="text-xs text-on-surface-variant">({session.focus_rating}/5)</p>
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant">—</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {session.notes ? (
                    <p className="text-xs text-on-surface-variant truncate max-w-xs">{session.notes}</p>
                  ) : (
                    <p className="text-xs text-on-surface-variant">—</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
