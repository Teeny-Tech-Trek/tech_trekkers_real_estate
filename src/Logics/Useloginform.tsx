import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';


interface LoginFormaData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormaData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const features = [
    { 
      icon: "🎭",
      label: "Avatar Creation", 
      value: "Unlimited",
      description: "Create as many AI agents as you need"
    },
    { 
      icon: "🎯",
      label: "Lead Capture", 
      value: "24/7",
      description: "Never miss a potential client"
    },
    { 
      icon: "🔗",
      label: "CRM Integration", 
      value: "All Major",
      description: "Seamless connection to your tools"
    },
    { 
      icon: "📊",
      label: "Analytics", 
      value: "Real-time",
      description: "Track performance instantly"
    },
    { 
      icon: "💰",
      label: "Commission", 
      value: "1% Auto-calc",
      description: "Automatic commission tracking"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { email, password, rememberMe } = formData;
      await authLogin(email, password);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    isLoading,
    error,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    navigateToSignup,
    features
  };
};
