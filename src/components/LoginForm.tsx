import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User, ChevronRight, Database, Shield } from 'lucide-react'

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Outer glow container */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan rounded-lg opacity-75 blur-sm animate-border-flow" />

      {/* Main card */}
      <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-lg p-8 overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />

        {/* Scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-20" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto border-2 border-primary rounded-lg flex items-center justify-center box-glow-cyan animate-pulse-glow">
              <Database className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-glow tracking-widest uppercase">
            {isLogin ? 'Data Access' : 'New Operator'}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 tracking-wide">
            {isLogin ? 'Authenticate to access datasets' : 'Register for data access'}
          </p>
        </div>

        {/* Data access level indicator */}
        <div className="mb-6 p-3 bg-muted/30 border border-border/50 rounded relative z-10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground tracking-wide">ACCESS LEVEL</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <div className="w-2 h-2 rounded-full bg-primary/30" />
              <span className="ml-2 text-primary tracking-wider">ADMIN</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {!isLogin && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 rounded opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity" />
              <div className="relative flex items-center">
                <User className="absolute left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="OPERATOR ID"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-input/50 border border-border rounded pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all tracking-wider text-sm"
                />
              </div>
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 rounded opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity" />
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-input/50 border border-border rounded pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all tracking-wider text-sm"
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 rounded opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity" />
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="ACCESS KEY"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-input/50 border border-border rounded pl-11 pr-11 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all tracking-wider text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wide"
              >
                RESET ACCESS KEY?
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-magenta opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-magenta blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-card/50 m-[1px] py-3 flex items-center justify-center gap-2 group-hover:bg-transparent transition-colors">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-foreground tracking-widest text-sm font-bold">
                    CONNECTING...
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-foreground group-hover:text-primary-foreground tracking-widest text-sm font-bold transition-colors">
                    {isLogin ? 'ACCESS DATABASE' : 'CREATE OPERATOR'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-foreground group-hover:text-primary-foreground group-hover:translate-x-1 transition-all" />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-muted-foreground text-xs tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide"
          >
            {isLogin ? 'New operator? ' : 'Existing operator? '}
            <span className="text-primary underline underline-offset-4">
              {isLogin ? 'REQUEST ACCESS' : 'SIGN IN'}
            </span>
          </button>
        </div>

        {/* Status bar */}
        <div className="mt-6 pt-4 border-t border-border/50 relative z-10">
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground tracking-wider">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>ENCRYPTED</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>3 NODES</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>SYNCED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
