import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Bell,
  Search,
  ChevronRight,
  Home,
  Sparkles,
  Calendar,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Avatars', path: '/avatars' },
  { icon: Building, label: 'Properties', path: '/properties' },
  { icon: MessageSquare, label: 'Leads', path: '/leads' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mock performance data
  const performanceData = {
    leads: 24,
    conversions: 8,
    growth: 12.5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Enhanced Premium Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 z-50 w-80 h-screen bg-card backdrop-blur-xl border-r border-black-200/80 shadow-2xl shadow-blue-500/5"
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Premium Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border-b border-gray-100/80 bg-gradient-to-r from-white to-blue-50/30"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Home className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 text-xl font-display tracking-tight">Estate AI</h2>
                <p className="text-xs text-gray-500 font-medium bg-gradient-to-r from-blue-600/10 to-cyan-600/10 px-2 py-1 rounded-full inline-block">
                  AI Real Estate Platform
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <motion.button
                    whileHover={{ 
                      x: 4,
                      backgroundColor: isActive ? '' : 'rgba(59, 130, 246, 0.05)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden border ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border-blue-200/60 shadow-blue-500/10' 
                        : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-blue-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all duration-300 border ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border-blue-600' 
                          : 'bg-white text-gray-600 border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-blue-600"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    )}
                    
                    {/* Enhanced Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full shadow-lg shadow-blue-500/30"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </nav>

          {/* Enhanced User Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-t border-black-200/80 bg-gradient-to-b from-white to-gray-50/50 p-6"
          >
            <div className="flex items-center gap-4 p-4 mb-3 rounded-xl bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {user?.firstName?.charAt(0) ?? 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName}
                </p>
                <p className="text-xs text-gray-500 truncate font-medium">
                  {user?.organization?.name}
                </p>
              </div>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50/70 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-red-100"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="ml-80">
       
       {/* 
<motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: "spring", damping: 25, stiffness: 200 }}
  className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black-200/80 shadow-sm"
>
  <div className="px-8 py-4">
    <div className="flex items-center justify-between">
     
      <div className="flex-1 max-w-xl">
        <motion.div 
          whileFocus={{ scale: 1.02 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties, leads, avatars..."
            className="pl-12 pr-4 py-3 bg-white border-gray-300/60 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 font-medium shadow-sm"
          />
        </motion.div>
      </div>
      
    
      <div className="flex items-center gap-6">
      
        <div className="flex items-center gap-6">
      
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/60 cursor-pointer"
          >
            <Target className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-700 font-medium">Today's Leads</p>
              <p className="text-sm font-bold text-emerald-900">{performanceData.leads}</p>
            </div>
          </motion.div>

       
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50/80 border border-blue-200/60 cursor-pointer"
          >
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-blue-700 font-medium">Conversions</p>
              <p className="text-sm font-bold text-blue-900">{performanceData.conversions}</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50/80 border border-purple-200/60 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-xs text-purple-700 font-medium">Growth</p>
              <p className="text-sm font-bold text-purple-900">+{performanceData.growth}%</p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
         
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="relative p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all duration-300">
              <Calendar className="h-5 w-5 text-gray-600" />
            </Button>
          </motion.div>

       
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="relative p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all duration-300">
              <Bell className="h-5 w-5 text-gray-600" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg border border-white"
              >
                3
              </motion.span>
            </Button>
          </motion.div>

       
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-600/50">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</motion.header>
*/} 


        {/* Page Content */}
      <main className="min-h-[calc(100vh-6rem)] p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default AppLayout;