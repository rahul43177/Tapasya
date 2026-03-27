import LoginForm from '@/components/auth/login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; details?: string }>
}) {
  const { error, message, details } = await searchParams

  return <LoginForm error={error} message={message} details={details} />
}
