import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAgentPublic, getAgentHistory, chatWithAgent, bookPropertyVisit, qualifyLead } from "../services/agentApi";

export default function AgentChatPage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("agentSessionId");
    if (existing) return existing;
    const v = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("agentSessionId", v);
    return v;
  });
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("formData");
    return saved
      ? JSON.parse(saved)
      : {
          budget: { minBudget: "", maxBudget: "", flexible: false },
          contact: { name: "", email: "", phone: "", preferredDate: "", preferredTime: "" },
          preferences: { propertyType: "", bedrooms: "", purpose: "", timeline: "" },
        };
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [agentData, chatHistory] = await Promise.all([
          getAgentPublic(id),
          getAgentHistory(id, sessionId),
        ]);
        setAgent(agentData);
        setHistory(chatHistory || []);
        
        // Focus input after load
        setTimeout(() => inputRef.current?.focus(), 100);
      } catch (err) {
        toast.error("Failed to load agent data. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Save form data to sessionStorage on change
  useEffect(() => {
    sessionStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const quickActions = [
    {
      label: "Find 3BHK properties",
      action: () => sendMessage("I'm looking for 3 bedroom properties in good locations"),
      hint: "Specify budget & location",
    },
    {
      label: "Investment properties",
      action: () => sendMessage("Show me properties with good rental yield and appreciation potential"),
      hint: "High ROI focus",
    },
    {
      label: "Schedule visit",
      action: () => setActiveForm("contact"),
      hint: "Quick booking",
    },
    {
      label: "Get market insights",
      action: () => sendMessage("What are the current market trends and prices in this area?"),
      hint: "Local intelligence",
    },
  ];

  const sendMessage = async (text) => {
  const msgToSend = text || message;
  if (!msgToSend?.trim() || isLoading) return;

  setIsLoading(true);

  const optimisticMsg = { 
    sender: "user", 
    text: msgToSend, 
    timestamp: Date.now(),
    id: `msg-${Date.now()}`
  };
  setHistory((prev) => [...prev, optimisticMsg]);
  setMessage("");
  setActiveForm(null);

  try {
    const response = await chatWithAgent(id, sessionId, msgToSend);
    setHistory(response.history || []);

    // Show form if agent asks
    const lastMessage = response.history[response.history.length - 1];
    if (lastMessage?.requiresAction) {
      const formType = lastMessage.requiresAction.replace("ask_", "");
      setActiveForm(formType);
    }

  } catch (err) {
    console.error("sendMessage error:", err);

    // Check for lead validation error
    if (err?.response?.data?.message) {
      const handled = handleQualificationError(err.response.data.message);
      if (handled) return;
    }

    toast.error("Failed to send message. Please try again.");
    setHistory((prev) => prev.filter(msg => msg.id !== optimisticMsg.id));
  } finally {
    setIsLoading(false);
    inputRef.current?.focus();
  }
};

const handleQualificationError = (errorMessage) => {
  const missingFields = [];

  if (/contactInfo\.phone/.test(errorMessage)) missingFields.push("phone");
  if (/contactInfo\.email/.test(errorMessage)) missingFields.push("email");
  if (/contactInfo\.name/.test(errorMessage)) missingFields.push("name");
  if (/qualification\.purpose/.test(errorMessage)) missingFields.push("purpose");

  // Focus form based on missing fields
  if (missingFields.length) {
    setActiveForm("contact"); // phone/email/name are in contact form
    toast.error(`Please provide: ${missingFields.join(", ")}`);
    return true;
  }

  return false;
};

  const handleQuickBooking = (propertyId) => {
    setActiveForm("contact");
    sessionStorage.setItem("pendingBooking", propertyId);
    toast.success("Please fill in your contact details to schedule a visit");
  };

  const validateForm = (type, data) => {
    switch (type) {
      case "budget":
        if (!data.minBudget || !data.maxBudget) return "Please provide both minimum and maximum budget.";
        if (parseFloat(data.minBudget) >= parseFloat(data.maxBudget))
          return "Minimum budget must be less than maximum budget.";
        return null;
      case "contact":
        if (!data.name || !data.email || !data.phone) return "Please fill in all contact fields.";
        if (!/^\S+@\S+\.\S+$/.test(data.email)) return "Please provide a valid email address.";
        if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) return "Please provide a valid phone number.";
        return null;
      case "preferences":
        if (!data.propertyType || !data.bedrooms || !data.purpose)
          return "Please fill in property type, bedrooms, and purpose.";
        return null;
      default:
        return "Invalid form type.";
    }
  };

  const submitQualificationForm = async (type) => {
    const data = formData[type];
    const error = validateForm(type, data);
    if (error) {
      toast.error(error);
      return;
    }

    setIsLoading(true);
    try {
      let message = "";
      let qualificationPayload = {};

      switch (type) {
        case "budget":
          message = `My budget is ₹${Number(data.minBudget).toLocaleString('en-IN')} to ₹${Number(data.maxBudget).toLocaleString('en-IN')}. ${data.flexible ? "Flexible for good options." : ""}`;
          qualificationPayload = { 
            budget: { 
              min: parseFloat(data.minBudget), 
              max: parseFloat(data.maxBudget) 
            } 
          };
          break;

        case "contact":
          message = `Here's my contact info: ${data.name}, ${data.email}, ${data.phone}.`;
          qualificationPayload = {
            contactInfo: { 
              name: data.name, 
              email: data.email, 
              phone: data.phone 
            }
          };

          // Handle booking if there's a pending booking
          const pendingBooking = sessionStorage.getItem("pendingBooking");
          if (pendingBooking) {
            console.log('🔄 Processing pending booking for property:', pendingBooking);
            
            // Combine date and time for booking
            let dateTime;
            if (data.preferredDate && data.preferredTime) {
              dateTime = new Date(`${data.preferredDate}T${data.preferredTime}`);
              console.log('📅 Using specific date/time:', dateTime);
            } else {
              // Default to tomorrow 10 AM if no specific time provided
              dateTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
              dateTime.setHours(10, 0, 0, 0);
              console.log('📅 Using default date/time:', dateTime);
            }

            // Validate date is in the future
            if (dateTime <= new Date()) {
              throw new Error('Please select a future date and time for the visit');
            }

            try {
              const bookingResult = await bookPropertyVisit(id, sessionId, pendingBooking, dateTime, {
                name: data.name,
                email: data.email,
                phone: data.phone,
                notes: `Quick booking from chat - Preferences: ${formData.preferences.propertyType || 'Not specified'}`
              });
              
              console.log('✅ Booking successful:', bookingResult);
              sessionStorage.removeItem("pendingBooking");
              
              // Add booking confirmation to chat
              setHistory(prev => [...prev, {
                sender: "system",
                text: `✅ Visit booked successfully for ${dateTime.toLocaleString()}! Confirmation sent to ${data.email}.`,
                timestamp: Date.now(),
                isBookingConfirmation: true
              }]);
              
              toast.success("Visit booked successfully! Check your email for confirmation.");
            } catch (bookingError) {
              console.error('❌ Booking failed:', bookingError);
              // Don't throw the error here - we still want to save the contact info
              toast.error(`Booking failed: ${bookingError.message}. But your contact info was saved.`);
            }
          }
          break;

        case "preferences":
          message = `I'm looking for a ${data.propertyType} with ${data.bedrooms} bedrooms, for ${data.purpose}.${data.timeline ? ` Timeline: ${data.timeline}.` : ''}`;
          qualificationPayload = {
            propertyType: data.propertyType,
            bedrooms: parseInt(data.bedrooms),
            // Only include purpose if it's a valid enum value
            ...(data.purpose && data.purpose !== "" ? { purpose: data.purpose } : {}),
            timeline: data.timeline || "flexible"
          };
          break;
      }

      // Send qualification data
      console.log('📤 Sending qualification data:', qualificationPayload);
      await qualifyLead(id, sessionId, qualificationPayload);
      
      // Send the message to chat
      await sendMessage(message);
      
      // Clear form data after successful submission
      setFormData((prev) => ({ 
        ...prev, 
        [type]: type === 'contact' ? 
          { ...prev[type], preferredDate: "", preferredTime: "" } : {} 
      }));

    } catch (err) {
      console.error('❌ Form submission error:', err);
      toast.error(err.message || "Failed to submit form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  // Enhanced Form Components
  const BudgetForm = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 animate-fade-in">
      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <span>💰</span> Budget Range
      </h4>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-blue-700 font-medium">Min Budget (₹)</label>
          <input
            type="number"
            placeholder="50,00,000"
            value={formData.budget.minBudget}
            onChange={(e) => handleFormChange("budget", "minBudget", e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-blue-700 font-medium">Max Budget (₹)</label>
          <input
            type="number"
            placeholder="1,00,00,000"
            value={formData.budget.maxBudget}
            onChange={(e) => handleFormChange("budget", "maxBudget", e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-blue-700 mb-3">
        <input
          type="checkbox"
          checked={formData.budget.flexible}
          onChange={(e) => handleFormChange("budget", "flexible", e.target.checked)}
          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
        />
        Flexible budget for the right property
      </label>
      <button
        onClick={() => submitQualificationForm("budget")}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Setting Budget..." : "Set Budget"}
      </button>
    </div>
  );

  const ContactForm = () => {
    const pendingBooking = sessionStorage.getItem("pendingBooking");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 animate-fade-in">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
          <span>{pendingBooking ? "📅" : "📞"}</span>
          {pendingBooking ? "Schedule Property Visit" : "Contact Information"}
        </h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your Full Name *"
            value={formData.contact.name}
            onChange={(e) => handleFormChange("contact", "name", e.target.value)}
            className="w-full p-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="email"
            placeholder="Email Address *"
            value={formData.contact.email}
            onChange={(e) => handleFormChange("contact", "email", e.target.value)}
            className="w-full p-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            value={formData.contact.phone}
            onChange={(e) => handleFormChange("contact", "phone", e.target.value)}
            className="w-full p-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          
          {pendingBooking && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-green-700 font-medium">Preferred Date</label>
                  <input
                    type="date"
                    min={minDate}
                    value={formData.contact.preferredDate}
                    onChange={(e) => handleFormChange("contact", "preferredDate", e.target.value)}
                    className="w-full p-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-green-700 font-medium">Preferred Time</label>
                  <input
                    type="time"
                    value={formData.contact.preferredTime}
                    onChange={(e) => handleFormChange("contact", "preferredTime", e.target.value)}
                    className="w-full p-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-green-600">
                We'll confirm your visit details via email and SMS.
              </p>
            </>
          )}
        </div>
        <button
          onClick={() => submitQualificationForm("contact")}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : pendingBooking ? "Schedule Visit" : "Save Contact Info"}
        </button>
      </div>
    );
  };

  const PreferencesForm = () => (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 animate-fade-in">
      <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
        <span>🎯</span> Property Preferences
      </h4>
      <div className="space-y-3">
        <select
          value={formData.preferences.propertyType}
          onChange={(e) => handleFormChange("preferences", "propertyType", e.target.value)}
          className="w-full p-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select Property Type *</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="independent_house">Independent House</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        
        <select
          value={formData.preferences.bedrooms}
          onChange={(e) => handleFormChange("preferences", "bedrooms", e.target.value)}
          className="w-full p-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select Bedrooms *</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="5">5+ BHK</option>
        </select>
        
        <select
          value={formData.preferences.purpose}
          onChange={(e) => handleFormChange("preferences", "purpose", e.target.value)}
          className="w-full p-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select Purpose (Optional)</option>
          <option value="primary_residence">Primary Residence</option>
          <option value="investment">Investment</option>
          <option value="rental">Rental Income</option>
          <option value="vacation">Vacation Home</option>
          <option value="commercial">Commercial Use</option>
        </select>
        
        <select
          value={formData.preferences.timeline}
          onChange={(e) => handleFormChange("preferences", "timeline", e.target.value)}
          className="w-full p-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Timeline (Optional)</option>
          <option value="immediate">Immediate</option>
          <option value="1-3_months">1-3 Months</option>
          <option value="3-6_months">3-6 Months</option>
          <option value="6-12_months">6-12 Months</option>
          <option value="exploring">Just Exploring</option>
        </select>
      </div>
      <button
        onClick={() => submitQualificationForm("preferences")}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-3"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );

  // In your renderMessage function, add analytics display
  const renderMessage = (msg, idx) => {
    const isUser = msg.sender === "user";
    const isSystem = msg.sender === "system";
    
    if (isSystem) {
      return (
        <div key={idx} className="flex justify-center">
          <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 max-w-md">
            <div className="text-xs text-gray-600 text-center">{msg.text}</div>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[85%] ${
            isUser
              ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl rounded-br-none"
              : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none shadow-sm"
          } px-4 py-3`}
        >
          <div className="text-xs font-semibold opacity-80 mb-1">
            {isUser ? "You" : agent?.name || "Agent"}
          </div>
          <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
          
          {/* Property Analytics Display */}
          {msg.propertyAnalytics && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">📊 Detailed Analytics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Hazards */}
                {msg.propertyAnalytics.hazards && (
                  <div>
                    <h5 className="font-semibold text-red-700 mb-1">🔥 Hazards & Risks</h5>
                    {msg.propertyAnalytics.hazards.map((hazard, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-1">
                        <span className={
                          hazard.level === 'high' ? 'text-red-500' : 
                          hazard.level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }>
                          {hazard.level === 'high' ? '🔴' : hazard.level === 'medium' ? '🟡' : '🟢'}
                        </span>
                        <span>{hazard.type}: {hazard.level} risk</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* ROI */}
                {msg.propertyAnalytics.roi && (
                  <div>
                    <h5 className="font-semibold text-green-700 mb-1">📈 Investment Returns</h5>
                    <div>ROI: {msg.propertyAnalytics.roi.percentage}</div>
                    <div>Appreciation: {msg.propertyAnalytics.roi.appreciation}</div>
                  </div>
                )}
                
                {/* Rental */}
                {msg.propertyAnalytics.rental && (
                  <div>
                    <h5 className="font-semibold text-purple-700 mb-1">💰 Rental Performance</h5>
                    <div>Yield: {msg.propertyAnalytics.rental.yield}</div>
                    <div>Demand: {msg.propertyAnalytics.rental.demand}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {msg.propertyCards?.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {msg.propertyCards.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onQuickBook={handleQuickBooking}
                  onShowAnalytics={(propertyId) => sendMessage(`Show me detailed analytics for ${property.title}`)}
                />
              ))}
            </div>
          )}
          
          {/* Quick Analytics Actions */}
          {msg.quickAnalytics && !msg.propertyAnalytics && (
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                onClick={() => sendMessage(`Show me hazards analysis for these properties`)}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200 transition"
              >
                🔥 Hazards
              </button>
              <button
                onClick={() => sendMessage(`What's the ROI for these properties?`)}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition"
              >
                📈 ROI
              </button>
              <button
                onClick={() => sendMessage(`Show rental yield analytics`)}
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 transition"
              >
                💰 Rental Yield
              </button>
            </div>
          )}
          
          <div className="text-xs mt-2 opacity-70">
            {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!agent && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting you with our agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-gray-900">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm">
              {agent?.avatar ? (
                <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-white">{(agent?.name || "A").charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold truncate">{agent?.name}</h1>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">• Online</span>
              </div>
              <p className="text-sm text-gray-500 truncate max-w-md">
                {agent?.description || agent?.welcomeMessage || "Real Estate Expert"}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
            <span>Session: {sessionId.slice(0, 8)}...</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-6 max-w-6xl mx-auto px-4 py-6 w-full">
        <section className="flex-1 flex flex-col gap-4">
          {history.length === 0 && !isLoading && (
            <div className="mx-auto my-8 text-center max-w-xl animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-3xl shadow-lg mb-4">
                🏠
              </div>
              <h2 className="text-2xl font-semibold mb-2">Hello, I'm {agent?.name} 👋</h2>
              <p className="text-gray-600 mb-6">
                I'll help you find your perfect property. Let's start by understanding what you're looking for!
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 text-sm text-left group"
                  >
                    <div className="font-medium text-gray-800 group-hover:text-sky-700">{action.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{action.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-4" style={{ maxHeight: "60vh" }}>
            <div className="flex flex-col gap-4 px-2">
              {history.map(renderMessage)}
              
              {activeForm === "budget" && <BudgetForm />}
              {activeForm === "contact" && <ContactForm />}
              {activeForm === "preferences" && <PreferencesForm />}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-3">
            <div className="max-w-4xl mx-auto px-2">
              <div className="flex gap-3 items-center">
                <input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about properties, budget, locations, or schedule a visit..."
                  className="flex-1 bg-white border border-gray-200 rounded-3xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400 shadow-sm"
                  disabled={isLoading}
                />
                <button
                  disabled={!message.trim() || isLoading}
                  onClick={() => sendMessage()}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-80 hidden lg:block sticky top-24 self-start">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-800">Quick Start</h4>
            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-sky-50 border border-gray-100 transition-all duration-200 group"
                >
                  <div className="font-medium text-gray-800 group-hover:text-sky-700">{action.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-sky-600">{action.hint}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-800">Agent Profile</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Experience:</span>
                <span className="font-medium">{agent?.experience || "5+ years"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Specialization:</span>
                <span className="font-medium">{agent?.specialization || "Residential"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Success Rate:</span>
                <span className="font-medium text-green-600">{agent?.successRate || "95%"}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="text-gray-500 mb-1">Contact:</div>
                <a 
                  href={`mailto:${agent?.contactEmail}`} 
                  className="text-sky-600 hover:underline break-all text-xs"
                >
                  {agent?.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

const PropertyCard = ({ property, onQuickBook }) => (
  <article className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200 group">
    {property.image ? (
      <div className="w-full h-40 bg-gray-50 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
    ) : (
      <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-400">
        <span className="text-sm">No image available</span>
      </div>
    )}
    <div className="p-3">
      <h3 className="text-sm font-semibold leading-tight truncate text-gray-800">{property.title}</h3>
      <p className="text-xs text-gray-500 truncate mt-1">{property.location}</p>
      
      {property.highlights && (
        <div className="mt-2 flex flex-wrap gap-1">
          {property.highlights.split(", ").map((highlight, idx) => (
            <span 
              key={idx} 
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {highlight}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-900">
            {property.price ? `₹${property.price.toLocaleString('en-IN')}` : "Price on request"}
          </div>
          <div className="text-xs text-gray-500">
            {property.bedrooms ? `${property.bedrooms} BHK` : ""}
            {property.area ? ` · ${property.area} sq ft` : ""}
            {property.bathrooms ? ` · ${property.bathrooms} Bath` : ""}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-all duration-200 font-medium"
            onClick={() => onQuickBook(property.id)}
          >
            Book visit
          </button>
          <button
            className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
            onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?property=${property.id}`);
              toast.success("Property link copied!");
            }}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  </article>
);

// Add some custom styles for animations
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);