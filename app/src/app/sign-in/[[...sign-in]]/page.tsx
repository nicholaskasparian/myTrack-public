import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="clerk-wrap">
      <div className="surface clerk-shell">
        <SignIn path="/sign-in" routing="path" />
      </div>
    </div>
  )
}
