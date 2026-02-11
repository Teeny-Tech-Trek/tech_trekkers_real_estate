import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api'; // Import the signup API function

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  accountType: string;
  password: string;
}

export const useSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    accountType: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // Assuming the signup API might expect 'company' instead of 'companyName'
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        accountType: formData.accountType,
      };

      if (formData.accountType === 'organization') {
        payload.company = formData.companyName;
      }

      const { user } = await signup(payload);
      console.log('Signup successful:', user);
      navigate('/login'); // Redirect to login on success
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return {
    formData,
    showPassword,
    handleSubmit,
    handleChange,
    togglePasswordVisibility,
    navigateToLogin,
    isLoading, // Expose isLoading
    error, // Expose error
    features
  };
};