import React, { useState, useMemo, useCallback } from 'react';
import { Property } from '../types/property';

export const usePropertiesLogic = () => {
const mockProperties: Property[] = [
  {
    _id: "prop1",
    title: "Luxury Villa with Ocean View",
    price: 15000000,
    location: "Mumbai, Maharashtra",
    address: "123 Ocean Drive",
    bedrooms: 4,
    bathrooms: 4,
    area: 4500,
    areaUnit: "sqft",
    status: "available",
    type: "single_family",
    yearBuilt: 2020,
    images: ["/hero-image.jpg", "/background-section1.png"], // Using existing images for simplicity
    description: "A stunning luxury villa with panoramic ocean views...",
    leads: 50,
    views: 500,
    favorite: false,
    createdAt: "2023-01-15T10:00:00Z",
    analytics: {
      riskScore: 30,
      investmentPotential: 90,
      rentalYield: 8,
      appreciation: 15,
      demandScore: 85,
      marketValue: 16000000,
      pricePerSqFt: 3555,
    },
    hazards: { type: "none", level: "very_low", description: "No known hazards" },
    demographics: {
      averageAge: 35,
      averageIncome: "200k+",
      familyRatio: 0.7,
      education: "high",
      populationDensity: "medium",
    },
    amenities: {
      transit: ["metro", "bus"],
      education: ["international school"],
      shopping: ["luxury mall"],
      parks: ["beach park"],
      healthcare: ["hospital"],
      other: [],
    },
    marketInsights: {
      daysOnMarket: 60,
      pricePerSqFt: 3500,
      comparableSales: 10,
      marketTrend: "upward",
      avgDaysOnMarket: 75,
    },
    financials: {
      monthlyRent: 80000,
      propertyTax: 10000,
      insurance: 5000,
      maintenance: 2000,
      hoa: 1000,
    },
    ownerInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      since: "2022-05-01",
    },
  },
  {
    _id: "prop2",
    title: "Spacious Apartment in Downtown",
    price: 8500000,
    location: "Delhi, Delhi",
    address: "456 City Center",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    areaUnit: "sqft",
    status: "sold",
    type: "apartment",
    yearBuilt: 2018,
    images: ["/background-section2.png", "/background-section3.png"],
    description: "Modern apartment in the heart of the city, close to all amenities...",
    leads: 120,
    views: 1200,
    favorite: true,
    createdAt: "2022-11-01T11:30:00Z",
    analytics: {
      riskScore: 15,
      investmentPotential: 75,
      rentalYield: 6,
      appreciation: 10,
      demandScore: 90,
      marketValue: 9000000,
      pricePerSqFt: 5000,
    },
    hazards: { type: "none", level: "very_low", description: "No known hazards" },
    demographics: {
      averageAge: 28,
      averageIncome: "150k+",
      familyRatio: 0.5,
      education: "high",
      populationDensity: "high",
    },
    amenities: {
      transit: ["metro", "bus", "rail"],
      education: ["university"],
      shopping: ["mall", "supermarket"],
      parks: ["city park"],
      healthcare: ["clinic"],
      other: [],
    },
    marketInsights: {
      daysOnMarket: 30,
      pricePerSqFt: 4800,
      comparableSales: 25,
      marketTrend: "stable",
      avgDaysOnMarket: 45,
    },
    financials: {
      monthlyRent: 45000,
      propertyTax: 6000,
      insurance: 3000,
      maintenance: 1500,
      hoa: 800,
    },
    ownerInfo: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
      since: "2021-08-10",
    },
  },
];

  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isViewPropertyOpen, setIsViewPropertyOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'analytics'>('grid');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we have mock data
  const [error, setError] = useState<string | null>(null);

  // Placeholder functions and derived states for now
  const toggleFavorite = useCallback((id: string) => {
    console.log(`Toggle favorite for ${id}`);
  }, []);

  const handleViewProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
    setIsViewPropertyOpen(true);
    setCurrentImageIndex(0);
  }, []);

  const openAddModal = useCallback(() => {
    setSelectedProperty(null);
    setModalMode('add');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((property: Property) => {
    setSelectedProperty(property);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleSaveProperty = useCallback((property: Property) => {
    console.log('Save property:', property);
    setIsModalOpen(false);
  }, []);

  const handleDeleteProperty = useCallback((id: string) => {
    console.log('Delete property:', id);
  }, []);

  const nextImage = useCallback(() => {
    if (selectedProperty && selectedProperty.images) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % selectedProperty.images.length
      );
    }
  }, [selectedProperty]);

  const prevImage = useCallback(() => {
    if (selectedProperty && selectedProperty.images) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + selectedProperty.images.length) % selectedProperty.images.length
      );
    }
  }, [selectedProperty]);

  const getRiskColor = useCallback((riskScore: number) => {
    if (riskScore > 75) return 'text-red-400';
    if (riskScore > 50) return 'text-orange-400';
    return 'text-green-400';
  }, []);

  const getHazardColor = useCallback((level: string) => {
    switch (level) {
      case 'very_high': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      case 'very_low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }, []);


  return {
    properties,
    setProperties,
    selectedProperty,
    setSelectedProperty,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    setModalMode, // Added setModalMode
    isViewPropertyOpen,
    setIsViewPropertyOpen,
    view,
    setView,
    currentImageIndex,
    setCurrentImageIndex,
    isLoading,
    setIsLoading,
    error,
    setError,
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
  };
};