import { useState } from 'react';
import { useStore } from '../store';
import { Save, RefreshCw, Stamp, Building2, User, CreditCard, Table2, FileText, CheckCircle2, Send, Palette } from 'lucide-react';
import { TableStyle } from '../types';

export default function Settings() {
  const { settings, updateSettings, resetToSampleData } = useStore();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'company' | 'staff' | 'banking' | 'telegram' | 'stamp' | 'invoice' | 'currency' | 'theme'>('all');
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestTelegram = async () => {
    if (!settings.telegramBotToken || !settings.telegramChatId) return;
    setIsTestingTelegram(true);
    setTelegramTestResult(null);
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: settings.telegramBotToken,
          chatId: settings.telegramChatId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramTestResult({ success: true, message: '🟢 តភ្ជាប់ Telegram Bot ជោគជ័យ! (Test message sent successfully)' });
      } else {
        setTelegramTestResult({ success: false, message: `🔴 បរាជ័យ: ${data.error || 'Invalid Token or Chat ID'}` });
      }
    } catch (err: any) {
      setTelegramTestResult({ success: false, message: `🔴 កំហុសបណ្តាញ: ${err.message || 'Network error'}` });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const themes = [
    { name: 'emerald', label: 'ត្បូងមរកត (Emerald)', color: 'bg-emerald-600' },
    { name: 'blue', label: 'ខៀវស្រស់ (Blue)', color: 'bg-blue-600' },
    { name: 'amber', label: 'ពណ៌ទឹកក្រូច (Amber)', color: 'bg-amber-600' },
    { name: 'violet', label: 'ស្វាយ (Violet)', color: 'bg-violet-600' },
    { name: 'rose', label: 'ផ្កាឈូក (Rose)', color: 'bg-rose-600' },
    { name: 'slate', label: 'ប្រផេះ (Slate)', color: 'bg-slate-700' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-khmer">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            ការកំណត់ទូទៅ (App & Depot Settings)
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            កំណត់ឈ្មោះដេប៉ូ អាសយដ្ឋាន គណនីធនាគារ KHQR និងត្រាផ្លូវការលើវិក្កយបត្រ
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>ផ្ទុកទិន្នន័យគំរូឡើងវិញ (Reset Demo)</span>
        </button>
      </div>

      {/* Reset Success Toast */}
      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            បានកំណត់ឡើងវិញជោគជ័យ! (Reset to sample data successfully!)
          </span>
          <button
            type="button"
            onClick={() => setShowSuccessToast(false)}
            className="text-emerald-700 font-bold text-xs cursor-pointer px-3 py-1 bg-emerald-100 rounded-lg hover:bg-emerald-200"
          >
            បិទ
          </button>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-khmer">
                  កំណត់ទិន្នន័យគំរូឡើងវិញ (Reset Demo Data)
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Sample Data Reset
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed font-khmer bg-slate-50 p-3 rounded-xl border border-slate-200">
              តើអ្នកពិតជាចង់ផ្ទុកទិន្នន័យគំរូឡើងវិញមែនទេ? ទិន្នន័យចាស់ទាំងអស់នឹងត្រូវជំនួសដោយទិន្នន័យគំរូដើម។
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToSampleData();
                  setShowResetModal(false);
                  setShowSuccessToast(true);
                  setTimeout(() => setShowSuccessToast(false), 4000);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>បញ្ជាក់ការកំណត់ឡើងវិញ (Confirm Reset)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Layout with Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            ប្រភេទការកំណត់
          </div>
          {[
            { id: 'all', label: 'បង្ហាញទាំងអស់ (All)', icon: FileText },
            { id: 'company', label: '🏢 ដេប៉ូ & ក្រុមហ៊ុន', icon: Building2 },
            { id: 'staff', label: '👤 បុគ្គលិក & ហត្ថលេខា', icon: User },
            { id: 'banking', label: '💳 ធនាគារ & KHQR', icon: CreditCard },
            { id: 'telegram', label: '💬 Telegram Bot', icon: Send },
            { id: 'stamp', label: '🔴 ត្រាផ្លូវការ', icon: Stamp },
            { id: 'invoice', label: '📄 ទម្រង់វិក្កយបត្រ', icon: FileText },
            { id: 'currency', label: '💱 រូបិយប័ណ្ណ', icon: RefreshCw },
            { id: 'theme', label: '🎨 ពណ៌ប្រព័ន្ធ', icon: Palette },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Sections */}
        <div className="lg:col-span-3 space-y-6">
          {/* Section 1: Depot / Company Information */}
          {(activeCategory === 'all' || activeCategory === 'company') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-200">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>ព័ត៌មានដេប៉ូ / ក្រុមហ៊ុន (Depot & Company Profile)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះដេប៉ូជាភាសាខ្មែរ (Company Name - Khmer)
                </label>
                <input
                  type="text"
                  value={settings.companyNameKhmer}
                  onChange={(e) => updateSettings({ companyNameKhmer: e.target.value })}
                  placeholder="ឧ. ដេប៉ូទិញដំឡូងមី ហេង ហេង"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះដេប៉ូជាភាសាអង់គ្លេស (Company Name - English)
                </label>
                <input
                  type="text"
                  value={settings.companyNameEnglish}
                  onChange={(e) => updateSettings({ companyNameEnglish: e.target.value })}
                  placeholder="Heng Heng Cassava Depot"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  ពាក្យស្លោក / មុខទំនិញទទួលទិញ (Tagline / Purchases)
                </label>
                <input
                  type="text"
                  value={settings.companyTagline || ''}
                  onChange={(e) => updateSettings({ companyTagline: e.target.value })}
                  placeholder="ឧ. មានទទួលទិញ: ស្រូវ ដំឡូងមីស្រស់ និងស្ងួត"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  ទីតាំង / អាសយដ្ឋានដេប៉ូ (Depot Address)
                </label>
                <input
                  type="text"
                  value={settings.companyAddressKhmer || ''}
                  onChange={(e) => updateSettings({ companyAddressKhmer: e.target.value })}
                  placeholder="ឧ. ភូមិព្រៃក្រឡាញ់ ឃុំស្រែណូយ ស្រុកវ៉ារិន ខេត្តសៀមរាប"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  លេខទូរស័ព្ទទី១ (Primary Phone)
                </label>
                <input
                  type="text"
                  value={settings.companyPhone || ''}
                  onChange={(e) => updateSettings({ companyPhone: e.target.value })}
                  placeholder="097 28 32 796"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  លេខទូរស័ព្ទទី២ (Secondary Phone)
                </label>
                <input
                  type="text"
                  value={settings.companyPhoneSecondary || ''}
                  onChange={(e) => updateSettings({ companyPhoneSecondary: e.target.value })}
                  placeholder="066 551 286"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  ទម្រង់វិក្កយបត្រលំនាំដើម (Default Invoice Template)
                </label>
                <select
                  value={settings.invoiceTemplate || 'modern'}
                  onChange={(e) =>
                    updateSettings({ invoiceTemplate: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="modern">ពាណិជ្ជកម្មទំនើប (Modern Commercial - គំរូប្រណិត)</option>
                  <option value="slip">បង្កាន់ដៃថ្លឹងខ្នាតតូច (Compact Scale Slip)</option>
                  <option value="pro">វិក្កយបត្រតារាង (Table Invoice)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ភាសាបោះពុម្ពវិក្កយបត្រ (Invoice Print Language)
                </label>
                <select
                  value={settings.invoiceLanguage || 'both'}
                  onChange={(e) =>
                    updateSettings({ invoiceLanguage: e.target.value as 'khmer' | 'english' | 'both' })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="both">ទាំងពីរភាសា (Both Khmer & English)</option>
                  <option value="khmer">ភាសាខ្មែរតែប៉ុណ្ណោះ (Khmer Only)</option>
                  <option value="english">English Only</option>
                </select>
              </div>
            </div>
          </div>
          )}

          {/* Section 2: Scale Staff & Signers */}
          {(activeCategory === 'all' || activeCategory === 'staff') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-200">
              <User className="w-5 h-5 text-blue-600" />
              <span>បុគ្គលិកទទួលបន្ទុក & ហត្ថលេខា (Staff & Signatories)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះអ្នកថ្លឹងជញ្ជីង (Scale Operator Name)
                </label>
                <input
                  type="text"
                  value={settings.weighMasterName || ''}
                  onChange={(e) => updateSettings({ weighMasterName: e.target.value })}
                  placeholder="ឧ. ចាន់ វិចិត្រ"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះបេឡា / អ្នកទូទាត់ (Cashier Name)
                </label>
                <input
                  type="text"
                  value={settings.cashierName || ''}
                  onChange={(e) => updateSettings({ cashierName: e.target.value })}
                  placeholder="ឧ. លី ស្រីមុំ"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះម្ចាស់ដេប៉ូ / អ្នកលក់ (Owner / Seller Name)
                </label>
                <input
                  type="text"
                  value={settings.sellerName || ''}
                  onChange={(e) => updateSettings({ sellerName: e.target.value })}
                  placeholder="ឧ. សុខ ហេង"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 3: Bank & KHQR Settings */}
          {(activeCategory === 'all' || activeCategory === 'banking') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-200">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>ព័ត៌មានគណនីធនាគារ & ស្កេន KHQR (Banking & KHQR)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះធនាគារ (Bank Name)
                </label>
                <input
                  type="text"
                  value={settings.bankName || ''}
                  onChange={(e) => updateSettings({ bankName: e.target.value })}
                  placeholder="ABA Bank / ACLEDA / Wing"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  លេខគណនី (Account Number)
                </label>
                <input
                  type="text"
                  value={settings.bankAccountNumber || ''}
                  onChange={(e) => updateSettings({ bankAccountNumber: e.target.value })}
                  placeholder="001 888 999"
                  className="w-full px-3.5 py-2 text-xs font-mono font-semibold border border-slate-300 rounded-xl bg-white shadow-2xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះម្ចាស់គណនី (Account Name)
                </label>
                <input
                  type="text"
                  value={settings.bankAccountName || ''}
                  onChange={(e) => updateSettings({ bankAccountName: e.target.value })}
                  placeholder="HENG HENG CASSAVA DEPOT"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none uppercase font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section: Telegram Bot Integration */}
          {(activeCategory === 'all' || activeCategory === 'telegram') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-200">
              <Send className="w-5 h-5 text-blue-600" />
              <span>ការតភ្ជាប់ Telegram Bot (Telegram Bot Settings)</span>
            </h3>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium leading-relaxed font-khmer bg-slate-50 p-3 rounded-xl border border-slate-200">
                កំណត់ Bot Token និង Chat ID ដើម្បីអាចចុចផ្ញើវិក្កយបត្រជា PDF / រូបភាពទៅកាន់ក្រុម ឬ Channel Telegram របស់អ្នកបានភ្លាមៗ។
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telegram Bot Token (ពី @BotFather)
                  </label>
                  <input
                    type="password"
                    value={settings.telegramBotToken || ''}
                    onChange={(e) => updateSettings({ telegramBotToken: e.target.value })}
                    placeholder="ឧ. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                    className="w-full px-3.5 py-2 text-xs font-mono font-medium border border-slate-300 rounded-xl bg-white shadow-2xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Telegram Chat ID / Group ID / Channel ID
                  </label>
                  <input
                    type="text"
                    value={settings.telegramChatId || ''}
                    onChange={(e) => updateSettings({ telegramChatId: e.target.value })}
                    placeholder="ឧ. -1001234567890 ឬ @mychannel"
                    className="w-full px-3.5 py-2 text-xs font-mono font-medium border border-slate-300 rounded-xl bg-white shadow-2xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs font-medium text-slate-500">
                  💡 ត្រូវផ្ញើសារសាកល្បងទៅកាន់ Bot ជាមុនសិន ទើប Chat ID អាចទទួលសារបាន។
                </div>
                <button
                  type="button"
                  disabled={isTestingTelegram || !settings.telegramBotToken || !settings.telegramChatId}
                  onClick={handleTestTelegram}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  {isTestingTelegram ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>កំពុងសាកល្បង... (Testing...)</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>តេស្តការតភ្ជាប់ Telegram (Test Connection)</span>
                    </>
                  )}
                </button>
              </div>

              {telegramTestResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold border ${
                    telegramTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {telegramTestResult.message}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Section 4: Official Rubber Stamp & Verification */}
          {(activeCategory === 'all' || activeCategory === 'stamp') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-200">
              <Stamp className="w-5 h-5 text-blue-600" />
              <span>ត្រាដេប៉ូ & និមិត្តសញ្ញាផ្លូវការ (Official Stamp Seal)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs items-center">
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer mb-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={settings.showStamp ?? true}
                    onChange={(e) => updateSettings({ showStamp: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="font-semibold text-slate-800 text-xs">
                    បង្ហាញត្រាមូលផ្លូវការលើវិក្កយបត្រ (Enable Stamp on Invoices)
                  </span>
                </label>

                <label className="block font-semibold text-slate-700 mb-1">
                  អក្សរលើត្រា (Stamp Caption)
                </label>
                <input
                  type="text"
                  value={settings.stampText || ''}
                  onChange={(e) => updateSettings({ stampText: e.target.value })}
                  placeholder="ដេប៉ូ ហេង ហេង - បង់ប្រាក់រួច (PAID)"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Stamp Preview */}
              <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-24 h-24 border-[3px] border-rose-600 rounded-full flex flex-col items-center justify-center text-center p-1.5 text-rose-600 rotate-[-8deg] select-none bg-white shadow-sm">
                  <span className="text-[7px] font-moul leading-none mb-0.5">
                    {settings.companyNameKhmer || 'ដេប៉ូ ហេង ហេង'}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase border-y border-rose-600 py-0.5 my-0.5 w-full">
                    ★ PAID ★
                  </span>
                  <span className="text-[7px] font-semibold">បានទូទាត់ប្រាក់រួច</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Section 5: Invoice Layout Standard */}
          {(activeCategory === 'all' || activeCategory === 'invoice') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5 pb-3 mb-5 border-b border-slate-200">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>រចនាប័ទ្មវិក្កយបត្រលំនាំដើម (Default Invoice Style)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {[
                {
                  id: 'modern',
                  title: 'សាមញ្ញប្រណិត (Clean Invoice)',
                  desc: 'ទម្រង់ពេញលេញ A4 ស្អាតបាត ស៊ីវិល័យ បង្ហាញជំហានថ្លឹងជញ្ជីង Gross, Tare, Net, Factor តាមជួរនីមួយៗច្បាស់លាស់',
                },
                {
                  id: 'slip',
                  title: 'បង្កាន់ដៃតូច (Compact Scale Slip)',
                  desc: 'ទំហំតូច 80mm សមស្របសម្រាប់ម៉ាស៊ីនព្រីនវិក្កយបត្រខ្នាតតូច ឬបង្កាន់ដៃថ្លឹងរហ័ស',
                },
                {
                  id: 'pro',
                  title: 'វិក្កយបត្រតារាង (Table Invoice)',
                  desc: 'ទម្រង់វិក្កយបត្រតារាង កត់ត្រាព័ត៌មានថ្លឹងជញ្ជីង Gross, Tare, Net និងមុខទំនិញជាតារាងច្បាស់លាស់',
                },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => updateSettings({ invoiceTemplate: st.id as any })}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    (settings.invoiceTemplate || 'modern') === st.id
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600 shadow-2xs font-semibold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-khmer text-xs text-slate-900 font-bold mb-1">
                    {st.title}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    {st.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Section 6: Currency & Exchange Rate */}
          {(activeCategory === 'all' || activeCategory === 'currency') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
              រូបិយប័ណ្ណ & អត្រាប្តូរប្រាក់ (Currency & Exchange Rate)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  រូបិយប័ណ្ណលំនាំដើម (Default Currency)
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) =>
                    updateSettings({ defaultCurrency: e.target.value as 'KHR' | 'USD' })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="KHR">ប្រាក់រៀល (KHR ៛)</option>
                  <option value="USD">ប្រាក់ដុល្លារ (USD $)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  អត្រាប្តូរប្រាក់ (1 USD = ? KHR)
                </label>
                <input
                  type="number"
                  value={settings.exchangeRate}
                  onChange={(e) => updateSettings({ exchangeRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs font-mono font-semibold border border-slate-300 rounded-xl bg-white shadow-2xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  min="1000"
                  step="10"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ខ្នាតរង្វាស់លំនាំដើម (Default Unit)
                </label>
                <select
                  value={settings.defaultUnit}
                  onChange={(e) => updateSettings({ defaultUnit: e.target.value as 'ton' | 'kg' })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white shadow-2xs outline-none font-semibold cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="ton">តោន (Ton - 1000 Kg)</option>
                  <option value="kg">គីឡូក្រាម (Kg)</option>
                </select>
              </div>
            </div>
          </div>
          )}

          {/* Section 7: App Theme */}
          {(activeCategory === 'all' || activeCategory === 'theme') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              ពណ៌ចម្បងនៃប្រព័ន្ធ (App Theme Color)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => updateSettings({ themeColor: theme.name })}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    settings.themeColor === theme.name
                      ? 'bg-blue-50 border-blue-600 shadow-2xs font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 font-medium'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full ${theme.color} shadow-xs border border-white/20`} />
                  <span className="text-[11px] font-semibold text-slate-800 text-center">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
