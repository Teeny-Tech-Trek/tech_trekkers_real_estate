import React from "react";
import { User, Bell, CreditCard, Shield, Zap, Users, Database, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const integrations = [
    { name: "HubSpot", status: "connected", icon: "🔗" },
    { name: "Salesforce", status: "disconnected", icon: "⚡" },
    { name: "Zoho CRM", status: "disconnected", icon: "📊" },
    { name: "Google Calendar", status: "connected", icon: "📅" },
    { name: "WhatsApp", status: "pending", icon: "💬" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and integrations</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Account Information
            </CardTitle>
            <CardDescription>Update your personal and company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Sarah" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Johnson" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sarah@realestate.com" />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Premium Real Estate Co." />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Subscription & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Subscription & Billing
            </CardTitle>
            <CardDescription>Manage your subscription and view billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Current Plan: Pro</p>
                <p className="text-sm text-gray-600">$99/month + 1% commission</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">$2,847</p>
                <p className="text-sm text-gray-600">Commission This Month</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-gray-600">Active Leads</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Active Avatars</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">View Billing</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">New Lead Notifications</Label>
                <p className="text-sm text-gray-600">Get notified when avatars capture new leads</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Daily Performance Reports</Label>
                <p className="text-sm text-gray-600">Receive daily analytics summaries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">System Updates</Label>
                <p className="text-sm text-gray-600">Important system and feature updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* CRM Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={20} />
              CRM Integrations
            </CardTitle>
            <CardDescription>Connect your existing CRM and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{integration.status}</p>
                    </div>
                  </div>
                  <Button 
                    variant={integration.status === 'connected' ? 'destructive' : 'default'}
                    size="sm"
                  >
                    {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Privacy & Security
            </CardTitle>
            <CardDescription>Manage data privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Call Recording</Label>
                <p className="text-sm text-gray-600">Record avatar voice conversations for quality</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Data Retention</Label>
                <p className="text-sm text-gray-600">Keep lead data for 2 years (GDPR compliant)</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" className="mr-2">Export Data</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;