import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  Sparkles, 
  X, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIInsightsPanel({ isOpen, onClose }) {
  const { products, transactions, expenses, getTodayStats } = useApp();
  const navigate = useNavigate();
  const stats = getTodayStats();

  // Generate real dynamic insights
  const insights = useMemo(() => {
    const list = [];

    // 1. Low stock detection
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.minStockThreshold || 5));
    if (lowStock.length > 0) {
      list.push({
        id: 'low-stock',
        type: 'warning',
        icon: AlertTriangle,
        color: 'text-amber-500 bg-amber-50 border-amber-200',
        title: 'Low Stock Restock Alert',
        message: `Your ${lowStock.map(p => p.name).slice(0, 2).join(' and ')} ${lowStock.length > 2 ? `and ${lowStock.length - 2} other model(s)` : ''} are running dangerously low on stock.`,
        actionLabel: 'Restock Devices',
        action: () => {
          onClose();
          navigate('/');
        }
      });
    }

    // 2. Best performing brand calculation
    const brandMap = {};
    transactions.forEach(t => {
      brandMap[t.brand] = (brandMap[t.brand] || 0) + Number(t.revenue);
    });
    let topBrand = 'Apple';
    let maxRev = 0;
    Object.entries(brandMap).forEach(([b, r]) => {
      if (r > maxRev) {
        maxRev = r;
        topBrand = b;
      }
    });

    if (maxRev > 0) {
      list.push({
        id: 'top-brand',
        type: 'success',
        icon: TrendingUp,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        title: 'Leading Brand Performance',
        message: `${topBrand} generated the highest revenue (${formatCurrency(maxRev)}) across current sales history. Customer preference is heavily favoring this brand.`,
        actionLabel: 'View Analytics',
        action: () => {
          onClose();
          navigate('/reports');
        }
      });
    }

    // 3. Today's profit & sales throughput
    if (stats.phonesSoldToday > 0) {
      list.push({
        id: 'daily-performance',
        type: 'info',
        icon: Zap,
        color: 'text-sky-600 bg-sky-50 border-sky-200',
        title: "Today's Sales Pulse",
        message: `You sold ${stats.phonesSoldToday} smartphone(s) today generating ${formatCurrency(stats.revenueToday)} in revenue and +${formatCurrency(stats.profitToday)} in gross profit.`,
        actionLabel: 'Open POS Register',
        action: () => {
          onClose();
          navigate('/pos');
        }
      });
    }

    // 4. Comparison vs yesterday
    if (stats.profitGrowth >= 0) {
      list.push({
        id: 'profit-growth',
        type: 'success',
        icon: Sparkles,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        title: 'Gross Margin Growth',
        message: `Your gross profit increased by +${stats.profitGrowth}% compared to yesterday. High-tier models are maintaining healthy margins.`,
        actionLabel: 'Review Reports',
        action: () => {
          onClose();
          navigate('/reports');
        }
      });
    }

    // 5. Margin optimization advice
    const highMargin = products.filter(p => (Number(p.sellingPrice) - Number(p.purchasePrice)) > 2000000);
    if (highMargin.length > 0) {
      list.push({
        id: 'margin-advice',
        type: 'tip',
        icon: Lightbulb,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        title: 'High-Margin Recommendation',
        message: `Flagship smartphones like ${highMargin[0].name} have unit margins above 2 000 000 so'm. Recommend featuring them prominently on store displays.`,
        actionLabel: 'View Product',
        action: () => {
          onClose();
          navigate('/');
        }
      });
    }

    return list;
  }, [products, transactions, stats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl border-l border-[#EAEAEA] flex flex-col animate-slide-left p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                AI Business Assistant
              </h3>
              <p className="text-[11px] text-[#888888]">Live automated store analytics & recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#888888] hover:text-[#171717] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intelligence Insights List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          <div className="p-3 bg-neutral-50 rounded-2xl border border-[#EAEAEA] text-xs text-[#666666] leading-relaxed">
            👋 <strong>Hello Sherzod!</strong> I analyzed your current smartphone inventory, POS sales, and daily margin trends. Here are key observations for your store:
          </div>

          {insights.map(item => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className="p-4 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm hover:shadow-card transition space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#171717]">{item.title}</h4>
                </div>

                <p className="text-xs text-[#666666] leading-relaxed">
                  {item.message}
                </p>

                {item.actionLabel && (
                  <button
                    onClick={item.action}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF7900] hover:text-[#EA6E00] pt-1"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Panel Footer */}
        <div className="pt-4 border-t border-[#EAEAEA] text-center">
          <span className="text-[10px] text-[#888888]">
            PhoneLytics Intelligence v1.0 • Built for retail smartphone stores
          </span>
        </div>
      </div>
    </div>
  );
}

