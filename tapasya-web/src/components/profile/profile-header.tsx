'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { User } from 'lucide-react'
import Image from 'next/image'
import EditProfileModal from './edit-profile-modal'

interface ProfileHeaderProps {
  userId: string
  fullName: string
  username?: string | null
  avatarUrl?: string | null
  createdAt: string
}

export default function ProfileHeader({ userId, fullName, username, avatarUrl, createdAt }: ProfileHeaderProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-surface-container border border-surface-container-highest p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-surface-container-highest flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={fullName ?? 'Profile'} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-on-surface-variant" />
              )}
            </div>
            {/* Name and Info */}
            <div>
              <h1 className="font-newsreader text-3xl italic font-bold text-on-surface mb-1">
                {fullName}
              </h1>
              {username && (
                <p className="text-sm font-sans text-on-surface-variant mb-2">@{username}</p>
              )}
              <p className="text-xs font-sans text-on-surface-variant">
                Member since {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-4 py-2 bg-brand-copper hover:bg-primary-container text-white font-sans text-sm font-semibold transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <EditProfileModal
        userId={userId}
        currentFullName={fullName}
        currentUsername={username}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  )
}
