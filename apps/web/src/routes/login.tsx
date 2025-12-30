import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, LoginFormData } from '@/features/auth/login.schema'
import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth.store'
import { jwtDecode } from 'jwt-decode'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type JwtPayload = {
  sub: string
}

function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    const response = await api<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const decoded = jwtDecode<JwtPayload>(response.accessToken)

    login({
      user: { id: decoded.sub, email: data.email },
      accessToken: response.accessToken,
    })

    navigate({ to: '/' })
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Email" {...register('email')} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-zinc-600">Não tem uma conta? </span>
        <Link 
          to="/register" 
          className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  )
}
