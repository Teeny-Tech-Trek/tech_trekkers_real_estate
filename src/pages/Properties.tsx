import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Home, TrendingUp, AlertTriangle, Eye, Edit, Trash2, Heart, MapPin, 
  ChevronLeft, ChevronRight, Bed, Bath, Maximize2, Filter, BarChart3, MoreVertical,
  Download, Share2, Copy, Settings, X, RefreshCw, Sparkles, Zap, ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import PropertyFormModal from "@/components/PropertyFormModal";
import { Property } from "@/types/property";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const Properties: React.FC = () => {
  // Logic removed - keeping UI only
  // Logic removed - keeping UI only
  // TODO: Implement usePropertiesLogic hook when needed
  const {
    properties,
    selectedProperty,
    isModalOpen,
    modalMode,
    isViewPropertyOpen,
    view,
    currentImageIndex,
    isLoading,
    error,
    setIsViewPropertyOpen,
    setView,
    setCurrentImageIndex,
    setIsModalOpen,
    toggleFavorite,
    handleViewProperty,
    openAddModal,
    openEditModal,
    handleSaveProperty,
    handleDeleteProperty,
    nextImage,
    prevImage,
    getRiskColor,
    getHazardColor,
  } = {
    properties: [],
    selectedProperty: null,
    isModalOpen: false,
    modalMode: 'add' as const,
    isViewPropertyOpen: false,
    view: 'grid' as const,
    currentImageIndex: 0,
    isLoading: false,
    error: null,
    setIsViewPropertyOpen: () => {},
    setView: () => {},
    setCurrentImageIndex: () => {},
    setIsModalOpen: () => {},
    toggleFavorite: () => {},
    handleViewProperty: () => {},
    openAddModal: () => {},
    openEditModal: () => {},
    handleSaveProperty: () => {},
    handleDeleteProperty: () => {},
    nextImage: () => {},
    prevImage: () => {},
    getRiskColor: () => 'text-gray-400',
    getHazardColor: () => 'bg-gray-500',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold'>('all');
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);

  const maxProperties = 50;
  const totalProperties = properties.length;
  const availableProperties = properties.filter(p => p.status === 'available').length;
  const totalLeads = properties.reduce((sum, p) => sum + (p.leads || 0), 0);
  const avgInvestmentScore = properties.length 
    ? Math.round(properties.reduce((s, p) => s + (p.analytics?.investmentPotential || 0), 0) / properties.length)
    : 0;

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-slate-300 text-lg">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-red-400" size={28} />
            <h3 className="text-red-400 font-semibold text-xl">Error</h3>
          </div>
          <p className="text-slate-300">{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] p-10">
      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Enhanced Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Property Portfolio
              </h1>
              <p className="text-base text-slate-400">Manage and analyze your real estate listings</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Plan Usage - Minimalist */}
              <div className="flex items-center gap-4 px-5 py-3 bg-slate-900/40 border  border-slate-500 rounded-full backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <div className="text-sm">
                    <span className="text-white font-bold">{totalProperties}</span>
                    <span className="text-slate-500 mx-1.5">/</span>
                    <span className="text-slate-500">{maxProperties}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-200 font-medium">Properties Listed</span>
              </div>

              {/* Action Buttons */}
              <button className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200 backdrop-blur-sm group">
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:rotate-180 transition-all duration-500" />
              </button>

              <button
                onClick={() => setView(view === "grid" ? "analytics" : "grid")}
                className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200 backdrop-blur-sm group"
              >
                <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
              </button>

              <button
                onClick={openAddModal}
                disabled={totalProperties >= maxProperties}
                className="group flex items-center gap-2.5 px-6 py-3 bg-white hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 rounded-full font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:border disabled:border-slate-700"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Add Property
              </button>
            </div>
          </div>

          {/* Enhanced KPI Stats - Organic Layout */}
          <div className="relative mb-8">
            <div className="flex items-center justify-between gap-8 px-4">
              {/* Stat 1 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{totalProperties}</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +12%
                  </span>
                </div>
                <div className="text-slate-400 font-medium">Total Properties</div>
                <div className="text-slate-600 text-sm mt-0.5">{maxProperties - totalProperties} slots available</div>
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700/30 to-transparent" />

              {/* Stat 2 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{availableProperties}</span>
                </div>
                <div className="text-slate-400 font-medium">Available</div>
                <div className="text-slate-600 text-sm mt-0.5">{totalProperties - availableProperties} sold</div>
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700/30 to-transparent" />

              {/* Stat 3 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{totalLeads}</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +24%
                  </span>
                </div>
                <div className="text-slate-400 font-medium">Active Leads</div>
                <div className="text-slate-600 text-sm mt-0.5">Last 30 days</div>
              </div>

              {/* Divider */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-700/30 to-transparent" />

              {/* Stat 4 */}
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-5xl font-bold text-white tracking-tight">{avgInvestmentScore}%</span>
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +8%
                  </span>
                </div>
                <div className="text-slate-400 font-medium">Investment Score</div>
                <div className="text-slate-600 text-sm mt-0.5">Average potential</div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - Minimal */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/30 border  border-slate-500 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:bg-slate-900/50 focus:border-slate-700/50 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available' | 'sold')}
              className="px-4 py-3.5 bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-300 text-sm hover:bg-slate-900/50 hover:border-slate-700/50 transition-all focus:outline-none focus:bg-slate-900/50 focus:border-slate-700/50 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        {/* Properties Grid/Analytics View */}
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            filteredProperties.length === 0 ? (
              searchQuery || filterStatus !== 'all' ? (
                <NoResultsState />
              ) : (
                <EmptyState onCreateClick={openAddModal} />
              )
            ) : (
              <motion.div 
                key="grid"
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProperties.map((property, index) => (
                  <motion.div key={property._id} variants={itemVariants}>
                    <PropertyCard 
                      property={property}
                      onToggleFavorite={() => toggleFavorite(property._id)}
                      onView={() => handleViewProperty(property)}
                      onEdit={() => openEditModal(property)}
                      onDelete={() => handleDeleteProperty(property._id)}
                      showMenu={showMenuFor === property._id}
                      onToggleMenu={() => setShowMenuFor(showMenuFor === property._id ? null : property._id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            <motion.div 
              key="analytics" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="space-y-5"
            >
              {filteredProperties.map((property, index) => (
                <PropertyAnalyticsCard 
                  key={property._id}
                  property={property}
                  index={index}
                  onView={() => handleViewProperty(property)}
                  onEdit={() => openEditModal(property)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <PropertyFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode} 
        initialData={selectedProperty} 
        onSave={handleSaveProperty} 
      />

      {/* View Property Modal */}
      {showMenuFor && <div className="fixed inset-0 z-10" onClick={() => setShowMenuFor(null)} />}
      
      <ViewPropertyModal 
        isOpen={isViewPropertyOpen}
        property={selectedProperty}
        currentImageIndex={currentImageIndex}
        onClose={() => setIsViewPropertyOpen(false)}
        onEdit={() => { 
          setIsViewPropertyOpen(false); 
          openEditModal(selectedProperty!); 
        }}
        onNextImage={nextImage}
        onPrevImage={prevImage}
      />
    </div>
  );
};

// Property Card Component
interface PropertyCardProps {
  property: Property;
  onToggleFavorite: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showMenu: boolean;
  onToggleMenu: () => void;
}

function PropertyCard({ 
  property, 
  onToggleFavorite,
  onView,
  onEdit,
  onDelete,
  showMenu,
  onToggleMenu
}: PropertyCardProps) {
  const statusConfig = {
    available: { 
      label: 'Available', 
      color: 'text-emerald-400',
      dot: 'bg-emerald-400'
    },
    sold: { 
      label: 'Sold', 
      color: 'text-amber-400',
      dot: 'bg-amber-400'
    }
  };

  const status = statusConfig[property.status as keyof typeof statusConfig] || statusConfig.available;
  const conversionRate = property.leads > 0 
    ? Math.round((property.conversions || 0) / property.leads * 100) 
    : 0;

  return (
    <div className="group relative bg-slate-900/30 border  border-slate-500 rounded-2xl overflow-hidden hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-slate-800">
        <img 
          src={property.images?.[0] || "/placeholder.svg"} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg text-xs font-medium ${status.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        </div>
        
        {/* Favorite */}
        <button 
          className="absolute top-3 right-3 w-9 h-9 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 border border-slate-700/50 rounded-lg flex items-center justify-center transition-colors" 
          onClick={onToggleFavorite}
        >
          <Heart 
            size={16} 
            className={property.favorite ? "fill-red-500 text-red-500" : "text-slate-400"} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg mb-1.5 truncate">
              {property.title}
            </h3>
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin size={14} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
          
          <div className="relative ml-2 ">
            <button
              onClick={onToggleMenu}
              className="p-1.5 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-800/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
                <button 
                  onClick={onView}
                  className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
                <button 
                  onClick={onEdit}
                  className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Property
                </button>
                <button className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
                <div className="h-px bg-slate-700/50 my-1.5" />
                <button 
                  onClick={onDelete}
                  className="w-full px-3.5 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-5 pb-5 border-b border-slate-800/50">
          <div className="text-3xl font-bold text-white">
            ₹{property.price?.toLocaleString()}
          </div>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Bed size={16} className="text-slate-500" />
            <span className="text-sm font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Bath size={16} className="text-slate-500" />
            <span className="text-sm font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Maximize2 size={16} className="text-slate-500" />
            <span className="text-sm font-medium">{property.area} {property.areaUnit}</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Active Leads</span>
            <span className="text-white font-semibold">{property.leads || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Investment Score</span>
            <div className="flex items-center gap-3">
              <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${property.analytics?.investmentPotential || 0}%` }}
                />
              </div>
              <span className="text-emerald-400 text-xs font-semibold w-9 text-right">{property.analytics?.investmentPotential || 0}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Risk Level</span>
            <span className="text-white font-semibold">{property.analytics?.riskScore || 0}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// Property Analytics Card Component
interface PropertyAnalyticsCardProps {
  property: Property;
  index: number;
  onView: () => void;
  onEdit: () => void;
}

function PropertyAnalyticsCard({ property, index, onView, onEdit }: PropertyAnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="relative bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="relative w-full lg:w-80 h-56 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
            <img 
              src={property.images?.[0] || "/placeholder.svg"} 
              alt={property.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{property.title}</h3>
                <div className="flex items-center text-slate-400 mb-3">
                  <MapPin size={16} className="mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <Bed size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-300">{property.bedrooms}</span>
                  <span className="text-slate-600">•</span>
                  <Bath size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-300">{property.bathrooms}</span>
                  <span className="text-slate-600">•</span>
                  <Maximize2 size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-300">{property.area} {property.areaUnit}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-1">Price</div>
                <div className="text-3xl font-bold text-white">₹{property.price?.toLocaleString()}</div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold mb-1 uppercase">Investment</div>
                <div className="text-3xl font-bold text-white">{property.analytics?.investmentPotential || 0}%</div>
              </div>
              <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold mb-1 uppercase">Risk</div>
                <div className="text-3xl font-bold text-white">{property.analytics?.riskScore || 0}%</div>
              </div>
              <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold mb-1 uppercase">Yield</div>
                <div className="text-3xl font-bold text-white">{property.analytics?.rentalYield || 0}%</div>
              </div>
              <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                <div className="text-xs text-slate-400 font-semibold mb-1 uppercase">Demand</div>
                <div className="text-3xl font-bold text-white">{property.analytics?.demandScore || 0}%</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={onEdit}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <Edit size={14} />
                Edit Property
              </button>
              <button 
                onClick={onView}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 text-sm font-medium"
              >
                <Eye size={14} />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// View Property Modal
interface ViewPropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  currentImageIndex: number;
  onClose: () => void;
  onEdit: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
}

function ViewPropertyModal({ isOpen, property, currentImageIndex, onClose, onEdit, onNextImage, onPrevImage }: ViewPropertyModalProps) {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800/50">
        <DialogHeader className="border-b border-slate-800/50 pb-5">
          <DialogTitle className="text-3xl font-bold text-white">{property.title}</DialogTitle>
          <DialogDescription className="text-slate-400 text-base mt-2">
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              {property.address || property.location}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Image Gallery */}
          <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-slate-800 group">
            <img 
              src={property.images?.[currentImageIndex] || "/placeholder.svg"} 
              alt={property.title} 
              className="w-full h-full object-cover" 
            />
            
            {property.images && property.images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 border border-slate-700/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={onPrevImage}
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 border border-slate-700/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={onNextImage}
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((imageUrl: string, idx: number) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 w-1.5'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <h4 className="text-white font-bold text-lg mb-3">Overview</h4>
                <p className="text-slate-300 leading-relaxed">{property.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                  <Bed size={24} className="text-slate-400 mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-white mb-1">{property.bedrooms}</div>
                  <div className="text-xs text-slate-400">Bedrooms</div>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                  <Bath size={24} className="text-slate-400 mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-white mb-1">{property.bathrooms}</div>
                  <div className="text-xs text-slate-400">Bathrooms</div>
                </div>
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                  <Maximize2 size={24} className="text-slate-400 mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-white mb-1">{property.area}</div>
                  <div className="text-xs text-slate-400">{property.areaUnit}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-3">Analytics</h4>
              <div className="space-y-3">
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-semibold">Investment Potential</span>
                    <span className="text-white font-bold text-lg">{property.analytics?.investmentPotential || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      style={{ width: `${property.analytics?.investmentPotential || 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-semibold">Risk Score</span>
                    <span className="text-white font-bold text-lg">{property.analytics?.riskScore || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                      style={{ width: `${property.analytics?.riskScore || 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400 text-sm font-semibold">Rental Yield</span>
                    <span className="text-white font-bold text-lg">{property.analytics?.rentalYield || 0}%</span>
                  </div>
                  <div className="h-2 bg-slate-700/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                      style={{ width: `${property.analytics?.rentalYield || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-800/50 pt-5">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-semibold"
          >
            Close
          </button>
          <button 
            onClick={onEdit}
            className="group px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
          >
            <Edit size={16} />
            Edit Property
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Empty State Component
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 rounded-3xl flex items-center justify-center shadow-2xl">
          <Home className="w-12 h-12 text-slate-400" />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-3">No Properties Yet</h3>
      <p className="text-slate-400 text-center max-w-md mb-8 leading-relaxed">
        Start building your real estate portfolio by adding your first property listing.
      </p>
      <button
        onClick={onCreateClick}
        className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold transition-all duration-200 shadow-lg hover:scale-105"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        Add Your First Property
      </button>
    </div>
  );
}

// No Results State Component
function NoResultsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Properties Found</h3>
      <p className="text-slate-400 text-center max-w-md">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
}

export default Properties;