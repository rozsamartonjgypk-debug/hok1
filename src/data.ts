export type NewsItem = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  image: string;
  featured?: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  interested: number;
};

export type FaqSection = {
  id: string;
  title: string;
  icon: string;
  items: { q: string; a: string }[];
};

export type QuickLink = {
  label: string;
  url: string;
  icon: string;
};

export const CATEGORIES = ['Ösztöndíj', 'Buli', 'Tanulmány', 'Kollégium', 'Közlemény'];

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Megnyílt a tavaszi ösztöndíjpályázat – leadási határidő április 15.',
    category: 'Ösztöndíj',
    excerpt:
      'A Hallgatói Önkormányzat tavaszi szociális és tanulmányi ösztöndíjpályázata elindult. A Neptunban tölthetitek fel a dokumentumokat, a bírálói javaslatokat a kari bizottság állítja össze.',
    date: '2026.03.28.',
    image: 'https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    featured: true,
  },
  {
    id: 'n2',
    title: 'Gólyabuli 2026 – jegyek már kaphatók a Diákigazolványban',
    category: 'Buli',
    excerpt: 'Idén is megrendezzük a kari gólyabulit a klubban. A jegyek 1500 Ft, Diákigazolvánnyal válthatóak a HÖK irodában.',
    date: '2026.03.25.',
    image: 'https://images.pexels.com/photos/36882728/pexels-photo-36882728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n3',
    title: 'Vizsgaidőszak: meghosszabbított nyitvatartás a könyvtárban',
    category: 'Tanulmány',
    excerpt: 'A egyetemi könyvtár a vizsgaidőszakban 0–24 órában tart nyitva. A csendes olvasóterem foglalható tanulóhelyekkel vár.',
    date: '2026.03.22.',
    image: 'https://images.pexels.com/photos/5538594/pexels-photo-5538594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n4',
    title: 'Kollégiumi felvételi – új eljárásrend 2026 őszétől',
    category: 'Kollégium',
    excerpt: 'A kollégiumi felvételi pontszámítás új szempontokat vesz figyelembe. A jelentkezési határidő június 30.',
    date: '2026.03.18.',
    image: 'https://images.pexels.com/photos/37762503/pexels-photo-37762503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 'n5',
    title: 'Tisztújítás: indul a HÖK delegáltválasztás',
    category: 'Közlemény',
    excerpt: 'A hallgatói delegáltak választása április 5-én zajlik. Jelöltek jelentkezését a választási bizottság várja március 31-ig.',
    date: '2026.03.15.',
    image: 'https://images.pexels.com/photos/6147143/pexels-photo-6147143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Gólyabuli 2026',
    date: '2026-04-04',
    time: '20:00',
    location: 'Kari Klub, egyetem utca 2.',
    interested: 342,
  },
  {
    id: 'e2',
    title: 'Tavaszi Szakmai Nap – Állásbörce',
    date: '2026-04-10',
    time: '10:00',
    location: 'A épület, földszinti aula',
    interested: 128,
  },
  {
    id: 'e3',
    title: 'HÖK Közgyűlés',
    date: '2026-04-16',
    time: '17:30',
    location: 'Nagyelőadó, B épület',
    interested: 64,
  },
  {
    id: 'e4',
    title: 'Vizsgaidőszak kezdete',
    date: '2026-05-05',
    time: '08:00',
    location: 'Egyetem (több helyszín)',
    interested: 501,
  },
  {
    id: 'e5',
    title: 'Diplomaosztó ünnepség',
    date: '2026-06-27',
    time: '11:00',
    location: 'Sportcsarnok, campus',
    interested: 276,
  },
];

export const FAQ: FaqSection[] = [
  {
    id: 'study',
    title: 'Tanulmányi ügyek',
    icon: 'GraduationCap',
    items: [
      {
        q: 'Hogyan igényeljek vizsgaidőszak halasztást?',
        a: 'A halasztási kérelmet a Neptun „Pályázatok" menüpontjában adhatod be a vizsgaidőszak kezdete előtt legkésőbb 5 nappal. A kari tanulmányi hivatal bírálja el, döntés 3 munkanapon belül.',
      },
      {
        q: 'Hol kaphatok igazolást a félévemről?',
        a: 'Aktív féléves és hallgatói jogviszony igazolást a Neptunban generálhatod, vagy személyesen a tanulmányi hivatalban kérheted. Az aktív státusz igazolás díjtalan.',
      },
      {
        q: 'Mikor és hogyan jelentkezem vizsgára?',
        a: 'A vizsgajelentkezés a Neptunban a vizsgaidőszak előtti héten nyílik meg. Egy tárgyból legfeljebb három vizsgaalkalomra jelentkezhetsz a félévben.',
      },
    ],
  },
  {
    id: 'dorm',
    title: 'Kollégium',
    icon: 'Building2',
    items: [
      {
        q: 'Hogyan pályázok kollégiumi férőhelyre?',
        a: 'A felvételi pályázatot a Neptunban adhatod be a megadott határidőig. A pontszámítás a tanulmányi átlag, a szociális helyzet és a távolság alapján történik.',
      },
      {
        q: 'Milyen szabályok vonatkoznak a vendéglátásra?',
        a: 'Vendéget 8–22 óra között fogadhatsz a közös terekben. A szobákban való vendéglátás a szobatárs hozzájárulásával, legfeljebb 24 óráig engedélyezett.',
      },
      {
        q: 'Hogyan jelentkezem karbantartási hibát?',
        a: 'A hibabejelentést a kollégium portáján vagy a karbantartási űrlapon keresztül teheted meg. Sürgős (víz, áram) hibák esetén hívd a portát 0–24 órában.',
      },
    ],
  },
  {
    id: 'money',
    title: 'Ösztztöndíjak és támogatások',
    icon: 'Wallet',
    items: [
      {
        q: 'Milyen ösztöndíjakat kérhetek?',
        a: 'Tanulmányi, szociális, részletes és külföldi ösztöndíjat. A pályázatok a Neptunban érhetők el, a határidők a félév elején és közepén vannak.',
      },
      {
        q: 'Mikor utalják ki az ösztöndíjat?',
        a: 'A tanulmányi ösztöndíjat a félév 8. hetében, a szociális ösztöndíjat a bírálat után legkésőbb a 10. héten utalják a bankszámládra.',
      },
    ],
  },
];

export const QUICK_LINKS: QuickLink[] = [
  { label: 'Neptun', url: 'https://neptun.hu', icon: 'Monitor' },
  { label: 'Kari honlap', url: 'https://www.uni.hu', icon: 'Globe' },
  { label: 'Tally űrlap', url: 'https://tally.so', icon: 'FileText' },
  { label: 'Könyvtár', url: 'https://lib.uni.hu', icon: 'Library' },
  { label: 'EBH portál', url: 'https://ebh.uni.hu', icon: 'KeyRound' },
  { label: 'Étkezde', url: 'https://menu.uni.hu', icon: 'Utensils' },
];

const MONTHS_HU = [
  'jan', 'feb', 'márc', 'ápr', 'máj', 'jún',
  'júl', 'aug', 'szept', 'okt', 'nov', 'dec',
];

export function formatDateParts(iso: string): { month: string; day: string } {
  const d = new Date(iso);
  return {
    month: MONTHS_HU[d.getMonth()].toUpperCase(),
    day: String(d.getDate()),
  };
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  const months = [
    'január', 'február', 'március', 'április', 'május', 'június',
    'július', 'augusztus', 'szeptember', 'október', 'november', 'december',
  ];
  return `${d.getFullYear()}. ${months[d.getMonth()]} ${d.getDate()}.`;
}
