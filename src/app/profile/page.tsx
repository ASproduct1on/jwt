// app/profile/page.tsx
import { cookies } from 'next/headers'

export default async function ProfilePage() {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('accessToken')?.value
	console.log('accessToken', accessToken)

	const res = await fetch(`https://video-blog-nestjs.vercel.app/auth/me`, {
		headers: { Authorization: `Bearer ${accessToken}` },
		cache: 'no-store',
		credentials: 'include',
	})

	if (!res.ok) {
		return <div>Unauthorized</div>
	}

	const user = await res.json()
	return <div>Привет, {user.email}</div>
}
