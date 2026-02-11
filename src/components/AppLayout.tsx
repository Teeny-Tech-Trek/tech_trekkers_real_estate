// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import logoImg from "../imges/WhatsApp_Image_2025-11-05_at_5.37.53_PM-removebg-preview.png"
// import { 
//   LayoutDashboard, 
//   Users, 
//   Building, 
//   MessageSquare, 
//   BarChart3, 
//   Settings, 
//   LogOut,
//   Plus,
//   Bell,
//   Search,
//   ChevronRight,
//   Home,
//   Sparkles,
//   Calendar,
//   Target,
//   TrendingUp,
//   Zap,
//   Menu,
//   X
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// const sidebarItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
//   { icon: Users, label: 'Avatars', path: '/avatars' },
//   { icon: Building, label: 'Properties', path: '/properties' },
//   { icon: MessageSquare, label: 'Leads', path: '/leads' },
//   { icon: BarChart3, label: 'Analytics', path: '/analytics' },
//   { icon: Settings, label: 'Settings', path: '/settings' },
// ];

// const AppLayout = () => {
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   // Mock performance data
//   const performanceData = {
//     leads: 24,
//     conversions: 8,
//     growth: 12.5,
//   };

//   const toggleMobileSidebar = () => {
//     setIsMobileSidebarOpen(!isMobileSidebarOpen);
//   };

//   const closeMobileSidebar = () => {
//     setIsMobileSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
//       {/* Mobile Header - Only visible on mobile/tablet */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
//         <div className="flex items-center justify-between px-4 py-3">
//           <div className="flex items-center gap-3">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={toggleMobileSidebar}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <Menu className="h-5 w-5 text-gray-700" />
//             </Button>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
//                 {/* <Home className="h-4 w-4 text-white" />
//                  */}
//                  <img src={logoImg} alt="logo" />
//               </div>
//               <h2 className="font-bold text-gray-900 text-base sm:text-lg">Estate AI</h2>
//             </div>
//           </div>
//           {/* <div className="flex items-center gap-2">
//             <Button variant="ghost" size="sm" className="relative p-2 rounded-lg hover:bg-gray-100">
//               <Bell className="h-5 w-5 text-gray-600" />
//               <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold text-[10px]">
//                 3
//               </span>
//             </Button>
//           </div> */}
//         </div>
//       </div>

//       {/* Mobile Overlay - Clicks here close the sidebar */}
//       <AnimatePresence>
//         {isMobileSidebarOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="lg:hidden fixed inset-0 bg-black/50 z-40"
//             onClick={closeMobileSidebar}
//           />
//         )}
//       </AnimatePresence>

//       {/* Enhanced Premium Sidebar */}
//       <motion.aside
//         initial={false}
//         animate={{ 
//           x: isMobileSidebarOpen ? 0 : -320
//         }}
//         transition={{ type: "spring", damping: 25, stiffness: 200 }}
//         className={`
//           fixed left-0 top-0 z-50 h-screen bg-white backdrop-blur-xl border-r border-gray-200/80 shadow-2xl
//           w-[280px] sm:w-[300px] lg:w-72 xl:w-80
//           lg:!translate-x-0
//         `}
//         style={{
//           transform: window.innerWidth >= 1024 ? 'translateX(0)' : undefined
//         }}
//       >
//         <div className="flex flex-col h-full">
//           {/* Close button for mobile */}
//           <div className="lg:hidden absolute top-4 right-4 z-10">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={closeMobileSidebar}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <X className="h-5 w-5 text-gray-700" />
//             </Button>
//           </div>

