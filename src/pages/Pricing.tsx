import React from "react";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for individual agents getting started",
      icon: Zap,
      popular: false,
      features: [
        "1 Virtual Avatar", 
        "Up to 100 leads/month",
        "Basic property management",
        "Email support",
        "Standard integrations",
        "Basic analytics",
        "1% commission on closed deals"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "outline" as const
    },
    {
      name: "Professional", 
      price: "$99",
      period: "/month",
      description: "Ideal for growing real estate teams",
      icon: Star,
      popular: true,
      features: [
        "3 Virtual Avatars",
        "Up to 500 leads/month", 
        "Advanced property management",
        "Priority support",
        "All CRM integrations",
        "Advanced analytics & reporting",
        "Team collaboration tools",
        "Custom avatar training",
        "1% commission on closed deals"
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large agencies and enterprises", 
      icon: Crown,
      popular: false,
      features: [
        "Unlimited Virtual Avatars",
        "Unlimited leads",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security & compliance",
        "Multi-location support", 
        "Custom reporting",
        "Volume-based commission rates"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start converting more leads with AI-powered virtual sales agents. 
            All plans include our 1% commission structure on closed deals.
          </p>
        </div>
      </header>

      <div className="p-6">
        {/* Commission Info Banner */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Performance-Based Success</h3>
              <p className="text-gray-700">
                Pay only 1% commission on deals closed through our platform. 
                No hidden fees, no setup costs - you only pay when you succeed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-6 h-6 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the commission structure work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We charge a 1% commission only on deals that close through leads generated by our platform. 
                  This ensures we're aligned with your success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I customize my avatars?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! All plans include avatar customization. Professional and Enterprise plans 
                  offer advanced training and personality customization options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What CRM integrations are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We integrate with HubSpot, Salesforce, Zoho, and most major real estate CRMs. 
                  Enterprise plans include custom integration development.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! Start with a 14-day free trial on any plan. No credit card required to begin.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;