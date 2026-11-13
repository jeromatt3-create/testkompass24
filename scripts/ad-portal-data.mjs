export const INDEXNOW_KEY = 'b4e8f2a9c1d34e5f8a7b6c5d4e3f2a1b';
export const GSC_VERIFICATION = 'Uf2lHW3LjFL_EGpiLy0OnUcqCOCNaCu7-rQJLI5F1lU';

export const OWNER_LEGAL = {
  name: 'Jeronimo Mattmüller',
  street: 'Max-Grothe-Str. 4',
  city: '04324 Leipzig',
  country: 'Deutschland',
  email: 'vd1hz54pr@mozmail.com',
  phone: '015754686543',
};

export const AD_PORTALS = [
  {
    slug: 'alltagsrechner',
    name: 'CleverRechner',
    theme: 'fintech-modern',
    badgeLabel: 'CLEVERRECHNER  •  FINANZ-GUIDE',
    tagline: 'Steuern, Stromkosten & Sparpotenziale sofort berechnen',
    description:
      'Interaktive Alltagsrechner und verständliche Schritt-für-Schritt-Ratgeber zu Steuern, Stromkosten, Förderungen und Sparen in Deutschland.',
    primaryColor: '#047857',
    primaryDark: '#065f46',
    accentColor: '#10b981',
    accentLight: '#ecfdf5',
    bgColor: '#f8fafc',
    surfaceColor: '#ffffff',
    surfaceAltColor: '#f1f5f9',
    textColor: '#0f172a',
    textMutedColor: '#475569',
    borderColor: '#cbd5e1',
    heroGradient: 'linear-gradient(135deg, #022c22 0%, #065f46 58%, #0d9488 100%)',
    cronSchedule: '5 6,17 * * *',
    cronLabel: 'täglich 07:05 & 18:05 Uhr MEZ (06:05 & 17:05 UTC)',
    heroHeadline: 'Zahlen im Griff: Steuern, Energiekosten & Ersparnis sofort durchrechnen',
    heroSubline:
      'Nutze unsere Schnellrechner für Strom, Pendlerpauschale & Sparziele – plus konkrete Rechenbeispiele für Deutschland.',
    categories: {
      'steuern-freibetraege': {
        slug: 'steuern-freibetraege',
        name: 'Steuern & Freibeträge',
        icon: '🧾',
        description: 'Homeoffice, Pendlerpauschale, Werbungskosten & Pauschbeträge einfach berechnet.',
        accent: '#047857',
      },
      'strom-heizkosten': {
        slug: 'strom-heizkosten',
        name: 'Strom & Heizkosten',
        icon: '⚡',
        description: 'Kilowattstunden, Standby-Kosten & Heizwärme exakt in Euro umrechnen.',
        accent: '#0d9488',
      },
      'foerderung-zuschuesse': {
        slug: 'foerderung-zuschuesse',
        name: 'Förderung & Zuschüsse',
        icon: '🏛️',
        description: 'Wohngeld, Kinderzuschlag & staatliche Prämien mit klaren Grenzwerte-Checks.',
        accent: '#059669',
      },
      'sparen-haushalt': {
        slug: 'sparen-haushalt',
        name: 'Sparen & Haushalt',
        icon: '💶',
        description: 'Versteckte Fixkosten, Verträge & Budget-Regeln für mehr Netto im Monat.',
        accent: '#0f766e',
      },
      'geldanlage-rechner': {
        slug: 'geldanlage-rechner',
        name: 'Geldanlage & Zinsen',
        icon: '📈',
        description: 'Zinseszins, Notgroschen, Freibeträge & Sparpläne verständlich durchgerechnet.',
        accent: '#15803d',
      },
    },
    seedArticles: [
      {
        slug: 'homeoffice-pauschale-berechnen-und-absetzen',
        category: 'steuern-freibetraege',
        pubDate: '2026-11-11',
        title: 'Homeoffice-Pauschale richtig berechnen: Bis zu 1.260 € absetzen',
        description:
          'Wie du mit der Tagespauschale auch ohne separates Arbeitszimmer Steuern sparst – mit Rechenbeispiel, Grenzbeträgen und ELSTER-Checkliste.',
        keywords: [
          'Homeoffice Pauschale berechnen',
          'Tagespauschale 1260 Euro',
          'Werbungskosten Arbeitnehmer Pauschbetrag',
          'Steuern sparen Homeoffice',
        ],
        readingTime: 6,
        savingPotential: 'bis zu 1.260 € Werbungskosten/Jahr',
        exampleCalculation: [
          { label: 'Tagessatz', value: '6 € pro Homeoffice-Tag' },
          { label: 'Maximum', value: '210 Tage (= 1.260 €)' },
          { label: 'Pauschbetrag-Hürde', value: 'ab 1.230 € Gesamt-Werbungskosten' },
          { label: 'Typische Steuerersparnis', value: 'ca. 280 – 520 € (je Steuersatz + Zusatzkosten)' },
        ],
        keyTakeaways: [
          'Jeder volle Tag im Homeoffice zählt pauschal 6 Euro – bis maximal 210 Tage pro Jahr.',
          'Funktioniert am Küchentisch oder im Wohnzimmer ohne abgeschlossenes Arbeitszimmer.',
          'Schreibtisch, Stuhl, Monitor & Pendeltage (an Bürotagen) erhöhen den Effekt deutlich.',
        ],
        steps: [
          {
            step: 1,
            title: 'Tatsächliche Homeoffice-Tage aus Kalender zählen',
            summary:
              'Rechne Urlaub, Krankheit und Wochenenden heraus und notiere die exakten Arbeitstage im Homeoffice.',
            tip: 'Eine kurze E-Mail-Übersicht oder Stundennachweise des Arbeitgebers als Beleg aufheben.',
          },
          {
            step: 2,
            title: 'Bürotage sauber trennen',
            summary:
              'Für Tage mit Fahrt ins Büro zählt die Pendlerpauschale (0,30 € bis 20 km, danach 0,38 €/km), nicht die Tagespauschale.',
            tip: 'Im Jahr mit 120 Bürotagen + 110 Homeoffice-Tagen kombinierst du beide Pauschalen legal.',
          },
          {
            step: 3,
            title: 'Werte in Anlage N eintragen',
            summary:
              'Trage die Tage in ELSTER oder deiner Steuersoftware ein und ergänze Arbeitsmittel sowie Kontoführungs- und Bewerbungskosten.',
            tip: 'Erst oberhalb von 1.230 € Gesamt-Werbungskosten sinkt die Steuerlast spürbar.',
          },
        ],
        faqs: [
          {
            question: 'Lohnt sich das Eintragen bei nur 60 Homeoffice-Tagen?',
            answer:
              'Allein 60 Tage ergeben 360 Euro. Kommen dazu aber z. B. 15 km Arbeitsweg an 160 Bürotagen (720 €) plus ein neuer Schreibtischstuhl für 250 €, liegst du bei 1.330 € – also über den 1.230 € Pauschbetrag!',
          },
          {
            question: 'Gilt die Homeoffice-Pauschale auch für Paare am selben Tisch?',
            answer:
              'Ja! Da die Tagespauschale personenbezogen gilt, können beide Partner unabhängig voneinander jeweils bis zu 210 Tage absetzen.',
          },
        ],
        bodyMarkdown: `## So rechnest du deine individuelle Ersparnis aus

Der Arbeitnehmer-Pauschbetrag in Deutschland liegt bei **1.230 Euro**, die automatisch berücksichtigt werden. Mit maximal **210 Homeoffice-Tagen à 6 Euro** erreichst du allein schon **1.260 Euro**. Besonders hoch wird die Rückzahlung, sobald zusätzliche Werbungskosten dazukommen:

- **Beispiel A (Mix-Modell):** 100 Tage Homeoffice (600 €) + 120 Tage Büro mit 22 km Entfernung (818,40 €) + 200 € Arbeitsmittel = **1.618,40 €**. Das liegt 388,40 € über dem Pauschbetrag und bringt bei 35 % Grenzsteuersatz rund **136 € echte Steuererstattung**.
- **Beispiel B (Voll-Homeoffice + Ausstattung):** 210 Tage Homeoffice (1.260 €) + Laptop/Monitor-Anschaffung (750 €) + Telefonanteil (240 €) = **2.250 €**. Gegenüber der Pauschale werden 1.020 € extra anerkannt – rund **320 bis 430 € Rückerstattung**.

Nutze unseren Schnellrechner oben auf der Startseite, um direkt deine eigenen Fahrt- und Homeoffice-Tage zu prüfen.`,
      },
      {
        slug: 'stromverbrauch-geraete-kosten-pro-jahr-berechnen',
        category: 'strom-heizkosten',
        pubDate: '2026-11-12',
        title: 'Was kostet dein Gerät im Jahr? Stromverbrauch in Euro exakt berechnen',
        description:
          'Wie viel verbrauchen Gaming-PC, Fernseher, Kühlschrank oder Heizlüfter wirklich? Mit der einfachen kWh-Formel und praxisnahen Beispieltabellen.',
        keywords: [
          'Stromkosten pro Gerät berechnen',
          'Watt in Euro umrechnen',
          'Was kostet 1000 Watt pro Stunde',
          'Standby Stromkosten Jahr',
        ],
        readingTime: 5,
        savingPotential: 'ca. 80 – 260 € / Jahr einsparen',
        exampleCalculation: [
          { label: 'Grundformel', value: '(Watt ÷ 1.000) × Stunden × Preis (€/kWh)' },
          { label: 'Heizlüfter 2.000 W (2 h/Tag)', value: '4 kWh/Tag ≈ 1,40 €/Tag (bei 35 Cent)' },
          { label: 'Standby-Leiste 25 W (24 h)', value: '219 kWh/Jahr ≈ 76,65 €/Jahr' },
          { label: 'LED-Lampe 8 W (4 h/Tag)', value: '11,7 kWh/Jahr ≈ 4,09 €/Jahr' },
        ],
        keyTakeaways: [
          'Die genaue Jahresformel lautet: (Watt ÷ 1.000) × Laufzeit in Stunden × Strompreis in Euro.',
          'Heiz- und Kühlgeräte verursachen im Haushalt oft mehr Kosten als Licht und Kleingeräte zusammen.',
          'Schaltbare Steckerleisten senken unnötigen Dauer-Standby um 50 bis 100 Euro im Jahr.',
        ],
        steps: [
          {
            step: 1,
            title: 'Leistung in Watt auf dem Typenschild ablesen',
            summary:
              'Schaue auf die Rückseite des Geräts oder ins Handbuch nach der Leistungsaufnahme (W) oder dem Jahreswert (kWh/annum).',
            tip: 'Bei PCs, TVs und Kühlschränken schwankt der Wert – hier hilft eine günstige Messsteckdose.',
          },
          {
            step: 2,
            title: 'In Kilowattstunden (kWh) umrechnen',
            summary:
              'Teile die Wattzahl durch 1.000 und multipliziere sie mit der täglichen Nutzungsdauer mal 365 Tage.',
            tip: '1.000 Watt über eine Stunde Laufzeit entsprechen exakt 1,0 kWh.',
          },
          {
            step: 3,
            title: 'Mit deinem Arbeitspreis multiplizieren',
            summary:
              'Rechne die Jahres-kWh mal deinen aktuellen Arbeitspreis laut letzter Stromrechnung (z. B. 0,34 € oder 0,38 €).',
            tip: 'Im CleverRechner-Widget auf der Startseite erledigst du das mit zwei Schiebereglern in 5 Sekunden.',
          },
        ],
        faqs: [
          {
            question: 'Stimmt die Typenschild-Wattzahl bei jedem Gerät?',
            answer:
              'Meist steht dort nur die maximale Spitzenleistung (z. B. beim Aufheizen einer Kaffeemaschine oder bei einem 600-W-PC-Netzteil). Im Durchschnitt zieht ein Office-Laptop oft nur 25–45 Watt statt maximalen 65–100 Watt.',
          },
          {
            question: 'Welche Geräte sind die teuersten Stromfresser pro Stunde?',
            answer:
              'Alles, was stark heizt oder kühlt: elektrische Heizlüfter (2.000 W ≈ 70 Cent/h), Durchlauferhitzer (18–24 kW), Wäschetrockner ohne Wärmepumpe sowie dauerhaft laufende alte Tiefkühltruhen.',
          },
        ],
        bodyMarkdown: `## Die 10-Sekunden-Faustregel für deinen Strompreis

Bei einem typischen Strompreis von rund **35 Cent pro Kilowattstunde** kostet ein Gerät, das **100 Watt** rund um die Uhr (24 Stunden am Tag, 365 Tage) zieht, fast **306 Euro im Jahr**! Merkst du dir einfach „**100 Watt Dauerlast ≈ 300 € im Jahr**“ (bei 10 Watt ≈ 30 €, bei 1.000 Watt für 1 Stunde ≈ 35 Cent), erkennst du Energiefresser im Alltag sofort.

## Typische Jahreskosten im Beispiel-Check (bei 0,35 €/kWh)

- **Alter Plasma-TV (220 W, 4 h/Tag):** ~321 kWh → **ca. 112 € / Jahr**
- **Moderner LED-TV (75 W, 4 h/Tag):** ~109 kWh → **ca. 38 € / Jahr**
- **Gaming-PC unter Last + Monitor (400 W, 3 h/Tag):** ~438 kWh → **ca. 153 € / Jahr**
- **Dauer-Standby in Wohnzimmer & Büro (30 W, 24 h):** ~263 kWh → **ca. 92 € / Jahr**`,
      },
      {
        slug: 'wohngeld-einkommensgrenzen-und-rechenweg-verstehen',
        category: 'foerderung-zuschuesse',
        pubDate: '2026-11-13',
        title: 'Wohngeld berechnen: Wann sich der Antrag trotz Vollzeitjob lohnt',
        description:
          'Welche Einkommensabzüge das Amt vornimmt, wie die örtliche Mietstufe wirkt und warum auch Durchschnittsverdiener oft Anspruch haben.',
        keywords: [
          'Wohngeld berechnen Anleitung',
          'Wohngeld Einkommensgrenze Brutto Netto',
          'Mietstufe herausfinden',
          'Wohngeldantrag stellen',
        ],
        readingTime: 6,
        savingPotential: 'oft 150 – 450 € Zuschuss/Monat',
        exampleCalculation: [
          { label: 'Pauschalabzug Steuern/SV', value: 'bis zu 30 % vom Brutto' },
          { label: 'Werbungskosten-Abzug', value: 'mind. 1.230 €/Jahr (102,50 €/Monat)' },
          { label: 'Kindergeld-Anrechnung', value: '0 € (wird nicht als Einkommen gezählt)' },
          { label: 'Antragsfrist', value: 'gilt ab Eingangsmonat (nicht rückwirkend)' },
        ],
        keyTakeaways: [
          'Entscheidend ist nicht dein Bruttogehalt allein, sondern das bereinigte Einkommen nach Pauschalabzügen.',
          'Kinder erhöhen die Einkommensgrenze spürbar – Kindergeld wird nicht als Einkommen angerechnet.',
          'Ein kurzer formloser Antrag noch vor Monatsende sichert den gesamten Monat.',
        ],
        steps: [
          {
            step: 1,
            title: 'Mietstufe deiner Stadt prüfen',
            summary:
              'Schaue in der offiziellen Wohngeld-Mietstufen-Tabelle nach, ob dein Wohnort in Mietstufe I bis VII liegt.',
            tip: 'Je höher die Mietstufe, desto höher fällt sowohl die berücksichtigte Höchstmiete als auch die zulässige Einkommensgrenze aus.',
          },
          {
            step: 2,
            title: 'Bruttoeinkommen um gesetzliche Pauschalen bereinigen',
            summary:
              'Ziehe pro Pflichtabgabe (Lohnsteuer, Kranken-/Pflegeversicherung, Rentenversicherung) je 10 % – also bis zu 30 % – sowie Werbungskosten ab.',
            tip: 'Auch Unterhaltszahlungen oder Schwerbehinderten-Freibeträge senken das maßgebliche Einkommen weiter.',
          },
          {
            step: 3,
            title: 'Antrag vor Monatsende absenden',
            summary:
              'Reiche das Formular (bzw. einen kurzen Vorab-Antrag per Einwurf oder Portal) noch im laufenden Monat bei deiner Stadt- oder Kreisverwaltung ein.',
            tip: 'Bewilligt wird in der Regel direkt für volle 12 Monate am Stück.',
          },
        ],
        faqs: [
          {
            question: 'Zählt angespartes Vermögen gegen das Wohngeld?',
            answer:
              'Es gilt eine großzügige Vermögensfreigrenze (erhebliches Vermögen liegt in der Regel erst ab 60.000 Euro für das erste Haushaltsmitglied plus 30.000 Euro für jede weitere Person vor). Ein normaler Notgroschen ist also unschädlich.',
          },
          {
            question: 'Gibt es Wohngeld auch für Rentner und Eigentümer?',
            answer:
              'Ja! Wer in der eigenen Wohnung oder dem eigenen Haus lebt, beantragt den sogenannten Lastenzuschuss statt des Mietzuschusses. Auch viele Rentnerinnen und Rentner haben Anspruch.',
          },
        ],
        bodyMarkdown: `## Warum Brutto-Schätzungen oft täuschen

Viele Berufstätige blicken auf eine Brutto-Einkommenstabelle und winken ab. Dabei rechnet das Wohngeldamt mit dem deutlich niedrigeren **wohngeldrechtlichen Jahreseinkommen**:

1. Vom Bruttolohn wird die Werbungskosten-Pauschale (1.230 € jährlich) abgezogen.
2. Zahlt du Einkommensteuer, Kranken-/Pflegeversicherung und Rentenbeiträge, sinkt der Betrag um pauschal **30 %** (je 10 % pro gezahlter Abgabenart).
3. Kindergeld fließt **nicht** in die Berechnung ein.

Dadurch liegen viele Familien mit ein bis zwei Kindern trotz normalem Vollzeitlohn in teureren Städten überraschend deutlich im anspruchsberechtigten Bereich.`,
      },
    ],
    topicQueue: [
      {
        id: 'notgroschen-wie-hoch-tagesgeld-rechner',
        category: 'geldanlage-rechner',
        keyword: 'Notgroschen berechnen: Wie viele Monatsgehälter sinnvoll sind & Zinsvergleich',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'abos-fixkosten-sparen-monatlich',
        category: 'sparen-haushalt',
        keyword: 'Haushaltsbuch-Check: Mit diesen 6 Fixkosten-Checks sofort 100 Euro im Monat sparen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'pendlerpauschale-berechnen-ab-21-kilometer',
        category: 'steuern-freibetraege',
        keyword: 'Pendlerpauschale richtig berechnen: 30 und 38 Cent ab dem 21. Kilometer',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'standby-stromverbrauch-im-haushalt-berechnen',
        category: 'strom-heizkosten',
        keyword: 'Standby-Kosten im Haushalt berechnen: TV, Router & PC im Jahrescheck',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'freistellungsauftrag-1000-euro-richtig-aufteilen',
        category: 'geldanlage-rechner',
        keyword: 'Freistellungsauftrag richtig aufteilen: 1.000 Euro Sparerpauschbetrag voll nutzen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'kinderzuschlag-einkommensgrenze-berechnen',
        category: 'foerderung-zuschuesse',
        keyword: 'Kinderzuschlag bis 292 Euro pro Kind berechnen & mit Wohngeld kombinieren',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'handwerkerkosten-20-prozent-steuerbonus-berechnen',
        category: 'steuern-freibetraege',
        keyword: 'Handwerkerrechnung absetzen: 20 % direkten Steuerbonus auf Arbeitslohn berechnen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'heizkosten-sparen-pro-grad-celsius-rechner',
        category: 'strom-heizkosten',
        keyword: 'Heizung 1 Grad herunterdrehen: Wie viel Prozent Heizkosten du wirklich sparst',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: '50-30-20-budgetregel-monatsnetto-aufteilen',
        category: 'sparen-haushalt',
        keyword: 'Die 50-30-20-Regel im Alltag: Monatsbudget sinnvoll zwischen Fixkosten und Sparen teilen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'zinseszins-bei-100-euro-sparplan-berechnen',
        category: 'geldanlage-rechner',
        keyword: 'Zinseszinseffekt konkret berechnet: Was aus 50 oder 100 Euro monatlich nach 10 Jahren wird',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'nebenkostenabrechnung-pruefen-quadratmeter-check',
        category: 'sparen-haushalt',
        keyword: 'Nebenkostenabrechnung nachrechnen: Umlagefähige Posten vs. versteckte Vermieterkosten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'steuerklasse-3-5-oder-4-4-faktor-vergleich',
        category: 'steuern-freibetraege',
        keyword: 'Steuerklassen-Vergleich für Ehepaare: Wann Faktorverfahren Nachzahlungen verhindert',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'e-auto-wallbox-ladekosten-gegen-benzin-berechnen',
        category: 'strom-heizkosten',
        keyword: 'E-Auto Stromkosten pro 100 km vs. Benzin berechnen: Lohnt sich das Laden zu Hause?',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'elterngeld-bemessungszeitraum-optimieren',
        category: 'foerderung-zuschuesse',
        keyword: 'Elterngeld richtig berechnen: Basis-Elterngeld, ElterngeldPlus & Geschwisterbonus',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'kirchensteuer-ersparnis-pro-monat-berechnen',
        category: 'steuern-freibetraege',
        keyword: 'Wie viel Kirchensteuer zahlst du? 8 % oder 9 % der Einkommensteuer erklärt',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'kfz-versicherung-jahresbeitrag-druecken',
        category: 'sparen-haushalt',
        keyword: 'Autoversicherung durchrechnen: Wie jährliche Zahlweise und Kilometerklasse Geld sparen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'inflation-kaufkraftverlust-auf-girokonto-berechnen',
        category: 'geldanlage-rechner',
        keyword: 'Was kostet liegen gelassenes Geld auf dem Girokonto bei 2–3 % Inflation pro Jahr?',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'stromtarif-wechsel-bonus-oder-arbeitspreis-rechnen',
        category: 'strom-heizkosten',
        keyword: 'Stromvertrag nachrechnen: Wann sich Neukundenbonus lohnt und wann ein niedriger kWh-Preis',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'arbeitsmittel-800-euro-grenze-sofort-absetzen',
        category: 'steuern-freibetraege',
        keyword: '952-Euro-Grenze (800 € netto): Laptop, Smartphone und Bürostuhl sofort komplett absetzen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'vermoegenswirksame-leistungen-arbeitgeber-bonus',
        category: 'foerderung-zuschuesse',
        keyword: 'Vermögenswirksame Leistungen (VL) & Arbeitnehmersparzulage einfach mitnehmen',
        intent: 'informational',
        status: 'pending',
      },
    ],
  },

  {
    slug: 'feierabendkueche',
    name: 'FeierabendKüche',
    theme: 'editorial-warm',
    badgeLabel: 'FEIERABENDKÜCHE  •  REZEPT',
    tagline: 'Schnelle, günstige Feierabend-Rezepte unter 25 Minuten',
    description:
      'Einfache Alltagsrezepte für Berufstätige und Familien: One-Pot-Pasta, schnelle Pfannengerichte, Airfryer-Rezepte und Meal-Prep mit Portions-Umrechner.',
    primaryColor: '#c2410c',
    primaryDark: '#9a3412',
    accentColor: '#3f6212',
    accentLight: '#f7fee7',
    bgColor: '#fffbf5',
    surfaceColor: '#ffffff',
    surfaceAltColor: '#fef3e7',
    textColor: '#1c1917',
    textMutedColor: '#57534e',
    borderColor: '#fed7aa',
    heroGradient: 'linear-gradient(135deg, #431407 0%, #9a3412 58%, #3f6212 100%)',
    cronSchedule: '10 6,17 * * *',
    cronLabel: 'täglich 07:10 & 18:10 Uhr MEZ (06:10 & 17:10 UTC)',
    heroHeadline: 'Richtig gut kochen nach der Arbeit – in höchstens 25 Minuten auf dem Tisch',
    heroSubline:
      'Ehrliche Feierabend-Rezepte mit wenig Abwasch, bezahlbaren Zutaten aus jedem Supermarkt und automatischem Portions-Umrechner.',
    categories: {
      'unter-20-minuten': {
        slug: 'unter-20-minuten',
        name: 'Unter 20 Minuten',
        icon: '⏱️',
        description: 'Blitzrezepte für Tage, an denen es nach Feierabend richtig schnell gehen muss.',
        accent: '#c2410c',
      },
      'one-pot-pfanne': {
        slug: 'one-pot-pfanne',
        name: 'One-Pot & Pfanne',
        icon: '🍳',
        description: 'Alles aus einem Topf oder einer Pfanne – maximaler Geschmack bei minimalem Abwasch.',
        accent: '#ea580c',
      },
      'ofen-airfryer': {
        slug: 'ofen-airfryer',
        name: 'Ofen & Airfryer',
        icon: '🥐',
        description: 'Blechgerichte & knusprige Heißluftfritteusen-Ideen ohne Danebenstehen.',
        accent: '#d97706',
      },
      'meal-prep-buero': {
        slug: 'meal-prep-buero',
        name: 'Meal-Prep & Büro',
        icon: '🥗',
        description: 'Vorbereitete Lunchboxen und Resteverwertung, die kalt und aufgewärmt schmecken.',
        accent: '#3f6212',
      },
      'guenstig-kochen': {
        slug: 'guenstig-kochen',
        name: 'Günstig & Satt',
        icon: '🥔',
        description: 'Herzhafte Sattmacher aus Vorratszutaten für unter 3 Euro pro Portion.',
        accent: '#b45309',
      },
    },
    seedArticles: [
      {
        slug: 'cremige-one-pot-tomaten-spinat-pasta',
        category: 'unter-20-minuten',
        pubDate: '2026-11-11',
        title: 'Cremige One-Pot-Tomaten-Spinat-Pasta in 18 Minuten (nur 1 Topf)',
        description:
          'Nudeln, aromatische Kirschtomaten, Knoblauch und frischer Spinat kochen zusammen in einem Topf – ganz ohne Abgießen und mit minimalem Abwasch.',
        keywords: [
          'One Pot Pasta Tomate Spinat',
          'schnelles Abendessen 20 Minuten',
          'Nudelgericht ein Topf',
          'günstiges Feierabendessen',
        ],
        readingTime: 5,
        servings: 2,
        prepMinutes: 18,
        calories: 'ca. 540 kcal',
        costPerServing: 'ca. 2,15 €',
        ingredients: [
          { amount: 250, unit: 'g', item: 'Penne oder Spaghetti' },
          { amount: 400, unit: 'g', item: 'passierte Tomaten oder Stückige aus der Dose' },
          { amount: 350, unit: 'ml', item: 'Gemüsebrühe (heiß)' },
          { amount: 150, unit: 'g', item: 'frischer Babyspinat' },
          { amount: 75, unit: 'g', item: 'Frischkäse (oder pflanzliche Alternative)' },
          { amount: 2, unit: 'Zehen', item: 'Knoblauch, fein gehackt' },
          { amount: 1, unit: 'EL', item: 'Olivenöl & 1 TL italienische Kräuter' },
        ],
        keyTakeaways: [
          'Die Nudeln garen direkt in der Tomaten-Brühe – die Stärke macht die Sauce ohne Mehlschwitze samtig.',
          'Fertig in rund 18 Minuten und du musst hinterher nur ein Schneidebrett und einen Topf spülen.',
          'Mit etwas Frischkäse am Ende gerührt entsteht in Sekunden eine cremige Konsistenz.',
        ],
        steps: [
          {
            step: 1,
            title: 'Knoblauch und Gewürze kurz anschwitzen',
            summary:
              'Erhitze das Olivenöl in einem großen Topf bei mittlerer Hitze und dünste den gehackten Knoblauch mit italienischen Kräutern etwa 45 Sekunden duftend an.',
            tip: 'Nicht zu heiß braten, sonst wird Knoblauch bitter.',
          },
          {
            step: 2,
            title: 'Nudeln, Tomaten und Brühe zusammen aufkochen',
            summary:
              'Gib ungekochte Pasta, passierte Tomaten und heiße Gemüsebrühe in den Topf. Rühre gut um und lasse alles offen ca. 10–12 Minuten sprudelnd simmern.',
            tip: 'Alle 2 Minuten umrühren, damit die Nudeln am Topfboden nicht anhängen.',
          },
          {
            step: 3,
            title: 'Spinat und Frischkäse unterheben',
            summary:
              'Nimm den Topf vom Herd, sobald die Pasta bissfest ist, und rühre Babyspinat sowie Frischkäse ein, bis der Spinat zusammengefallen ist.',
            tip: 'Mit Salz, Pfeffer und optional etwas geriebenem Hartkäse abrunden.',
          },
        ],
        faqs: [
          {
            question: 'Welche Nudelsorte funktioniert bei One-Pot-Pasta am besten?',
            answer:
              'Kurze Sorten wie Penne, Fusilli oder Farfalle mit einer regulären Kochzeit von 9–11 Minuten saugen die Sauce besonders gleichmäßig auf. Bei sehr dünnen Spaghetti sollte man etwas häufiger umrühren.',
          },
          {
            question: 'Kann ich das Gericht für den nächsten Tag im Büro aufheben?',
            answer:
              'Ja! Da Nudeln über Nacht noch Flüssigkeit nachziehen, gib beim Aufwärmen in Topf oder Mikrowelle einfach 2–3 Esslöffel Wasser oder Milch dazu, dann wird die Sauce wieder sofort cremig.',
          },
        ],
        bodyMarkdown: `## Warum One-Pot-Pasta nach Feierabend unschlagbar ist

An langen Arbeitstagen scheitert das Selbstkochen meist nicht an der Zeit, sondern am Berg schmutziger Töpfe danach. Bei der One-Pot-Technik sparst du dir sowohl den zweiten Topf als auch das Nudelsieb – und gewinnst obendrein besseren Geschmack, weil die abgegebene Nudelsärke die Tomatensauce von selbst bindet.

## Variations-Ideen aus dem Vorratsschrank

- **Mehr Eiweiß:** Eine Dose abgespülte weiße Bohnen oder Kichererbsen einfach in den letzten 4 Minuten mitköcheln lassen.
- **Tiefkühl-Alternative:** Statt frischem Babyspinat funktionieren auch 150 g aufgetaute Tiefkühl-Erbsen hervorragend.`,
      },
      {
        slug: 'schnelle-lachs-kartoffel-pfanne-mit-senf-dill-joghurt',
        category: 'one-pot-pfanne',
        pubDate: '2026-11-12',
        title: 'Knusprige Kartoffel-Fisch-Pfanne mit schneller Zitronen-Senf-Sauce (22 Min.)',
        description:
          'Mit Vorgekochtem oder fein gewürfelten Kartoffeln zauberst du ein vollwertiges Pfannengericht samt frischem Kräuter-Dip in gut 20 Minuten.',
        keywords: [
          'schnelle Kartoffel Pfanne',
          'Fisch Pfannengericht 20 Minuten',
          'Feierabend Pfannengericht',
          'einfaches Abendessen mit Kartoffeln',
        ],
        readingTime: 5,
        servings: 2,
        prepMinutes: 22,
        calories: 'ca. 590 kcal',
        costPerServing: 'ca. 3,40 €',
        ingredients: [
          { amount: 450, unit: 'g', item: 'vorwiegend festkochende Kartoffeln (klein gewürfelt)' },
          { amount: 250, unit: 'g', item: 'Lachs- oder Seelachsfilet (ohne Gräten)' },
          { amount: 200, unit: 'g', item: 'grüne Bohnen oder Zucchini in Stücken' },
          { amount: 150, unit: 'g', item: 'Naturjoghurt oder Schmand' },
          { amount: 1, unit: 'EL', item: 'mittelscharfer Senf' },
          { amount: 2, unit: 'EL', item: 'Rapsöl zum Braten & etwas Zitronensaft' },
        ],
        keyTakeaways: [
          'Kleine 1-cm-Kartoffelwürfel werden direkt roh in der Pfanne in 12 Minuten gar und kross.',
          'Der Fisch gart die letzten 5 Minuten einfach auf dem heißen Gemüse mit.',
          'Aus Joghurt, Senf und Zitrone rührst du in 60 Sekunden eine frische Sauce ohne Sahne.',
        ],
        steps: [
          {
            step: 1,
            title: 'Kartoffelwürfel bei mittlerer Hitze anbraten',
            summary:
              'Schneide die Kartoffeln in ca. 1 cm große Würfel und brate sie in Rapsöl 10 Minuten lang goldgelb an (die ersten 5 Minuten mit Deckel, damit sie innen weich werden).',
            tip: 'Erst salzen, wenn die Würfel bereits etwas Kruste haben – so bleiben sie knuspriger.',
          },
          {
            step: 2,
            title: 'Gemüse und gewürfelten Fisch zugeben',
            summary:
              'Streue die gewürfelte Zucchini oder vorgegarte Bohnen in die Pfanne, lege das gesalzene Fischfilet in mundgerechten Stücken obenauf und gare alles 5 Minuten bei schwacher Hitze abgedeckt fertig.',
            tip: 'Nicht zu stark rühren, damit der zarte Fisch nicht zerfällt.',
          },
          {
            step: 3,
            title: 'Senf-Zitronen-Dip anrühren & servieren',
            summary:
              'Verrühre Joghurt, Senf, einen Spritzer Zitronensaft, Salz und Pfeffer und gib je einen Klecks direkt auf die heißen Portionen.',
            tip: 'Frisch gehackter Dill oder Schnittlauch passt perfekt dazu.',
          },
        ],
        faqs: [
          {
            question: 'Geht das Rezept auch vegetarisch?',
            answer:
              'Sehr gut sogar: Ersetze den Fisch einfach durch 200 g gewürfelten Halloumi-Grillkäse oder Räuchertofu, den du in Schritt 2 kurz knusprig mitbrätst.',
          },
          {
            question: 'Werden rohe Kartoffelwürfel wirklich in 10–15 Minuten durch?',
            answer:
              'Ja, entscheidend ist die kleine Würfelgröße (max. 1 bis 1,5 cm) und ein geschlossener Deckel in den ersten 5 Minuten. Alternativ funktionieren natürlich auch übrig gebliebene Pellkartoffeln vom Vortag.',
          },
        ],
        bodyMarkdown: `## Der Trick mit der Größe: Rohe Bratkartoffeln ohne Vorkochen

Viele Rezepte verlangen, dass man Kartoffeln zuerst zwanzig Minuten kocht, abgießt und ausdampfen lässt – für ein schnelles Feierabendessen viel zu umständlich. Schneidest du geschälte oder gründlich gewaschene junge Kartoffeln dagegen in kleine **1-Zentimeter-Würfel**, halbiert sich die Garzeit dramatisch. Mit fünf Minuten unter dem Deckel wird die Stärke im Inneren weich, anschließend brät die offene Pfanne die Kanten knusprig.`,
      },
      {
        slug: 'knuspriges-haehnchen-gemuese-blech-aus-dem-airfryer',
        category: 'ofen-airfryer',
        pubDate: '2026-11-13',
        title: 'Würziges Hähnchen-Paprika-Blech aus Backofen oder Airfryer in 20 Min.',
        description:
          'Alles gleichzeitig würzen, in den Korb oder aufs Blech schieben und während des Garens die Küche genießen – proteinreich, bunt und extrem einfach.',
        keywords: [
          'Airfryer Abendessen schnell',
          'Hähnchen Gemüse Pfanne Backofen',
          'einfaches Blechgericht Feierabend',
          'Heißluftfritteuse Rezept Hähnchen Paprika',
        ],
        readingTime: 5,
        servings: 2,
        prepMinutes: 20,
        calories: 'ca. 480 kcal',
        costPerServing: 'ca. 3,10 €',
        ingredients: [
          { amount: 300, unit: 'g', item: 'Hähnchenbrustfilet in Streifen' },
          { amount: 2, unit: 'Stück', item: 'rote und gelbe Paprika in Stücken' },
          { amount: 1, unit: 'Stück', item: 'rote Zwiebel in Spalten' },
          { amount: 200, unit: 'g', item: 'Kirschtomaten oder Champignons' },
          { amount: 2, unit: 'EL', item: 'Olivenöl + 1 TL Paprika edelsüß + 0,5 TL Kreuzkümmel' },
          { amount: 150, unit: 'g', item: 'Fladenbrot oder gekochter Reis als Beilage' },
        ],
        keyTakeaways: [
          'Kein Danebenstehen am Herd: 5 Minuten schneiden, 14 Minuten garen lassen.',
          'Durch kleine Mengen Öl mit Paprikapulver bleibt Fleisch im Airfryer innen schön saftig.',
          'Funktioniert wahlweise bei 190 °C in der Heißluftfritteuse oder bei 210 °C Umluft im Ofen.',
        ],
        steps: [
          {
            step: 1,
            title: 'Fleisch und Gemüse direkt in einer Schüssel marinieren',
            summary:
              'Schneide Hähnchen, Paprika und Zwiebel in gleichmäßige mundgerechte Stücke und vermenge alles gründlich mit Olivenöl, Paprika edelsüß, Kreuzkümmel, Salz und Pfeffer.',
            tip: 'Wenn alles gleich groß geschnitten ist, gart es punktgenau gleichzeitig.',
          },
          {
            step: 2,
            title: 'In Airfryer oder auf dem Blech knusprig garen',
            summary:
              'Gare die Mischung bei 190 °C im Airfryer ca. 13–15 Minuten (einmal nach der Hälfte schütteln) – im vorgeheizten Backofen bei 210 °C Umluft ca. 18 Minuten.',
            tip: 'Den Korb bzw. das Blech nicht überfüllen, damit das Gemüse röstet statt dünstet.',
          },
          {
            step: 3,
            title: 'Mit warmem Fladenbrot oder Kräuterquark anrichten',
            summary:
              'Lege Fladenbrot die letzten 2 Minuten kurz mit auf die Restwärme und serviere alles zusammen.',
            tip: 'Reste schmecken am nächsten Tag hervorragend kalt im Wrap für die Mittagspause.',
          },
        ],
        faqs: [
          {
            question: 'Wird Hähnchenbrust im Airfryer oder Backofen nicht trocken?',
            answer:
              'Nur wenn man ganze Filets zu lange bei 200 °C brät. In 3-cm-Würfel geschnitten und mit 2 Esslöffeln Öl ummantelt, braucht das Fleisch nur ca. 13–14 Minuten und bleibt innen saftig.',
          },
          {
            question: 'Kann ich das Gericht vegan mit Kichererbsen zubereiten?',
            answer:
              'Auf jeden Fall! Nimm statt Fleisch einfach eine abgetropfte Dose Kichererbsen (ca. 240 g Abtropfgewicht) – die werden durch dieselbe Paprika-Kreuzkümmel-Marinade herrlich kross.',
          },
        ],
        bodyMarkdown: `## Maximale Entspannung beim Kochen

Der große Vorteil von Blech- und Airfryer-Gerichten liegt darin, dass die eigentliche Garzeit dir selbst gehört. Sobald Gemüse und Protein mariniert im heißen Luftstrom liegen, kannst du in Ruhe Tisch decken, kurz durchschnaufen oder Post öffnen – nichts kocht über und nichts brennt beim Telefonat an.`,
      },
    ],
    topicQueue: [
      {
        id: 'guenstige-kichererbsen-curry-pfanne-15-minuten',
        category: 'guenstig-kochen',
        keyword: 'Schnelles Kichererbsen-Kokos-Curry in 15 Minuten für unter 2 Euro pro Portion',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'couscous-salat-mit-feta-und-gurke-meal-prep',
        category: 'meal-prep-buero',
        keyword: 'Bunter Couscous-Feta-Salat in 10 Minuten: Perfektes Meal-Prep für das Büro',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'schupfnudel-gemuese-pfanne-mit-rahm-senf-sauce',
        category: 'unter-20-minuten',
        keyword: 'Schnelle Schupfnudel-Gemüse-Pfanne in 15 Minuten aus wenigen Zutaten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'knusprige-ofenkartoffeln-mit-kraeuterquark-airfryer',
        category: 'ofen-airfryer',
        keyword: 'Extra knusprige Rosmarin-Kartoffelspalten mit Quark aus dem Airfryer oder Ofen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'tortellini-brokkoli-pfanne-cremig-ein-topf',
        category: 'one-pot-pfanne',
        keyword: 'Cremige Tortellini-Brokkoli-Pfanne in 15 Minuten – ohne Vorkochen im Topf',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'linsensuppe-aus-roten-linsen-in-20-minuten',
        category: 'guenstig-kochen',
        keyword: 'Herzhafte rote Linsensuppe mit Karotte & Zitrone: Günstiger Sattmacher in 20 Min.',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'reispfanne-mit-ei-und-erbsen-resteverwertung',
        category: 'unter-20-minuten',
        keyword: 'Gebratener Reis mit Ei & Gemüse in 12 Minuten: Die beste Resteverwertung',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'wraps-mit-crispy-tofu-und-joghurt-sauce',
        category: 'meal-prep-buero',
        keyword: 'Saftige Lunch-Wraps zum Vorbereiten: Durchweichen verhindern mit einfachem Schicht-Trick',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'flammkuchen-vom-blech-mit-schmand-und-lauchzwiebeln',
        category: 'ofen-airfryer',
        keyword: 'Knuspriger Feierabend-Flammkuchen in 20 Minuten – klassisch oder vegetarisch',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'gnocchi-pfanne-mit-kirschtomaten-und-mozzarella',
        category: 'one-pot-pfanne',
        keyword: 'Goldbraune Gnocchi-Pfanne mit Kirschtomaten & Mozzarella in 15 Minuten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'kartoffelsuppe-schnell-mit-wuerstchen-oder-rauchertofu',
        category: 'guenstig-kochen',
        keyword: 'Sämige Kartoffelsuppe für kalte Abende – günstig vorkochen für 2 Tage',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'overnight-oats-grundrezept-5-variationen-buero',
        category: 'meal-prep-buero',
        keyword: 'Overnight Oats Grundrezept in 3 Minuten abends anrühren für das Büro-Frühstück',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'aglio-e-olio-spaghetti-trick-fuer-cremige-emulsion',
        category: 'unter-20-minuten',
        keyword: 'Spaghetti Aglio e Olio richtig kochen: So entsteht mit Nudelwasser eine perfekte Bindung',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'lachs-aus-dem-airfryer-mit-honig-senf-glasur',
        category: 'ofen-airfryer',
        keyword: 'Saftiges Lachsfilet mit Honig-Senf-Kruste aus der Heißluftfritteuse in 10 Minuten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'shakshuka-aus-einer-pfanne-mit-feta-und-ei',
        category: 'one-pot-pfanne',
        keyword: 'Würzige Shakshuka-Pfanne mit pochierten Eiern und Tomaten – fertig in 20 Minuten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'altes-brot-retten-panzanella-und-arme-ritter',
        category: 'guenstig-kochen',
        keyword: 'Altes Brot clever verwerten: Herzhafte Brotpfanne & knusprige Croutons in 10 Min.',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'glasnudelsalat-oder-asian-noodle-bowl-15-minuten',
        category: 'meal-prep-buero',
        keyword: 'Schnelle Asia-Nudel-Bowl mit Erdnuss-Limetten-Dressing zum Mitnehmen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'feta-tomaten-pasta-aus-dem-ofen-klassiker',
        category: 'ofen-airfryer',
        keyword: 'Ofen-Feta mit Kirschtomaten & Pasta verfeinert: Extra schnell für zwei Personen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'gemuese-omelett-mit-kaese-und-kraeutern-10-minuten',
        category: 'unter-20-minuten',
        keyword: 'Lockeres Kräuter-Gemüse-Omelett für den späten Feierabend in 10 Minuten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'chili-sin-carne-aus-vorraeten-in-20-minuten',
        category: 'guenstig-kochen',
        keyword: 'Schnelles Chili sin Carne mit Kidneybohnen & Mais – perfekt für mehrere Portionen',
        intent: 'informational',
        status: 'pending',
      },
    ],
  },

  {
    slug: 'fehlercode-held',
    name: 'FehlercodeHeld',
    theme: 'tech-diagnostic',
    badgeLabel: 'FEHLERCODEHELD  •  DIAGNOSE',
    tagline: 'Fehlercodes & Technik-Störungen in Minuten verstehen & selbst lösen',
    description:
      'Die verständliche Fehlercode-Datenbank für Waschmaschine, Spülmaschine, Heizung, Router & PC: Ursachen prüfen, Reparaturkosten sparen und sicher selbst beheben.',
    primaryColor: '#1d4ed8',
    primaryDark: '#1e3a8a',
    accentColor: '#f59e0b',
    accentLight: '#fffbeb',
    bgColor: '#f1f5f9',
    surfaceColor: '#ffffff',
    surfaceAltColor: '#e2e8f0',
    textColor: '#0f172a',
    textMutedColor: '#475569',
    borderColor: '#cbd5e1',
    heroGradient: 'linear-gradient(135deg, #090d16 0%, #1e293b 55%, #1d4ed8 100%)',
    cronSchedule: '15 6,17 * * *',
    cronLabel: 'täglich 07:15 & 18:15 Uhr MEZ (06:15 & 17:15 UTC)',
    heroHeadline: 'Blinkender Fehlercode? Diagnose finden & teuren Kundendienst oft sparen',
    heroSubline:
      'Suche direkt nach deinem Code (z. B. E18, E24, F28) oder Symptom und prüfe in 3 Minuten, ob du es sicher selbst lösen kannst.',
    categories: {
      'waschmaschine-trockner': {
        slug: 'waschmaschine-trockner',
        name: 'Waschmaschine & Trockner',
        icon: '🌀',
        description: 'Codes wie E18, F21, 5C oder E20 bei Bosch, Siemens, Bauknecht & Co. lösen.',
        accent: '#1d4ed8',
      },
      'spuelmaschine-kueche': {
        slug: 'spuelmaschine-kueche',
        name: 'Spülmaschine & Küche',
        icon: '🍽️',
        description: 'E15 Wasser in Bodenwanne, E24 Abpumpfehler, i20/i30 & Herd-Symbole beheben.',
        accent: '#2563eb',
      },
      'heizung-therme': {
        slug: 'heizung-therme',
        name: 'Heizung & Therme',
        icon: '🔥',
        description: 'Vaillant F.28, Viessmann, Buderus 6A & Druckabfall sicher einordnen.',
        accent: '#d97706',
      },
      'router-wlan': {
        slug: 'router-wlan',
        name: 'Router & WLAN',
        icon: '📡',
        description: 'Blinkende Power-/DSL-LED, PPPoE-Fehler, FritzBox & Telekom Speedport Diagnosen.',
        accent: '#0284c7',
      },
      'pc-smartphone': {
        slug: 'pc-smartphone',
        name: 'PC & Smartphone',
        icon: '🖥️',
        description: 'Windows Update Codes, USB-Fehler, Drucker-Status & Ladebuchsen-Warnungen.',
        accent: '#3730a3',
      },
    },
    seedArticles: [
      {
        slug: 'waschmaschine-fehlercode-e18-f18-loesen',
        category: 'waschmaschine-trockner',
        pubDate: '2026-11-11',
        title: 'Waschmaschine Fehlercode E18 / F18 (Bosch & Siemens): Soforthilfe ohne Monteur',
        description:
          'Die Maschine piept vor dem Schleudern und zeigt E18 oder F18? Meist ist lediglich das Flusensieb blockiert. So pumpst du sicher ab und behebst den Code.',
        keywords: [
          'Waschmaschine Fehlercode E18',
          'Siemens Waschmaschine F18 beheben',
          'Waschmaschine pumpt nicht ab E18',
          'Flusensieb Fremdkörperfalle reinigen',
        ],
        readingTime: 5,
        errorCodes: ['E18', 'F18', 'E03'],
        brands: 'Bosch, Siemens, Constructa, Neff',
        selfFixLevel: 'Grün: Fast immer selbst ohne Spezialwerkzeug lösbar',
        timeRequired: 'ca. 15 – 20 Min.',
        savedCost: 'ca. 90 – 160 € Anfahrts- & Techniker-Kosten',
        keyTakeaways: [
          'E18 / F18 bedeutet eindeutig: Abpumpzeit überschritten (Schmutzwasser verlässt Trommel nicht schnell genug).',
          'In 8 von 10 Fällen stecken Münzen, Haargummis, BH-Bügel oder Flusen vor dem Pumpenflügel.',
          'Immer erst den Netzstecker ziehen und das Wasser kontrolliert über den kleinen Ablassschlauch ablassen.',
        ],
        steps: [
          {
            step: 1,
            title: 'Strom trennen & flaches Backblech unter Wartungsklappe stellen',
            summary:
              'Ziehe den Stecker aus der Steckdose und öffne die Serviceklappe rechts unten an der Front.',
            tip: 'Halte einen großen Putzlappen und ein flaches Ofenblech oder eine Schüssel bereit – es können mehrere Liter Wasser herauslaufen.',
          },
          {
            step: 2,
            title: 'Über Notablassschlauch entleeren & Flusensieb aufdrehen',
            summary:
              'Ziehe den dünnen schwarzen Ablaufschlauch heraus, löse den Stopfen über der Schüssel und schraube danach langsam den Schraubdeckel des Siebs gegen den Uhrzeigersinn heraus.',
            tip: 'Tipp für Modelle ohne dünnen Schlauch: Deckel immer nur ein Viertel aufdrehen und Wasser schrittweise ablaufen lassen.',
          },
          {
            step: 3,
            title: 'Pumpenflügel tief im Schacht auf Leichtgängigkeit prüfen',
            summary:
              'Leuchte mit der Handy-Taschenlampe ins Gehäuse hinter dem Sieb und prüfe, ob sich das weiße Flügelrad mit einem Finger sauber drehen lässt.',
            tip: 'Festsitzende Stecknadeln, Haarnadeln oder Knöpfe vorsichtig mit einer Spitzzange herausziehen.',
          },
        ],
        faqs: [
          {
            question: 'Der Deckel vom Flusensieb lässt sich nicht drehen – was nun?',
            answer:
              'Manchmal klemmt ein Geldstück oder BH-Bügel quer im Gewinde. Ziehe keinesfalls mit voller Gewalt die Zange an, sonst bricht der Kunststoffgriff ab! Stattdessen den Griff vorsichtig leicht vor und zurück ruckeln oder zuvor den Ablaufschlauch am Siphon kontrollieren.',
          },
          {
            question: 'Nach dem Reinigen blinkt E18 beim nächsten Start immer noch – warum?',
            answer:
              'Prüfe zusätzlich den Abwassersiphon am Waschbecken/Wandanschluss! Häufig sammelt sich genau hinter der Schlauchschelle ein fester Fett-Flusen-Pfropf. Zudem setzen manche älteren Modelle den Fehler erst nach kurzem Reset (Programmwähler auf Aus / Neustart) zurück.',
          },
        ],
        bodyMarkdown: `## Was technisch hinter E18 / F18 steckt

Die Steuerung von Bosch-, Siemens-, Constructa- und Neff-Geräten überwacht beim Abpumpen über einen Drucksensor (Niveauschalter), ob der Wasserstand innerhalb von rund fünf bis sechs Minuten fällt. Sinkt das Niveau nicht rechtzeitig, stoppt die Elektronik aus Sicherheitsgründen vor dem Schleudergang und zeigt **E18** oder **F18**.

## Checkliste wenn das Flusensieb komplett sauber war

1. **Ablaufschlauch knickfrei?** Kontrolliere hinter der Maschine, ob beim Zurückschieben etwas den Schlauch gequetscht hat.
2. **Siphon an der Wand verstopft?** Löse die Schlauchschelle am Siphonstutzen und prüfe mit einem Blick, ob dort verhärtete Waschmittelreste und Flusen den Querschnitt verengen.
3. **Verbindungsschlauch in der Maschine (nur bei älteren Geräten):** Falls die Laugenpumpe beim Starten gar nicht mehr summt sondern totenstill bleibt, kann ein Wackelkontakt oder Verschleiß der Ablaufpumpe vorliegen – in diesem Fall lohnt der Fachservice.`,
      },
      {
        slug: 'spuelmaschine-fehlercode-e15-wasserhahn-symbol-loesen',
        category: 'spuelmaschine-kueche',
        pubDate: '2026-11-12',
        title: 'Spülmaschine zeigt E15 & Wasserhahn-Symbol: So trocknest du die Bodenwanne',
        description:
          'Dauerlaufende Pumpe trotz ausgeschalteter Maschine und Fehler E15? Der Aquastop-Schwimmer wurde ausgelöst. So prüfst du sicher, ob nur Überlauf oder ein Leck vorliegt.',
        keywords: [
          'Spülmaschine Fehlercode E15',
          'Geschirrspüler E15 Wasserhahn blinkt',
          'Bodenwanne trocken legen E15',
          'Aquastop ausgelöst reset',
        ],
        readingTime: 6,
        errorCodes: ['E15', 'i30', 'F1'],
        brands: 'Bosch, Siemens, Neff, AEG (teils i30)',
        selfFixLevel: 'Gelb: Selbst prüfbar (Vorsicht mit Strom & Wasser!)',
        timeRequired: 'ca. 25 Min.',
        savedCost: 'ca. 110 – 180 € Kundendienst-Besuch',
        keyTakeaways: [
          'E15 heißt: Wasser steht ganz unten in der Sicherheits-Bodenwanne unterhalb der Spülkammer.',
          'Aus Sicherheitsgründen lässt der Schwimmerschalter die Abwasserpumpe dauerhaft laufen.',
          'Oft war nur Überdosierung von Spülmittel/Klarspüler (Schaumbildung) oder eine schmutzige Türdichtung schuld.',
        ],
        steps: [
          {
            step: 1,
            title: 'Zuerst Wasserhahn zudrehen & Netzstecker ziehen',
            summary:
              'Drehe sofort den Eckventil-Wasserhahn unter der Spüle zu und trenne die Maschine komplett vom Stromnetz (Stecker ziehen oder Sicherung aus).',
            tip: 'Niemals mit feuchten Händen in geöffnete Gerätegehäuse fassen, solange Strom anliegt.',
          },
          {
            step: 2,
            title: 'Untere Sockelblende lösen und Bodenwanne mit Tuch trocknen',
            summary:
              'Schraube bzw. klipse die schmale Sockelleiste ganz unten unter der Spülmaschinentür ab und sauge das Wasser rund um den kleinen runden Styropor-Schwimmer mit Küchenpapier oder Lappen komplett auf.',
            tip: 'Nicht die ganze Maschine dauerhaft stark nach vorn kippen, sonst schwappt eventuell Restwasser auf Platinen – lieber trocken wischen.',
          },
          {
            step: 3,
            title: 'Probelauf beobachten: Kommt neues Wasser nach?',
            summary:
              'Schalte erst bei komplett trockener Bodenwanne den Strom wieder ein und lasse ein Kurzprogramm bei abgeschraubtem Sockel unter Beobachtung laufen.',
            tip: 'Tritt während des Laufs erneut Wasser von unten aus einem Schlauch oder der Pumpendichtung, bleibt nur der echte Austausch der Dichtung.',
          },
        ],
        faqs: [
          {
            question: 'Wie konnte Wasser in die Bodenwanne gelangen, wenn die Maschine dicht wirkt?',
            answer:
              'Sehr häufig passiert das durch normalen Handschuh-/Flüssigspülmittel-Einsatz im Geschirrspüler (extreme Schaumbildung läuft über den Sicherheitsüberlauf nach unten) oder wenn ein schweres Backblech die untere Türdichtung minimal aufdrückt.',
          },
          {
            question: 'Verschwindet E15 direkt, sobald der Styroporschwimmer wieder trocken liegt?',
            answer:
              'Ja! Sobald der kleine rote oder weiße Styroporschwimmer wieder auf dem trockenen Boden absinkt, öffnet der Mikroschalter und die Fehlercode-Blockade verschwindet nach dem Einschalten meist sofort.',
          },
        ],
        bodyMarkdown: `## Warum die Pumpe sogar bei ausgeschalteter Maschine weiterbrummt

Wenn dein Geschirrspüler **E15** (bei Bosch/Siemens/Neff) oder **i30** (bei AEG/Electrolux) anzeigt und unaufhörlich abpumpt, arbeitet der eingebaute Hochwasserschutz genau richtig: Unterhalb des eigentlichen Spülraums sitzt eine geschlossene Kunststoffwanne mit einem kleinen Styropor-Schwimmer. Schon zwei Schnapsgläser Wasser heben ihn an, blockieren das Zulaufventil und verhindern so einen Wasserschaden in deiner Küche.`,
      },
      {
        slug: 'heizung-vaillant-fehlercode-f28-f29-ursachen-pruefen',
        category: 'heizung-therme',
        pubDate: '2026-11-13',
        title: 'Heizung zeigt F.28 oder F.29 (Vaillant): Was du selbst prüfen darfst & wann der Profi muss',
        description:
          'Kalte Heizkörper und Fehler F.28 auf dem Thermen-Display? Erfahre, welche ungefährlichen Checks (Gasventil, Reset, Kondensat) du vor dem teuren Notdienst prüfen kannst.',
        keywords: [
          'Vaillant Fehlercode F28',
          'Vaillant F29 Zündung fehlgeschlagen',
          'Gastherme zündet nicht F28',
          'Heizung Reset Taste drücken',
        ],
        readingTime: 6,
        errorCodes: ['F.28', 'F.29', '6A'],
        brands: 'Vaillant (F.28 / F.29), Buderus/Junkers (6A)',
        selfFixLevel: 'Gelb: Äußeren Reset & Absperrhahn prüfen – niemals Gas-Baugruppen öffnen!',
        timeRequired: 'ca. 10 Min. Sichtcheck',
        savedCost: 'ca. 100 – 200 € Notdienst-Zuschlag vermeiden',
        keyTakeaways: [
          'F.28 bedeutet: Die Therme hat beim Startvorgang erfolglos versucht zu zünden (Kein Flamm-Signal).',
          'Sicherheitshinweis: Niemals Verkleidungen abschrauben oder an Gasarmaturen arbeiten – das ist ausschließlich Sache des zertifizierten SHK-Fachbetriebs.',
          'Folgende harmlose Außenursachen kannst du gefahrlos checken: Gelber Gas-Absperrhahn, Strom-Reset (max. 2x) und eingefrorener Kondensatablauf bei strengem Frost.',
        ],
        steps: [
          {
            step: 1,
            title: 'Gasgeruch ausschließen & gelben Absperrhahn prüfen',
            summary:
              'Falls es nach Gas riecht: sofort Fenster öffnen, nichts schalten, Gebäude verlassen und Notruf wählen! Ohne Gasgeruch kurz schauen, ob der gelbe Gashahn unter dem Gerät parallel zum Rohr (offen) steht.',
            tip: 'Manchmal stößt man beim Putzen im Keller/Flur versehentlich gegen den Absperrgriff.',
          },
          {
            step: 2,
            title: 'Entstörtaste (Reset) maximal zweimal drücken',
            summary:
              'Drücke an der Bedienblende einmal für etwa 3–5 Sekunden die durchgestrichene Flammen- bzw. Reset-Taste, um eine einmalige Luftblase oder Zündstörung zurückzusetzen.',
            tip: 'Erscheint F.28 nach 2 Resets sofort wieder, auf keinen Fall dauernd neu resetten, sondern Fehler stehen lassen und Fachbetrieb anrufen.',
          },
          {
            step: 3,
            title: 'Kondensatschlauch bei Frost kontrollieren & Zähler checken',
            summary:
              'Bei Brennwertgeräten bei Minusgraden prüfen, ob das nach außen führende Kondensatrohr zugefroren ist (dann staut sich Wasser bis zur Zündung zurück). Bei mehreren Parteien prüfen, ob ggf. ein Gaszähler gesperrt ist.',
            tip: 'Gib dem Monteur am Telefon direkt den exakten Code („F.28“) sowie Modelltyp vom Typenschild durch – dann bringt er das passende Zündelektroden-Set direkt mit.',
          },
        ],
        faqs: [
          {
            question: 'Was ist der genaue Unterschied zwischen F.28 und F.29?',
            answer:
              'Bei F.28 gelingt bereits der allererste Zündversuch beim Start nicht. Bei F.29 brannte die Flamme schon kurz, erlosch aber während des laufenden Betriebs wieder und die nachfolgende Wiederzündung schlug fehl.',
          },
          {
            question: 'Darf man als Mieter eine eigene Firma rufen?',
            answer:
              'Nein! Informiere bei einer Mietwohnung unbedingt sofort deinen Vermieter bzw. die Hausverwaltung (Notfallnummer), da diese den Heizungsfachbetrieb beauftragen und die Kosten über die Instandhaltung laufen.',
          },
        ],
        bodyMarkdown: `## Wichtige Sicherheitsregel bei Gas- und Brennwertthermen

Anders als beim Flusensieb einer Waschmaschine gelten bei Gas- und Heizungsanlagen strenge gesetzliche Sicherheitsgrenzen. Alles im Inneren des geschlossenen Brennraums (Zündelektrode, Ionisationselektrode, Gasregelblock, Gebläse) darf ausschließlich ein eingetragener Fachhandwerker öffnen und prüfen.

## Warum der Blick auf Absperrhahn & Reset trotzdem oft hilft

Tatsächlich rücken Notdienste im Winter häufig wegen drei trivialer Außenursachen aus:
- Nach Arbeiten am Haus-Stromnetz oder einer kurzen Gas-Wartung vergessen manche das erneute Quittieren an der Entstörtaste.
- Im strengen Dauerfrost vereist gelegentlich ein außen liegender Kunststoff-Kondensatablauf und legt den Abgas- und Zündsensor lahm.
- Wurde frisch am Gasherd oder an der Kellerleitung hantiert, steht oft schlicht ein Absperrventil quer zur Leitung.

Sind alle diese Außenpunkte geklärt und F.28 erscheint nach maximal zwei Reset-Versuchen erneut, hat meist schlicht die Ionisations- oder Zündelektrode ihre Verschleißgrenze erreicht – ein Routineaustausch für den Heizungsmonteur.`,
      },
    ],
    topicQueue: [
      {
        id: 'fritzbox-power-dsl-led-blinkt-ursachen-loesung',
        category: 'router-wlan',
        keyword: 'FritzBox Power/DSL LED blinkt dauerhaft: Kabel, Telefondose & Störung prüfen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'windows-update-fehlercode-0x80070002-reparieren',
        category: 'pc-smartphone',
        keyword: 'Windows Update Fehlercode 0x80070002 / 0x800f081f ohne Neuinstallation beheben',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'spuelmaschine-fehlercode-e24-e25-bosch-siemens',
        category: 'spuelmaschine-kueche',
        keyword: 'Spülmaschine Fehlercode E24 & E25: Pumpenabdeckung und Siphon Schritt für Schritt prüfen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'waschmaschine-fehler-5c-se-samsung-pumpt-nicht',
        category: 'waschmaschine-trockner',
        keyword: 'Samsung Waschmaschine Fehlercode 5C / 5E / SE beheben: Ablauf & Sieb reinigen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'viessmann-heizung-stoerung-f4-flammensignal',
        category: 'heizung-therme',
        keyword: 'Viessmann Störung F4 / F5: Ursachen für fehlendes Flammensignal verständlich erklärt',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'iphone-warnung-fluessigkeit-im-lightning-usb-c-anschluss',
        category: 'pc-smartphone',
        keyword: 'Handy-Warnung „Flüssigkeit im Anschluss erkannt“: Was tun statt Reis-Mythos?',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'waermepumpentrockner-behaelter-voll-blinkt-trotz-leeren',
        category: 'waschmaschine-trockner',
        keyword: 'Trockner zeigt „Behälter voll“ obwohl leer: Schwimmerschalter und Kondensatpumpe prüfen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'aeg-spuelmaschine-fehlercode-i20-i30-beheben',
        category: 'spuelmaschine-kueche',
        keyword: 'AEG Spülmaschine zeigt i20 oder i30: Druckwächter, Abfluss und Bodenwanne prüfen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'wlan-fehler-kein-internet-gesichert-windows-loesen',
        category: 'router-wlan',
        keyword: 'Windows zeigt „Kein Internet, gesichert“ im WLAN: DNS, IP-Adresse & Adapter retten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'induktionskochfeld-fehlercode-e6-e9-oder-u-erkennung',
        category: 'spuelmaschine-kueche',
        keyword: 'Induktionskochfeld blinkt „U“ oder Fehler E / F: Topferkennung und Überhitzung prüfen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'bauknecht-whirlpool-waschmaschine-f05-f06-fehler',
        category: 'waschmaschine-trockner',
        keyword: 'Bauknecht Waschmaschine Fehlercode F05, F06 oder F08: Sensor, Motor & Abpumpen checken',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'kaffeevollautomat-allgemeine-stoerung-bruehgruppe-klemmt',
        category: 'spuelmaschine-kueche',
        keyword: 'Kaffeevollautomat „Allgemeine Störung“ oder „Brühgruppe einsetzen“ sicher lösen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'heizung-wasserdruck-unter-1-bar-fehlercode-f22',
        category: 'heizung-therme',
        keyword: 'Heizungsfehler F.22 / Wassermangel: Manometer ablesen & Heizungswasser richtig nachfüllen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'telekom-speedport-wlan-fehler-keine-verbindung',
        category: 'router-wlan',
        keyword: 'Speedport blinkt rot oder orange: Link-LED, Zugangsdaten & Line-Reset durchführen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'drucker-fehlerstatus-offline-windows-warteschlange',
        category: 'pc-smartphone',
        keyword: 'Drucker zeigt „Fehlerstatus“ oder „Offline“ trotz WLAN: Druckspooler in 2 Minuten retten',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'lg-waschmaschine-fehler-oe-ue-de-beheben',
        category: 'waschmaschine-trockner',
        keyword: 'LG Waschmaschine Fehlercodes OE, UE, dE und IE: Die schnelle Übersicht zur Selbsthilfe',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'miele-spuelmaschine-f11-f70-zulauf-ablauf-blinkt',
        category: 'spuelmaschine-kueche',
        keyword: 'Miele Geschirrspüler F11 / F70 oder „Zulauf/Ablauf“: Rückschlagventil einfach reinigen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'buderus-junkers-heizung-fehlercode-6a-ea-keine-flamme',
        category: 'heizung-therme',
        keyword: 'Buderus / Junkers Fehlercode 6A oder EA: Was die Zündstörung konkret bedeutet',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'usb-geraet-wurde-nicht-erkannt-fehler-43-windows',
        category: 'pc-smartphone',
        keyword: 'Windows „USB-Gerät wurde nicht erkannt (Fehlercode 43)“: Controller und Kabel prüfen',
        intent: 'informational',
        status: 'pending',
      },
      {
        id: 'vodafone-router-rote-internet-led-dns-ausfall',
        category: 'router-wlan',
        keyword: 'Kabelrouter blinkt rot bei Internet/Telefon: Koax-Kabel, Rückwegstörung & Neustart prüfen',
        intent: 'informational',
        status: 'pending',
      },
    ],
  },
];
