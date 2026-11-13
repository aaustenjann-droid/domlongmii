import { useState } from 'react';
import { useStore } from '../store';
import { FileText, Eye, Trash2, Edit, Plus, Scale, Search, RefreshCw, Truck } from 'lucide-react';

interface InvoiceListProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onCreateNew: () => void;
}

export default function InvoiceList({ onView, onEdit, onCreateNew }: InvoiceListProps) {
  const { invoices, deleteInvoice, resetToSampleData } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceToDelete, setInvoiceToDelete] = useState<any | null>(null);

  const formatCurrency = (amount: number, currency: 'KHR' | 'USD' = 'KHR') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      (inv.truckPlateNumber && inv.truckPlateNumber.toLowerCase().includes(q)) ||
      (inv.driverName && inv.driverName.toLowerCase().includes(q))
    );
  });

  const totalTonnage = invoices.reduce((sum, inv) => {
    return (
      sum +
      inv.items.reduce((s, it) => s + (inv.unit === 'ton' ? it.quantity : it.quantity / 1000), 0)
    );
  }, 0);

  const totalKhr = invoices
    .filter((inv) => inv.currency === 'KHR')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalUsd = invoices
    .filter((inv) => inv.currency === 'USD')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-khmer">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-moul">
            ប្រវត្តិវិក្កយបត្រ & ប័ណ្ណថ្លឹងទំនិញ
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            គ្រប់គ្រងការទិញ-លក់ដំឡូងមី ថ្លឹងរថយន្ត និងបោះពុម្ពវិក្កយបត្រ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToSampleData}
            title="Reload Demo Invoices"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>គំរូវិក្កយបត្រ (Demo)</span>
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បង្កើតវិក្កយបត្រថ្មី</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="overflow-hidden min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide block truncate">វិក្កយបត្រសរុប</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 block leading-tight font-mono">{invoices.length}</span>
            <span className="text-[11px] text-slate-400 block truncate mt-0.5">ប័ណ្ណថ្លឹងទំនិញ</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="overflow-hidden min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide block truncate">បរិមាណសរុប</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 block leading-tight truncate">
              {totalTonnage.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 block truncate mt-0.5">តោន (Total Tons)</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="overflow-hidden min-w-0 pr-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide block truncate">ទឹកប្រាក់សរុប</span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-900 block truncate leading-tight">
              {formatCurrency(totalKhr, 'KHR')}
            </span>
            {totalUsd > 0 && (
              <span className="text-xs font-mono font-medium text-slate-500 block truncate mt-0.5">
                + {formatCurrency(totalUsd, 'USD')}
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកអតិថិជន ផ្លាកលេខឡាន លេខប័ណ្ណ..."
              className="w-full pl-10 pr-3.5 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>

          <div className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            បង្ហាញ <span className="font-bold text-blue-600">{filteredInvoices.length}</span> នៃ {invoices.length} វិក្កយបត្រ
          </div>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {filteredInvoices.map((invoice) => {
            const totalQty = invoice.items.reduce((sum, it) => sum + it.quantity, 0);
            return (
              <div key={invoice.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {invoice.invoiceNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {invoice.date} {invoice.time && `· ${invoice.time}`}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{invoice.customerName}</h4>
                    {invoice.customerPhone && (
                      <p className="text-[11px] text-slate-500 font-mono">{invoice.customerPhone}</p>
                    )}
                    {invoice.truckPlateNumber && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded font-mono text-[10px]">
                        ឡាន: {invoice.truckPlateNumber}
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {totalQty} {invoice.unit === 'ton' ? 'តោន' : 'Kg'}
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onView(invoice.id)}
                    className="flex-1 h-9 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>មើល & បោះពុម្ព</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(invoice.id)}
                    className="h-9 w-9 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInvoiceToDelete(invoice);
                    }}
                    className="h-9 w-9 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* TABLE VIEW */}
        <div className="hidden sm:block overflow-x-hidden w-full">
          <table className="w-full text-left border-collapse text-xs font-khmer table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="p-3 w-[14%] truncate">លេខវិក្កយបត្រ (No.)</th>
                <th className="p-3 w-[14%] truncate">កាលបរិច្ឆេទ (Date)</th>
                <th className="p-3 w-[22%] truncate">អតិថិជន (Customer)</th>
                <th className="p-3 w-[13%] truncate">ផ្លាកលេខ (Plate)</th>
                <th className="p-3 w-[12%] text-right truncate">បរិមាណ</th>
                <th className="p-3 w-[14%] text-right truncate">សរុប (Total)</th>
                <th className="p-3 w-[11%] text-center truncate">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((invoice) => {
                const totalQty = invoice.items.reduce((sum, it) => sum + it.quantity, 0);
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="p-3 font-mono font-bold text-blue-600 truncate">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="p-3 text-slate-700 truncate">
                      <div>{invoice.date}</div>
                      {invoice.time && <div className="text-[10px] text-slate-400 font-mono">{invoice.time}</div>}
                    </td>
                    <td className="p-3 text-slate-900 truncate">
                      <div className="truncate font-semibold" title={invoice.customerName}>{invoice.customerName}</div>
                      {invoice.customerPhone && (
                        <div className="text-[10px] text-slate-400 font-mono truncate">{invoice.customerPhone}</div>
                      )}
                    </td>
                    <td className="p-3 truncate">
                      {invoice.truckPlateNumber ? (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded font-mono text-[10px] truncate max-w-full">
                          {invoice.truckPlateNumber}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-semibold text-slate-800 truncate">
                      {totalQty} {invoice.unit === 'ton' ? 'តោន' : 'Kg'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 truncate">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(invoice.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                          title="View & Print"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">មើល</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(invoice.id)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInvoiceToDelete(invoice);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-600">រកមិនឃើញវិក្កយបត្រទេ</p>
                    <p className="text-xs text-slate-400 mt-1">
                      សូមចុច "បង្កើតវិក្កយបត្រថ្មី" ឬ "គំរូវិក្កយបត្រ" ដើម្បីចាប់ផ្តើម
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {invoiceToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs"
          onClick={() => setInvoiceToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-khmer">
                  លុបវិក្កយបត្រ (Delete Invoice)
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {invoiceToDelete.invoiceNumber}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-khmer bg-slate-50 p-3 rounded-xl border border-slate-200">
              តើអ្នកពិតជាចង់លុបវិក្កយបត្រលេខ <strong>{invoiceToDelete.invoiceNumber}</strong> របស់អតិថិជន{' '}
              <strong>{invoiceToDelete.customerName || 'ទូទៅ'}</strong> នេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = invoiceToDelete.id;
                  setInvoiceToDelete(null);
                  deleteInvoice(targetId);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>លុបចេញ (Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
