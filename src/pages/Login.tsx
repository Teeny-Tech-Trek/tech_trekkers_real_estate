import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, Building, Sparkles, TrendingUp, MessageSquare, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is managed in AuthContext
    }
  };

  const floatingIcons = [
    { Icon: Building, delay: 0, x: -20, y: -30 },
    { Icon: Calendar, delay: 0.2, x: 20, y: -20 },
    { Icon: MessageSquare, delay: 0.4, x: -15, y: 25 },
    { Icon: TrendingUp, delay: 0.6, x: 25, y: 20 },
    { Icon: BarChart3, delay: 0.8, x: -25, y: -15 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />

        {/* Floating Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
      </div>

      {/* Floating Icons Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              x: [0, x, 0],
              y: [0, y, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{
              left: `${20 + index * 15}%`,
              top: `${15 + index * 12}%`,
            }}
          >
            <Icon className="w-12 h-12 text-blue-300/40" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <Building className="h-10 w-10 text-white relative z-10" />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-3xl border-2 border-blue-300"
            />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2"
          >
            Welcome Back
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-200/80 mt-2 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Real Estate Platform
            <Sparkles className="w-4 h-4" />
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden relative">
            {/* Card Shine Effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
            />

            <CardHeader className="text-center pb-6 relative">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Sign In
              </CardTitle>
              <CardDescription className="text-blue-200/70 mt-2">
                Access your AI agent dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-white/90 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300/60 group-focus-within:text-blue-400 transition-colors z-10" size={18} />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agent@realestate.ai"
                      className="pl-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-200/40 focus:bg-white/10 focus:border-blue-400/50 transition-all duration-300 rounded-xl backdrop-blur-sm"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-white/90 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300/60 group-focus-within:text-blue-400 transition-colors z-10" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-14 bg-white/5 border-white/20 text-white placeholder:text-blue-200/40 focus:bg-white/10 focus:border-blue-400/50 transition-all duration-300 rounded-xl backdrop-blur-sm"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300/60 hover:text-blue-400 transition-colors z-10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-white/30 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2 cursor-pointer"
                    />
                    <span className="text-sm text-blue-200/80 group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <Link to="#" className="text-sm text-blue-300 hover:text-white font-medium transition-colors relative group">
                    Forgot password?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-blue-400/60 transition-all duration-300 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </span>
                    <motion.div
                      animate={{
                        x: ['0%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </Button>
                </motion.div>
              </form>

              {/* Sign Up Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center relative"
              >
                <div className="relative inline-block">
                  <p className="text-sm text-blue-200/70">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      className="text-blue-300 hover:text-white font-semibold transition-colors relative group inline-flex items-center gap-1"
                    >
                      Sign up for free
                      <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-300" />
                    </Link>
                  </p>
                </div>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8 flex flex-wrap gap-2 justify-center"
              >
                {[
                  { icon: Calendar, text: 'Book Visits' },
                  { icon: MessageSquare, text: 'AI Chat' },
                  { icon: BarChart3, text: 'Analytics' },
                  { icon: TrendingUp, text: 'Lead Tracking' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center gap-1.5 text-xs text-blue-200/80"
                  >
                    <feature.icon className="w-3 h-3" />
                    {feature.text}
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-blue-300/50 text-xs flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Secured with enterprise-grade encryption
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;