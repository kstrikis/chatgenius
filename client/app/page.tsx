import { DemoChat } from '../components/demo-chat'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-primary">Welcome to ChatGenius</h1>
      <div className="w-full max-w-4xl">
        <DemoChat />
      </div>
      <div className="mt-8 space-x-4">
        <Button variant="outline">Sign Up</Button>
        <Button>Log In</Button>
      </div>
    </main>
  )
}

