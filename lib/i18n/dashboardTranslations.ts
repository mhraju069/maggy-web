import { Language } from "./translations";

export interface DashboardTranslations {
  sidebar: {
    home: string;
    myBookings: string;
    accessCodes: string;
    profile: string;
    viewWebsite: string;
    logout: string;
  };
  home: {
    welcomeBack: string;
    welcomeBackUser: string;
    summarySubtitle: string;
    bookNewExperience: string;
    membershipsAndPasses: string;
    totalBookings: string;
    upcomingVisits: string;
    activeSubscriptions: string;
    saunaSessions: string;
    nextUp: string;
    priority: string;
    confirmed: string;
    bookingReference: string;
    date: string;
    arrivalTime: string;
    guests: string;
    guest: string;
    code: string;
    wellnessSubscriptions: string;
    browseNewSubscriptions: string;
    membership: string;
    sessionBalance: string;
    remaining: string;
    price: string;
    validUntil: string;
    noActiveSubscriptionTitle: string;
    noActiveSubscriptionDesc: string;
    explorePlans: string;
    scheduledReservations: string;
    scheduledSubtitle: string;
    viewAll: string;
    noVisitsScheduled: string;
    nextOn: string;
    allVisitsPlanned: string;
    viewBooking: string;
  };
  myBookings: {
    title: string;
    subtitle: string;
    upcomingTab: string;
    pastTab: string;
    noUpcomingTitle: string;
    noUpcomingDesc: string;
    noPastTitle: string;
    noPastDesc: string;
    bookNow: string;
    confirmed: string;
    completed: string;
    cancelled: string;
    pending: string;
    timeSlot: string;
    guestsCount: string;
    totalPaid: string;
    bookingId: string;
    accessCode: string;
    notes: string;
  };
  accessCodes: {
    title: string;
    subtitle: string;
    activeCodes: string;
    noCodesTitle: string;
    noCodesDesc: string;
    codeLabel: string;
    validFor: string;
    instruction: string;
    instructionsTitle: string;
    instructionsBody: string;
  };
  profile: {
    title: string;
    subtitle: string;
    personalInfo: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    preferredLanguage: string;
    saveChanges: string;
    saving: string;
    successMessage: string;
    security: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
  };
}

export interface AdminTranslations {
  sidebar: {
    reservations: string;
    availability: string;
    services: string;
    subscriptions: string;
    payments: string;
    accessCodes: string;
    exceptions: string;
    supportMessages: string;
    users: string;
    settings: string;
    profile: string;
    viewWebsite: string;
    logout: string;
  };
  reservations: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allServices: string;
    allStatuses: string;
    allPaymentStatuses: string;
    dateFilter: string;
    filterButton: string;
    clearFilters: string;
    bookingId: string;
    client: string;
    service: string;
    dateTime: string;
    guests: string;
    status: string;
    payment: string;
    actions: string;
    viewDetails: string;
    confirmed: string;
    pending: string;
    cancelled: string;
    paid: string;
    unpaid: string;
    noReservationsFound: string;
    showingResults: string;
    of: string;
    exportCsv: string;
    newReservation: string;
  };
  availability: {
    title: string;
    subtitle: string;
    saveChanges: string;
    saving: string;
    capacity: string;
    timeSlots: string;
    openingHours: string;
    closedDays: string;
    selectService: string;
  };
  subscriptions: {
    title: string;
    subtitle: string;
    activePlans: string;
    sessionPasses: string;
    createPlan: string;
    createPass: string;
    edit: string;
    delete: string;
    name: string;
    price: string;
    duration: string;
    maxSessions: string;
    features: string;
    status: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    actions: string;
    status: string;
    date: string;
    time: string;
    all: string;
    yes: string;
    no: string;
  };
}

