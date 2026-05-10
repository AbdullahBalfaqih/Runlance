'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Bell, Shield, Globe, Monitor, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Manage your account preferences and integration settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="space-y-1">
            {[
              { icon: User, label: 'Profile', active: true },
              { icon: Bell, label: 'Notifications', active: false },
              { icon: Shield, label: 'Privacy & Security', active: false },
              { icon: Globe, label: 'Integrations', active: false },
              { icon: Monitor, label: 'Appearance', active: false },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  item.active 
                    ? 'bg-white/20 text-white backdrop-blur-sm' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-6">
            <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Abdullah Balfaqih"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <input 
                      type="email" 
                      defaultValue="abdullah@example.com"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Bio</label>
                  <textarea 
                    rows={4}
                    defaultValue="Full-stack engineer passionate about AI and career coaching."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none transition resize-none"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Extension Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Automatic Analysis</p>
                    <p className="text-sm text-gray-400">Automatically analyze jobs when you visit LinkedIn</p>
                  </div>
                  <div className="w-12 h-6 bg-white/50 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Voice Feedback</p>
                    <p className="text-sm text-gray-400">Play AI voice feedback after job analysis</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-white/10 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm">
                Cancel
              </Button>
              <Button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                <Save size={18} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
