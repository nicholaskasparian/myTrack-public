import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="clerk-wrap">
      <div className="surface clerk-shell">
        <SignUp path="/sign-up" routing="path" />
      </div>
    </div>
  )
}