export const dashboardTranslations: Record<Language, DashboardTranslations> = {
  en: {
    sidebar: {
      home: "Home",
      myBookings: "My Bookings",
      accessCodes: "Access Codes",
      profile: "Profile",
      viewWebsite: "View Website",
      logout: "Log Out",
    },
    home: {
      welcomeBack: "Welcome back",
      welcomeBackUser: "Welcome back, {name}",
      summarySubtitle: "Here is a summary of your upcoming reservations, wellness subscriptions, and door codes.",
      bookNewExperience: "Book New Experience",
      membershipsAndPasses: "Memberships & Passes",
      totalBookings: "Total Bookings",
      upcomingVisits: "Upcoming Visits",
      activeSubscriptions: "Active Passes & Plans",
      saunaSessions: "Sauna Sessions",
      nextUp: "Priority • Next Up",
      priority: "Priority",
      confirmed: "Confirmed",
      bookingReference: "Booking Reference:",
      date: "Date",
      arrivalTime: "Arrival Time",
      guests: "Guests",
      guest: "Guest",
      code: "Code",
      wellnessSubscriptions: "Wellness Subscriptions & Passes",
      browseNewSubscriptions: "Browse New Subscriptions",
      membership: "Membership",
      sessionBalance: "Session Balance:",
      remaining: "Remaining",
      price: "Price:",
      validUntil: "Valid until:",
      noActiveSubscriptionTitle: "No Active Subscription Yet",
      noActiveSubscriptionDesc: "Enjoy unlimited sessions, discounted sauna admissions, and complimentary towels with our flexible monthly or 10-session passes.",
      explorePlans: "Explore Membership Plans ›",
      scheduledReservations: "Scheduled Reservations",
      scheduledSubtitle: "Your other planned visits in chronological order",
      viewAll: "View All ›",
      noVisitsScheduled: "No visits scheduled",
      nextOn: "Next on {date}",
      allVisitsPlanned: "All planned visits",
      viewBooking: "View booking",
    },
    myBookings: {
      title: "My Bookings",
      subtitle: "Overview of your upcoming and past wellness reservations.",
      upcomingTab: "Upcoming",
      pastTab: "Past / History",
      noUpcomingTitle: "No Upcoming Bookings",
      noUpcomingDesc: "You don't have any upcoming wellness sessions scheduled at this moment.",
      noPastTitle: "No Past Bookings",
      noPastDesc: "Your completed visit history will appear here.",
      bookNow: "Book An Experience",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      pending: "Pending",
      timeSlot: "Time Slot",
      guestsCount: "Guests",
      totalPaid: "Total",
      bookingId: "Booking ID",
      accessCode: "Access Code",
      notes: "Special Requests / Notes",
    },
    accessCodes: {
      title: "Door & Sauna Access Codes",
      subtitle: "Your digital keys to enter your booked private and shared wellness facilities.",
      activeCodes: "Active Access Codes",
      noCodesTitle: "No Active Access Codes",
      noCodesDesc: "Access codes are automatically generated upon confirmed sauna or private room bookings.",
      codeLabel: "Keycode",
      validFor: "Valid for:",
      instruction: "Enter this code on the electronic keypad at the facility door followed by #.",
      instructionsTitle: "How to use your access codes",
      instructionsBody: "Codes activate 15 minutes before your scheduled start time and remain valid until the end of your session.",
    },
    profile: {
      title: "Profile & Account",
      subtitle: "Manage your personal details, contact preferences, and language.",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number",
      preferredLanguage: "Preferred Language",
      saveChanges: "Save Changes",
      saving: "Saving...",
      successMessage: "Profile updated successfully!",
      security: "Account Security",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
    },
  },
  nl: {
    sidebar: {
      home: "Overzicht",
      myBookings: "Mijn Reserveringen",
      accessCodes: "Toegangscodes",
      profile: "Profiel",
      viewWebsite: "Bekijk Website",
      logout: "Uitloggen",
    },
    home: {
      welcomeBack: "Welkom terug",
      welcomeBackUser: "Welkom terug, {name}",
      summarySubtitle: "Hier is een overzicht van je geplande reserveringen, wellness abonnementen en toegangscodes.",
      bookNewExperience: "Nieuwe Belevenis Boeken",
      membershipsAndPasses: "Abonnementen & Passen",
      totalBookings: "Totaal Reserveringen",
      upcomingVisits: "Aankomende Bezoeken",
      activeSubscriptions: "Actieve Passen & Abonnementen",
      saunaSessions: "Sauna Sessies",
      nextUp: "Prioriteit • Eerstvolgende",
      priority: "Prioriteit",
      confirmed: "Bevestigd",
      bookingReference: "Boekingsreferentie:",
      date: "Datum",
      arrivalTime: "Aankomsttijd",
      guests: "Gasten",
      guest: "Gast",
      code: "Code",
      wellnessSubscriptions: "Wellness Abonnementen & Passen",
      browseNewSubscriptions: "Bekijk Nieuwe Abonnementen",
      membership: "Lidmaatschap",
      sessionBalance: "Resterende Sessies:",
      remaining: "Resterend",
      price: "Prijs:",
      validUntil: "Geldig tot:",
      noActiveSubscriptionTitle: "Nog Geen Actief Abonnement",
      noActiveSubscriptionDesc: "Geniet van onbeperkte sessies, korting op sauna-entree en gratis handdoeken met onze flexibele maandabonnementen of 10-rittenkaarten.",
      explorePlans: "Ontdek Lidmaatschappen ›",
      scheduledReservations: "Geplande Reserveringen",
      scheduledSubtitle: "Je overige geplande bezoeken in chronologische volgorde",
      viewAll: "Alles Bekijken ›",
      noVisitsScheduled: "Geen bezoeken gepland",
      nextOn: "Eerstvolgende op {date}",
      allVisitsPlanned: "Alle geplande bezoeken",
      viewBooking: "Bekijk boeking",
    },
    myBookings: {
      title: "Mijn Reserveringen",
      subtitle: "Overzicht van je geplande en eerdere wellness reserveringen.",
      upcomingTab: "Aankomend",
      pastTab: "Eerder / Geschiedenis",
      noUpcomingTitle: "Geen Aankomende Reserveringen",
      noUpcomingDesc: "Je hebt momenteel geen geplande wellness sessies.",
      noPastTitle: "Geen Eerdere Reserveringen",
      noPastDesc: "Je voltooide bezoeken worden hier weergegeven.",
      bookNow: "Boek Een Belevenis",
      confirmed: "Bevestigd",
      completed: "Voltooid",
      cancelled: "Geannuleerd",
      pending: "In behandeling",
      timeSlot: "Tijdslot",
      guestsCount: "Gasten",
      totalPaid: "Totaal",
      bookingId: "Boekingsnummer",
      accessCode: "Toegangscode",
      notes: "Speciale verzoeken / Notities",
    },
    accessCodes: {
      title: "Deur- & Saunatoegangscodes",
      subtitle: "Je digitale sleutels voor toegang tot je gereserveerde wellness faciliteiten.",
      activeCodes: "Actieve Toegangscodes",
      noCodesTitle: "Geen Actieve Toegangscodes",
      noCodesDesc: "Toegangscodes worden automatisch gegenereerd na bevestiging van een sauna- of privékamer boeking.",
      codeLabel: "Toegangscode",
      validFor: "Geldig voor:",
      instruction: "Voer deze code in op het toetsenpaneel bij de toegangsdeur gevolgd door #.",
      instructionsTitle: "Hoe gebruik je de toegangscodes",
      instructionsBody: "Codes worden 15 minuten voor aanvang van je sessie actief en blijven geldig tot het einde van je boeking.",
    },
    profile: {
      title: "Profiel & Account",
      subtitle: "Beheer je persoonlijke gegevens, contactvoorkeuren en taal.",
      personalInfo: "Persoonlijke Gegevens",
      fullName: "Volledige Naam",
      emailAddress: "E-mailadres",
      phoneNumber: "Telefoonnummer",
      preferredLanguage: "Voorkeurstaal",
      saveChanges: "Wijzigingen Opslaan",
      saving: "Opslaan...",
      successMessage: "Profiel succesvol bijgewerkt!",
      security: "Accountbeveiliging",
      changePassword: "Wachtwoord Wijzigen",
      currentPassword: "Huidig Wachtwoord",
      newPassword: "Nieuw Wachtwoord",
      confirmPassword: "Bevestig Nieuw Wachtwoord",
      updatePassword: "Wachtwoord Bijwerken",
    },
  },
  de: {
    sidebar: {
      home: "Übersicht",
      myBookings: "Meine Buchungen",
      accessCodes: "Zugangscodes",
      profile: "Profil",
      viewWebsite: "Website ansehen",
      logout: "Abmelden",
    },
    home: {
      welcomeBack: "Willkommen zurück",
      welcomeBackUser: "Willkommen zurück, {name}",
      summarySubtitle: "Hier ist eine Übersicht über Ihre anstehenden Reservierungen, Wellness-Abonnements und Zugangscodes.",
      bookNewExperience: "Neues Erlebnis Buchen",
      membershipsAndPasses: "Mitgliedschaften & Pässe",
      totalBookings: "Buchungen Gesamt",
      upcomingVisits: "Anstehende Besuche",
      activeSubscriptions: "Aktive Abos & Pässe",
      saunaSessions: "Sauna-Sitzungen",
      nextUp: "Priorität • Als Nächstes",
      priority: "Priorität",
      confirmed: "Bestätigt",
      bookingReference: "Buchungsnummer:",
      date: "Datum",
      arrivalTime: "Ankunftszeit",
      guests: "Gäste",
      guest: "Gast",
      code: "Code",
      wellnessSubscriptions: "Wellness-Abonnements & Pässe",
      browseNewSubscriptions: "Neue Abonnements Durchsuchen",
      membership: "Mitgliedschaft",
      sessionBalance: "Verbleibende Sitzungen:",
      remaining: "Verbleibend",
      price: "Preis:",
      validUntil: "Gültig bis:",
      noActiveSubscriptionTitle: "Noch Kein Aktives Abonnement",
      noActiveSubscriptionDesc: "Genießen Sie unbegrenzte Sitzungen, ermäßigten Saunaeintritt und kostenlose Handtücher mit unseren flexiblen Monats- oder 10er-Karten.",
      explorePlans: "Mitgliedschaften Entdecken ›",
      scheduledReservations: "Geplante Reservierungen",
      scheduledSubtitle: "Ihre weiteren geplanten Besuche in chronologischer Reihenfolge",
      viewAll: "Alle Anzeigen ›",
      noVisitsScheduled: "Keine Besuche geplant",
      nextOn: "Nächster am {date}",
      allVisitsPlanned: "Alle geplanten Besuche",
      viewBooking: "Buchung ansehen",
    },
    myBookings: {
      title: "Meine Buchungen",
      subtitle: "Übersicht über Ihre anstehenden und vergangenen Wellness-Reservierungen.",
      upcomingTab: "Anstehend",
      pastTab: "Vergangen / Verlauf",
      noUpcomingTitle: "Keine Anstehenden Buchungen",
      noUpcomingDesc: "Sie haben derzeit keine anstehenden Wellness-Termine geplant.",
      noPastTitle: "Keine Vergangenen Buchungen",
      noPastDesc: "Ihre abgeschlossenen Besuche werden hier aufgeführt.",
      bookNow: "Ein Erlebnis Buchen",
      confirmed: "Bestätigt",
      completed: "Abgeschlossen",
      cancelled: "Storniert",
      pending: "Ausstehend",
      timeSlot: "Zeitfenster",
      guestsCount: "Gäste",
      totalPaid: "Gesamtbetrag",
      bookingId: "Buchungs-ID",
      accessCode: "Zugangscode",
      notes: "Besondere Wünsche / Notizen",
    },
    accessCodes: {
      title: "Tür- & Sauna-Zugangscodes",
      subtitle: "Ihre digitalen Schlüssel für den Zugang zu Ihren gebuchten Wellness-Bereichen.",
      activeCodes: "Aktive Zugangscodes",
      noCodesTitle: "Keine Aktiven Zugangscodes",
      noCodesDesc: "Zugangscodes werden nach der Bestätigung einer Sauna- oder Privatbereichsbuchung automatisch generiert.",
      codeLabel: "Zugangscode",
      validFor: "Gültig für:",
      instruction: "Geben Sie diesen Code auf dem Tastenfeld an der Tür ein, gefolgt von #.",
      instructionsTitle: "So verwenden Sie Ihre Zugangscodes",
      instructionsBody: "Codes werden 15 Minuten vor Beginn Ihrer gebuchten Zeit aktiv und bleiben bis zum Ende Ihrer Buchung gültig.",
    },
    profile: {
      title: "Profil & Konto",
      subtitle: "Verwalten Sie Ihre persönlichen Daten, Kontaktdaten und Spracheinstellungen.",
      personalInfo: "Persönliche Informationen",
      fullName: "Vollständiger Name",
      emailAddress: "E-Mail-Adresse",
      phoneNumber: "Telefonnummer",
      preferredLanguage: "Bevorzugte Sprache",
      saveChanges: "Änderungen Speichern",
      saving: "Wird gespeichert...",
      successMessage: "Profil erfolgreich aktualisiert!",
      security: "Kontosicherheit",
      changePassword: "Passwort Ändern",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      confirmPassword: "Neues Passwort Bestätigen",
      updatePassword: "Passwort Aktualisieren",
    },
  },
};

