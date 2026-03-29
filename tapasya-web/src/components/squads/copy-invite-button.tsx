'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyInviteButtonProps {
  inviteCode: string
}

export default function CopyInviteButton({ inviteCode }: CopyInviteButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-2 hover:bg-surface-container transition-colors"
      title={copied ? 'Copied!' : 'Copy invite code'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-on-surface-variant" />
      )}
    </button>
  )
}