//           {/* Enhanced Premium Logo */}
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="p-4 sm:p-5 lg:p-6 border-b border-gray-100/80 bg-gradient-to-r from-white to-blue-50/30"
//           >
//             <div className="flex items-center gap-3 lg:gap-4">
//               <div className="relative">
//                 <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
//                   {/* <Home className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
//                    */}
//                    <img src={logoImg} alt="logo" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
//                   <Sparkles className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-white" />
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h2 className="font-bold text-gray-900 text-lg sm:text-xl font-display tracking-tight">Estate AI</h2>
//                 <p className="text-[10px] sm:text-xs text-gray-500 font-medium bg-gradient-to-r from-blue-600/10 to-cyan-600/10 px-2 py-0.5 lg:py-1 rounded-full inline-block">
//                   AI Real Estate Platform
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Enhanced Navigation */}
//           <nav className="flex-1 p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-y-auto">
//             {sidebarItems.map((item, index) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
              
//               return (
//                 <motion.div
//                   key={item.path}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.1 + index * 0.05 }}
//                 >
//                   <motion.button
//                     whileHover={{ 
//                       x: 4,
//                       backgroundColor: isActive ? '' : 'rgba(59, 130, 246, 0.05)'
//                     }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       navigate(item.path);
//                       closeMobileSidebar();
//                     }}
//                     className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 group relative overflow-hidden border ${
//                       isActive 
//                         ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border-blue-200/60 shadow-blue-500/10' 
//                         : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-blue-100'
//                     }`}
//                   >
//                     <div className="flex items-center gap-2.5 sm:gap-3">
//                       <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all duration-300 border ${
//                         isActive 
//                           ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border-blue-600' 
//                           : 'bg-white text-gray-600 border-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200'
//                       }`}>
//                         <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                       </div>
//                       <span className="font-semibold">{item.label}</span>
//                     </div>
                    
//                     {isActive && (
//                       <motion.div
//                         initial={{ scale: 0, rotate: -180 }}
//                         animate={{ scale: 1, rotate: 0 }}
//                         className="text-blue-600"
//                       >
//                         <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
//                       </motion.div>
//                     )}
                    
//                     {/* Enhanced Active indicator */}
//                     {isActive && (
//                       <motion.div
//                         layoutId="activeIndicator"
//                         className="absolute left-0 top-1/2 -translate-y-1/2 w-1 sm:w-1.5 h-8 sm:h-10 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-r-full shadow-lg shadow-blue-500/30"
//                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                       />
//                     )}
//                   </motion.button>
//                 </motion.div>
//               );
//             })}
//           </nav>

//           {/* Enhanced User Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="border-t border-gray-200/80 bg-gradient-to-b from-white to-gray-50/50 p-4 sm:p-5 lg:p-6"
//           >
//             <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 mb-3 rounded-lg sm:rounded-xl bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
//               <div className="relative flex-shrink-0">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
//                   <span className="text-white text-xs sm:text-sm font-bold">
//                     {user?.firstName?.charAt(0) ?? 'U'}
//                   </span>
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
//                   {user?.firstName}
//                 </p>
//                 <p className="text-[10px] sm:text-xs text-gray-500 truncate font-medium">
//                   {user?.organization?.name}
//                 </p>
//               </div>
//             </div>
            
//             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={logout}
//                 className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50/70 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-300 border border-transparent hover:border-red-100 text-xs sm:text-sm"
//               >
//                 <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
//                 Sign Out
//               </Button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.aside>

//       {/* Main Content Area */}
//       <div className="lg:ml-72 xl:ml-80 pt-14 lg:pt-0">
       
//        {/* 
// <motion.header
//   initial={{ y: -100, opacity: 0 }}
//   animate={{ y: 0, opacity: 1 }}
//   transition={{ type: "spring", damping: 25, stiffness: 200 }}
//   className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black-200/80 shadow-sm"
// >
//   <div className="px-8 py-4">
//     <div className="flex items-center justify-between">
     
//       <div className="flex-1 max-w-xl">
//         <motion.div 
//           whileFocus={{ scale: 1.02 }}
//           className="relative"
//         >
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//           <Input
//             placeholder="Search properties, leads, avatars..."
//             className="pl-12 pr-4 py-3 bg-white border-gray-300/60 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 font-medium shadow-sm"
//           />
//         </motion.div>
//       </div>
      
    
//       <div className="flex items-center gap-6">
      
