import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ParkingSquare, Shield, Layers, Car, BarChart3, Bot, Lock, ArrowRight, Building2, UserCheck, Sparkles, Check, KeyRound, Cpu, Terminal, Receipt, Clock, LogIn
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Active Section State for Header Tracking
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Auth Gate Modal State
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);
  const [gateFeatureTitle, setGateFeatureTitle] = useState('');

  // Intersection Observer for Active Section Highlighting
  useEffect(() => {
    const sectionIds = ['features', 'how-it-works', 'multi-tenant', 'spring-ai'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGateTrigger = (featureTitle: string) => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setGateFeatureTitle(featureTitle);
      setIsAuthGateOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* 1. PUBLIC NAVIGATION HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between select-none shadow-sm dark:shadow-[#080b38]/50">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('hero');
          }}
        >
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-sm dark:shadow-[#080b38]/50 group-hover:bg-indigo-500 transition-colors">
            <ParkingSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">SmartParking</span>
            <span className="text-[10px] text-slate-400 font-mono block leading-none">Enterprise Platform</span>
          </div>
        </div>

        {/* Spaced-Out Navigation Links - ONLY THE ACTIVE ITEM IS BORDERED & HIGHLIGHTED */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <button
            onClick={() => scrollToSection('features')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSection === 'features'
                ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500 shadow-sm dark:shadow-[#080b38]/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
            }`}
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection('how-it-works')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSection === 'how-it-works'
                ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500 shadow-sm dark:shadow-[#080b38]/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
            }`}
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection('multi-tenant')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeSection === 'multi-tenant'
                ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500 shadow-sm dark:shadow-[#080b38]/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
            }`}
          >
            Multi-Tenant
          </button>

          <button
            onClick={() => scrollToSection('spring-ai')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeSection === 'spring-ai'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500 shadow-sm dark:shadow-[#080b38]/50'
                : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-slate-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring AI</span>
          </button>
        </nav>

        {/* Action Controls & High-Contrast Sign In Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button variant="primary" size="md" icon={ArrowRight} onClick={() => navigate('/dashboard')}>
              Go to Console
            </Button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 shadow-sm dark:shadow-[#080b38]/50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-600"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sign In</span>
              </button>

              <Button variant="primary" size="md" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono select-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Multi-Tenant Enterprise Platform v2.0</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Enterprise Parking Lot Operations & Multi-Tenant Engine
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
          Designed for daily operational use. Real-time 2D floor plan visualizer, automated check-in/out workflows, Spring AI slot recommendations, and company data isolation.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 select-none">
          {isAuthenticated ? (
            <Button variant="primary" size="lg" icon={ArrowRight} onClick={() => navigate('/dashboard')}>
              Open Operating Console
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/signup')}
              >
                Get Started / Register Company
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('how-it-works')}
              >
                Learn How It Works
              </Button>
            </>
          )}
        </div>
      </section>

      {/* 3. SECTION 1: FEATURES GRID */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Platform Capabilities</h2>
          <p className="text-2xl font-bold text-white tracking-tight">Built for Operational Speed & Security</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">2D Operational Floor Map</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Visual floor layout with driving aisles, floor selector tabs, live duration clocks, and 1-click slot check-in/out triggers.
              </p>
            </div>
            <button
              onClick={() => handleGateTrigger('2D Operational Floor Map')}
              className="text-[11px] font-mono text-indigo-400 mt-4 inline-flex items-center gap-1 hover:underline text-left font-semibold"
            >
              Try Floor Map Console ➔
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Car className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Automated Fee Calculation</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Fast &lt; 3-second vehicle check-in/out. Dynamic hourly billing rates by vehicle category (Car, Bike, Truck) with printable receipts.
              </p>
            </div>
            <button
              onClick={() => handleGateTrigger('Automated Check-In Terminal')}
              className="text-[11px] font-mono text-indigo-400 mt-4 inline-flex items-center gap-1 hover:underline text-left font-semibold"
            >
              Test Check-In Terminal ➔
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Complete data separation per company. Unique company registration, email 6-digit verification codes, and staff approval workflows.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('multi-tenant')}
              className="text-[11px] font-mono text-indigo-400 mt-4 inline-flex items-center gap-1 hover:underline text-left font-semibold"
            >
              View Multi-Tenant Architecture ↓
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Spring AI Assistant</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Natural language query processing. Ask Spring AI for optimal slot recommendations, revenue breakdowns, or capacity trends.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('spring-ai')}
              className="text-[11px] font-mono text-emerald-400 mt-4 inline-flex items-center gap-1 hover:underline text-left font-semibold"
            >
              Explore Spring AI Specs ↓
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Analytics & Financial Reports</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Hourly occupancy trend charts, vehicle type revenue breakdowns, date range filtering, and 1-click CSV report exports.
              </p>
            </div>
            <button
              onClick={() => handleGateTrigger('Financial Analytics & Export')}
              className="text-[11px] font-mono text-indigo-400 mt-4 inline-flex items-center gap-1 hover:underline text-left font-semibold"
            >
              View Financial Reports ➔
            </button>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 text-left flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Role Persona Switching</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Administrator users can dynamically toggle between Admin Mode and Staff View to test both operational perspectives in real time.
              </p>
            </div>
            <button
              onClick={() => scrollToSection('multi-tenant')}
              className="text-[11px] font-mono text-indigo-400 mt-4 inline-flex items-center gap-1 hover:underline text-left font-semibold"
            >
              Learn Role Switching ↓
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80 space-y-10 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Step-by-Step Operations</h2>
          <p className="text-2xl font-bold text-white tracking-tight">How SmartParking Operates End-to-End</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                STEP 01
              </span>
              <KeyRound className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Company Setup & Email Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When an Administrator registers a new organization, the system verifies name availability. A 6-digit verification code is immediately dispatched to the administrator's email address.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verifies identity & activates Admin account</span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                STEP 02
              </span>
              <Car className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Rapid Gate Check-In (&lt; 3 Seconds)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gate attendants enter the vehicle registration plate, select vehicle type (Car, Bike, Truck), and owner contact. Spring AI recommends the nearest available parking bay, or the operator picks manually.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Creates active session & occupies bay</span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                STEP 03
              </span>
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Interactive 2D Operational Floor Map</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The dashboard renders driving aisles, floor selector tabs (Floor 1-3), status indicators (Available, Occupied, Maintenance), and real-time parked duration timers.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click slot check-in/out triggers</span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                STEP 04
              </span>
              <Receipt className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Automated Fee Engine & Receipt Printing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon vehicle exit, the system calculates exact duration, applies tiered hourly rates, generates payable total, and displays a printable proof-of-payment receipt modal.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Printable receipt with serial number</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: MULTI-TENANT ARCHITECTURE */}
      <section id="multi-tenant" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80 space-y-10 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">Enterprise Security</h2>
          <p className="text-2xl font-bold text-white tracking-tight">Multi-Tenant Company Isolation & Admin Approvals</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>1. Organization Data Isolation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Company names are unique across the system. Each organization receives a unique reference code. All slots, vehicles, and parking sessions are securely isolated per organization.
              </p>
            </div>

            <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>2. Staff Approval Workflow</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Staff members selecting an existing organization from the dropdown are placed in pending approval status until authorized by the Administrator via email code.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>3. Admin Role Switcher</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Administrator users possess elevated management controls. The header bar provides an interactive Admin Mode / Staff View toggle for testing operational workflows.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-left">
              <span className="font-bold text-white">Ready to register your company?</span>
              <p className="text-slate-400 text-[11px]">Takes under 1 minute. Verification code delivered straight to your email inbox.</p>
            </div>
            <Button variant="primary" size="md" onClick={() => navigate('/signup')}>
              Register Company Now ➔
            </Button>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: SPRING AI ENGINE */}
      <section id="spring-ai" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80 space-y-10 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">AI Intelligence</h2>
          <p className="text-2xl font-bold text-white tracking-tight">Spring AI Engine & Natural Language Assistant</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Conversational Queries</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Spring AI natural language intelligence. Operators can ask plain English questions like "What is today's revenue?" or "How many bike slots are available on Floor 2?".
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Smart Slot Allocation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spring AI evaluates vehicle size (Car, Bike, Truck), driveway clearance, and entry gate proximity to recommend the most optimal slot.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span>Local Assistant Fallback</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Includes an intelligent assistant fallback mechanism so natural language operations run smoothly in all environments.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-md border border-slate-800 font-mono text-xs space-y-2 text-left">
            <div className="text-slate-400 text-[11px]">Live Sample Prompt:</div>
            <div className="text-emerald-400 font-semibold">"Recommend an optimal slot for a heavy truck near Ground Level Aisle A."</div>
            <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-300 font-sans">
              Spring AI Response: Slot T-101 (Floor 1, Aisle A) has 4.5m clearance and is allocated.
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ParkingSquare className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-400">SmartParking Enterprise</span>
            <span>© 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button onClick={() => scrollToSection('features')} className="hover:text-white">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">How It Works</button>
            <button onClick={() => scrollToSection('multi-tenant')} className="hover:text-white">Multi-Tenant</button>
            <button onClick={() => scrollToSection('spring-ai')} className="hover:text-white">Spring AI</button>
            <Link to="/login" className="hover:text-white">Sign In</Link>
          </div>
        </div>
      </footer>

      {/* 8. INTERACTIVE FEATURE GATE MODAL */}
      {isAuthGateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">Authentication Required</h3>
              <p className="text-xs text-slate-400 mt-1">
                To access <strong className="text-indigo-300">{gateFeatureTitle}</strong>, please sign in to your account or register a new company.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setIsAuthGateOpen(false);
                  navigate('/login');
                }}
              >
                Sign In or Register ➔
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setIsAuthGateOpen(false)}
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
