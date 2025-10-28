
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAgentPublic,
  getAgentHistory,
  chatWithAgent,
  bookPropertyVisit,
  qualifyLead,
} from "../services/agentApi";

/**
 * Types (kept permissive to avoid long refactors)
 */
type AnyObj = Record<string, any>;
type Message = {
  sender: "user" | "agent" | "system";
  text: string;
  timestamp?: number;
  id?: string;
  requiresAction?: string;
  propertyAnalytics?: AnyObj;
  propertyCards?: AnyObj[];
  quickAnalytics?: AnyObj;
  isBookingConfirmation?: boolean;
};
type Agent = {
  name?: string;
  avatar?: string;
  description?: string;
  welcomeMessage?: string;
  [k: string]: any;
};
type Property = AnyObj;

export default function AgentChatPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("agentSessionId");
    if (existing) return existing;
    const v = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("agentSessionId", v);
    return v;
  });

  const [activeForm, setActiveForm] = useState<null | "budget" | "contact" | "preferences">(null);

  const [formData, setFormData] = useState<any>(() => {
    const saved = sessionStorage.getItem("formData");
    return saved
      ? JSON.parse(saved)
      : {
          budget: { minBudget: "", maxBudget: "", flexible: false },
          contact: { name: "", email: "", phone: "", preferredDate: "", preferredTime: "" },
          preferences: { propertyType: "", bedrooms: "", purpose: "", timeline: "" },
        };
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formInputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [agentData, chatHistory] = await Promise.all([getAgentPublic(id), getAgentHistory(id, sessionId)]);
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

  useEffect(() => {
    sessionStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (activeForm && formInputRef.current) {
      setTimeout(() => formInputRef.current?.focus(), 100);
    }
  }, [activeForm]);

  const quickActions = [
    {
      label: "🏠 Find 3BHK",
      action: () => sendMessage("I'm looking for 3 bedroom properties in good locations"),
      hint: "Specify budget & location",
      icon: "🔍",
    },
    {
      label: "📈 Investment",
      action: () => sendMessage("Show me properties with good rental yield and appreciation potential"),
      hint: "High ROI focus",
      icon: "💹",
    },
    {
      label: "📅 Schedule Visit",
      action: () => setActiveForm("contact"),
      hint: "Quick booking",
      icon: "📋",
    },
    {
      label: "📊 Market Insights",
      action: () => sendMessage("What are the current market trends and prices in this area?"),
      hint: "Local intelligence",
      icon: "📉",
    },
  ];

  const sendMessage = async (text?: string) => {
    const msgToSend = text || message;
    if (!msgToSend?.trim() || isLoading) return;

    setIsLoading(true);

    const optimisticMsg: Message = {
      sender: "user",
      text: msgToSend,
      timestamp: Date.now(),
      id: `msg-${Date.now()}`,
    };
    setHistory((prev) => [...prev, optimisticMsg]);
    setMessage("");
    setActiveForm(null);

    try {
      const response = await chatWithAgent(id, sessionId, msgToSend);
      setHistory(response.history || []);

      const lastMessage = response.history[response.history.length - 1];
      if (lastMessage?.requiresAction) {
        const formType = lastMessage.requiresAction.replace("ask_", "");
        if (formType === "budget" || formType === "contact" || formType === "preferences") {
          setActiveForm(formType as any);
        }
      }
    } catch (err: any) {
      console.error("sendMessage error:", err);

      if (err?.response?.data?.message) {
        const handled = handleQualificationError(err.response.data.message);
        if (handled) {
          setIsLoading(false);
          return;
        }
      }

      toast.error("Failed to send message. Please try again.");
      setHistory((prev) => prev.filter((msg) => msg.id !== optimisticMsg.id));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQualificationError = (errorMessage: string) => {
    const missingFields: string[] = [];

    if (/contactInfo\.phone/.test(errorMessage)) missingFields.push("phone");
    if (/contactInfo\.email/.test(errorMessage)) missingFields.push("email");
    if (/contactInfo\.name/.test(errorMessage)) missingFields.push("name");
    if (/qualification\.purpose/.test(errorMessage)) missingFields.push("purpose");

    if (missingFields.length) {
      setActiveForm("contact");
      toast.error(`Please provide: ${missingFields.join(", ")}`);
      return true;
    }

    return false;
  };

  const handleQuickBooking = (propertyId: string) => {
    setActiveForm("contact");
    sessionStorage.setItem("pendingBooking", propertyId);
    toast.success("Please fill in your contact details to schedule a visit");
  };

  const validateForm = (type: string, data: any) => {
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

  const submitQualificationForm = async (type: string) => {
    const data = formData[type];
    const error = validateForm(type, data);
    if (error) {
      toast.error(error);
      return;
    }

    setIsLoading(true);
    try {
      let messageText = "";
      let qualificationPayload: AnyObj = {};

      switch (type) {
        case "budget":
          messageText = `My budget is ₹${Number(data.minBudget).toLocaleString("en-IN")} to ₹${Number(
            data.maxBudget
          ).toLocaleString("en-IN")}. ${data.flexible ? "Flexible for good options." : ""}`;
          qualificationPayload = {
            budget: {
              min: parseFloat(data.minBudget),
              max: parseFloat(data.maxBudget),
            },
          };
          break;

        case "contact":
          messageText = `Here's my contact info: ${data.name}, ${data.email}, ${data.phone}.`;
          qualificationPayload = {
            contactInfo: {
              name: data.name,
              email: data.email,
              phone: data.phone,
            },
          };

          const pendingBooking = sessionStorage.getItem("pendingBooking");
          if (pendingBooking) {
            let dateTime;
            if (data.preferredDate && data.preferredTime) {
              dateTime = new Date(`${data.preferredDate}T${data.preferredTime}`);
            } else {
              dateTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
              dateTime.setHours(10, 0, 0, 0);
            }

            if (dateTime <= new Date()) {
              throw new Error("Please select a future date and time for the visit");
            }

            try {
              const bookingResult = await bookPropertyVisit(id, sessionId, pendingBooking, dateTime, {
                name: data.name,
                email: data.email,
                phone: data.phone,
                notes: `Quick booking from chat - Preferences: ${formData.preferences.propertyType || "Not specified"}`,
              });

              sessionStorage.removeItem("pendingBooking");

              setHistory((prev) => [
                ...prev,
                {
                  sender: "system",
                  text: `✅ Visit booked successfully for ${dateTime.toLocaleString()}! Confirmation sent to ${data.email}.`,
                  timestamp: Date.now(),
                  isBookingConfirmation: true,
                },
              ]);

              toast.success("Visit booked successfully! Check your email for confirmation.");
            } catch (bookingError: any) {
              toast.error(`Booking failed: ${bookingError?.message || "Unknown error"}. But your contact info was saved.`);
            }
          }
          break;

        case "preferences":
          messageText = `I'm looking for a ${data.propertyType} with ${data.bedrooms} bedrooms, for ${data.purpose}.${
            data.timeline ? ` Timeline: ${data.timeline}.` : ""
          }`;
          qualificationPayload = {
            propertyType: data.propertyType,
            bedrooms: parseInt(data.bedrooms, 10),
            ...(data.purpose && data.purpose !== "" ? { purpose: data.purpose } : {}),
            timeline: data.timeline || "flexible",
          };
          break;
      }

      await qualifyLead(id, sessionId, qualificationPayload);

      await sendMessage(messageText);

      setFormData((prev: any) => ({
        ...prev,
        [type]: type === "contact" ? { ...prev[type], preferredDate: "", preferredTime: "" } : {},
      }));
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit form. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (type: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const renderMessage = (msg: Message, idx: number) => {
    const isUser = msg.sender === "user";
    const isSystem = msg.sender === "system";

    if (isSystem) {
      return (
        <div key={idx} className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-2xl px-6 py-4 max-w-md shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>💡</span>
              <span>{msg.text}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
        <div
          className={`max-w-[80%] ${
            isUser
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-3xl rounded-br-md shadow-lg"
              : "bg-white border border-gray-100 text-gray-800 rounded-3xl rounded-bl-md shadow-lg"
          } px-6 py-4 relative group`}
        >
          <div className="flex items-center gap-2 mb-2">
            {!isUser && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-xs text-white font-bold">
                {agent?.name?.charAt(0) || "A"}
              </div>
            )}
            <div className={`text-xs font-semibold ${isUser ? "text-blue-100" : "text-gray-500"}`}>
              {isUser ? "You" : agent?.name || "Property Expert"}
            </div>
            {!isUser && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>}
          </div>

          <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</div>

          {msg.propertyAnalytics && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50 backdrop-blur-sm">
              <h4 className="font-bold text-blue-900 mb-3 text-sm flex items-center gap-2">
                <span>📊</span>
                Detailed Property Analytics
              </h4>
              {/* ... analytics rendering omitted for brevity (keeps same structure) */}
            </div>
          )}

          {msg.propertyCards?.length > 0 && (
            <div className="mt-4 space-y-4">
              <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <span>🏘️</span>
                Matching Properties ({msg.propertyCards.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {msg.propertyCards.map((property: Property) => (
                  <EnhancedPropertyCard
                    key={property.id}
                    property={property}
                    onQuickBook={handleQuickBooking}
                    onShowAnalytics={(propertyId: string) => sendMessage(`Show me detailed analytics for ${property.title}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {msg.quickAnalytics && !msg.propertyAnalytics && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => sendMessage(`Show me hazards analysis for these properties`)}
                className="text-xs bg-red-50 text-red-700 px-3 py-2 rounded-full hover:bg-red-100 transition-all duration-200 border border-red-200 hover:border-red-300 font-medium flex items-center gap-1"
              >
                <span>⚠️</span>
                Hazards
              </button>
              <button
                onClick={() => sendMessage(`What's the ROI for these properties?`)}
                className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-full hover:bg-green-100 transition-all duration-200 border border-green-200 hover:border-green-300 font-medium flex items-center gap-1"
              >
                <span>📈</span>
                ROI Analysis
              </button>
              <button
                onClick={() => sendMessage(`Show rental yield analytics`)}
                className="text-xs bg-purple-50 text-purple-700 px-3 py-2 rounded-full hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300 font-medium flex items-center gap-1"
              >
                <span>💰</span>
                Rental Yield
              </button>
            </div>
          )}

          <div className={`text-xs mt-3 ${isUser ? "text-blue-200" : "text-gray-400"} text-right`}>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Connecting you with our expert</h3>
          <p className="text-gray-600">Loading your personalized property assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-blue-50/30 to-indigo-50/30 text-gray-900">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
                {agent?.avatar ? (
                  <img src={agent.avatar} alt={agent.avatar} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">{(agent?.avatar || "A").charAt(0)}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 truncate">{agent?.name}</h1>
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  • Online
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate max-w-md">
                {agent?.description || agent?.welcomeMessage || "Real Estate Expert & Property Consultant"}
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <span className="font-mono">ID: {sessionId.slice(0, 8)}...</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-8 max-w-7xl mx-auto px-4 py-8 w-full">
        <section className="flex-1 flex flex-col gap-6">
          {history.length === 0 && !isLoading && (
            <div className="mx-auto my-12 text-center max-w-2xl animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-4xl shadow-2xl mb-6">
                🏠
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Hello, I'm {agent?.name} 👋</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                I'll help you find your perfect property with AI-powered insights and personalized recommendations!
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-sky-200 hover:bg-gradient-to-br hover:from-sky-50 hover:to-blue-50 transition-all duration-300 text-left group hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="font-semibold text-gray-800 group-hover:text-sky-700 mb-1">{action.label}</div>
                    <div className="text-xs text-gray-500 group-hover:text-sky-600">{action.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: "65vh" }}>
            <div className="flex flex-col gap-6 px-2">
              {history.map(renderMessage)}

              {activeForm === "budget" && (
                <BudgetForm
                  formData={formData}
                  handleFormChange={handleFormChange}
                  submitQualificationForm={submitQualificationForm}
                  isLoading={isLoading}
                  activeForm={activeForm}
                  formInputRef={formInputRef}
                />
              )}
              {activeForm === "contact" && (
                <ContactForm
                  formData={formData}
                  handleFormChange={handleFormChange}
                  submitQualificationForm={submitQualificationForm}
                  isLoading={isLoading}
                  activeForm={activeForm}
                  formInputRef={formInputRef}
                />
              )}
              {activeForm === "preferences" && (
                <PreferencesForm
                  formData={formData}
                  handleFormChange={handleFormChange}
                  submitQualificationForm={submitQualificationForm}
                  isLoading={isLoading}
                  activeForm={activeForm}
                  formInputRef={formInputRef}
                />
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-3xl px-6 py-4 shadow-lg max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{agent?.name || "Agent"} is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-4">
            <div className="max-w-4xl mx-auto px-2">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Ask about properties, locations, budget, or schedule a visit..."
                    className="w-full bg-white border-2 border-gray-200 rounded-3xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-400 shadow-sm text-sm transition-all duration-200"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">⏎ Enter to send</div>
                </div>
                <button
                  disabled={!message.trim() || isLoading}
                  onClick={() => sendMessage()}
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-sky-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <span className="font-semibold">Send</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-96 hidden xl:block sticky top-28 self-start">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🚀</span>
              Quick Actions
            </h4>
            <div className="space-y-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="w-full text-left p-4 rounded-xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 border border-gray-100 transition-all duration-200 group hover:border-sky-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{action.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-sky-700">{action.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-sky-600 mt-1">{action.hint}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* -----------------------
   Memoized Form Components
   ----------------------- */

type FormProps = {
  formData: any;
  handleFormChange: (type: string, field: string, value: any) => void;
  submitQualificationForm: (type: string) => Promise<void>;
  isLoading: boolean;
  activeForm: string | null;
  formInputRef: React.RefObject<HTMLInputElement | HTMLSelectElement | null>;
};

const BudgetForm = React.memo(function BudgetForm({
  formData,
  handleFormChange,
  submitQualificationForm,
  isLoading,
  activeForm,
  formInputRef,
}: FormProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-6 mb-6 animate-fade-in shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white text-lg">💰</span>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-lg">Budget Range</h4>
          <p className="text-blue-600 text-sm">Set your investment range</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-semibold text-blue-800 mb-2 block">Min Budget (₹)</label>
          <input
            ref={activeForm === "budget" ? formInputRef as any : null}
            type="number"
            placeholder="50,00,000"
            value={formData.budget.minBudget}
            onChange={(e) => handleFormChange("budget", "minBudget", e.target.value)}
            className="w-full p-3 border-2 border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-blue-800 mb-2 block">Max Budget (₹)</label>
          <input
            type="number"
            placeholder="1,00,00,000"
            value={formData.budget.maxBudget}
            onChange={(e) => handleFormChange("budget", "maxBudget", e.target.value)}
            className="w-full p-3 border-2 border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl mb-4">
        <input
          type="checkbox"
          checked={formData.budget.flexible}
          onChange={(e) => handleFormChange("budget", "flexible", e.target.checked)}
          className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
        />
        <div>
          <label className="font-medium text-blue-800">Flexible Budget</label>
          <p className="text-blue-600 text-xs">Willing to adjust for exceptional properties</p>
        </div>
      </div>

      <button
        onClick={() => submitQualificationForm("budget")}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Setting Budget...
          </span>
        ) : (
          "💰 Set Budget & Continue"
        )}
      </button>
    </div>
  );
});

const ContactForm = React.memo(function ContactForm({
  formData,
  handleFormChange,
  submitQualificationForm,
  isLoading,
  activeForm,
  formInputRef,
}: FormProps) {
  const pendingBooking = typeof window !== "undefined" ? sessionStorage.getItem("pendingBooking") : null;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 rounded-2xl p-6 mb-6 animate-fade-in shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <span className="text-white text-lg">{pendingBooking ? "📅" : "👤"}</span>
        </div>
        <div>
          <h4 className="font-bold text-green-900 text-lg">{pendingBooking ? "Schedule Property Visit" : "Contact Information"}</h4>
          <p className="text-green-600 text-sm">{pendingBooking ? "Book your property viewing" : "Get personalized recommendations"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-green-800 mb-2 block">Full Name *</label>
          <input
            ref={activeForm === "contact" ? formInputRef as any : null}
            type="text"
            placeholder="Enter your full name"
            value={formData.contact.name}
            onChange={(e) => handleFormChange("contact", "name", e.target.value)}
            className="w-full p-3 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-green-800 mb-2 block">Email Address *</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={formData.contact.email}
            onChange={(e) => handleFormChange("contact", "email", e.target.value)}
            className="w-full p-3 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-green-800 mb-2 block">Phone Number *</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.contact.phone}
            onChange={(e) => handleFormChange("contact", "phone", e.target.value)}
            className="w-full p-3 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
            required
          />
        </div>

        {pendingBooking && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-green-800 mb-2 block">Preferred Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={formData.contact.preferredDate}
                  onChange={(e) => handleFormChange("contact", "preferredDate", e.target.value)}
                  className="w-full p-3 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-green-800 mb-2 block">Preferred Time</label>
                <input
                  type="time"
                  value={formData.contact.preferredTime}
                  onChange={(e) => handleFormChange("contact", "preferredTime", e.target.value)}
                  className="w-full p-3 border-2 border-green-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                />
              </div>
            </div>
            <div className="bg-green-100 border border-green-200 rounded-xl p-3">
              <p className="text-green-700 text-sm font-medium">✅ We'll confirm your visit details via email and SMS</p>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => submitQualificationForm("contact")}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : pendingBooking ? (
          "📅 Schedule Visit Now"
        ) : (
          "💾 Save & Continue"
        )}
      </button>
    </div>
  );
});

const PreferencesForm = React.memo(function PreferencesForm({
  formData,
  handleFormChange,
  submitQualificationForm,
  isLoading,
  activeForm,
  formInputRef,
}: FormProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-100 rounded-2xl p-6 mb-6 animate-fade-in shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
          <span className="text-white text-lg">🎯</span>
        </div>
        <div>
          <h4 className="font-bold text-purple-900 text-lg">Property Preferences</h4>
          <p className="text-purple-600 text-sm">Tell us what you're looking for</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-purple-800 mb-2 block">Property Type *</label>
          <select
            ref={activeForm === "preferences" ? (formInputRef as any) : null}
            value={formData.preferences.propertyType}
            onChange={(e) => handleFormChange("preferences", "propertyType", e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
          >
            <option value="">Select Property Type</option>
            <option value="apartment">🏢 Apartment</option>
            <option value="villa">🏡 Villa</option>
            <option value="independent_house">🏠 Independent House</option>
            <option value="plot">📐 Plot</option>
            <option value="commercial">🏪 Commercial</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-purple-800 mb-2 block">Bedrooms *</label>
          <select
            value={formData.preferences.bedrooms}
            onChange={(e) => handleFormChange("preferences", "bedrooms", e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
          >
            <option value="">Select Bedrooms</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5+ BHK</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-purple-800 mb-2 block">Purpose</label>
          <select
            value={formData.preferences.purpose}
            onChange={(e) => handleFormChange("preferences", "purpose", e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
          >
            <option value="">Select Purpose (Optional)</option>
            <option value="primary_residence">🏠 Primary Residence</option>
            <option value="investment">📈 Investment</option>
            <option value="rental">💰 Rental Income</option>
            <option value="vacation">🌴 Vacation Home</option>
            <option value="commercial">🏢 Commercial Use</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-purple-800 mb-2 block">Timeline</label>
          <select
            value={formData.preferences.timeline}
            onChange={(e) => handleFormChange("preferences", "timeline", e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
          >
            <option value="">Timeline (Optional)</option>
            <option value="immediate">⚡ Immediate</option>
            <option value="1-3_months">📅 1-3 Months</option>
            <option value="3-6_months">🗓️ 3-6 Months</option>
            <option value="6-12_months">📆 6-12 Months</option>
            <option value="exploring">🔍 Just Exploring</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => submitQualificationForm("preferences")}
        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </span>
        ) : (
          "🎯 Save Preferences"
        )}
      </button>
    </div>
  );
});

/* -----------------------
   Enhanced Property Card
   ----------------------- */

const EnhancedPropertyCard = ({ property, onQuickBook, onShowAnalytics }: { property: Property; onQuickBook: (id: string) => void; onShowAnalytics: (id: string) => void }) => {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
       {property.image ? (
  <img
    src={`https://api.estate.techtrekkers.ai${property.image}`}
    alt={property.title || "Property"}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
) : (
  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
    <span className="text-4xl mb-2">🏠</span>
    <span className="text-sm font-medium">Property Image</span>
  </div>
)}


        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="bg-white/90 text-sky-600 px-4 py-2 rounded-full text-xs font-semibold hover:bg-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0" onClick={() => onQuickBook(property.id)}>
              📅 Book Visit
            </button>
            <button className="bg-white/90 text-gray-600 px-4 py-2 rounded-full text-xs font-semibold hover:bg-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0" onClick={() => onShowAnalytics(property.id)}>
              📊 Analytics
            </button>
          </div>
        </div>

        <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          {property.price ? `₹${Number(property.price).toLocaleString("en-IN")}` : "Price on Request"}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{property.title}</h3>
        <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
          <span>📍</span>
          {property.location}
        </p>

        {property.highlights && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.highlights.split(", ").slice(0, 3).map((highlight: string, idx: number) => (
              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100 font-medium">
                {highlight}
              </span>
            ))}
            {property.highlights.split(", ").length > 3 && <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full border border-gray-100">+{property.highlights.split(", ").length - 3} more</span>}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            {property.bedrooms && <span className="flex items-center gap-1">🛏️ {property.bedrooms} BHK</span>}
            {property.bathrooms && <span className="flex items-center gap-1">🚿 {property.bathrooms} Bath</span>}
            {property.area && <span className="flex items-center gap-1">📐 {property.area} sq ft</span>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 text-center" onClick={() => onQuickBook(property.id)}>
            Book Visit
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
            onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?property=${property.id}`);
              toast.success("Property link copied to clipboard!");
            }}
            title="Share property"
          >
            <span className="text-gray-600 group-hover:text-sky-600">📤</span>
          </button>
        </div>
      </div>
    </article>
  );
};

/* -----------------------
   Inject minimal enhanced styles
   ----------------------- */
const enhancedStyles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slide-in {
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-fade-in { animation: fade-in 0.4s ease-out; }
.animate-slide-in { animation: slide-in 0.3s ease-out; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.backdrop-blur-xl { backdrop-filter: blur(24px); }
`;

if (typeof document !== "undefined") {
  const enhancedStyleSheet = document.createElement("style");
  enhancedStyleSheet.innerText = enhancedStyles;
  document.head.appendChild(enhancedStyleSheet);
}
