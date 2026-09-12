export interface TextElement {
  id: string;
  text: string;
  top: number;
  left: number;
  color: string;
  fontFamily: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface EventDetail {
  id: string;
  heading: string;
  detailsColor?: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  imageUrl: string;
  directionUrl?: string;
  caricatureUrl?: string;
  showCaricature?: boolean;
  caricatureSize?: number;
  caricatureBottom?: number;
  caricatureLeft?: number;
  showDescription?: boolean;
  showDate?: boolean;
  showTime?: boolean;
  showVenue?: boolean;
}

export interface ECardSettings {
  remixOf?: string;
  openingBgColor: string;
  embeddedImageUrl: string;
  embeddedImageTop: number;
  embeddedImageLeft: number;
  embeddedImageWidth: number;
  textElements: TextElement[];
  heroImageUrl: string;
  ogImageUrl?: string;
  ganeshaIconUrl?: string;
  musicUrl: string;
  targetDate: string;
  eventDetails: EventDetail[];
  eventsBgColor: string;
  eventsSectionHeadingColor?: string;
  eventsSectionHeadingFont?: string;
  eventsImageHeadingColor?: string;
  eventsHeadingColor?: string; // keeping for backward compatibility
  sectionsBgColor?: string;
  mapHeading?: string;
  mapSubHeading?: string;
  mapAddress?: string;
  showMap?: boolean;
  
  // New section options
  invitationMessageHeading?: string;
  invitationMessageBody?: string;

  familyInviteHeading?: string;
  familyInviteSubHeading1?: string;
  familyInviteSubHeading2?: string;
  familyNames?: string;
  familyInviteBgColor?: string;
  
  contactHeading?: string;
  contactName?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactBgColor?: string;
  
  footerInviteHeading?: string;
  footerInviteNames?: string;
  footerInviteDate?: string;
  footerHashtag?: string;
  footerInviteFamilies?: string;
  footerInviteBgColor?: string;
  
  // New section option for holding page
  paymentPending?: boolean;
  paymentPendingText?: string;
  adminPassword?: string;
  heroTopText?: string;
  heroGroomName?: string;
  heroGroomParents?: string;
  heroMiddleText?: string;
  heroBrideName?: string;
  heroBrideParents?: string;
  customFields?: Record<string, string>;
}

export const defaultSettings: ECardSettings = {
  heroTopText: 'We cordially invite you to witness the beginning of our forever and celebrate the wedding ceremony of',
  heroGroomName: 'Riyansh',
  heroGroomParents: 'S/o Mr. Rajesh & Mrs. Sunita',
  heroMiddleText: 'with',
  heroBrideName: 'Prinyanshi',
  heroBrideParents: 'D/o Mr. Vikram & Mrs. Neelam',
  openingBgColor: '#DCE8D3',
  embeddedImageUrl: 'https://images.unsplash.com/photo-1607198179219-cd8b835fdda3?q=80&w=800&auto=format&fit=crop', // Default fallback ring image
  embeddedImageTop: 50,
  embeddedImageLeft: 50,
  embeddedImageWidth: 25,
  textElements: [
    {
      id: 'default-1',
      text: 'You are invited!',
      top: 20,
      left: 50,
      color: '#831843',
      fontFamily: 'Playfair Display',
      fontSize: 3,
      textAlign: 'center',
    }
  ],
  heroImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
  ogImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
  musicUrl: '',
  targetDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  eventDetails: [
    {
      id: 'event-1',
      heading: 'Haldi Ceremony',
      description: 'A vibrant morning filled with haldi, laughter, music, and beautiful family moments as we begin the wedding celebrations.',
      date: '18 February 2027, Thursday',
      time: '11:00 AM – 1:00 PM',
      venue: 'The Royal Garden, Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
      directionUrl: '',
      showDescription: true,
      showDate: true,
      showTime: true,
      showVenue: true,
      showCaricature: false,
      caricatureSize: 50,
      caricatureBottom: 0,
      caricatureLeft: 50
    },
    {
      id: 'event-2',
      heading: 'Mehndi Ceremony',
      description: 'An evening of intricate mehndi designs, music, dance, and joyful celebrations with family and friends.',
      date: '18 February 2027, Thursday',
      time: '5:00 PM – 8:00 PM',
      venue: 'The Royal Garden, Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
      directionUrl: '',
      showDescription: true,
      showDate: true,
      showTime: true,
      showVenue: true,
      showCaricature: false,
      caricatureSize: 50,
      caricatureBottom: 0,
      caricatureLeft: 50
    },
    {
      id: 'event-3',
      heading: 'Sangeet Ceremony',
      description: 'Get ready for a magical evening of music, dance, performances, and unforgettable memories as both families come together.',
      date: '19 February 2027, Friday',
      time: '7:00 PM onwards',
      venue: 'Grand Palace Banquet, Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
      directionUrl: '',
      showDescription: true,
      showDate: true,
      showTime: true,
      showVenue: true,
      showCaricature: false,
      caricatureSize: 50,
      caricatureBottom: 0,
      caricatureLeft: 50
    },
    {
      id: 'event-4',
      heading: 'Wedding Ceremony',
      description: 'With the blessings of our loved ones, we invite you to witness the beautiful beginning of our forever as we exchange vows and embark on a new journey together.',
      date: '20 February 2027, Saturday',
      time: '7:00 PM onwards',
      venue: 'Grand Palace Banquet, Jaipur',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
      directionUrl: '',
      showDescription: true,
      showDate: true,
      showTime: true,
      showVenue: true,
      showCaricature: false,
      caricatureSize: 50,
      caricatureBottom: 0,
      caricatureLeft: 50
    }
  ],
  eventsBgColor: '#FAF5EA',
  eventsSectionHeadingColor: '#8D2342',
  eventsSectionHeadingFont: 'Great Vibes',
  eventsImageHeadingColor: '#8D2342',
  eventsHeadingColor: '#8D2342',
  sectionsBgColor: '#FAF5EA',
  mapHeading: 'Where We Celebrate',
  mapSubHeading: 'VENUE',
  mapAddress: 'Royal Garden, Jaipur, Rajasthan',
  showMap: true,
  invitationMessageHeading: 'Awaiting Your Noble Presence',
  invitationMessageBody: 'Because meeting two souls requires twice the joy — and you!',
  familyInviteHeading: 'WITH LOVE',
  familyInviteSubHeading1: 'The Families',
  familyInviteSubHeading2: 'AWAITING YOUR GRACIOUS PRESENCE',
  familyNames: 'Mr. Rajesh Mehra\nMrs. Sunita Mehra',
  familyInviteBgColor: '#DCE8D3',
  contactHeading: 'CONTACT DETAILS:',
  contactName: 'RAKESH KAPADIA',
  contactPhone: '+91 9456411569',
  contactAddress: 'Address: 42 Lotus Heights, Bandra West, Mumbai 400050',
  contactBgColor: '',
  footerInviteHeading: 'WITH LOVE',
  footerInviteNames: 'Arjun Mehra & Ananya Sharma',
  footerInviteDate: '22nd November 2026',
  footerHashtag: '#ARJUNWEDSANANYA',
  footerInviteFamilies: '',
  footerInviteBgColor: '#3B291F',
  paymentPending: false,
  paymentPendingText: "'Pranay weds Alisha' wedding Invitation website didn't purchase yet",
};
