import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowDownRight,
    ArrowRight,
    AudioLines,
    BadgeCheck,
    Camera,
    Check,
    ChevronRight,
    CircleHelp,
    Cpu,
    Gamepad2,
    Heart,
    Laptop,
    MessageCircle,
    Monitor,
    Radio,
    Search,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Sparkles,
    UserRound,
    Watch,
    X,
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CartModal from '../components/CartModal';
import AIChat from '../components/AIChat';
import ProfilePage from './ProfilePage';
import { useCart } from '../contexts/CartContext';

const categories = [
    { name: 'Phones', query: 'smartphone', Icon: Smartphone, detail: 'iPhone, Samsung & more', color: 'bg-blue-50 text-blue-700' },
    { name: 'Laptops', query: 'laptop', Icon: Laptop, detail: 'Work, study & gaming', color: 'bg-violet-50 text-violet-700' },
    { name: 'TV & monitors', query: 'TV', Icon: Monitor, detail: 'Bring every detail closer', color: 'bg-amber-50 text-amber-700' },
    { name: 'Audio', query: 'headphones', Icon: AudioLines, detail: 'Headphones, earbuds & speakers', color: 'bg-rose-50 text-rose-700' },
    { name: 'Cameras', query: 'camera', Icon: Camera, detail: 'Capture something brilliant', color: 'bg-emerald-50 text-emerald-700' },
    { name: 'Gaming', query: 'PlayStation', Icon: Gamepad2, detail: 'Consoles & gaming gear', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'Tablets', query: 'tablet', Icon: Cpu, detail: 'A little more room to create', color: 'bg-cyan-50 text-cyan-700' },
    { name: 'Wearables', query: 'smartwatch', Icon: Watch, detail: 'Smartwatches & fitness tech', color: 'bg-orange-50 text-orange-700' },
];

const retailers = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'iStore'];

const getRetailerStyle = (name) => {
    const styles = {
        Amazon: 'bg-[#fff4e5] text-[#9a4d00]',
        Flipkart: 'bg-[#eaf3ff] text-[#1557ad]',
        Croma: 'bg-[#fff0f0] text-[#b31b25]',
        'Reliance Digital': 'bg-[#f2edff] text-[#5932a8]',
        iStore: 'bg-slate-100 text-slate-700',
    };
    return styles[name] || 'bg-slate-100 text-slate-700';
};

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

