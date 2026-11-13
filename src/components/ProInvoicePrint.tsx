import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, ArrowLeft, Edit, Trash2, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ProInvoicePrintProps {
  invoice: any;
  settings: any;
  onBack: () => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
}

export default function ProInvoicePrint({ invoice, settings, onBack, onEdit, onDelete }: ProInvoicePrintProps) {
  const [layoutFormat, setLayoutFormat] = useState<'single' | 'two-per-page'>('single');
  const printableAreaRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef: printableAreaRef,
    documentTitle: invoice ? `${invoice.invoiceNumber}-Invoice` : 'Invoice',
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          background: white !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        .print-container {
          width: 210mm !important;
          height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          padding: 16mm 18mm 14mm 18mm !important;
          box-shadow: none !important;
          border: none !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `,
    onAfterPrint: () => setIsPrinting(false),
  });

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      if (typeof reactToPrintFn === 'function') {
        reactToPrintFn();
      } else {
        window.print();
        setTimeout(() => setIsPrinting(false), 800);
      }
    } catch (err) {
      window.print();
      setTimeout(() => setIsPrinting(false), 800);
    }
  };

  const handleDownloadPng = async () => {
    if (!printableAreaRef.current) return;
    setIsDownloadingPng(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(printableAreaRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `${invoice.invoiceNumber || 'Invoice'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download PNG failed:', err);
      alert('បរាជ័យក្នុងការទាញយក PNG');
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const formatCurrency = (amount: number, curr: 'KHR' | 'USD' = invoice.currency) => {
    if (curr === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    }
    return new Intl.NumberFormat('km-KH', { maximumFractionDigits: 0 }).format(amount || 0) + ' ៛';
  };

  const formatDateDDMMYYYY = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch (e) {}
    return dateStr;
  };

  const wb = invoice.weighbridge;
  const subtotal = invoice.totalAmount || 0;
  const deposit = invoice.depositAmount || 0;
  const remaining = invoice.remainingAmount ?? (subtotal - deposit);
  const finalAmount = remaining > 0 ? remaining : subtotal;

  const exchangeRate = invoice.exchangeRate || settings.exchangeRate || 4100;
  const usdEquivalent = finalAmount / exchangeRate;

  const qrPayload = `KHQR:${settings.bankName || 'ABA'}|ACC:${settings.bankAccountNumber || '001888999'}|AMT:${finalAmount}|CUR:${invoice.currency}|INV:${invoice.invoiceNumber}`;
  const bankDisplayName = settings.bankAccountName || settings.bankName || settings.companyNameEnglish || 'CHEY MAB DEPOT';

  return (
    <div className="max-w-5xl mx-auto pb-12 font-khmer text-slate-900">
      {/* Top Action Toolbar - Hidden when Printing */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-2xs text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ក្រោយ</span>
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(invoice.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl border border-blue-200 text-xs cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>កែសម្រួល</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl border border-rose-200 text-xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>លុប</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>បោះពុម្ព / ទាញយក PDF</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloadingPng}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs text-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingPng ? 'កំពុងបង្កើត PNG...' : 'ទាញយក PNG'}</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper with horizontal scroll for mobile */}
      <div className="flex justify-center bg-slate-200 p-4 rounded-2xl overflow-x-auto w-full">
        <div className="w-full flex justify-center">
          <div
            ref={printableAreaRef}
            id="printable-area"
            className="print-container bg-white text-slate-900 shadow-2xl border border-slate-300 w-[210mm] min-h-[297mm] max-h-[297mm] p-[16mm_18mm_14mm_18mm] flex flex-col justify-between box-border overflow-hidden relative"
            style={{ fontFamily: '"Noto Sans Khmer", "Inter", sans-serif', lineHeight: 1.6 }}
          >
            <SingleWholesaleProContent
              invoice={invoice}
              settings={settings}
              formatCurrency={formatCurrency}
              formatDateDDMMYYYY={formatDateDDMMYYYY}
              wb={wb}
              subtotal={subtotal}
              deposit={deposit}
              remaining={remaining}
              finalAmount={finalAmount}
              usdEquivalent={usdEquivalent}
              exchangeRate={exchangeRate}
              qrPayload={qrPayload}
              bankDisplayName={bankDisplayName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface WholesaleProContentProps {
  invoice: any;
  settings: any;
  formatCurrency: (n: number, curr?: 'KHR' | 'USD') => string;
  formatDateDDMMYYYY?: (d: string) => string;
  wb: any;
  subtotal?: number;
  deposit?: number;
  remaining?: number;
  finalAmount?: number;
  usdEquivalent?: number;
  exchangeRate?: number;
  qrPayload: string;
  bankDisplayName: string;
  isCompact?: boolean;
}

export function SingleWholesaleProContent({
  invoice,
  settings,
  formatCurrency,
  formatDateDDMMYYYY,
  wb,
  subtotal,
  deposit,
  remaining,
  finalAmount: propFinalAmount,
  usdEquivalent: propUsdEquivalent,
  exchangeRate: propExchangeRate,
  qrPayload,
  bankDisplayName,
  isCompact = false,
}: WholesaleProContentProps) {
  const unitLabelStr = unitLabel(invoice.unit);

  const sub = subtotal ?? invoice.totalAmount ?? 0;
  const dep = deposit ?? invoice.depositAmount ?? 0;
  const rem = remaining ?? invoice.remainingAmount ?? (sub - dep);
  const finalAmount = propFinalAmount ?? (rem > 0 ? rem : sub);
  const exchangeRate = propExchangeRate ?? invoice.exchangeRate ?? settings.exchangeRate ?? 4100;
  const usdEquivalent = propUsdEquivalent ?? (finalAmount / exchangeRate);

  const formatDate = formatDateDDMMYYYY ?? ((dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch (e) {}
    return dateStr;
  });

  return (
    <div className={`w-full h-full flex flex-col justify-between font-battambang text-[#000000] ${isCompact ? 'text-[11px]' : 'text-xs sm:text-sm'}`}>
      <div className="space-y-5">
        {/* Centered Title */}
        <div className="text-center pb-3.5 border-b-2 border-black mb-4">
          <h1 className={`font-bold font-moul tracking-tight text-black whitespace-nowrap ${isCompact ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
            វិក្កយបត្របង់ប្រាក់
          </h1>
        </div>

        {/* Two-Column Info Block */}
        <div className="grid grid-cols-2 gap-6 text-[13px] mb-4">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-normal text-slate-700">លេខបន្ទប់:</span>
              <strong className="font-bold text-black font-inter">
                {invoice.truckPlateNumber || invoice.customerAddress || 'F4'}
              </strong>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-normal text-slate-700">ឈ្មោះអ្នកផ្ដល់:</span>
              <span className="font-bold text-black font-inter">
                {invoice.customerName || '...........................................'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex items-baseline justify-end gap-2">
              <span className="font-normal text-slate-700">កាលបរិច្ឆេទ:</span>
              <span className="font-bold text-black font-inter tabular-nums">
                {formatDate(invoice.date)}
              </span>
            </div>
            <div className="flex items-baseline justify-end gap-2">
              <span className="font-normal text-slate-700">លេខវិក្កយបត្រ:</span>
              <strong className="font-bold text-black font-inter tabular-nums">
                {invoice.invoiceNumber}
              </strong>
            </div>
          </div>
        </div>

        {/* Table Structure */}
        <table className="w-full border-collapse border-t-[1.5px] border-b-[1.5px] border-black text-[13px] break-inside-avoid">
          <thead>
            <tr className="border-b-[1.5px] border-black bg-gray-50 font-bold">
              <th className="py-3 px-2.5 text-left w-[45%] font-bold">បរិយាយ</th>
              <th className="py-3 px-2.5 text-center w-[20%] font-bold">បរិមាណ</th>
              <th className="py-3 px-2.5 text-right w-[15%] font-bold">តម្លៃឯកតា</th>
              <th className="py-3 px-2.5 text-right w-[20%] font-bold">សរុប</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ddd] font-normal">
            {wb && (
              <>
                <tr>
                  <td className="py-3 px-2.5 font-bold">ទម្ងន់សរុប</td>
                  <td className="py-3 px-2.5 text-center font-inter tabular-nums">{wb.grossWeight?.toLocaleString()} {unitLabelStr}</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-2.5 font-bold">ទម្ងន់ឡានទទេ</td>
                  <td className="py-3 px-2.5 text-center font-inter tabular-nums">-{wb.tareWeight?.toLocaleString()} {unitLabelStr}</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-3 px-2.5 font-bold">ទម្ងន់សុទ្ធ</td>
                  <td className="py-3 px-2.5 text-center font-inter tabular-nums">{wb.netWeight?.toLocaleString()} {unitLabelStr}</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-2.5 font-bold">មេគុណកាត់កងសំណើម</td>
                  <td className="py-3 px-2.5 text-center font-inter tabular-nums">× {wb.deductionFactor || 0.9}</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                  <td className="py-3 px-2.5 text-right font-inter tabular-nums">-</td>
                </tr>
              </>
            )}

            {invoice.items?.map((item: any, idx: number) => (
              <tr key={idx} className={idx === 0 && wb ? 'bg-gray-50/50 font-bold' : ''} style={{ breakInside: 'avoid' }}>
                <td className="py-3.5 px-2.5">
                  <div className="font-bold">{item.productName}</div>
                  {item.description && <div className="text-[10px] text-gray-500 font-inter mt-0.5 whitespace-pre-line">{item.description}</div>}
                </td>
                <td className="py-3.5 px-2.5 text-center font-inter tabular-nums">
                  {item.quantity?.toLocaleString()} {unitLabelStr}
                </td>
                <td className="py-3.5 px-3.5 text-right font-inter tabular-nums">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-3.5 px-3.5 text-right font-inter font-bold tabular-nums">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Grand Total Block */}
        <div className="flex justify-end pt-2">
          <div className="bg-[#f5f5f5] border-l-4 border-black py-2.5 px-4 flex items-center gap-6">
            <span className="text-[14px] font-bold text-black font-khmer">សរុបទឹកប្រាក់ត្រូវបង់:</span>
            <div className="text-right">
              <div className="text-[22px] font-bold font-inter tabular-nums text-black">
                {formatCurrency(finalAmount)}
              </div>
              {invoice.currency === 'KHR' && (
                <div className="text-[10px] text-gray-500 font-inter tabular-nums">
                  ≈ ${usdEquivalent.toFixed(2)} USD (អត្រាប្តូរប្រាក់ 1$ = {exchangeRate.toLocaleString()}៛)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section (Pinned to Bottom) */}
      <div className="pt-4 border-t border-black flex items-start justify-between gap-6 mt-auto">
        <div className="flex flex-col items-start gap-2">
          <div className="p-1 bg-white border border-black shadow-2xs">
            <QRCodeSVG value={qrPayload} size={130} />
          </div>
          <span className="text-[11px] font-bold font-inter text-black">
            Bank Name: {bankDisplayName}
          </span>
        </div>

        <div className="space-y-1 text-[11px]">
          <p className="font-bold font-khmer underline decoration-1 underline-offset-4 mb-1">របៀបបង់ប្រាក់:</p>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 font-inter tabular-nums">
            <li>បើកកម្មវិធីធនាគាររបស់អ្នក</li>
            <li>ស្កែន QR Code នេះ</li>
            <li>បញ្ជាក់ការបង់ប្រាក់</li>
          </ol>
          <p className="text-[10px] text-slate-500 italic font-khmer mt-2">
            * សូមរក្សាទុកវិក្កយបត្រនេះជាភស្តុតាង
          </p>
        </div>
      </div>
    </div>
  );
}

function unitLabel(unit: string) {
  return unit === 'ton' ? 'តោន' : 'គីឡូក្រាម';
}
