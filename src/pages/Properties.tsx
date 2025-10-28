  import React, { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import {
    Plus, Search, Filter, MapPin, Bed, Bath, Square,
    TrendingUp, AlertTriangle, Users, School, ShoppingCart,
    Train, Sun, Droplets, Wifi, Car, Eye, Edit,
    Star, Heart, Share2, Download, BarChart3, Target,
    Clock, DollarSign, Home, Building, Crown, Trash2,
    Save, X, Upload, Calendar, Phone, Mail, User,
    ArrowLeft, ArrowRight, ZoomIn, ZoomOut
  } from "lucide-react";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Badge } from "@/components/ui/badge";
  import { Progress } from "@/components/ui/progress";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { Slider } from "@/components/ui/slider";
  import axios from "axios";
  import propertiesApi, {
  fetchProperties as fetchPropertiesApi,
  createProperty,
  updateProperty,
  toggleFavoriteProperty,
  deleteProperty
} from "@/services/propertiesApi";
  import { Property } from "@/types/property";

  // Default property structure for initialization
  const defaultProperty = {
    title: "",
    price: "",
    location: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "sq ft",
    status: "available",
    type: "single_family",
    yearBuilt: new Date().getFullYear(),
    images: [],
    description: "",
    leads: 0,
    views: 0,
    favorite: false,
    createdAt: new Date().toISOString().split("T")[0],
    analytics: {
      riskScore: 0,
      investmentPotential: 0,
      rentalYield: 0,
      appreciation: 0,
      demandScore: 0,
      marketValue: 0,
      pricePerSqFt: 0
    },
    hazards: [],
    demographics: {
      averageAge: 0,
      averageIncome: "",
      familyRatio: 0,
      education: "",
      populationDensity: "medium"
    },
    amenities: {
      transit: [],
      education: [],
      shopping: [],
      parks: [],
      healthcare: [],
      other: []
    },
    marketInsights: {
      daysOnMarket: 0,
      pricePerSqFt: 0,
      comparableSales: 0,
      marketTrend: "stable",
      avgDaysOnMarket: 0
    },
    financials: {
      monthlyRent: 0,
      propertyTax: 0,
      insurance: 0,
      maintenance: 0,
      hoa: 0
    },
    ownerInfo: {
      name: "",
      email: "",
      phone: "",
      since: new Date().toISOString().split("T")[0]
    }
  };

  const Properties = () => {
const [properties, setProperties] = useState<Property[]>([]);
const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [isViewPropertyOpen, setIsViewPropertyOpen] = useState(false);
    const [view, setView] = useState("grid");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    
    useEffect(() => {
      fetchProperties();
    }, []);

  const fetchProperties = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const data = await fetchPropertiesApi();
    console.log
    setProperties(data);
  } catch (err: any) {
    console.error("Fetch Properties Error:", err);
    setError(err.message || "Failed to load properties");
    setProperties([]);
  } finally {
    setIsLoading(false);
  }
};