const HomePage = () => {
    const { isCartOpen, openCart, closeCart, cartCount, addToCart } = useCart();
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [retailerStatuses, setRetailerStatuses] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [searchedQuery, setSearchedQuery] = useState('');
    const [addedToCart, setAddedToCart] = useState({});
    const [notification, setNotification] = useState('');
    const resultsRef = useRef(null);

    const bestOffer = useMemo(
        () => searchResults.reduce((best, product) => !best || product.price < best.price ? product : best, null),
        [searchResults],
    );

    useEffect(() => {
        if (searchedQuery && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [searchedQuery, searchResults]);

    const handleSearch = async (query) => {
        setIsLoading(true);
        setSearchError('');
        setSearchedQuery(query);
        setSearchResults([]);
        setRetailerStatuses([]);
        setLastUpdated(null);

        try {
            const response = await fetch(`/api/products/scrape?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Live product search failed.');
            setSearchResults(Array.isArray(data.results) ? data.results : []);
            setRetailerStatuses(Array.isArray(data.retailers) ? data.retailers : []);
            setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : new Date());
        } catch (error) {
            console.error('Search error:', error);
            setSearchError(error.message || 'Could not reach the live search service. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedToCart(current => ({ ...current, [product.id]: true }));
        setNotification('Saved to your comparison list');
        window.setTimeout(() => {
            setAddedToCart(current => ({ ...current, [product.id]: false }));
            setNotification('');
        }, 2200);
    };

    if (isProfileOpen) return <ProfilePage onBack={() => setIsProfileOpen(false)} />;

    return (
        <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <a href="#home" className="flex items-center gap-2.5" aria-label="DealFinder home">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                            <ShoppingBag size={20} strokeWidth={2.2} />
                        </span>
                        <span className="text-[21px] font-extrabold tracking-tight text-slate-950">deal<span className="text-indigo-600">finder</span></span>
                    </a>

                    <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
                        <a href="#categories" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">Categories</a>
                        <a href="#stores" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">Stores we check</a>
                        <a href="#how-it-works" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">How it works</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsAIChatOpen(true)} className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:flex" aria-label="Open shopping assistant">
                            <MessageCircle size={18} />
                            <span className="hidden lg:inline">Ask AI</span>
                        </button>
                        <button onClick={openCart} className="relative flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" aria-label={`Open saved products, ${cartCount} items`}>
                            <Heart size={18} />
                            <span className="hidden sm:inline">Saved</span>
                            {cartCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white">{cartCount}</span>}
                        </button>
                        <button onClick={() => setIsProfileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-indigo-700" aria-label="Open profile">
                            <UserRound size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main id="home">
                <section className="relative isolate overflow-visible bg-[#11152c] text-white">
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                        <div className="absolute -right-20 -top-48 h-[520px] w-[520px] rounded-full bg-indigo-600/30 blur-[100px]" />
                        <div className="absolute -bottom-56 left-[12%] h-[440px] w-[440px] rounded-full bg-cyan-400/10 blur-[100px]" />
                        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#dbeafe 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                    </div>

                    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-24">
                        <div className="relative z-10 max-w-2xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-indigo-100">
                                <Sparkles size={14} className="text-cyan-300" />
                                THE SMARTER WAY TO SHOP TECH
                            </div>
                            <h1 className="max-w-[680px] text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[64px]">
                                Your next tech upgrade,
                                <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-indigo-200 to-violet-300 bg-clip-text text-transparent">for a whole lot less.</span>
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                                Search once. Compare real electronics prices from the stores you trust. Choose the exact product and the best offer.
                            </p>

                            <div className="mt-9 max-w-2xl rounded-2xl bg-white p-2 shadow-[0_24px_70px_rgba(3,7,18,0.35)] ring-1 ring-white/50">
                                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                            </div>
                            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
                                <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald-300" /> Live retailer listings</span>
                                <span className="flex items-center gap-1.5"><BadgeCheck size={15} className="text-emerald-300" /> No made-up prices</span>
                                <span className="flex items-center gap-1.5"><ArrowDownRight size={15} className="text-emerald-300" /> Best observed price</span>
                            </div>
                        </div>

                        <div className="relative hidden min-h-[360px] items-center justify-center lg:flex" aria-hidden="true">
                            <div className="absolute h-[310px] w-[310px] rounded-full border border-white/10" />
                            <div className="absolute h-[240px] w-[240px] rounded-full border border-white/10" />
                            <div className="absolute h-[170px] w-[170px] rounded-full bg-gradient-to-br from-indigo-500/25 to-cyan-400/10 blur-xl" />
                            <div className="relative flex h-40 w-40 items-center justify-center rounded-[36px] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.03] shadow-[0_30px_90px_rgba(0,0,0,.32)] backdrop-blur-xl">
                                <Smartphone size={82} strokeWidth={1.15} className="text-white" />
                                <span className="absolute -right-4 top-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-xl">
                                    <Search size={20} />
                                </span>
                                <span className="absolute -bottom-4 -left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-300 text-slate-950 shadow-xl">
                                    <Radio size={21} />
                                </span>
                            </div>
                            <div className="absolute right-3 top-10 rounded-2xl border border-white/15 bg-[#1d2344]/90 px-4 py-3 shadow-xl backdrop-blur">
                                <div className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Compare stores</div>
                                <div className="mt-1 flex items-center gap-2 text-sm font-bold"><span className="text-emerald-300">●</span> Amazon · Flipkart · more</div>
                            </div>
                            <div className="absolute bottom-6 left-1 rounded-2xl border border-white/15 bg-[#1d2344]/90 px-4 py-3 shadow-xl backdrop-blur">
                                <div className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Your best offer</div>
                                <div className="mt-1 flex items-center gap-2 text-lg font-extrabold"><span className="text-emerald-300">↓</span> Find it in seconds</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="stores" className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center lg:px-8">
                        <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">One search. Multiple retailers.</p>
                        <div className="flex flex-wrap items-center gap-2">
                            {retailers.map((retailer) => (
                                <span key={retailer} className={`rounded-lg px-3 py-2 text-xs font-bold ${getRetailerStyle(retailer)}`}>{retailer}</span>
                            ))}
                            <span className="ml-1 text-xs text-slate-400">availability varies by store</span>
                        </div>
                    </div>
                </section>

                <div ref={resultsRef} className="scroll-mt-24">
                    {searchError && (
                        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                            <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
                                <CircleHelp size={20} className="mt-0.5 shrink-0" />
                                <div><p className="font-bold">We couldn’t complete that search.</p><p className="mt-1 text-sm">{searchError}</p></div>
                            </div>
                        </section>
                    )}

                    {searchedQuery && isLoading && (
                        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Search size={25} className="animate-pulse" />
                            </div>
                            <h2 className="mt-5 text-xl font-bold text-slate-900">Checking stores for “{searchedQuery}”</h2>
                            <p className="mt-2 text-sm text-slate-500">Looking for matching electronics listings and current prices.</p>
                            <div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-200"><div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-600" /></div>
                        </section>
                    )}

                    {searchedQuery && !isLoading && !searchError && searchResults.length === 0 && (
                        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
                                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"><Search size={24} /></span>
                                <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-slate-400">Search complete</p>
                                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">No live matches for “{searchedQuery}”</h2>
                                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">Some stores block automated searches or don’t have an exact match right now. We don’t fill the gaps with sample products or estimated prices.</p>
                                <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2">
                                    {retailerStatuses.map((retailer) => (
                                        <a key={retailer.name} href={retailer.searchUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 ${getRetailerStyle(retailer.name)}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${retailer.status === 'unavailable' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                            {retailer.name}<span className="font-medium opacity-70">{retailer.status === 'unavailable' ? 'check store' : 'no match'}</span>
                                            <ArrowRight size={13} />
                                        </a>
                                    ))}
                                </div>
                                <p className="mt-5 text-xs text-slate-400">Store links open their own search results in a new tab.</p>
                            </div>
                        </section>
                    )}

                    {searchResults.length > 0 && (
                        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-emerald-700">
                                        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
                                        Live store results
                                    </div>
                                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Offers for “{searchedQuery}”</h2>
                                    <p className="mt-2 text-sm text-slate-500">{searchResults.length} matching {searchResults.length === 1 ? 'listing' : 'listings'}{lastUpdated ? ` · Checked at ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {retailerStatuses.map((retailer) => (
                                        <a key={retailer.name} href={retailer.searchUrl} target="_blank" rel="noopener noreferrer" className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition hover:opacity-75 ${getRetailerStyle(retailer.name)}`} title={`Open ${retailer.name} search`}>
                                            {retailer.name} · {retailer.status === 'live' ? `${retailer.count} found` : retailer.status === 'unavailable' ? 'unavailable' : 'no match'}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {bestOffer && (
                                <a href={bestOffer.link} target="_blank" rel="noopener noreferrer" className="group mt-7 flex flex-col gap-5 overflow-hidden rounded-3xl bg-[#171b35] p-6 text-white shadow-lg transition hover:shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><ArrowDownRight size={28} /></span>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-300">Lowest listed price we found</p>
                                            <h3 className="mt-1 text-lg font-bold sm:text-xl">{bestOffer.name}</h3>
                                            <p className="mt-1 text-sm text-slate-400">At {bestOffer.platform} · retailer listing</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                                        <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">{formatPrice(bestOffer.price)}</span>
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 transition group-hover:bg-emerald-300"><ArrowRight size={19} /></span>
                                    </div>
                                </a>
                            )}

                            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {[...searchResults].sort((a, b) => a.price - b.price).map((product, index) => (
                                    <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_45px_rgba(15,23,42,.09)]">
                                        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#f4f5f8] p-5">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-[1.04]" />
                                            ) : (
                                                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-sm"><Smartphone size={42} strokeWidth={1.3} /></div>
                                            )}
                                            {index === 0 && <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Lowest found</span>}
                                            <button onClick={() => handleAddToCart(product)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-rose-600" aria-label={`Save ${product.name}`} title="Save to comparison list">
                                                {addedToCart[product.id] ? <Check size={17} className="text-emerald-600" /> : <Heart size={17} />}
                                            </button>
                                            <span className={`absolute bottom-3 left-3 rounded-md px-2.5 py-1 text-[10px] font-extrabold ${getRetailerStyle(product.platform)}`}>{product.platform}</span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <h3 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-slate-900">{product.name}</h3>
                                            <div className="mt-4 flex items-end justify-between gap-2">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listed price</p>
                                                    <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-950">{formatPrice(product.price)}</p>
                                                </div>
                                                {product.rating && <span className="mb-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">★ {product.rating}</span>}
                                            </div>
                                            <a href={product.link} target="_blank" rel="noopener noreferrer" className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-indigo-700">
                                                View at {product.platform}<ChevronRight size={16} />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                            <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-slate-400"><CircleHelp size={14} className="mt-0.5 shrink-0" />Prices, stock and delivery may change on the retailer’s site. Check the final price before buying.</p>
                        </section>
                    )}
                </div>

                {!searchedQuery && (
                    <>
                        <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Explore the tech</p>
                                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">What are you looking for?</h2>
                                    <p className="mt-2 text-sm text-slate-500">Pick a category to compare offers across stores.</p>
                                </div>
                                <span className="hidden items-center gap-2 text-sm font-semibold text-slate-500 sm:flex">Electronics only <ShieldCheck size={17} className="text-emerald-600" /></span>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
                                {categories.map((category) => {
                                    const CategoryIcon = category.Icon;
                                    return (
                                        <button key={category.name} onClick={() => handleSearch(category.query)} className="group flex min-h-[160px] flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:min-h-[178px] sm:p-5">
                                            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.color}`}><CategoryIcon size={21} /></span>
                                            <span className="mt-5 flex w-full items-center justify-between text-sm font-extrabold text-slate-900">{category.name}<ArrowRight size={15} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" /></span>
                                            <span className="mt-1 text-xs leading-5 text-slate-500">{category.detail}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section id="how-it-works" className="border-y border-slate-200 bg-white">
                            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                                <div className="max-w-xl">
                                    <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Simple by design</p>
                                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Better buying starts with a better comparison.</h2>
                                </div>
                                <div className="mt-10 grid gap-8 md:grid-cols-3">
                                    {[
                                        { number: '01', title: 'Search your exact tech', body: 'Type a model like iPhone 13 or Sony WH-1000XM5. We focus on electronics, not home accessories.', Icon: Search },
                                        { number: '02', title: 'Compare real store listings', body: 'We check retailer search pages and only show a price when a product listing is available to read.', Icon: AudioLines },
                                        { number: '03', title: 'Choose where to buy', body: 'See the lowest listed offer, then open the retailer to confirm stock, shipping and checkout price.', Icon: ShoppingCart },
                                    ].map((step) => {
                                        const StepIcon = step.Icon;
                                        return (
                                            <div key={step.number} className="relative rounded-2xl bg-[#f7f8fa] p-6">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-extrabold tracking-[.18em] text-indigo-600">{step.number} / 03</span>
                                                    <StepIcon size={20} className="text-slate-400" />
                                                </div>
                                                <h3 className="mt-7 text-lg font-extrabold text-slate-950">{step.title}</h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-500">{step.body}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <footer className="bg-[#11152c] text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <a href="#home" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><ShoppingBag size={18} /></span>
                        <span className="font-extrabold tracking-tight">dealfinder</span>
                    </a>
                    <p className="max-w-xl text-xs leading-5 text-slate-400">An independent electronics price comparison experience. Retailer names and marks belong to their respective owners. Prices and availability are confirmed by each store.</p>
                    <button onClick={() => setIsAIChatOpen(true)} className="flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"><MessageCircle size={17} /> Shopping help</button>
                </div>
            </footer>

            <CartModal isOpen={isCartOpen} onClose={closeCart} />
            <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
            {notification && (
                <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
                    <Check size={17} className="text-emerald-300" />{notification}<button onClick={() => setNotification('')} className="ml-2 rounded p-0.5 text-slate-400 hover:text-white" aria-label="Dismiss notification"><X size={15} /></button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