export const adminTranslations: Record<Language, AdminTranslations> = {
  en: {
    sidebar: {
      reservations: "Reservations",
      availability: "Availability & Capacity",
      services: "Services",
      subscriptions: "Subscriptions",
      payments: "Payments",
      accessCodes: "Access Codes",
      exceptions: "Exceptions",
      supportMessages: "Support Messages",
      users: "Users",
      settings: "Settings",
      profile: "Profile",
      viewWebsite: "View Website",
      logout: "Log Out",
    },
    reservations: {
      title: "Reservations",
      subtitle: "Manage, filter and review all guest bookings across all wellness facilities.",
      searchPlaceholder: "Search by booking ID, guest name, or email...",
      allServices: "All Services",
      allStatuses: "All Statuses",
      allPaymentStatuses: "All Payment Statuses",
      dateFilter: "Filter by Date",
      filterButton: "Filter",
      clearFilters: "Clear Filters",
      bookingId: "Booking ID",
      client: "Guest / Client",
      service: "Service",
      dateTime: "Date & Time",
      guests: "Guests",
      status: "Status",
      payment: "Payment",
      actions: "Actions",
      viewDetails: "View Details",
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      paid: "Paid",
      unpaid: "Unpaid",
      noReservationsFound: "No reservations found matching your criteria.",
      showingResults: "Showing",
      of: "of",
      exportCsv: "Export CSV",
      newReservation: "New Reservation",
    },
    availability: {
      title: "Availability & Capacity",
      subtitle: "Configure time slots, room capacities, and operational rules.",
      saveChanges: "Save Changes",
      saving: "Saving...",
      capacity: "Capacity",
      timeSlots: "Time Slots",
      openingHours: "Opening Hours",
      closedDays: "Closed Days",
      selectService: "Select Service",
    },
    subscriptions: {
      title: "Subscriptions & Passes",
      subtitle: "Create and manage customer membership plans and multi-session passes.",
      activePlans: "Active Membership Plans",
      sessionPasses: "Session Passes",
      createPlan: "Create New Plan",
      createPass: "Create New Pass",
      edit: "Edit",
      delete: "Delete",
      name: "Name",
      price: "Price",
      duration: "Duration",
      maxSessions: "Max Sessions",
      features: "Features",
      status: "Status",
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Action completed successfully",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      filter: "Filter",
      actions: "Actions",
      status: "Status",
      date: "Date",
      time: "Time",
      all: "All",
      yes: "Yes",
      no: "No",
    },
  },
  nl: {
    sidebar: {
      reservations: "Reserveringen",
      availability: "Beschikbaarheid & Capaciteit",
      services: "Diensten",
      subscriptions: "Abonnementen",
      payments: "Betalingen",
      accessCodes: "Toegangscodes",
      exceptions: "Uitzonderingen",
      supportMessages: "Ondersteuning Berichten",
      users: "Gebruikers",
      settings: "Instellingen",
      profile: "Profiel",
      viewWebsite: "Bekijk Website",
      logout: "Uitloggen",
    },
    reservations: {
      title: "Reserveringen",
      subtitle: "Beheer, filter en bekijk alle gastreserveringen voor alle wellness faciliteiten.",
      searchPlaceholder: "Zoek op boekingsnummer, gastnaam of e-mail...",
      allServices: "Alle Diensten",
      allStatuses: "Alle Statussen",
      allPaymentStatuses: "Alle Betalingsstatussen",
      dateFilter: "Filter op Datum",
      filterButton: "Filteren",
      clearFilters: "Filters Wissen",
      bookingId: "Boekings-ID",
      client: "Gast / Klant",
      service: "Dienst",
      dateTime: "Datum & Tijd",
      guests: "Gasten",
      status: "Status",
      payment: "Betaling",
      actions: "Acties",
      viewDetails: "Details Bekijken",
      confirmed: "Bevestigd",
      pending: "In behandeling",
      cancelled: "Geannuleerd",
      paid: "Betaald",
      unpaid: "Onbetaald",
      noReservationsFound: "Geen reserveringen gevonden die voldoen aan de zoekcriteria.",
      showingResults: "Resultaten",
      of: "van",
      exportCsv: "Exporteer CSV",
      newReservation: "Nieuwe Reservering",
    },
    availability: {
      title: "Beschikbaarheid & Capaciteit",
      subtitle: "Configureer tijdsloten, ruimtetarieven, capaciteit en operationele regels.",
      saveChanges: "Wijzigingen Opslaan",
      saving: "Opslaan...",
      capacity: "Capaciteit",
      timeSlots: "Tijdsloten",
      openingHours: "Openingstijden",
      closedDays: "Sluitingsdagen",
      selectService: "Selecteer Dienst",
    },
    subscriptions: {
      title: "Abonnementen & Passen",
      subtitle: "Beheer lidmaatschapsplannen en meerrittenkaarten voor klanten.",
      activePlans: "Actieve Lidmaatschappen",
      sessionPasses: "Rittenkaarten",
      createPlan: "Nieuw Plan Maken",
      createPass: "Nieuwe Pas Maken",
      edit: "Bewerken",
      delete: "Verwijderen",
      name: "Naam",
      price: "Prijs",
      duration: "Looptijd",
      maxSessions: "Max Sessies",
      features: "Kenmerken",
      status: "Status",
    },
    common: {
      loading: "Laden...",
      error: "Er is een fout opgetreden",
      success: "Actie succesvol voltooid",
      save: "Opslaan",
      cancel: "Annuleren",
      delete: "Verwijderen",
      edit: "Bewerken",
      search: "Zoeken",
      filter: "Filteren",
      actions: "Acties",
      status: "Status",
      date: "Datum",
      time: "Tijd",
      all: "Alle",
      yes: "Ja",
      no: "Nee",
    },
  },
  de: {
    sidebar: {
      reservations: "Reservierungen",
      availability: "Verfügbarkeit & Kapazität",
      services: "Dienstleistungen",
      subscriptions: "Abonnements",
      payments: "Zahlungen",
      accessCodes: "Zugangscodes",
      exceptions: "Ausnahmen",
      supportMessages: "Support-Nachrichten",
      users: "Benutzer",
      settings: "Einstellungen",
      profile: "Profil",
      viewWebsite: "Website ansehen",
      logout: "Abmelden",
    },
    reservations: {
      title: "Reservierungen",
      subtitle: "Verwalten, filtern und überprüfen Sie alle Gästebuchungen in allen Bereichen.",
      searchPlaceholder: "Suche nach Buchungsnummer, Gastname oder E-Mail...",
      allServices: "Alle Dienstleistungen",
      allStatuses: "Alle Status",
      allPaymentStatuses: "Alle Zahlungsstatus",
      dateFilter: "Nach Datum filtern",
      filterButton: "Filtern",
      clearFilters: "Filter zurücksetzen",
      bookingId: "Buchungs-ID",
      client: "Gast / Kunde",
      service: "Dienstleistung",
      dateTime: "Datum & Uhrzeit",
      guests: "Gäste",
      status: "Status",
      payment: "Zahlung",
      actions: "Aktionen",
      viewDetails: "Details ansehen",
      confirmed: "Bestätigt",
      pending: "Ausstehend",
      cancelled: "Storniert",
      paid: "Bezahlt",
      unpaid: "Unbezahlt",
      noReservationsFound: "Keine Reservierungen gefunden, die den Kriterien entsprechen.",
      showingResults: "Ergebnisse",
      of: "von",
      exportCsv: "CSV Exportieren",
      newReservation: "Neue Reservierung",
    },
    availability: {
      title: "Verfügbarkeit & Kapazität",
      subtitle: "Konfigurieren Sie Zeitfenster, Raumkapazitäten und Betriebszeiten.",
      saveChanges: "Änderungen Speichern",
      saving: "Wird gespeichert...",
      capacity: "Kapazität",
      timeSlots: "Zeitfenster",
      openingHours: "Öffnungszeiten",
      closedDays: "Ruhetage",
      selectService: "Dienstleistung Wählen",
    },
    subscriptions: {
      title: "Abonnements & Pässe",
      subtitle: "Erstellen und verwalten Sie Mitgliedschaften und Mehrfachkarten.",
      activePlans: "Aktive Mitgliedschaften",
      sessionPasses: "Sitzungskarten",
      createPlan: "Neuen Plan Erstellen",
      createPass: "Neue Karte Erstellen",
      edit: "Bearbeiten",
      delete: "Löschen",
      name: "Name",
      price: "Preis",
      duration: "Dauer",
      maxSessions: "Max. Sitzungen",
      features: "Funktionen",
      status: "Status",
    },
    common: {
      loading: "Wird geladen...",
      error: "Ein Fehler ist aufgetreten",
      success: "Aktion erfolgreich abgeschlossen",
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      search: "Suchen",
      filter: "Filtern",
      actions: "Aktionen",
      status: "Status",
      date: "Datum",
      time: "Zeit",
      all: "Alle",
      yes: "Ja",
      no: "Nein",
    },
  },
};

