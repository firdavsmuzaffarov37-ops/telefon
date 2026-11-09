import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  Sparkles, 
  X, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIInsightsPanel({ isOpen, onClose }) {
  const { products, transactions, getTodayStats } = useApp();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const stats = getTodayStats();

  // Generate dynamic localized insights
  const insights = useMemo(() => {
    const list = [];
    const isUz = language === 'uz';
    const isRu = language === 'ru';

    // 1. Low stock detection
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.minStockThreshold || 5));
    if (lowStock.length > 0) {
      list.push({
        id: 'low-stock',
        type: 'warning',
        icon: AlertTriangle,
        color: 'text-amber-500 bg-amber-50 border-amber-200',
        title: isUz ? "Zaxira Kam Qolganlik Ogohlantiruvi" : isRu ? "Предупреждение о малом запасе" : 'Low Stock Restock Alert',
        message: isUz 
          ? `Sizning ${lowStock.slice(0, 2).map(p => p.name).join(' va ')} smartfonlaringiz omborda juda kam qoldi. Zaxirani zudlik bilan to'ldirish tavsiya etiladi.`
          : isRu 
            ? `Смартфоны ${lowStock.slice(0, 2).map(p => p.name).join(' и ')} заканчиваются на складе. Рекомендуется оформить пополнение.`
            : `Your ${lowStock.slice(0, 2).map(p => p.name).join(' and ')} are running low on stock. Restock advised.`,
        actionLabel: isUz ? "Omborga o'tish" : isRu ? "Перейти на склад" : 'Restock Devices',
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
        title: isUz ? "Yetakchi Brend Ko'rsatkichi" : isRu ? "Лидирующий бренд" : 'Leading Brand Performance',
        message: isUz
          ? `${topBrand} brendi savdo tarixida eng ko'p daromad (${formatCurrency(maxRev)}) keltirgan. Xaridorlar talabi ushbu brendga eng yuqori bo'lmoqda.`
          : isRu
            ? `Бренд ${topBrand} принес наибольшую выручку (${formatCurrency(maxRev)}). Покупательский спрос активно сосредоточен на этом бренде.`
            : `${topBrand} generated the highest revenue (${formatCurrency(maxRev)}) across sales history.`,
        actionLabel: isUz ? "Hisobotlarni ko'rish" : isRu ? "Открыть отчеты" : 'View Analytics',
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
        title: isUz ? "Bugungi Savdo Sur'ati" : isRu ? "Темп продаж сегодня" : "Today's Sales Pulse",
        message: isUz
          ? `Bugun do'konda ${stats.phonesSoldToday} ta smartfon sotildi. Jami tushum: ${formatCurrency(stats.revenueToday)}, kutilayotgan foyda: +${formatCurrency(stats.profitToday)}.`
          : isRu
            ? `Сегодня продано ${stats.phonesSoldToday} смартфонов на сумму ${formatCurrency(stats.revenueToday)} с прибылью +${formatCurrency(stats.profitToday)}.`
            : `You sold ${stats.phonesSoldToday} smartphone(s) today generating ${formatCurrency(stats.revenueToday)}.`,
        actionLabel: isUz ? "POS Kassaga o'tish" : isRu ? "Открыть кассу POS" : 'Open POS Register',
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
        title: isUz ? "Foyda O'sishi" : isRu ? "Рост рентабельности" : 'Gross Margin Growth',
        message: isUz
          ? `Yalpi foyda kechagiga nisbatan +${stats.profitGrowth}% ga oshdi. Yuqori toifadagi modellar daromad marjasini mustahkam ushlab turibdi.`
          : isRu
            ? `Валовая прибыль выросла на +${stats.profitGrowth}% по сравнению со вчерашним днем.`
            : `Your gross profit increased by +${stats.profitGrowth}% compared to yesterday.`,
        actionLabel: isUz ? "Tahlilni ochish" : isRu ? "Подробнее" : 'Review Reports',
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
        title: isUz ? "Yuqori Marjali Tavsiya" : isRu ? "Высокомаржинальный совет" : 'High-Margin Recommendation',
        message: isUz
          ? `${highMargin[0].name} kabi flagman smartfonlar har bir donasidan 2 000 000 so'mdan ortiq foyda keltiradi. Ularni do'kon peshtaxtasining markaziy qismiga joylashtiring.`
          : isRu
            ? `Флагманы вроде ${highMargin[0].name} приносят более 2 000 000 сум маржи с каждой единицы. Рекомендуется выставлять их на витрину.`
            : `Flagship smartphones like ${highMargin[0].name} have unit margins above 2 000 000 so'm.`,
        actionLabel: isUz ? "Smartfonni ko'rish" : isRu ? "Посмотреть" : 'View Product',
        action: () => {
          onClose();
          navigate('/');
        }
      });
    }

    return list;
  }, [products, transactions, stats, language]);

  if (!isOpen) return null;

  const isUz = language === 'uz';
  const isRu = language === 'ru';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl border-l border-[#EAEAEA] flex flex-col animate-slide-left p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF7900] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171717] font-['Plus_Jakarta_Sans']">
                {isUz ? "AI Biznes Maslahatchi" : isRu ? "AI Бизнес-Помощник" : "AI Business Assistant"}
              </h3>
              <p className="text-[11px] text-[#888888]">
                {isUz ? "Real vaqtli avtomatlashtirilgan do'kon tahlili" : isRu ? "Автоматический анализ показателей магазина" : "Live automated store analytics"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#888888] hover:text-[#171717] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intelligence Insights List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          <div className="p-3 bg-neutral-50 rounded-2xl border border-[#EAEAEA] text-xs text-[#666666] leading-relaxed">
            {isUz 
              ? "👋 Assalomu alaykum! Do'koningizdagi barcha smartfonlar, ombor qoldiqlari va savdo ko'rsatkichlari tahlil qilindi. Asosiy xulosalar:"
              : isRu 
                ? "👋 Здравствуйте! Мы проанализировали складские остатки, продажи через POS и маржинальность магазина:"
                : "👋 Hello! I analyzed your current smartphone inventory, POS sales, and daily margin trends:"}
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF7900] hover:text-[#EA6E00] pt-1 cursor-pointer"
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
            PhoneLytics Intelligence v2.0 • Aqlli Smartfon Savdo Tizimi
          </span>
        </div>
      </div>
    </div>
  );
}
