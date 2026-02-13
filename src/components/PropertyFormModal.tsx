import React, { useState, useEffect } from "react";
import {
  Plus, X, Save
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {mode === "add" ? "Add New Property" : "Edit Property"}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {mode === "add"
              ? "Create a new property listing with comprehensive analytics and risk assessment."
              : "Update property details and analytics."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 p-1 rounded-lg">
            <TabsTrigger value="basic" className="rounded-md text-xs text-slate-300 data-[state=active]:text-white">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-md text-xs text-slate-300 data-[state=active]:text-white">
              Property Details
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md text-xs text-slate-300 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="risks" className="rounded-md text-xs text-slate-300 data-[state=active]:text-white">
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="amenities" className="rounded-md text-xs text-slate-300 data-[state=active]:text-white">
              Amenities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Property Title *</Label>
                <Input
                  name="title"
                  placeholder="Luxury Downtown Penthouse"
                  value={propertyData.title}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Price *</Label>
                <Input
                  name="price"
                  placeholder="₹55,00,000"
                  value={propertyData.price}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-slate-300">Location *</Label>
                <Input
                  name="location"
                  placeholder="Downtown Financial District"
                  value={propertyData.location}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-slate-300">Full Address</Label>
                <Input
                  name="address"
                  placeholder="123 Skyline Boulevard, New York, NY 10001"
                  value={propertyData.address}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Property Type</Label>
                <Select
                  value={propertyData.type}
                  onValueChange={(value) => setPropertyData({ ...propertyData, type: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white">
                        {type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Status</Label>
                <Select
                  value={propertyData.status}
                  onValueChange={(value) => setPropertyData({ ...propertyData, status: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="available" className="text-white">Available</SelectItem>
                    <SelectItem value="pending" className="text-white">Pending</SelectItem>
                    <SelectItem value="sold" className="text-white">Sold</SelectItem>
                    <SelectItem value="draft" className="text-white">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Images</Label>
              <Input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="bg-slate-800 border-slate-700 text-slate-300 file:bg-blue-600 file:text-white file:border-0"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded" />
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-0 text-red-500 hover:text-red-400"
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
                <Label className="text-slate-300">Bedrooms</Label>
                <Input
                  type="number"
                  name="bedrooms"
                  placeholder="3"
                  value={propertyData.bedrooms}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Bathrooms</Label>
                <Input
                  type="number"
                  name="bathrooms"
                  placeholder="2"
                  value={propertyData.bathrooms}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Year Built</Label>
                <Input
                  type="number"
                  name="yearBuilt"
                  placeholder="2020"
                  value={propertyData.yearBuilt}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-slate-300">Area</Label>
                <div className="flex gap-2">
                  <Input
                    name="area"
                    placeholder="2400"
                    value={propertyData.area}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  <Select
                    value={propertyData.areaUnit}
                    onValueChange={(value) => setPropertyData({ ...propertyData, areaUnit: value })}
                  >
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="sq ft" className="text-white">sq ft</SelectItem>
                      <SelectItem value="sq m" className="text-white">sq m</SelectItem>
                      <SelectItem value="acres" className="text-white">acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-slate-300">Description</Label>
              <Textarea
                name="description"
                placeholder="Describe the property features, unique selling points, and key amenities..."
                value={propertyData.description}
                onChange={handleChange}
                rows={4}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Investment Potential (%)</Label>
                <Slider
                  value={[propertyData.analytics.investmentPotential]}
                  onValueChange={(value) =>
                    handleNestedChange("analytics", "investmentPotential", value[0])
                  }
                  max={100}
                  step={1}
                />
                <div className="text-sm text-slate-400 mt-1">
                  {propertyData.analytics.investmentPotential}%
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Risk Score (%)</Label>
                <Slider
                  value={[propertyData.analytics.riskScore]}
                  onValueChange={(value) => handleNestedChange("analytics", "riskScore", value[0])}
                  max={100}
                  step={1}
                />
                <div className="text-sm text-slate-400 mt-1">{propertyData.analytics.riskScore}%</div>
              </div>
              <div>
                <Label className="text-slate-300">Rental Yield (%)</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.rentalYield}
                  onChange={(e) =>
                    handleNestedChange("analytics", "rentalYield", parseFloat(e.target.value) || 0)
                  }
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Appreciation (%)</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.appreciation}
                  onChange={(e) =>
                    handleNestedChange("analytics", "appreciation", parseFloat(e.target.value) || 0)
                  }
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Demand Score (%)</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.demandScore}
                  onChange={(e) =>
                    handleNestedChange("analytics", "demandScore", parseFloat(e.target.value) || 0)
                  }
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="text-slate-300">Market Value</Label>
                <Input
                  type="number"
                  value={propertyData.analytics.marketValue}
                  onChange={(e) =>
                    handleNestedChange("analytics", "marketValue", parseFloat(e.target.value) || 0)
                  }
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-slate-300">Risk Hazards</Label>
                <Button variant="outline" size="sm" onClick={addHazard} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <Plus size={14} className="mr-1" />
                  Add Hazard
                </Button>
              </div>
              {propertyData.hazards.map((hazard, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-3 border border-slate-700 rounded-lg bg-slate-800/40">
                  <Select
                    value={hazard.type}
                    onValueChange={(value) => updateHazard(index, "type", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {hazardTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={hazard.level}
                    onValueChange={(value) => updateHazard(index, "level", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {hazardLevels.map((level) => (
                        <SelectItem key={level} value={level} className="text-white">
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
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <Button variant="outline" size="sm" onClick={() => removeHazard(index)} className="border-slate-600 text-red-400 hover:bg-slate-800 hover:text-red-300">
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
                <Label className="text-slate-300 capitalize">{category.replace("_", " ")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option) => (
                    <Badge
                      key={option}
                      variant={propertyData.amenities[category].includes(option) ? "default" : "outline"}
                      className={`cursor-pointer ${propertyData.amenities[category].includes(option) ? "bg-blue-600 text-white" : "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800"}`}
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
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-800">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save size={16} className="mr-2" />
            {mode === "add" ? "Add Property" : "Update Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyFormModal;
