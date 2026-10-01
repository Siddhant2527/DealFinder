import React from 'react';
import { X, Trash2, Heart, ExternalLink } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartModal = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart } = useCart();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <header className="flex items-center justify-between border-b border-slate-100 bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-rose-50 p-2.5">
                            <Heart className="text-rose-600" size={21} />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-950">Saved offers</h3>
                            <p className="text-sm text-slate-500">{cartItems.length} saved item{cartItems.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Close saved offers">
                        <X size={21} />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-5">
                    {cartItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <Heart size={25} />
                            </div>
                            <h4 className="font-bold text-slate-900">No saved offers yet</h4>
                            <p className="mt-1 text-sm text-slate-500">Save a product while comparing prices to find it again.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                                        {item.image ? <img src={item.image} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain mix-blend-multiply" /> : <Heart size={20} className="text-slate-400" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-sm font-bold text-slate-900">{item.name}</p>
                                        <p className="mt-1 text-xs text-slate-500">{item.platform}</p>
                                        <p className="mt-1 text-sm font-extrabold text-slate-950">
                                            ₹{item.price.toLocaleString('en-IN')}
                                            {item.quantity > 1 && <span className="ml-1 text-xs font-medium text-slate-500">· saved {item.quantity} times</span>}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex h-9 items-center gap-1 rounded-lg bg-slate-950 px-2.5 text-xs font-bold text-white transition hover:bg-indigo-700" aria-label={`View ${item.name} at ${item.platform}`}>
                                            View<ExternalLink size={13} />
                                        </a>
                                        <button onClick={() => removeFromCart(item.id)} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${item.name}`}>
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartModal;