//         <div className="flex items-center gap-6">
      
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/60 cursor-pointer"
//           >
//             <Target className="h-4 w-4 text-emerald-600" />
//             <div>
//               <p className="text-xs text-emerald-700 font-medium">Today's Leads</p>
//               <p className="text-sm font-bold text-emerald-900">{performanceData.leads}</p>
//             </div>
//           </motion.div>

       
//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50/80 border border-blue-200/60 cursor-pointer"
//           >
//             <TrendingUp className="h-4 w-4 text-blue-600" />
//             <div>
//               <p className="text-xs text-blue-700 font-medium">Conversions</p>
//               <p className="text-sm font-bold text-blue-900">{performanceData.conversions}</p>
//             </div>
//           </motion.div>

//           <motion.div 
//             whileHover={{ scale: 1.05 }}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50/80 border border-purple-200/60 cursor-pointer"
//           >
//             <Zap className="h-4 w-4 text-purple-600" />
//             <div>
//               <p className="text-xs text-purple-700 font-medium">Growth</p>
//               <p className="text-sm font-bold text-purple-900">+{performanceData.growth}%</p>
//             </div>
//           </motion.div>
//         </div>

//         <div className="flex items-center gap-3">
         
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Button variant="ghost" size="sm" className="relative p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all duration-300">
//               <Calendar className="h-5 w-5 text-gray-600" />
//             </Button>
//           </motion.div>

       
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             <Button variant="ghost" size="sm" className="relative p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all duration-300">
//               <Bell className="h-5 w-5 text-gray-600" />
//               <motion.span 
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg border border-white"
//               >
//                 3
//               </motion.span>
//             </Button>
//           </motion.div>

       
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-600/50">
//               <Plus className="h-4 w-4 mr-2" />
//               New Task
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   </div>
// </motion.header>
// */} 


//         {/* Page Content */}
//         <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-6rem)] p-4 sm:p-6 lg:p-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="h-full"
//           >
//             <Outlet />
//           </motion.div>
//         </main>
//       </div>

//       {/* Background Decorations */}
//       <div className="fixed top-0 right-0 w-1/2 sm:w-1/3 h-1/3 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl -z-10"></div>
//       <div className="fixed bottom-0 left-0 w-1/3 sm:w-1/4 h-1/4 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl -z-10"></div>
//     </div>
//   );
// };

// export default AppLayout;




import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoImg from "../imges/WhatsApp_Image_2025-11-05_at_5.37.53_PM-removebg-preview.png"
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Dashboard from './Dasboard';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] shadow-sm">
        <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
          {/* LEFT SECTION - Logo and Name */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <img src={logoImg} alt="logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-semibold text-white text-base lg:text-lg">Govind</h2>
              <p className="text-xs lg:text-sm text-gray-100 leading-none">Tenny Tech Trek</p>
            </div>
          </div>

          {/* MIDDLE SECTION - Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 z-10">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

          {/* RIGHT SECTION - Bell and User */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Bell Icon */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 rounded-lg hover:bg-white/10 text-white group"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0f1e3a] animate-pulse"></span>
            </Button>

            {/* User Profile Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileSidebar}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white h-9"
            >
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isMobileSidebarOpen ? 'rotate-90' : ''}`} />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 h-9 w-9 hover:bg-white/10 rounded-lg text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile/User Dropdown Menu */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 z-50 w-72 bg-white border border-gray-200 rounded-lg shadow-xl"
          >
            {/* User Info */}
            <div 
              className="p-4 border-b border-gray-100 cursor-pointer"
              onClick={() => {
                navigate('/avatars');
                closeMobileSidebar();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.organization?.name || 'Organization'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation (only on mobile) */}
            <div className="lg:hidden p-2">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        closeMobileSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-black hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg font-medium"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="pt-16">
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {/* <Outlet /> */}
          < Dashboard/>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

  