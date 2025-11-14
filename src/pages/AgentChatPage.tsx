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
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

/**
 * Types
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
  isStreaming?: boolean;
};
type Agent = {
  name?: string;
  avatar?: string;
  description?: string;
  welcomeMessage?: string;
  avatarUrl?: string;
  [k: string]: any;
};
type Property = AnyObj;

export default function AgentChatPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

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
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: history.length > 5 ? "smooth" : "auto",
      block: "end",
    });
  }, [history, streamingMessageId]);

  useEffect(() => {
    sessionStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (activeForm && formInputRef.current) {
      setTimeout(() => formInputRef.current?.focus(), 100);
    }
  }, [activeForm]);

  // Simulate streaming response
  const simulateStreamingResponse = async (fullText: string, messageId: string) => {
    setStreamingMessageId(messageId);

    // Split text into words for realistic streaming
    const words = fullText.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      // Add slight random delay between words for natural feel
      const delay = Math.random() * 60 + 40; // 40–100 ms between words

      await new Promise((resolve) => setTimeout(resolve, delay));

      currentText += (i === 0 ? "" : " ") + words[i];

      setHistory((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: currentText, isStreaming: i < words.length - 1 }
            : msg
        )
      );

      // Scroll to bottom as text streams
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    // Mark streaming as complete
    setHistory((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    );

    setStreamingMessageId(null);
  };

  const quickActions = [
    {
      label: "🏠 Find 3BHK",
      action: () => sendMessage("I'm looking for 3 bedroom properties in good locations"),
      hint: "Specify budget & location",
      icon: "🔍",
      mobileIcon: "🏠",
    },
    {
      label: "📈 Investment",
      action: () => sendMessage("Show me properties with good rental yield and appreciation potential"),
      hint: "High ROI focus",
      icon: "💹",
      mobileIcon: "📈",
    },
    {
      label: "📅 Schedule Visit",
      action: () => setActiveForm("contact"),
      hint: "Quick booking",
      icon: "📋",
      mobileIcon: "📅",
    },
    {
      label: "📊 Market Insights",
      action: () => sendMessage("What are the current market trends and prices in this area?"),
      hint: "Local intelligence",
      icon: "📉",
      mobileIcon: "📊",
    },
  ];

  const sendMessage = async (text?: string) => {
    const msgToSend = text || message;
    if (!msgToSend?.trim() || isLoading) return;

    setIsLoading(true);

    const userMsgId = `msg-${Date.now()}-user`;
    const userMsg: Message = {
      sender: "user",
      text: msgToSend,
      timestamp: Date.now(),
      id: userMsgId,
    };

    setHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setActiveForm(null);

    // Scroll to bottom immediately after user message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);

    try {
      const response = await chatWithAgent(id, sessionId, msgToSend);

      // Create streaming message for agent response
      const lastAgentMessage = response.history[response.history.length - 1];
      if (lastAgentMessage && lastAgentMessage.sender === "agent") {
        const agentMsgId = `msg-${Date.now()}-agent`;
        const streamingMsg: Message = {
          ...lastAgentMessage,
          id: agentMsgId,
          text: "", // Start with empty text
          isStreaming: true,
          timestamp: Date.now(),
        };

        setHistory((prev) => [...prev, streamingMsg]);

        // Start streaming simulation
        simulateStreamingResponse(lastAgentMessage.text, agentMsgId);

        // Handle any action requirements after streaming completes
        if (lastAgentMessage.requiresAction) {
          setTimeout(() => {
            const formType = lastAgentMessage.requiresAction.replace("ask_", "");
            if (formType === "budget" || formType === "contact" || formType === "preferences") {
              setActiveForm(formType as any);
            }
          }, lastAgentMessage.text.length * 30); // Delay based on text length
        }
      } else {
        // Fallback: if no streaming, set full history
        setHistory(response.history || []);
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
      setHistory((prev) => prev.filter((msg) => msg.id !== userMsgId));
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
          messageText = `I'm looking for a ${data.propertyType} with ${data.bedrooms} bedrooms, for ${data.purpose}.${data.timeline ? ` Timeline: ${data.timeline}.` : ""
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
    const isStreaming = msg.isStreaming && msg.sender === "agent";

    if (isSystem) {
      return (
        <div key={msg.id || idx} className="flex justify-center mb-4 px-2">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-2xl px-4 py-3 max-w-full w-full md:max-w-md shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>💡</span>
              <span className="text-xs md:text-sm">{msg.text}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={msg.id || idx} className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 px-2`}>
        <div
          className={`max-w-[90%] md:max-w-[80%] ${isUser
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-3xl rounded-br-md shadow-lg"
              : "bg-white border border-gray-100 text-gray-800 rounded-3xl rounded-bl-md shadow-lg"
            } px-4 py-3 relative group transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-1">
            {!isUser && (
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-xs text-white font-bold">
                {agent?.name?.charAt(0) || "A"}
              </div>
            )}
            <div className={`text-xs font-semibold ${isUser ? "text-blue-100" : "text-gray-500"}`}>
              {isUser ? "You" : agent?.name || "Property Expert"}
            </div>
            {!isUser && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse"></div>}
          </div>

          <div className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
            {msg.text}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-sky-500 animate-pulse"></span>
            )}
          </div>

          {msg.propertyAnalytics && !isStreaming && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50 backdrop-blur-sm">
              <h4 className="font-bold text-blue-900 mb-2 text-xs md:text-sm flex items-center gap-2">
                <span>📊</span>
                Detailed Property Analytics
              </h4>
            </div>
          )}

          {msg.propertyCards?.length > 0 && !isStreaming && (
            <div className="mt-3 space-y-3">
              <h4 className="font-semibold text-gray-700 text-xs md:text-sm flex items-center gap-2">
                <span>🏘️</span>
                Matching Properties ({msg.propertyCards.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {msg.propertyCards.map((property: Property) => (
                  <EnhancedPropertyCard
                    key={property.id}
                    property={property}
                    onQuickBook={handleQuickBooking}
                    onShowAnalytics={(propertyId: string) => sendMessage(`Show me detailed analytics for ${property.title}`)}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          )}

          {msg.quickAnalytics && !msg.propertyAnalytics && !isStreaming && (
            <div className="mt-2 flex flex-wrap gap-1">
              <button
                onClick={() => sendMessage(`Show me hazards analysis for these properties`)}
                className="text-xs bg-red-50 text-red-700 px-2 py-1.5 rounded-full hover:bg-red-100 transition-all duration-200 border border-red-200 hover:border-red-300 font-medium flex items-center gap-1"
              >
                <span>⚠️</span>
                {!isMobile && "Hazards"}
              </button>
              <button
                onClick={() => sendMessage(`What's the ROI for these properties?`)}
                className="text-xs bg-green-50 text-green-700 px-2 py-1.5 rounded-full hover:bg-green-100 transition-all duration-200 border border-green-200 hover:border-green-300 font-medium flex items-center gap-1"
              >
                <span>📈</span>
                {!isMobile && "ROI Analysis"}
              </button>
              <button
                onClick={() => sendMessage(`Show rental yield analytics`)}
                className="text-xs bg-purple-50 text-purple-700 px-2 py-1.5 rounded-full hover:bg-purple-100 transition-all duration-200 border border-purple-200 hover:border-purple-300 font-medium flex items-center gap-1"
              >
                <span>💰</span>
                {!isMobile && "Rental Yield"}
              </button>
            </div>
          )}

          {!isStreaming && (
            <div className={`text-xs mt-2 ${isUser ? "text-blue-200" : "text-gray-400"} text-right`}>
              {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!agent && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-gray-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4 md:mb-6"></div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Connecting you with our expert</h3>
          <p className="text-gray-600 text-sm md:text-base">Loading your personalized property assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-blue-50/30 to-indigo-50/30 text-gray-900">
      {/* Mobile Quick Actions Bar */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-sm py-2 px-1">
          <div className="flex justify-around">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-sky-50 transition-all duration-200 active:scale-95 min-w-0 flex-1 mx-1"
                title={action.label}
              >
                <div className="text-lg mb-1">{action.mobileIcon}</div>
                <div className="text-[10px] text-gray-600 font-medium truncate w-full text-center">
                  {action.label.split(" ")[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-3 md:px-4 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
                {agent?.avatarUrl ? (
                  <img
                    src={
                      agent.avatarUrl.startsWith("http")
                        ? agent.avatarUrl
                        : `https://api.estate.techtrekkers.ai${agent.avatarUrl}`
                    }
                    alt={agent.name || "Agent"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm md:text-lg font-bold text-white">
                    {(agent?.name || "A").charAt(0).toUpperCase()}
                  </span>
                )}

              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">{agent?.name}</h1>
                <span className="text-[10px] md:text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 md:px-3 md:py-1.5 rounded-full border border-green-200">
                  • Online
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-600 truncate max-w-[200px] md:max-w-md">
                {agent?.description || agent?.welcomeMessage || "Real Estate Expert & Property Consultant"}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <span className="font-mono text-xs">ID: {sessionId.slice(0, 8)}...</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-4 md:gap-8 max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8 w-full">
        <section className="flex-1 flex flex-col gap-4 md:gap-6">
          {history.length === 0 && !isLoading && (
            <div className="mx-auto my-8 md:my-12 text-center max-w-2xl animate-fade-in px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-2xl md:text-4xl shadow-2xl mb-4 md:mb-6">
                🏠
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Hello, I'm {agent?.name} 👋</h2>
              <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 max-w-md mx-auto">
                I'll help you find your perfect property with AI-powered insights and personalized recommendations!
              </p>

              {!isMobile ? (
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
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4 mb-4">
                  <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🚀</span>
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className="w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 border border-gray-100 transition-all duration-200 group hover:border-sky-200 hover:shadow-md active:scale-95"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{action.mobileIcon}</div>
                          <div>
                            <div className="font-semibold text-gray-800 group-hover:text-sky-700 text-sm">{action.label}</div>
                            <div className="text-xs text-gray-500 group-hover:text-sky-600 mt-0.5">{action.hint}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2 space-y-1 md:space-y-2"
            style={{ maxHeight: isMobile ? "60vh" : "65vh" }}
          >
            <div className="flex flex-col gap-4 md:gap-6 px-1">
              {history.map(renderMessage)}

              {activeForm === "budget" && (
                <BudgetForm
                  formData={formData}
                  handleFormChange={handleFormChange}
                  submitQualificationForm={submitQualificationForm}
                  isLoading={isLoading}
                  activeForm={activeForm}
                  formInputRef={formInputRef}
                  isMobile={isMobile}
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
                  isMobile={isMobile}
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
                  isMobile={isMobile}
                />
              )}

              {isLoading && !streamingMessageId && (
                <div className="flex justify-start px-2">
                  <div className="bg-white border border-gray-100 rounded-3xl px-4 py-3 md:px-6 md:py-4 shadow-lg max-w-full md:max-w-md">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 font-medium">
                        {agent?.name || "Agent"} is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="mt-2 md:mt-4 px-2">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 md:gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Type your message..."
                    className="w-full bg-white border-2 border-gray-200 rounded-3xl px-4 py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-400 shadow-sm text-xs md:text-sm transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
                <button
                  disabled={!message.trim() || isLoading}
                  onClick={() => sendMessage()}
                  className="inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-sky-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {!isMobile && <span className="font-semibold text-sm">Send</span>}
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {!isMobile && (
          <aside className="w-80 lg:w-96 hidden xl:block sticky top-28 self-start">
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
        )}
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
  isMobile?: boolean;
};

const BudgetForm = React.memo(function BudgetForm({
  formData,
  handleFormChange,
  submitQualificationForm,
  isLoading,
  activeForm,
  formInputRef,
  isMobile = false,
}: FormProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 animate-fade-in shadow-lg mx-2">
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white text-base md:text-lg">💰</span>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-base md:text-lg">Budget Range</h4>
          <p className="text-blue-600 text-xs md:text-sm">Set your investment range</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
        <div>
          <label className="text-xs md:text-sm font-semibold text-blue-800 mb-1 md:mb-2 block">Min Budget (₹)</label>
          <input
            ref={activeForm === "budget" ? (formInputRef as any) : null}
            type="number"
            placeholder="50,00,000"
            value={formData.budget.minBudget}
            onChange={(e) => handleFormChange("budget", "minBudget", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
          />
        </div>
        <div>
          <label className="text-xs md:text-sm font-semibold text-blue-800 mb-1 md:mb-2 block">Max Budget (₹)</label>
          <input
            type="number"
            placeholder="1,00,00,000"
            value={formData.budget.maxBudget}
            onChange={(e) => handleFormChange("budget", "maxBudget", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-blue-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-blue-100 rounded-xl mb-3 md:mb-4">
        <input
          type="checkbox"
          checked={formData.budget.flexible}
          onChange={(e) => handleFormChange("budget", "flexible", e.target.checked)}
          className="w-4 h-4 md:w-5 md:h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
        />
        <div>
          <label className="font-medium text-blue-800 text-xs md:text-sm">Flexible Budget</label>
          <p className="text-blue-600 text-xs">Willing to adjust for exceptional properties</p>
        </div>
      </div>

      <button
        onClick={() => submitQualificationForm("budget")}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 md:py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs md:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Setting Budget...
          </span>
        ) : (
          `💰 ${isMobile ? "Set Budget" : "Set Budget & Continue"}`
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
  isMobile = false,
}: FormProps) {
  const pendingBooking = typeof window !== "undefined" ? sessionStorage.getItem("pendingBooking") : null;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 animate-fade-in shadow-lg mx-2">
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <span className="text-white text-base md:text-lg">{pendingBooking ? "📅" : "👤"}</span>
        </div>
        <div>
          <h4 className="font-bold text-green-900 text-base md:text-lg">{pendingBooking ? "Schedule Visit" : "Contact Info"}</h4>
          <p className="text-green-600 text-xs md:text-sm">{pendingBooking ? "Book your viewing" : "Get personalized recommendations"}</p>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="text-xs md:text-sm font-semibold text-green-800 mb-1 md:mb-2 block">Full Name *</label>
          <input
            ref={activeForm === "contact" ? (formInputRef as any) : null}
            type="text"
            placeholder="Enter your full name"
            value={formData.contact.name}
            onChange={(e) => handleFormChange("contact", "name", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-green-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="text-xs md:text-sm font-semibold text-green-800 mb-1 md:mb-2 block">Email *</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={formData.contact.email}
            onChange={(e) => handleFormChange("contact", "email", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-green-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="text-xs md:text-sm font-semibold text-green-800 mb-1 md:mb-2 block">Phone *</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.contact.phone}
            onChange={(e) => handleFormChange("contact", "phone", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-green-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
            required
          />
        </div>

        {pendingBooking && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-semibold text-green-800 mb-1 md:mb-2 block">Preferred Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={formData.contact.preferredDate}
                  onChange={(e) => handleFormChange("contact", "preferredDate", e.target.value)}
                  className="w-full p-2 md:p-3 border-2 border-green-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm font-semibold text-green-800 mb-1 md:mb-2 block">Preferred Time</label>
                <input
                  type="time"
                  value={formData.contact.preferredTime}
                  onChange={(e) => handleFormChange("contact", "preferredTime", e.target.value)}
                  className="w-full p-2 md:p-3 border-2 border-green-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                />
              </div>
            </div>
            <div className="bg-green-100 border border-green-200 rounded-xl p-2 md:p-3">
              <p className="text-green-700 text-xs md:text-sm font-medium">✅ We'll confirm via email & SMS</p>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => submitQualificationForm("contact")}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 md:py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-xs md:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 mt-3 md:mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : pendingBooking ? (
          `📅 ${isMobile ? "Schedule" : "Schedule Visit Now"}`
        ) : (
          `💾 ${isMobile ? "Save" : "Save & Continue"}`
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
  isMobile = false,
}: FormProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-100 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 animate-fade-in shadow-lg mx-2">
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center">
          <span className="text-white text-base md:text-lg">🎯</span>
        </div>
        <div>
          <h4 className="font-bold text-purple-900 text-base md:text-lg">Preferences</h4>
          <p className="text-purple-600 text-xs md:text-sm">Tell us what you want</p>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="text-xs md:text-sm font-semibold text-purple-800 mb-1 md:mb-2 block">Property Type *</label>
          <select
            ref={activeForm === "preferences" ? (formInputRef as any) : null}
            value={formData.preferences.propertyType}
            onChange={(e) => handleFormChange("preferences", "propertyType", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-purple-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
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
          <label className="text-xs md:text-sm font-semibold text-purple-800 mb-1 md:mb-2 block">Bedrooms *</label>
          <select
            value={formData.preferences.bedrooms}
            onChange={(e) => handleFormChange("preferences", "bedrooms", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-purple-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
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
          <label className="text-xs md:text-sm font-semibold text-purple-800 mb-1 md:mb-2 block">Purpose</label>
          <select
            value={formData.preferences.purpose}
            onChange={(e) => handleFormChange("preferences", "purpose", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-purple-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
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
          <label className="text-xs md:text-sm font-semibold text-purple-800 mb-1 md:mb-2 block">Timeline</label>
          <select
            value={formData.preferences.timeline}
            onChange={(e) => handleFormChange("preferences", "timeline", e.target.value)}
            className="w-full p-2 md:p-3 border-2 border-purple-200 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 appearance-none"
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
        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-2 md:py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-200 text-xs md:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 mt-3 md:mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </span>
        ) : (
          `🎯 ${isMobile ? "Save Prefs" : "Save Preferences"}`
        )}
      </button>
    </div>
  );
});

/* -----------------------
   Enhanced Property Card
   ----------------------- */

const EnhancedPropertyCard = ({
  property,
  onQuickBook,
  onShowAnalytics,
  isMobile = false,
}: {
  property: Property;
  onQuickBook: (id: string) => void;
  onShowAnalytics: (id: string) => void;
  isMobile?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Properly handle image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) {
      return `https://api.estate.techtrekkers.ai${imagePath}`;
    }
    return `https://api.estate.techtrekkers.ai/${imagePath}`;
  };

  const imageUrl = property.image ? getImageUrl(property.image) : null;
  const hasValidImage = imageUrl && !imageUrl.includes("undefined");

  return (
    <>
      {/* Property Card */}
      <article
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          {hasValidImage ? (
            <img
              src={imageUrl}
              alt={property.title || "Property"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : null}

          {/* Fallback */}
          <div
            className={`w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 ${hasValidImage ? "hidden" : "flex"
              }`}
          >
            <span className="text-3xl md:text-4xl mb-1 md:mb-2">🏠</span>
            <span className="text-xs md:text-sm font-medium text-center px-2">
              {property.title || "Property Image"}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-bold shadow-lg">
            {property.price
              ? `₹${Number(property.price).toLocaleString("en-IN")}`
              : "Price on Request"}
          </div>

          {/* Image Count */}
          {property.images && property.images.length > 1 && (
            <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
              📸 {property.images.length}
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="p-3 md:p-5">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 md:mb-2 line-clamp-2">
            {property.title}
          </h3>
          <p className="text-xs text-gray-600 mb-2 md:mb-3 flex items-center gap-1">
            <span>📍</span>
            {property.location}
          </p>

          {property.highlights && (
            <div className="flex flex-wrap gap-1 md:gap-1.5 mb-3 md:mb-4">
              {property.highlights
                .split(", ")
                .slice(0, isMobile ? 2 : 3)
                .map((highlight: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-blue-100 font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              {property.highlights.split(", ").length > (isMobile ? 2 : 3) && (
                <span className="text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-gray-100">
                  +{property.highlights.split(", ").length - (isMobile ? 2 : 3)} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-4">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <span>🛏️</span>
                  {property.bedrooms} BHK
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  <span>🚿</span>
                  {property.bathrooms} Bath
                </span>
              )}
              {property.area && (
                <span className="flex items-center gap-1">
                  <span>📐</span>
                  {property.area} sq ft
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 text-center flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onQuickBook(property.id);
              }}
            >
              <span>📅</span>
              {isMobile ? "Book" : "Book Visit"}
            </button>
            <button
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-200 group active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard?.writeText(
                  `${window.location.origin}${window.location.pathname}?property=${property.id}`
                );
                toast.success("Property link copied to clipboard!");
              }}
              title="Share property"
            >
              <span className="text-gray-600 group-hover:text-sky-600 text-sm">📤</span>
            </button>
          </div>
        </div>
      </article>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setSelectedImage(null); // Reset selected image when closing
      }}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 z-10"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center justify-center p-4 overflow-y-auto">
              {/* Selected Image Display */}
              <div className="w-full h-64 md:h-96 mb-4 flex items-center justify-center bg-gray-100 rounded-xl">
                {selectedImage ? (
                  <img
                    src={getImageUrl(selectedImage)}
                    alt="Selected Property"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-gray-500 text-center text-sm md:text-base">
                    Click a thumbnail below to view the image
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {property.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      className={`w-full h-20 md:h-24 rounded-lg overflow-hidden border-2 ${selectedImage === img ? "border-blue-500" : "border-gray-200"
                        } hover:border-blue-400 transition-colors duration-200`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 py-10 text-center text-sm md:text-base">
                  No images available
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* -----------------------
   Enhanced Styles
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

/* Mobile optimizations */
@media (max-width: 768px) {
  .text-balance {
    text-wrap: balance;
  }
  
  input, select, button {
    -webkit-tap-highlight-color: transparent;
  }
  
  button:active {
    transform: scale(0.95);
  }
}

/* Prevent zoom on input focus on mobile */
@media (max-width: 768px) {
  input, select, textarea {
    font-size: 16px;
  }
}
`;

if (typeof document !== "undefined") {
  const enhancedStyleSheet = document.createElement("style");
  enhancedStyleSheet.innerText = enhancedStyles;
  document.head.appendChild(enhancedStyleSheet);
}