const toggleFavorite = async (id: string) => {
  try {
    const updatedProperty = await toggleFavoriteProperty(id);
    setProperties((props) =>
      props.map((p) => (p._id === id ? updatedProperty : p))
    );
  } catch (err: any) {
    console.error("Toggle Favorite Error:", err);
    setError(err.message);
  }
};



  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setIsViewPropertyOpen(true);
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const openEditModal = (property) => {
    setModalMode("edit");
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

const handleSaveProperty = async (propertyData: Property, files: File[], deletedImages: string[]) => {
  const formData = new FormData();

  // ✅ Stringify the main object, make sure hazards is an array of objects
  const dataToSend = { ...propertyData, hazards: propertyData.hazards || [] };
  formData.append("data", JSON.stringify(dataToSend));

  // Deleted images
  formData.append("deletedImages", JSON.stringify(deletedImages));

  // Append files
  files.forEach((file) => formData.append("images", file));

  try {
    if (modalMode === "add") {
      await createProperty(formData);
    } else if (selectedProperty) {
      await updateProperty(selectedProperty._id, formData);
    }
    await fetchProperties();
    setIsModalOpen(false);
  } catch (err: any) {
    console.error("Save Property Error:", err);
    setError(err.response?.data?.error || err.message);
  }
};



  const handleDeleteProperty = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this property?")) return;

  try {
    await deleteProperty(id);
    await fetchProperties();
  } catch (err: any) {
    console.error("Delete Property Error:", err);
    setError(err.message);
  }
};



    const nextImage = () => {
      setCurrentImageIndex((prev) =>
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    };

    const getRiskColor = (score) => {
      if (score <= 20) return "text-green-600 bg-green-100 border-green-200";
      if (score <= 40) return "text-yellow-600 bg-yellow-100 border-yellow-200";
      return "text-red-600 bg-red-100 border-red-200";
    };

    const getHazardColor = (level) => {
      switch (level) {
        case "very_low":
          return "bg-green-500 text-white";
        case "low":
          return "bg-blue-500 text-white";
        case "medium":
          return "bg-yellow-500 text-white";
        case "high":
          return "bg-orange-500 text-white";
        case "very_high":
          return "bg-red-500 text-white";
        default:
          return "bg-gray-500 text-white";
      }
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
        },
      },
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div>Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="text-red-600">Error: {error}</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Property Portfolio
              </h1>
              <p className="text-slate-600 mt-1">Manage listings with advanced analytics & risk assessment</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-slate-300"
                onClick={() => setView(view === "grid" ? "analytics" : "grid")}
              >
                <BarChart3 size={16} />
                {view === "grid" ? "Analytics View" : "Grid View"}
              </Button>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                onClick={openAddModal}
              >
                <Plus size={16} />
                Add Property
              </Button>
            </div>
          </div>
        </motion.header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Stats Overview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Properties</p>
                    <p className="text-2xl font-bold text-slate-900">{properties.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="text-blue-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Leads</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {properties.reduce((sum, prop) => sum + prop.leads, 0)}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Risk Score</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {properties.length > 0
                        ? Math.round(
                            properties.reduce((sum, prop) => sum + prop.analytics.riskScore, 0) /
                              properties.length
                          )
                        : 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Investment Potential</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {properties.length > 0
                        ? Math.round(
                            properties.reduce(
                              (sum, prop) => sum + prop.analytics.investmentPotential,
                              0
                            ) / properties.length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="text-purple-600" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Search properties by location, features, or risk factors..."
                className="pl-10 border-slate-300 bg-white/80"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 border-slate-300 bg-white/80">
              <Filter size={16} />
              Advanced Filters
            </Button>
          </motion.div>

          {/* Properties Grid */}
          <AnimatePresence mode="wait">
            {view === "grid" ? (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {properties.map((property) => (
                  <motion.div
                    key={property.id}
                 
                    layoutId={`property-${property.id}`}
                  >
                    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-xl transition-all duration-300 group">
                      <div className="relative">
                <img
  src={
    property.images && property.images[0]
      ? `https://api.estate.techtrekkers.ai${encodeURI(property.images[0])}`
      : "/placeholder-image.jpg"
  }
  alt={property.title}
  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
  onError={(e) => {
    console.error("Image load error:", e.currentTarget.src);
    e.currentTarget.src = "/placeholder-image.jpg";
  }}
/>

                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge
                            className={`${
                              property.status === "available" ? "bg-green-500" : "bg-yellow-500"
                            } text-white`}
                          >
                            {property.status}
                          </Badge>
                          <Badge className={getRiskColor(property.analytics.riskScore)}>
                            Risk: {property.analytics.riskScore}%
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                          onClick={() => toggleFavorite(property._id)}
                        >
                          <Heart
                            size={16}
                            className={property.favorite ? "fill-red-500 text-red-500" : "text-slate-600"}
                          />
                        </Button>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1 text-slate-800">
                            {property.title}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            <span className="truncate">{property.location}</span>
                          </CardDescription>
                        </div>
                        <span className="text-xl font-bold text-green-600 ml-2">₹ {property.price}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                        <div className="flex items-center">
                          <Bed size={14} className="mr-1" />
                          {property.bedrooms} bed
                        </div>
                        <div className="flex items-center">
                          <Bath size={14} className="mr-1" />
                          {property.bathrooms} bath
                        </div>
                        <div className="flex items-center">
                          <Square size={14} className="mr-1" />
                          {property.area} {property.areaUnit}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Investment Potential</span>
                          <span className="font-medium">{property.analytics.investmentPotential}%</span>
                        </div>
                        <Progress value={property.analytics.investmentPotential} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="font-semibold text-slate-800">{property.leads}</div>
                          <div className="text-slate-500">Leads</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="font-semibold text-slate-800">{property.views}</div>
                          <div className="text-slate-500">Views</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <div className="font-semibold text-blue-600">{property.analytics.rentalYield}%</div>
                          <div className="text-slate-500">Yield</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-slate-300"
                          onClick={() => openEditModal(property)}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleViewProperty(property)}
                        >
                          <Eye size={14} className="mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
         <img
  src={
    property.images && property.images[0]
      ? `https://api.estate.techtrekkers.ai${encodeURI(property.images[0])}`
      : "/placeholder-image.jpg"
  }
  alt={property.title}
  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
  onError={(e) => {
    console.error("Image load error:", e.currentTarget.src);
    e.currentTarget.src = "/placeholder-image.jpg";
  }}
/>

                        </div>

                        <div className="lg:w-2/3 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800">{property.title}</h3>
                              <p className="text-slate-600 flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {property.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">{property.price}</div>
                              <Badge className={getRiskColor(property.analytics.riskScore)}>
                                Risk Score: {property.analytics.riskScore}%
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                              <div className="font-bold text-slate-800">
                                {property.analytics.investmentPotential}%
                              </div>
                              <div className="text-xs text-slate-600">Potential</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                              <div className="font-bold text-slate-800">{property.analytics.appreciation}%</div>
                              <div className="text-xs text-slate-600">Appreciation</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                              <div className="font-bold text-slate-800">{property.analytics.rentalYield}%</div>
                              <div className="text-xs text-slate-600">Rental Yield</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <Users className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                              <div className="font-bold text-slate-800">{property.analytics.demandScore}%</div>
                              <div className="text-xs text-slate-600">Demand</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                                <AlertTriangle size={16} className="mr-1" />
                                Risk Hazards
                              </h4>
                              <div className="space-y-2">
                                {property.hazards.map((hazard, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="capitalize">{hazard.type}</span>
                                    <Badge className={getHazardColor(hazard.level)}>
                                      {hazard.level.replace("_", " ")}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                                <Building size={16} className="mr-1" />
                                Nearby Amenities
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(property.amenities)
                                  .flatMap(([, items]) => items)
                                  .map((item, index) => (
                                    <Badge key={index} variant="outline" className="bg-white">
                                      {item.replace("_", " ")}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              size="sm"
                              onClick={() => handleViewProperty(property)}
                            >
                              <Eye size={14} className="mr-1" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(property)}
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unified Add/Edit Modal */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedProperty}
        onSave={handleSaveProperty}
      />

      {/* View Property Modal */}
      <Dialog open={isViewPropertyOpen} onOpenChange={setIsViewPropertyOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  {selectedProperty.title}
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  {selectedProperty.address}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="relative">
            <img
  src={
    selectedProperty.images && selectedProperty.images[currentImageIndex]
      ? `https://api.estate.techtrekkers.ai${encodeURI(selectedProperty.images[currentImageIndex])}`
      : "/placeholder-image.jpg"
  }
  alt={selectedProperty.title}
  className="w-full h-64 md:h-96 object-cover rounded-lg"
  onError={(e) => {
    console.error("Image load error:", e.currentTarget.src);
    e.currentTarget.src = "/placeholder-image.jpg";
  }}
/>

                  {selectedProperty.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ArrowLeft size={16} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ArrowRight size={16} />
                      </Button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {selectedProperty.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? "bg-white" : "bg-white/50"
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-md">Analytics</TabsTrigger>
                    <TabsTrigger value="financials" className="rounded-md">Financials</TabsTrigger>
                    <TabsTrigger value="owner" className="rounded-md">Owner Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.bedrooms}</div>
                          <div className="text-sm text-slate-600">Bedrooms</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Bath className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.bathrooms}</div>
                          <div className="text-sm text-slate-600">Bathrooms</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Square className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.area}</div>
                          <div className="text-sm text-slate-600">{selectedProperty.areaUnit}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.yearBuilt}</div>
                          <div className="text-sm text-slate-600">Year Built</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600">{selectedProperty.description}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">
                            {selectedProperty.analytics.investmentPotential}%
                          </div>
                          <div className="text-sm text-slate-600">Investment Potential</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.analytics.riskScore}%</div>
                          <div className="text-sm text-slate-600">Risk Score</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.analytics.rentalYield}%</div>
                          <div className="text-sm text-slate-600">Rental Yield</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <div className="font-bold text-slate-800">{selectedProperty.analytics.appreciation}%</div>
                          <div className="text-sm text-slate-600">Appreciation</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="financials" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-600">Monthly Rent</div>
                          <div className="font-bold text-slate-800">${selectedProperty.financials.monthlyRent}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-600">Property Tax</div>
                          <div className="font-bold text-slate-800">${selectedProperty.financials.propertyTax}/mo</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-600">Insurance</div>
                          <div className="font-bold text-slate-800">${selectedProperty.financials.insurance}/mo</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-600">Maintenance</div>
                          <div className="font-bold text-slate-800">${selectedProperty.financials.maintenance}/mo</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-600">HOA</div>
                          <div className="font-bold text-slate-800">${selectedProperty.financials.hoa}/mo</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="owner" className="space-y-4 mt-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Name</span>
                            <span className="font-medium">{selectedProperty.ownerInfo.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Email</span>
                            <span className="font-medium">{selectedProperty.ownerInfo.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Phone</span>
                            <span className="font-medium">{selectedProperty.ownerInfo.phone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">Owner Since</span>
                            <span className="font-medium">{selectedProperty.ownerInfo.since}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewPropertyOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewPropertyOpen(false);
                    openEditModal(selectedProperty);
                  }}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Property
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PropertyFormModal = ({ isOpen, onClose, mode, initialData, onSave }) => {
  const [propertyData, setPropertyData] = useState(defaultProperty);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setPropertyData(initialData);
      setPreviews(initialData.images || []);
    } else {
      setPropertyData(defaultProperty);
      setPreviews([]);
    }
    setFiles([]);
    setDeletedImages([]);
  }, [initialData, isOpen, mode]);

  const handleChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section, key, value) => {
    setPropertyData({
      ...propertyData,
      [section]: { ...propertyData[section], [key]: value },
    });
  };

  const addHazard = () => {
    setPropertyData({
      ...propertyData,
      hazards: [...propertyData.hazards, { type: "flood", level: "low", description: "" }],
    });
  };

  const removeHazard = (index) => {
    setPropertyData({
      ...propertyData,
      hazards: propertyData.hazards.filter((_, i) => i !== index),
    });
  };

  const updateHazard = (index, key, value) => {
    const updatedHazards = [...propertyData.hazards];
    updatedHazards[index][key] = value;
    setPropertyData({ ...propertyData, hazards: updatedHazards });
  };

  const toggleAmenity = (category, item) => {
    const updatedAmenities = { ...propertyData.amenities };
    if (updatedAmenities[category].includes(item)) {
      updatedAmenities[category] = updatedAmenities[category].filter((i) => i !== item);
    } else {
      updatedAmenities[category].push(item);
    }
    setPropertyData({ ...propertyData, amenities: updatedAmenities });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (index < propertyData.images.length) {
      setDeletedImages([...deletedImages, propertyData.images[index]]);
      setPropertyData({
        ...propertyData,
        images: propertyData.images.filter((_, i) => i !== index),
      });
    } else {
      const fileIndex = index - propertyData.images.length;
      setFiles(files.filter((_, i) => i !== fileIndex));
    }
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSave(propertyData, files, deletedImages);
  };

  const propertyTypes = [
    "single_family",
    "condo",
    "townhouse",
    "multi_family",
    "commercial",
    "land",
  ];

  const hazardTypes = ["flood", "earthquake", "fire", "landslide", "hurricane", "tornado"];

  const hazardLevels = ["very_low", "low", "medium", "high", "very_high"];

  const amenityOptions = {
    transit: ["subway", "bus", "train", "light_rail", "airport"],
    education: ["top_schools", "good_schools", "universities", "colleges"],
    shopping: ["luxury_malls", "local_malls", "grocery", "boutiques"],
    parks: ["community_parks", "nature_preserve", "playgrounds", "riverside_park"],
    healthcare: ["hospital", "clinics", "specialty_clinics", "dentists"],
    other: ["gym", "pool", "concierge", "security", "garage", "garden"],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
            {mode === "add" ? "Add New Property" : "Edit Property"}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {mode === "add"
              ? "Create a new property listing with comprehensive analytics and risk assessment."
              : "Update property details and analytics."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="basic" className="rounded-md text-xs">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-md text-xs">
              Property Details
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md text-xs">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="risks" className="rounded-md text-xs">
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="amenities" className="rounded-md text-xs">
              Amenities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Property Title *</Label>
                <Input
                  name="title"
                  placeholder="Luxury Downtown Penthouse"
                  value={propertyData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  name="price"
                   placeholder="₹55,00,000"
                  value={propertyData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label>Location *</Label>
                <Input
                  name="location"
                  placeholder="Downtown Financial District"
                  value={propertyData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label>Full Address</Label>
                <Input
                  name="address"
                  placeholder="123 Skyline Boulevard, New York, NY 10001"
                  value={propertyData.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Property Type</Label>
                <Select
                  value={propertyData.type}
                  onValueChange={(value) => setPropertyData({ ...propertyData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={propertyData.status}
                  onValueChange={(value) => setPropertyData({ ...propertyData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Images</Label>
              <Input type="file" multiple onChange={handleFileChange} />
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded" />
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-0 text-red-500"
                      onClick={() => removeImage(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  name="bedrooms"
                  placeholder="3"
                  value={propertyData.bedrooms}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  name="bathrooms"
                  placeholder="2"
                  value={propertyData.bathrooms}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Year Built</Label>
                <Input
                  type="number"
                  name="yearBuilt"
                  placeholder="2020"
                  value={propertyData.yearBuilt}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label>Area</Label>
                <div className="flex gap-2">
                  <Input
                    name="area"
                    placeholder="2400"
                    value={propertyData.area}
                    onChange={handleChange}
                  />
                  <Select
                    value={propertyData.areaUnit}
                    onValueChange={(value) => setPropertyData({ ...propertyData, areaUnit: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sq ft">sq ft</SelectItem>
                      <SelectItem value="sq m">sq m</SelectItem>
                      <SelectItem value="acres">acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                placeholder="Describe the property features, unique selling points, and key amenities..."
                value={propertyData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Investment Potential (%)</Label>
                <Slider
                  value={[propertyData.analytics.investmentPotential]}
                  onValueChange={(value) =>
                    handleNestedChange("analytics", "investmentPotential", value[0])
                  }
                  max={100}
                  step={1}
                />
                <div className="text-sm text-slate-600 mt-1">
                  {propertyData.analytics.investmentPotential}%
                </div>
              </div>
              <div>
                <Label>Risk Score (%)</Label>
                <Slider
                  value={[propertyData.analytics.riskScore]}
                  onValueChange={(value) => handleNestedChange("analytics", "riskScore", value[0])}
                  max={100}
                  step={1}
                />
                <div className="text-sm text-slate-600 mt-1">{propertyData.analytics.riskScore}%</div>
              </div>
              <div>
                <Label>Rental Yield (%)</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.rentalYield}
                  onChange={(e) =>
                    handleNestedChange("analytics", "rentalYield", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Appreciation (%)</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.appreciation}
                  onChange={(e) =>
                    handleNestedChange("analytics", "appreciation", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Demand Score (%)</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.demandScore}
                  onChange={(e) =>
                    handleNestedChange("analytics", "demandScore", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <Label>Market Value</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.marketValue}
                  onChange={(e) =>
                    handleNestedChange("analytics", "marketValue", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Risk Hazards</Label>
                <Button variant="outline" size="sm" onClick={addHazard}>
                  <Plus size={14} className="mr-1" />
                  Add Hazard
                </Button>
              </div>
              {propertyData.hazards.map((hazard, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-3 border rounded-lg">
                  <Select
                    value={hazard.type}
                    onValueChange={(value) => updateHazard(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hazardTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={hazard.level}
                    onValueChange={(value) => updateHazard(index, "level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hazardLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Description"
                      value={hazard.description}
                      onChange={(e) => updateHazard(index, "description", e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => removeHazard(index)}>
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4 mt-4">
            {Object.entries(amenityOptions).map(([category, options]) => (
              <div key={category}>
                <Label className="capitalize">{category.replace("_", " ")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option) => (
                    <Badge
                      key={option}
                      variant={propertyData.amenities[category].includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAmenity(category, option)}
                    >
                      {option.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save size={16} className="mr-2" />
            {mode === "add" ? "Add Property" : "Update Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Properties;