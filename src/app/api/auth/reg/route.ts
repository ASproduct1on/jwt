import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const body = await req.json()
	console.log('Данные из формы:', body)

	const apiUrl = 'https://video-blog-nestjs.vercel.app'

	const res = await fetch(`${apiUrl}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})

	if (!res.ok) {
		return NextResponse.json(
			{ error: 'Неверный логин или пароль' },
			{ status: 401 }
		)
	}
}
