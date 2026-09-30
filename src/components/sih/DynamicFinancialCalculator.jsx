import React, { useState, useEffect } from 'react';
import { 
  Calculator, IndianRupee, Clock, TrendingDown, ShieldAlert, 
  HelpCircle, ArrowUpRight, Sparkles, Check, PieChart, Layers, 
  ChevronRight, Calendar, Landmark 
} from 'lucide-react';
import { FundingDonut } from './SIHVisuals';

export function DynamicFinancialCalculator({ 
  initialCost = 120000, 
  initialRate = 6.5, 
  initialMoratorium = 6, 
  initialTenure = 3,
  initialCadence = 'QUARTERLY',
  onProceedToLocator
}) {
  // Configurable Financial Inputs
  const [projectCost, setProjectCost] = useState(initialCost);
  const [fundingPercent, setFundingPercent] = useState(90); // Default sovereign 90%
  const [interestRate, setInterestRate] = useState(initialRate); // 6.5% to 15.0%
  const [moratoriumMonths, setMoratoriumMonths] = useState(initialMoratorium); // 3 to 12
  const [tenureYears, setTenureYears] = useState(initialTenure); // 2 to 7
  const [cadence, setCadence] = useState(initialCadence); // 'QUARTERLY' or 'MONTHLY'

  // Calculations
  const loanPrincipal = Math.round(projectCost * (fundingPercent / 100));
  const ownEquity = projectCost - loanPrincipal;

  const isQuarterly = cadence === 'QUARTERLY';
  const periodsPerYear = isQuarterly ? 4 : 12;
  const totalRepaymentPeriods = tenureYears * periodsPerYear;
  const periodicRate = (interestRate / 100) / periodsPerYear;

  // Reducing balance EMI post-moratorium
  let periodicPayment = 0;
  if (periodicRate > 0) {
    periodicPayment = loanPrincipal * (periodicRate * Math.pow(1 + periodicRate, totalRepaymentPeriods)) /
                      (Math.pow(1 + periodicRate, totalRepaymentPeriods) - 1);
  } else {
    periodicPayment = loanPrincipal / totalRepaymentPeriods;
  }

  // Moratorium interest accrued
  const moratoriumYears = moratoriumMonths / 12;
  const moratoriumInterest = loanPrincipal * (interestRate / 100) * moratoriumYears;

  const totalRepayablePostMoratorium = periodicPayment * totalRepaymentPeriods;
  const grandTotalRepayable = totalRepayablePostMoratorium + moratoriumInterest;
  const totalInterestPaid = grandTotalRepayable - loanPrincipal;

  // Commercial Bank Benchmark Comparison (12.5% rate, 75% loan cap, 0 moratorium)
  const commLoan = projectCost * 0.75;
  const commRate = 12.5;
  const commPeriodicRate = (commRate / 100) / 12;
  const commTotalMonths = tenureYears * 12;
  const commMonthlyEMI = commLoan * (commPeriodicRate * Math.pow(1 + commPeriodicRate, commTotalMonths)) /
                         (Math.pow(1 + commPeriodicRate, commTotalMonths) - 1);
  const commTotalPaid = commMonthlyEMI * commTotalMonths;
  const sovereignSavings = Math.max(0, commTotalPaid - grandTotalRepayable);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Calculator className="w-3.5 h-3.5" />
            Module 2: Dynamic Financial Engine
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white tracking-tight">
            Concessional EMI & Moratorium Calculator
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Simulate your exact installment schedule with up to 90% funding, sovereign concessional rates (6.5% - 15%), and 3-12 months moratorium grace.
          </p>
        </div>

        {/* Quick Cadence Toggle */}
        <div className="flex rounded-xl bg-slate-800 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setCadence('QUARTERLY')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              cadence === 'QUARTERLY' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quarterly (NSFDC)
          </button>
          <button
            type="button"
            onClick={() => setCadence('MONTHLY')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              cadence === 'MONTHLY' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly (NBFC)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Interactive Sliders & Variables (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Project Cost Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-200">
                Total Project Cost (₹)
              </label>
              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 border border-white/10 text-emerald-400 font-mono font-bold text-base">
                <IndianRupee className="w-4 h-4" />
                <span>{projectCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <input
              type="range"
              min={20000}
              max={5000000}
              step={10000}
              value={projectCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>₹20,000 (Micro)</span>
              <span>₹1.40L (MFS)</span>
              <span>₹50.00L (Term Loan)</span>
            </div>
          </div>

          {/* 2. Funding Ratio: 90% Loan vs 10% Equity (donut + bar) */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Concessional Loan Share: {fundingPercent}%</span>
              <span className="text-amber-400">Beneficiary Own Equity: {100 - fundingPercent}%</span>
            </div>

            <div className="flex items-center gap-4">
              <FundingDonut percent={fundingPercent} size={104} />
              <div className="flex-1 space-y-2">
                {/* Visual ratio bar */}
                <div className="w-full h-3 rounded-full bg-slate-700 flex overflow-hidden">
                  <div style={{ width: `${fundingPercent}%` }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: `${100 - fundingPercent}%` }} className="bg-amber-400 h-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                    <span className="text-[11px] text-slate-400 block">Sanctioned Loan</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">₹{loanPrincipal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20">
                    <span className="text-[11px] text-slate-400 block">Own Margin</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">₹{ownEquity.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                <span className="text-[11px] text-slate-400 block">Sanctioned Loan (90%)</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">
                  ₹{loanPrincipal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20">
                <span className="text-[11px] text-slate-400 block">Own Margin (10%)</span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  ₹{ownEquity.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Concessional Interest Rate Slider (6.5% to 15.0%) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-200">
                Concessional Interest Rate (%)
              </label>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-white/10 text-orange-400 font-mono font-bold text-base">
                {interestRate}% p.a.
              </span>
            </div>
            <input
              type="range"
              min={6.5}
              max={15.0}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-400 font-semibold">6.5% (SCA Micro Finance)</span>
              <span className="text-cyan-400 font-semibold">8.0% (Term Loan)</span>
              <span className="text-amber-400 font-semibold">15.0% (NBFC-MFI)</span>
            </div>
          </div>

          {/* 4. Moratorium Period (3 to 12 Months) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-200">
                Moratorium / Grace Period (Months)
              </label>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-white/10 text-white font-mono font-bold text-base">
                {moratoriumMonths} Months
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={moratoriumMonths}
              onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              No principal repayment during moratorium. Allows business to set up machinery and generate revenue first.
            </p>
          </div>

          {/* 5. Repayment Tenure (2 to 7 Years) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-200">
                Repayment Tenure (Years)
              </label>
              <span className="px-3 py-1 rounded-xl bg-slate-800 border border-white/10 text-white font-mono font-bold text-base">
                {tenureYears} Years ({totalRepaymentPeriods} {isQuarterly ? 'Quarters' : 'Months'})
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={7}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>
        </div>

        {/* Right Column: Dynamic Output Cards & Commercial Comparison (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Main Installment Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-800 to-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Landmark className="w-28 h-28 text-white" />
            </div>

            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Estimated Installment ({isQuarterly ? 'Quarterly' : 'Monthly'})
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <IndianRupee className="w-6 h-6 text-white" />
              <span className="text-3xl md:text-4xl font-black text-white font-mono">
                {Math.round(periodicPayment).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">/ {isQuarterly ? 'quarter' : 'month'}</span>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">First Installment Due:</span>
                <span className="font-bold text-white">After {moratoriumMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-mono font-bold text-orange-300">
                  ₹{Math.round(totalInterestPaid).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Amount Repaid:</span>
                <span className="font-mono font-bold text-white">
                  ₹{Math.round(grandTotalRepayable).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Sovereign Savings Banner (Commercial Bank Comparison) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <TrendingDown className="w-4 h-4" />
              <span>Sovereign Benefit vs Commercial Bank</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Commercial banks charge 12.5%+ interest with zero moratorium and require 25% upfront down payment.
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[11px] text-amber-300 block">Total Money Saved by Entrepreneur:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                ₹{Math.round(sovereignSavings).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action button to Geo-Spatial Router */}
          {onProceedToLocator && (
            <button
              type="button"
              onClick={onProceedToLocator}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition transform active:scale-[0.99] cursor-pointer"
            >
              <span>Locate Authorized Channel Partner</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DynamicFinancialCalculator;
