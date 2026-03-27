import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode | string
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      {icon && (
        <div className="text-6xl mb-4">
          {typeof icon === 'string' ? icon : icon}
        </div>
      )}
      <h3 className="font-newsreader italic text-xl font-semibold text-on-surface mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-on-surface-variant mb-4 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
