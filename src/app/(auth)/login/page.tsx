'use client'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
	loginOrEmail: z.string().min(2, {
		message: 'Username must be at least 2 characters.',
	}),

	password: z.string().min(6, {
		message: 'Password must be at least 6 characters.',
	}),
})

export default function Page() {
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitMessage, setSubmitMessage] = useState('')
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			loginOrEmail: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true)
		setSubmitMessage('')

		try {
			console.log('Отправляем данные:', values)

			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})

			console.log('[v0] Ответ от API:', res.status, res.statusText)

			const data = await res.json()
			console.log('[v0] Данные ответа:', data)

			if (!res.ok) {
				setSubmitMessage(`Ошибка: ${data.error || 'Неверный логин или пароль'}`)
				return
			} else {
				router.push('/profile')
			}

			setSubmitMessage('Успешная авторизация!')
			form.reset()
		} catch (error) {
			console.error('Ошибка при отправке:', error)
			setSubmitMessage('Ошибка сети. Попробуйте еще раз.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='flex min-h-screen w-full items-center justify-center p-6 bg-background'>
			<div className='w-full max-w-md space-y-6'>
				<div className='text-center space-y-2'>
					<h1 className='text-2xl font-bold text-foreground'>Форма входа</h1>
					<p className='text-muted-foreground'>Заполните данные для входа</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4 p-6 bg-card border border-border rounded-lg shadow-sm'
					>
						<FormField
							control={form.control}
							name='loginOrEmail'
							render={({ field }) => (
								<FormItem className='space-y-2'>
									<FormLabel>Username</FormLabel>
									<Input placeholder='Enter loginOrEmail' {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem className='space-y-2'>
									<FormLabel className='text-sm font-medium text-foreground'>
										Пароль
									</FormLabel>
									<div className='relative'>
										<Input
											type={showPassword ? 'text' : 'password'}
											placeholder='Введите пароль'
											className='h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
											{...field}
										/>
										<button
											type='button'
											className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground'
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className='h-4 w-4' />
											) : (
												<Eye className='h-4 w-4' />
											)}
										</button>
									</div>
									<FormMessage className='text-sm text-destructive' />
								</FormItem>
							)}
						/>

						{submitMessage && (
							<div
								className={`text-sm p-3 rounded-md ${
									submitMessage.includes('Успешная')
										? 'bg-green-50 text-green-700 border border-green-200'
										: 'bg-red-50 text-red-700 border border-red-200'
								}`}
							>
								{submitMessage}
							</div>
						)}

						<Button type='submit' className='w-full' disabled={isSubmitting}>
							{isSubmitting ? 'Отправка...' : 'Войти'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	)
}
