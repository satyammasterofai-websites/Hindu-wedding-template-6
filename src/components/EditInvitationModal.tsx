import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  Music, 
  Heart, 
  Users, 
  MessageSquare, 
  Sparkles,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CeremonyEvent {
  id: string;
  name: string;
  date: string;
  day: string;
  time: string;
  venue: string;
  address: string;
  mapLink: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPauseMusic?: () => void;
  currentTemplateUrl?: string;
}

const COMMON_CEREMONIES = [
  'Haldi Ceremony',
  'Mehndi Ceremony',
  'Sangeet Night',
  'Wedding Ceremony (Pheras)',
  'Reception Party',
  'Ring Ceremony / Engagement',
  'Tilak / Sagan Ceremony',
  'Cocktail Night',
  'Custom Event'
];

// Helper to compute Day and Year from YYYY-MM-DD
function computeDayAndYear(dateStr: string): { day: string; year: string } {
  if (!dateStr || !dateStr.includes('-')) {
    return { day: '', year: '' };
  }
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return { day: '', year: '' };
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const year = String(y);
    return { day, year };
  } catch {
    return { day: '', year: '' };
  }
}

export function EditInvitationModal({ isOpen, onClose, onPauseMusic, currentTemplateUrl }: Props) {
  // Groom Details
  const [groomName, setGroomName] = useState('');
  const [groomFather, setGroomFather] = useState('');
  const [groomMother, setGroomMother] = useState('');
  const [groomIntro, setGroomIntro] = useState('');

  // Bride Details
  const [brideName, setBrideName] = useState('');
  const [brideFather, setBrideFather] = useState('');
  const [brideMother, setBrideMother] = useState('');
  const [brideIntro, setBrideIntro] = useState('');

  // Main Wedding Info
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingDay, setWeddingDay] = useState('');
  const [weddingYear, setWeddingYear] = useState('');
  const [weddingTime, setWeddingTime] = useState('');
  const [weddingVenue, setWeddingVenue] = useState('');
  const [weddingAddress, setWeddingAddress] = useState('');
  const [weddingMapLink, setWeddingMapLink] = useState('');

  // Ceremonies
  const [ceremonies, setCeremonies] = useState<CeremonyEvent[]>([
    {
      id: 'c-1',
      name: 'Haldi Ceremony',
      date: '',
      day: '',
      time: '',
      venue: '',
      address: '',
      mapLink: ''
    },
    {
      id: 'c-2',
      name: 'Mehndi Ceremony',
      date: '',
      day: '',
      time: '',
      venue: '',
      address: '',
      mapLink: ''
    },
    {
      id: 'c-3',
      name: 'Sangeet Ceremony',
      date: '',
      day: '',
      time: '',
      venue: '',
      address: '',
      mapLink: ''
    },
    {
      id: 'c-4',
      name: 'Wedding Ceremony',
      date: '',
      day: '',
      time: '',
      venue: '',
      address: '',
      mapLink: ''
    }
  ]);
  const [selectedCeremonyPreset, setSelectedCeremonyPreset] = useState('Haldi Ceremony');

  // Family Details (Optional)
  const [brideFamily, setBrideFamily] = useState('');
  const [groomFamily, setGroomFamily] = useState('');

  // Custom Invitation Message (Optional)
  const [invitationMessage, setInvitationMessage] = useState('');

  // Background Music (Optional)
  const [musicUrl, setMusicUrl] = useState('');

  // Accordion Section States
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    couple: true,
    wedding: true,
    ceremonies: true,
    family: false,
    message: false,
    music: false,
  });

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWeddingDateChange = (date: string) => {
    setWeddingDate(date);
    const { day, year } = computeDayAndYear(date);
    setWeddingDay(day);
    setWeddingYear(year);
    if (errors.weddingDate) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.weddingDate;
        return next;
      });
    }
  };

  const handleCeremonyDateChange = (id: string, date: string) => {
    const { day } = computeDayAndYear(date);
    setCeremonies(prev => prev.map(c => c.id === id ? { ...c, date, day } : c));
  };

  const handleCeremonyFieldChange = (id: string, field: keyof CeremonyEvent, value: string) => {
    setCeremonies(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCeremony = (nameToAdd?: string) => {
    const name = nameToAdd || selectedCeremonyPreset;
    const newCeremony: CeremonyEvent = {
      id: `c-${Date.now()}`,
      name: name === 'Custom Event' ? 'New Ceremony' : name,
      date: '',
      day: '',
      time: '',
      venue: '',
      address: '',
      mapLink: ''
    };
    setCeremonies(prev => [...prev, newCeremony]);
    setOpenSections(prev => ({ ...prev, ceremonies: true }));
  };

  const removeCeremony = (id: string) => {
    setCeremonies(prev => prev.filter(c => c.id !== id));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!groomName.trim()) {
      newErrors.groomName = "Groom's full name is required";
    }
    if (!brideName.trim()) {
      newErrors.brideName = "Bride's full name is required";
    }
    if (!weddingDate) {
      newErrors.weddingDate = "Wedding date is required";
    }
    if (!weddingVenue.trim()) {
      newErrors.weddingVenue = "Wedding venue name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Open the sections containing errors
      setOpenSections(prev => ({ ...prev, couple: true, wedding: true }));
      return;
    }

    // Auto-detect template link
    const demoUrl = currentTemplateUrl || (typeof window !== 'undefined' ? window.location.href : '');

    // Build the formatted WhatsApp message
    let msg = `✨ *WEDDING INVITATION CUSTOMIZATION DETAILS* ✨\n\n`;
    
    msg += `🌐 *SELECTED TEMPLATE / DEMO LINK:*\n${demoUrl}\n\n`;
    
    msg += `💍 *1. BRIDE & GROOM DETAILS*\n`;
    msg += `🤵 *Groom Details:*\n`;
    msg += `• Full Name: *${groomName.trim()}*\n`;
    if (groomFather.trim()) msg += `• Father's Name: ${groomFather.trim()}\n`;
    if (groomMother.trim()) msg += `• Mother's Name: ${groomMother.trim()}\n`;
    if (groomIntro.trim()) msg += `• Short Intro: ${groomIntro.trim()}\n`;
    
    msg += `\n👰 *Bride Details:*\n`;
    msg += `• Full Name: *${brideName.trim()}*\n`;
    if (brideFather.trim()) msg += `• Father's Name: ${brideFather.trim()}\n`;
    if (brideMother.trim()) msg += `• Mother's Name: ${brideMother.trim()}\n`;
    if (brideIntro.trim()) msg += `• Short Intro: ${brideIntro.trim()}\n`;
    
    msg += `\n📅 *2. MAIN WEDDING INFORMATION*\n`;
    msg += `• Wedding Date: *${weddingDate}* (${weddingDay || 'Day auto-calculated'}, ${weddingYear || ''})\n`;
    if (weddingTime.trim()) msg += `• Wedding Time: ${weddingTime.trim()}\n`;
    msg += `• Venue Name: *${weddingVenue.trim()}*\n`;
    if (weddingAddress.trim()) msg += `• Full Address: ${weddingAddress.trim()}\n`;
    if (weddingMapLink.trim()) msg += `• Google Maps Link: ${weddingMapLink.trim()}\n`;
    
    if (ceremonies.length > 0) {
      msg += `\n🎉 *3. WEDDING CEREMONIES (${ceremonies.length})*\n`;
      ceremonies.forEach((ceremony, idx) => {
        msg += `\n${idx + 1}. *${ceremony.name}*\n`;
        if (ceremony.date) msg += `   • Date: ${ceremony.date}${ceremony.day ? ` (${ceremony.day})` : ''}\n`;
        if (ceremony.time.trim()) msg += `   • Time: ${ceremony.time.trim()}\n`;
        if (ceremony.venue.trim()) msg += `   • Venue: ${ceremony.venue.trim()}\n`;
        if (ceremony.address.trim()) msg += `   • Address: ${ceremony.address.trim()}\n`;
        if (ceremony.mapLink.trim()) msg += `   • Maps Link: ${ceremony.mapLink.trim()}\n`;
      });
    }
    
    if (groomFamily.trim() || brideFamily.trim()) {
      msg += `\n👨‍👩‍👧‍👦 *4. FAMILY DETAILS*\n`;
      if (groomFamily.trim()) msg += `• Groom's Side Family: ${groomFamily.trim()}\n`;
      if (brideFamily.trim()) msg += `• Bride's Side Family: ${brideFamily.trim()}\n`;
    }
    
    if (invitationMessage.trim()) {
      msg += `\n💌 *5. INVITATION MESSAGE / BLESSING*\n"${invitationMessage.trim()}"\n`;
    }
    
    if (musicUrl.trim()) {
      msg += `\n🎵 *6. BACKGROUND MUSIC PREFERENCE*\n• ${musicUrl.trim()}\n`;
    }
    
    msg += `\n------------------------------\n`;
    msg += `Sent via DigiInvitations Website Builder`;

    // Pause music when exiting to WhatsApp
    onPauseMusic?.();

    // Destination WhatsApp number
    const targetPhone = '919456411569';
    const encodedMessage = encodeURIComponent(msg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedMessage}`;

    // Trigger WhatsApp click-to-chat
    const anchor = document.createElement('a');
    anchor.href = whatsappUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#FAF5EA] border-2 border-[#C9A15A]/40 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden text-stone-800 font-sans"
        >
          {/* Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-[#8D2342] to-[#7a103c] text-[#FAF5EA] flex items-center justify-between border-b border-[#C9A15A]/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-[#C9A15A]/40 text-[#C9A15A] shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide text-[#FAF5EA]">
                  Edit Your Invitation
                </h2>
                <p className="text-xs text-[#FAF5EA]/80 font-sans">
                  Enter your details below to personalize this invitation for WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#FAF5EA]/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-5">
            {/* Template Note Banner */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="leading-relaxed">
                <span className="font-semibold">Selected Design:</span> Your details will be sent with this template's link to our designer on WhatsApp (+91 9456411569).
              </p>
            </div>

            {/* Validation Alert */}
            {Object.keys(errors).length > 0 && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Please fill in the required fields:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Section 1: Bride & Groom Details */}
            <div className="border border-[#C9A15A]/30 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('couple')}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-stone-50 to-[#FAF5EA] hover:bg-[#FAF5EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-[#8D2342]" />
                  <span className="font-serif font-bold text-base text-[#8D2342]">
                    1. Bride & Groom Details
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${openSections.couple ? 'rotate-180' : ''}`} />
              </button>

              {openSections.couple && (
                <div className="p-5 space-y-6 border-t border-[#C9A15A]/20">
                  {/* Groom Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-serif tracking-wider font-bold text-[#8D2342] flex items-center gap-1.5">
                      <span>🤵 Groom Information</span>
                      <span className="text-rose-600">*</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={groomName}
                          onChange={(e) => {
                            setGroomName(e.target.value);
                            if (errors.groomName) setErrors(prev => ({ ...prev, groomName: '' }));
                          }}
                          placeholder="e.g. Riyansh Mehra"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.groomName ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 bg-white'} text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none`}
                        />
                        {errors.groomName && <p className="text-[11px] text-rose-500 mt-1">{errors.groomName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Father's Name <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={groomFather}
                          onChange={(e) => setGroomFather(e.target.value)}
                          placeholder="e.g. Mr. Rajesh Mehra"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Mother's Name <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={groomMother}
                          onChange={(e) => setGroomMother(e.target.value)}
                          placeholder="e.g. Mrs. Sunita Mehra"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Short Introduction <span className="text-stone-400 font-normal">(2–4 lines, Optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={groomIntro}
                          onChange={(e) => setGroomIntro(e.target.value)}
                          placeholder="A short note about the groom (profession, passions, etc.)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-stone-100" />

                  {/* Bride Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-serif tracking-wider font-bold text-[#8D2342] flex items-center gap-1.5">
                      <span>👰 Bride Information</span>
                      <span className="text-rose-600">*</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={brideName}
                          onChange={(e) => {
                            setBrideName(e.target.value);
                            if (errors.brideName) setErrors(prev => ({ ...prev, brideName: '' }));
                          }}
                          placeholder="e.g. Priyanshi Sharma"
                          className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.brideName ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 bg-white'} text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none`}
                        />
                        {errors.brideName && <p className="text-[11px] text-rose-500 mt-1">{errors.brideName}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Father's Name <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={brideFather}
                          onChange={(e) => setBrideFather(e.target.value)}
                          placeholder="e.g. Mr. Vikram Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Mother's Name <span className="text-stone-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={brideMother}
                          onChange={(e) => setBrideMother(e.target.value)}
                          placeholder="e.g. Mrs. Neelam Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-stone-600 mb-1">
                          Short Introduction <span className="text-stone-400 font-normal">(2–4 lines, Optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={brideIntro}
                          onChange={(e) => setBrideIntro(e.target.value)}
                          placeholder="A short note about the bride (profession, hobbies, etc.)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Wedding Information */}
            <div className="border border-[#C9A15A]/30 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('wedding')}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-stone-50 to-[#FAF5EA] hover:bg-[#FAF5EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#8D2342]" />
                  <span className="font-serif font-bold text-base text-[#8D2342]">
                    2. Wedding Information
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${openSections.wedding ? 'rotate-180' : ''}`} />
              </button>

              {openSections.wedding && (
                <div className="p-5 space-y-4 border-t border-[#C9A15A]/20">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Date Picker */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Wedding Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={weddingDate}
                        onChange={(e) => handleWeddingDateChange(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.weddingDate ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 bg-white'} text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none`}
                      />
                      {errors.weddingDate && <p className="text-[11px] text-rose-500 mt-1">{errors.weddingDate}</p>}
                    </div>

                    {/* Auto-calculated Day */}
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        Wedding Day <span className="text-[10px] text-emerald-600 font-semibold">(Auto)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={weddingDay || 'Select date'}
                        placeholder="e.g. Saturday"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/80 text-stone-700 text-sm font-medium"
                      />
                    </div>

                    {/* Auto-calculated Year */}
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">
                        Wedding Year <span className="text-[10px] text-emerald-600 font-semibold">(Auto)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={weddingYear || 'Select date'}
                        placeholder="e.g. 2027"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/80 text-stone-700 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Wedding Time */}
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Wedding Time <span className="text-stone-400 font-normal">(e.g. 7:00 PM onwards)</span>
                    </label>
                    <input
                      type="text"
                      value={weddingTime}
                      onChange={(e) => setWeddingTime(e.target.value)}
                      placeholder="e.g. 7:00 PM onwards"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                    />
                  </div>

                  {/* Wedding Venue */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Wedding Venue Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={weddingVenue}
                      onChange={(e) => {
                        setWeddingVenue(e.target.value);
                        if (errors.weddingVenue) setErrors(prev => ({ ...prev, weddingVenue: '' }));
                      }}
                      placeholder="e.g. Grand Palace Banquet"
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.weddingVenue ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 bg-white'} text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none`}
                    />
                    {errors.weddingVenue && <p className="text-[11px] text-rose-500 mt-1">{errors.weddingVenue}</p>}
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Full Venue Address
                    </label>
                    <textarea
                      rows={2}
                      value={weddingAddress}
                      onChange={(e) => setWeddingAddress(e.target.value)}
                      placeholder="e.g. Tonk Road, Near Airport, Jaipur, Rajasthan 302018"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                    />
                  </div>

                  {/* Google Maps Link */}
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Google Maps Link <span className="text-stone-400 font-normal">(Optional)</span></span>
                    </label>
                    <input
                      type="url"
                      value={weddingMapLink}
                      onChange={(e) => setWeddingMapLink(e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Wedding Ceremonies */}
            <div className="border border-[#C9A15A]/30 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('ceremonies')}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-stone-50 to-[#FAF5EA] hover:bg-[#FAF5EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#8D2342]" />
                  <span className="font-serif font-bold text-base text-[#8D2342]">
                    3. Wedding Ceremonies ({ceremonies.length})
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${openSections.ceremonies ? 'rotate-180' : ''}`} />
              </button>

              {openSections.ceremonies && (
                <div className="p-5 space-y-4 border-t border-[#C9A15A]/20">
                  <p className="text-xs text-stone-600">
                    Add all functions and celebrations (Haldi, Mehndi, Sangeet, Wedding, Reception, etc.). You can customize or remove any event.
                  </p>

                  {/* List of ceremonies */}
                  <div className="space-y-4">
                    {ceremonies.map((ceremony, index) => (
                      <div 
                        key={ceremony.id}
                        className="p-4 bg-stone-50/70 border border-stone-200 rounded-2xl space-y-3 relative transition-all"
                      >
                        <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-[#8D2342] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              value={ceremony.name}
                              onChange={(e) => handleCeremonyFieldChange(ceremony.id, 'name', e.target.value)}
                              className="font-serif font-bold text-sm text-[#8D2342] bg-transparent border-b border-dashed border-[#8D2342]/40 focus:border-[#8D2342] focus:outline-none px-1"
                              placeholder="Ceremony Name"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCeremony(ceremony.id)}
                            className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove Ceremony"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Date */}
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Date</label>
                            <input
                              type="date"
                              value={ceremony.date}
                              onChange={(e) => handleCeremonyDateChange(ceremony.id, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:ring-1 focus:ring-[#8D2342] focus:outline-none"
                            />
                          </div>
                          {/* Auto Day */}
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">
                              Day <span className="text-emerald-600 font-semibold text-[10px]">(Auto)</span>
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={ceremony.day || 'Auto'}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-100/70 text-stone-600 text-xs font-medium"
                            />
                          </div>
                          {/* Time */}
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Time</label>
                            <input
                              type="text"
                              value={ceremony.time}
                              onChange={(e) => handleCeremonyFieldChange(ceremony.id, 'time', e.target.value)}
                              placeholder="e.g. 5:00 PM onwards"
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:ring-1 focus:ring-[#8D2342] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Venue */}
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Venue Name</label>
                            <input
                              type="text"
                              value={ceremony.venue}
                              onChange={(e) => handleCeremonyFieldChange(ceremony.id, 'venue', e.target.value)}
                              placeholder="e.g. Royal Courtyard"
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:ring-1 focus:ring-[#8D2342] focus:outline-none"
                            />
                          </div>
                          {/* Full Address */}
                          <div>
                            <label className="block text-[11px] font-medium text-stone-600 mb-1">Full Address</label>
                            <input
                              type="text"
                              value={ceremony.address}
                              onChange={(e) => handleCeremonyFieldChange(ceremony.id, 'address', e.target.value)}
                              placeholder="e.g. Jaipur, Rajasthan"
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:ring-1 focus:ring-[#8D2342] focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Maps Link (Optional) */}
                        <div>
                          <label className="block text-[11px] font-medium text-stone-600 mb-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>Google Maps Link <span className="text-stone-400 font-normal">(Optional)</span></span>
                          </label>
                          <input
                            type="text"
                            value={ceremony.mapLink}
                            onChange={(e) => handleCeremonyFieldChange(ceremony.id, 'mapLink', e.target.value)}
                            placeholder="e.g. https://maps.app.goo.gl/... (Optional)"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs focus:ring-1 focus:ring-[#8D2342] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Ceremony Dropdown + Button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <select
                      value={selectedCeremonyPreset}
                      onChange={(e) => setSelectedCeremonyPreset(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none font-medium flex-1"
                    >
                      {COMMON_CEREMONIES.map(c => (
                        <option key={c} value={c}>
                          {c === 'Custom Event' ? '✏️ Custom Event (Type own name)' : `✨ ${c}`}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => addCeremony()}
                      className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Ceremony</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Family Details (Optional) */}
            <div className="border border-[#C9A15A]/30 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('family')}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-stone-50 to-[#FAF5EA] hover:bg-[#FAF5EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#8D2342]" />
                  <span className="font-serif font-bold text-base text-[#8D2342]">
                    4. Family Details <span className="text-xs text-stone-500 font-normal font-sans">(Optional)</span>
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${openSections.family ? 'rotate-180' : ''}`} />
              </button>

              {openSections.family && (
                <div className="p-5 space-y-4 border-t border-[#C9A15A]/20">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Groom's Side Family Names
                    </label>
                    <textarea
                      rows={2}
                      value={groomFamily}
                      onChange={(e) => setGroomFamily(e.target.value)}
                      placeholder="e.g. Mr. Rajesh Mehra, Mrs. Sunita Mehra, Kapadia & Mehra Families"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Bride's Side Family Names
                    </label>
                    <textarea
                      rows={2}
                      value={brideFamily}
                      onChange={(e) => setBrideFamily(e.target.value)}
                      placeholder="e.g. Mr. Vikram Sharma, Mrs. Neelam Sharma, Namdev & Sharma Families"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Custom Invitation Message (Optional) */}
            <div className="border border-[#C9A15A]/30 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('message')}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-stone-50 to-[#FAF5EA] hover:bg-[#FAF5EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#8D2342]" />
                  <span className="font-serif font-bold text-base text-[#8D2342]">
                    5. Invitation Message <span className="text-xs text-stone-500 font-normal font-sans">(Optional)</span>
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${openSections.message ? 'rotate-180' : ''}`} />
              </button>

              {openSections.message && (
                <div className="p-5 space-y-3 border-t border-[#C9A15A]/20">
                  <p className="text-xs text-stone-500">
                    Add a personalized blessing, poem, or message you want prominently displayed on your wedding card.
                  </p>
                  <textarea
                    rows={3}
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    placeholder="e.g. 'Because meeting two souls requires twice the joy — and you! We request the honor of your gracious presence to bless the couple.'"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Section 6: Background Music (Optional) */}
            <div className="border border-[#C9A15A]/30 rounded-2xl bg-white/70 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('music')}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-stone-50 to-[#FAF5EA] hover:bg-[#FAF5EA] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Music className="w-4 h-4 text-[#8D2342]" />
                  <span className="font-serif font-bold text-base text-[#8D2342]">
                    6. Background Music <span className="text-xs text-stone-500 font-normal font-sans">(Optional)</span>
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${openSections.music ? 'rotate-180' : ''}`} />
              </button>

              {openSections.music && (
                <div className="p-5 space-y-3 border-t border-[#C9A15A]/20">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    YouTube Link or Song Name
                  </label>
                  <input
                    type="text"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or 'Kesariya instrumental'"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-[#8D2342] focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-500">
                    We will configure your preferred instrumental or song as the automatic background audio for your e-card.
                  </p>
                </div>
              )}
            </div>

            {/* WhatsApp Send Action Box */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-serif tracking-wider uppercase text-sm sm:text-base font-bold rounded-2xl shadow-[0_10px_30px_-5px_rgba(5,150,105,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(5,150,105,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 border border-emerald-400/30"
              >
                <Send className="w-5 h-5" />
                <span>Send Details on WhatsApp</span>
              </button>
              <p className="text-center text-[11px] text-stone-500 mt-2.5">
                📲 Clicking will open WhatsApp with your formatted wedding details ready to send to <span className="font-semibold text-stone-700">+91 9456411569</span>. You can review before sending.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
