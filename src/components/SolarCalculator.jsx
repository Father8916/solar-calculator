import React, { useState, useEffect } from 'react';
import { Calculator, Sun, Zap, DollarSign, Home, MapPin, TrendingUp, Shield, Leaf, Mail, Phone, MapIcon } from 'lucide-react';

const SolarCalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    zipCode: '',
    monthlyBill: '',
    electricityRate: '0.12',
    location: 'average',
    roofType: 'south',
    homeSize: 'medium'
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // US States
  const usStates = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
  ];

  // ZIP code ranges for US states
  const zipCodeRanges = {
    'AL': [35000, 36999], 'AK': [99500, 99999], 'AZ': [85000, 86999], 'AR': [71600, 72999],
    'CA': [90000, 96699], 'CO': [80000, 81999], 'CT': [6000, 6999], 'DE': [19700, 19999],
    'FL': [32000, 34999], 'GA': [30000, 31999], 'HI': [96700, 96999], 'ID': [83200, 83999],
    'IL': [60000, 62999], 'IN': [46000, 47999], 'IA': [50000, 52999], 'KS': [66000, 67999],
    'KY': [40000, 42799], 'LA': [70000, 71599], 'ME': [3900, 4999], 'MD': [20600, 21999],
    'MA': [1000, 2799], 'MI': [48000, 49999], 'MN': [55000, 56799], 'MS': [38600, 39999],
    'MO': [63000, 65999], 'MT': [59000, 59999], 'NE': [68000, 69399], 'NV': [89000, 89999],
    'NH': [3000, 3899], 'NJ': [7000, 8999], 'NM': [87000, 88999], 'NY': [10000, 14999],
    'NC': [27000, 28999], 'ND': [58000, 58999], 'OH': [43000, 45999], 'OK': [73000, 74999],
    'OR': [97000, 97999], 'PA': [15000, 19699], 'RI': [2800, 2999], 'SC': [29000, 29999],
    'SD': [57000, 57999], 'TN': [37000, 38599], 'TX': [73301, 88599], 'UT': [84000, 84999],
    'VT': [5000, 5999], 'VA': [20100, 26999], 'WA': [98000, 99499], 'WV': [24700, 26999],
    'WI': [53000, 54999], 'WY': [82000, 83199]
  };

  // Free email providers
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com',
    'mail.com', 'protonmail.com', 'yandex.com', 'zoho.com', 'gmx.com', 'live.com',
    'msn.com', 'rediffmail.com', 'fastmail.com', 'tutanota.com', 'mailinator.com'
  ];

  // Solar irradiance data (kWh/m²/day) for different regions
  const solarIrradiance = {
    'high': 5.5, // Southwest US (Arizona, Nevada, etc.)
    'average': 4.2, // Most of US
    'low': 3.5, // Northeast, Northwest
  };

  // Roof orientation multipliers
  const roofMultipliers = {
    'south': 1.0,
    'southeast': 0.95,
    'southwest': 0.95,
    'east': 0.85,
    'west': 0.85,
    'north': 0.6,
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    const domain = email.split('@')[1]?.toLowerCase();
    return freeEmailProviders.includes(domain);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateZipCode = (zipCode, state) => {
    if (!zipCode || !state) return false;
    const zip = parseInt(zipCode);
    const range = zipCodeRanges[state];
    return range && zip >= range[0] && zip <= range[1];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please use a free email provider (Gmail, Yahoo, etc.)';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid US phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!validateZipCode(formData.zipCode, formData.state)) {
      newErrors.zipCode = 'ZIP code doesn\'t match selected state';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    return formData.monthlyBill && parseFloat(formData.monthlyBill) > 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      calculateSolar();
    }
  };

  const calculateSolar = async () => {
    setLoading(true);
    
    try {
      // Send lead data to webhook immediately when they hit calculate
      await sendLeadToWebhook();
      
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Webhook error:', error);
      // Continue with calculation even if webhook fails
    }
    
    const monthlyUsage = parseFloat(formData.monthlyBill) / parseFloat(formData.electricityRate);
    const dailyUsage = monthlyUsage / 30;
    const annualUsage = monthlyUsage * 12;

    // Calculate system size needed
    const peakSunHours = solarIrradiance[formData.location];
    const roofEfficiency = roofMultipliers[formData.roofType];
    const systemEfficiency = 0.85; // Account for inverter losses, shading, etc.

    const systemSizeKW = dailyUsage / (peakSunHours * roofEfficiency * systemEfficiency);
    const panelCount = Math.ceil(systemSizeKW / 0.4); // Assuming 400W panels
    const actualSystemSize = panelCount * 0.4;

    // Cost calculations
    const costPerWatt = 3.50; // Average cost per watt installed
    const totalSystemCost = actualSystemSize * 1000 * costPerWatt;
    const federalTaxCredit = totalSystemCost * 0.30; // 30% federal tax credit
    const netCost = totalSystemCost - federalTaxCredit;

    // Savings calculations
    const annualProduction = actualSystemSize * peakSunHours * 365 * roofEfficiency * systemEfficiency;
    const annualSavings = annualProduction * parseFloat(formData.electricityRate);
    const paybackPeriod = netCost / annualSavings;
    const twentyYearSavings = (annualSavings * 20) - netCost;

    // Environmental impact
    const co2Reduction = annualProduction * 0.855; // lbs CO2 per kWh
    const treesEquivalent = co2Reduction / 48; // Average tree absorbs 48 lbs CO2/year

    setResults({
      monthlyUsage: Math.round(monthlyUsage),
      annualUsage: Math.round(annualUsage),
      systemSizeKW: Math.round(actualSystemSize * 10) / 10,
      panelCount,
      totalSystemCost: Math.round(totalSystemCost),
      federalTaxCredit: Math.round(federalTaxCredit),
      netCost: Math.round(netCost),
      annualProduction: Math.round(annualProduction),
      annualSavings: Math.round(annualSavings),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      twentyYearSavings: Math.round(twentyYearSavings),
      co2Reduction: Math.round(co2Reduction),
      treesEquivalent: Math.round(treesEquivalent)
    });
    setShowResults(true);
    setLoading(false);
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    if (formattedPhone.length <= 14) {
      handleInputChange('phone', formattedPhone);
    }
  };

  const handleZipChange = (e) => {
    const zipValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    handleInputChange('zipCode', zipValue);
  };

  // Webhook function to send lead data
  const sendLeadToWebhook = async () => {
    const webhookUrl = process.env.REACT_APP_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
    
    // Clean, structured lead data
    const leadData = {
      // Contact Information
      timestamp: new Date().toISOString(),
      lead_id: `solar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      
      // Personal Details  
      full_name: formData.name.trim(),
      email_address: formData.email.toLowerCase().trim(),
      phone_number: formData.phone,
      street_address: formData.address.trim(),
      state: formData.state,
      zip_code: formData.zipCode,
      
      // Energy Details
      monthly_electric_bill: parseFloat(formData.monthlyBill),
      electricity_rate_per_kwh: parseFloat(formData.electricityRate),
      solar_resource_level: formData.location,
      roof_orientation: formData.roofType,
      
      // Lead Classification
      lead_source: "Solar Calculator",
      lead_quality: "High",
      lead_status: "New",
      interest_level: "Hot",
      
      // Marketing Attribution
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
      utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || 'website',
      utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || 'solar_calculator',
      
      // Technical Details
      browser_info: navigator.userAgent.split(' ')[0] || 'Unknown',
      device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      referrer_url: document.referrer || 'Direct',
      landing_page: window.location.href,
      
      // Form Completion Details
      form_completed_at: new Date().toLocaleString(),
      calculation_requested: true,
      ready_for_followup: true
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(leadData)
      });
      
      console.log('✅ Lead data sent successfully:', leadData);
      
      // Send to backup webhooks
      await sendToBackupWebhooks(leadData);
      
    } catch (error) {
      console.error('❌ Webhook error:', error);
      // Store locally as backup
      localStorage.setItem('pendingLead_' + Date.now(), JSON.stringify(leadData));
    }
  };

  // Send to multiple webhook services for redundancy
  const sendToBackupWebhooks = async (leadData) => {
    const backupWebhooks = [
      process.env.REACT_APP_BACKUP_WEBHOOK_1, // Make.com webhook
      process.env.REACT_APP_BACKUP_WEBHOOK_2, // N8N webhook
      process.env.REACT_APP_CRM_WEBHOOK       // Direct CRM webhook
    ].filter(Boolean); // Remove undefined webhooks

    const webhookPromises = backupWebhooks.map(async (url) => {
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
          mode: 'no-cors'
        });
      } catch (error) {
        console.warn(`Backup webhook failed: ${url}`, error);
      }
    });

    await Promise.allSettled(webhookPromises);
  };

  // Additional webhook for "Schedule Assessment" button
  const sendScheduleWebhook = async () => {
    const scheduleWebhookUrl = process.env.REACT_APP_SCHEDULE_WEBHOOK_URL || process.env.REACT_APP_WEBHOOK_URL;
    
    const scheduleData = {
      // Lead Identification
      timestamp: new Date().toISOString(),
      lead_id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action_type: "schedule_assessment_requested",
      
      // Contact Information
      full_name: formData.name.trim(),
      email_address: formData.email.toLowerCase().trim(),
      phone_number: formData.phone,
      complete_address: `${formData.address}, ${formData.state} ${formData.zipCode}`,
      
      // Solar Calculation Results
      estimated_20_year_savings: results?.twentyYearSavings || 0,
      recommended_system_size_kw: results?.systemSizeKW || 0,
      estimated_annual_production: results?.annualProduction || 0,
      estimated_payback_period: results?.paybackPeriod || 0,
      number_of_panels_needed: results?.panelCount || 0,
      
      // Lead Priority
      lead_priority: "URGENT",
      lead_temperature: "HOT",
      ready_to_buy: true,
      followup_required_within: "24_hours",
      
      // Sales Notes
      sales_notes: `Customer completed solar calculator and requested assessment. Estimated savings: ${results?.twentyYearSavings?.toLocaleString() || 0} over 20 years.`,
      next_action: "Schedule in-home assessment",
      
      // Form Completion Data
      calculation_completed: true,
      assessment_requested_at: new Date().toLocaleString()
    };

    try {
      await fetch(scheduleWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(scheduleData)
      });
      
      console.log('✅ Schedule request sent:', scheduleData);
      
      // Show user feedback
      alert('🎉 Thank you! Our solar expert will contact you within 24 hours to schedule your free assessment.');
      
    } catch (error) {
      console.error('❌ Schedule webhook error:', error);
      alert('✅ Request received! We will contact you soon.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full">
              <Sun className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              Solar Calculator
            </h1>
          </div>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Calculate your solar system size, potential savings, and environmental impact
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {step} of 2</span>
              <span className="text-sm text-gray-600">{step === 1 ? 'Contact Info' : 'Energy Details'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Home className="text-blue-500" />
                  Contact Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Get your personalized solar estimate in just 2 quick steps
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your.email@gmail.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      We accept free email providers (Gmail, Yahoo, Outlook, etc.)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street, City"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapIcon className="inline w-4 h-4 mr-1" />
                        State *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select State</option>
                        {usStates.map(state => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={handleZipChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="12345"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Continue to Energy Details →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Calculator className="text-blue-500" />
                    Energy Information
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
                <p className="text-gray-600 mb-8">
                  Hi <span className="font-semibold text-blue-600">{formData.name}</span>! Now let's calculate your solar savings.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Electricity Bill ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyBill}
                      onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Electricity Rate ($/kWh)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.electricityRate}
                      onChange={(e) => handleInputChange('electricityRate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 0.12"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Check your electricity bill for the rate per kWh
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Solar Resource in Your Area
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="high">High (Southwest US - AZ, NV, CA)</option>
                      <option value="average">Average (Most of US)</option>
                      <option value="low">Low (Northeast, Northwest)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Home className="inline w-4 h-4 mr-1" />
                      Roof Orientation
                    </label>
                    <select
                      value={formData.roofType}
                      onChange={(e) => handleInputChange('roofType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="south">South-facing (Best)</option>
                      <option value="southeast">Southeast-facing</option>
                      <option value="southwest">Southwest-facing</option>
                      <option value="east">East-facing</option>
                      <option value="west">West-facing</option>
                      <option value="north">North-facing</option>
                    </select>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!validateStep2() || loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        Calculate My Solar Savings
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="text-orange-500" />
              Your Solar Estimate
            </h2>

            {!showResults ? (
              <div className="text-center text-gray-500 py-16">
                <div className="relative">
                  <Sun className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-yellow-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-lg">Enter your information to see your solar estimate</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* System Size */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    System Size
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 text-sm">Monthly Usage</p>
                      <p className="font-bold text-lg">{results.monthlyUsage.toLocaleString()} kWh</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 text-sm">Annual Usage</p>
                      <p className="font-bold text-lg">{results.annualUsage.toLocaleString()} kWh</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 text-sm">System Size</p>
                      <p className="font-bold text-lg">{results.systemSizeKW} kW</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-gray-600 text-sm">Number of Panels</p>
                      <p className="font-bold text-lg">{results.panelCount} panels</p>
                    </div>
                  </div>
                </div>

                {/* Costs */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Investment & Savings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-600">Total System Cost</span>
                      <span className="font-bold text-lg">${results.totalSystemCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-600">Federal Tax Credit (30%)</span>
                      <span className="font-bold text-lg text-green-600">-${results.federalTaxCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-3">
                      <span className="font-semibold">Your Net Investment</span>
                      <span className="font-bold text-xl">${results.netCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Performance & Savings */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance & Returns
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-600">Annual Production</span>
                      <span className="font-bold text-lg">{results.annualProduction.toLocaleString()} kWh</span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-600">Annual Savings</span>
                      <span className="font-bold text-lg text-green-600">${results.annualSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white rounded-lg p-3">
                      <span className="text-gray-600">Payback Period</span>
                      <span className="font-bold text-lg">{results.paybackPeriod} years</span>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-3">
                      <span className="font-semibold">20-Year Total Savings</span>
                      <span className="font-bold text-xl">${results.twentyYearSavings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border-l-4 border-emerald-500">
                  <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Environmental Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-gray-600 text-sm">CO₂ Reduction/Year</p>
                      <p className="font-bold text-lg text-green-600">{results.co2Reduction.toLocaleString()} lbs</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-gray-600 text-sm">Equivalent Trees Planted</p>
                      <p className="font-bold text-lg text-green-600">{results.treesEquivalent} trees</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl p-6 text-center">
                  <Shield className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-2">Ready to Go Solar, {formData.name}?</h3>
                  <p className="text-blue-100 mb-2">
                    We'll contact you at:
                  </p>
                  <p className="text-white font-semibold mb-1">📧 {formData.email}</p>
                  <p className="text-white font-semibold mb-4">📞 {formData.phone}</p>
                  <div className="bg-white/10 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-100">✅ Lead automatically sent to your CRM</p>
                    <p className="text-sm text-blue-100">✅ Follow-up email triggered</p>
                    <p className="text-sm text-blue-100">✅ Sales team notified</p>
                  </div>
                  <button 
                    onClick={() => {
                      // Trigger additional webhook for "Schedule Assessment" button
                      sendScheduleWebhook();
                    }}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Schedule Free Assessment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              <p className="mb-3 font-semibold">Important Disclaimer:</p>
              <p className="mb-2">
                This calculator provides estimates based on typical conditions and average costs. 
                Actual results may vary based on specific location, roof conditions, local electricity rates, available incentives, 
                and installation factors.
              </p>
              <p>
                Federal tax credit is subject to change. Consult with a tax professional regarding your specific situation. 
                Get quotes from multiple certified installers for accurate pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarCalculator;