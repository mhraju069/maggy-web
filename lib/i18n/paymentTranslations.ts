import { Language } from "./translations";

export interface PaymentTranslations {
  paymentInformation: string;
  secureCheckout: {
    badge: string;
    title: string;
    pciBadge: string;
  };
  passIncluded: {
    title: string;
    desc: string;
  };
  methodSelector: {
    label: string;
    cardTitle: string;
    cardDesc: string;
    idealTitle: string;
    idealDesc: string;
  };
  cardFields: {
    nameOnCard: string;
    namePlaceholder: string;
    cardNumber: string;
    expires: string;
    cvc: string;
    zip: string;
    zipPlaceholder: string;
  };
  idealFields: {
    selectBank: string;
    redirectNotice: string;
  };
  totalDueToday: string;
  totalAmountDue: string;
  buttons: {
    confirmBookingCredit: string;
    confirmAndPay: string;
    confirmingBooking: string;
  };
  errors: {
    genericFailure: string;
  };
  policyCard: {
    title: string;
    subtitlePrefix: string;
    subtitleHighlight: string;
    subtitleSuffix: string;
    reviewPolicyBtn: string;
    readPolicyBtn: string;
    acknowledgedText: string;
    unacknowledgedPrefix: string;
    unacknowledgedAction: string;
    unacknowledgedSuffix: string;
    openPolicyLink: string;
    changePolicyLink: string;
  };
  policyModal: {
    title: string;
    subtitle: string;
    importantNoticeTitle: string;
    importantNoticeBody: string;
    sec1Title: string;
    sec1Intro: string;
    sec1IntroBold: string;
    sec1Point1Title: string;
    sec1Point1Body: string;
    sec1Point2Title: string;
    sec1Point2Body: string;
    sec1Point3Title: string;
    sec1Point3Body: string;
    sec2Title: string;
    sec2Intro: string;
    sec2Point1Title: string;
    sec2Point1Body: string;
    sec2Point2Title: string;
    sec2Point2Body: string;
    sec2Point3Title: string;
    sec2Point3Body: string;
    sec3Title: string;
    sec3Body: string;
    sec4Title: string;
    sec4Body: string;
    agreeCheckboxLabel1: string;
    agreeCheckboxBold: string;
    agreeCheckboxLabel2: string;
    cancelBtn: string;
    confirmBtn: string;
  };
}

export const paymentTranslations: Record<Language, PaymentTranslations> = {
  en: {
    paymentInformation: "Payment Information",
    secureCheckout: {
      badge: "Stripe Official Elements",
      title: "Secure Card Checkout",
      pciBadge: "PCI-DSS Certified 256-Bit SSL",
    },
    passIncluded: {
      title: "Session Included with Pass / Membership",
      desc: "No payment card is required. 1 session credit will be deducted directly from your account.",
    },
    methodSelector: {
      label: "Select Payment Method",
      cardTitle: "Credit / Debit Card",
      cardDesc: "Visa, Mastercard, Amex",
      idealTitle: "iDEAL Online Banking",
      idealDesc: "Dutch Banks (ING, Rabo, ABN)",
    },
    cardFields: {
      nameOnCard: "Name on Card",
      namePlaceholder: "e.g. John Doe",
      cardNumber: "Card Number",
      expires: "Expires (MM/YY)",
      cvc: "CVC / CVV",
      zip: "Zip / Postal Code",
      zipPlaceholder: "1011 AB",
    },
    idealFields: {
      selectBank: "Select your Dutch Bank",
      redirectNotice: "You will be redirected securely to your bank to authorize the iDEAL transaction.",
    },
    totalDueToday: "Total Due Today",
    totalAmountDue: "Total Amount Due",
    buttons: {
      confirmBookingCredit: "Confirm Booking (Deduct Session)",
      confirmAndPay: "Confirm & Pay",
      confirmingBooking: "Confirming Booking...",
    },
    errors: {
      genericFailure: "Payment processing failed. Please check your card details and try again.",
    },
    policyCard: {
      title: "Cancellation, Rescheduling & Refund Policy",
      subtitlePrefix: "Cancellations or changes are permitted up to ",
      subtitleHighlight: "24 hours",
      subtitleSuffix: " before your scheduled time.",
      reviewPolicyBtn: "Review Policy",
      readPolicyBtn: "Read Policy",
      acknowledgedText: "Policy acknowledged & accepted (24h requirement agreed)",
      unacknowledgedPrefix: "Please click to ",
      unacknowledgedAction: "read and accept",
      unacknowledgedSuffix: " the cancellation & refund policy",
      openPolicyLink: "Open Policy",
      changePolicyLink: "Change",
    },
    policyModal: {
      title: "Cancellation, Rescheduling & Refund Policy",
      subtitle: "Please read through our terms carefully before accepting.",
      importantNoticeTitle: "Important Notice:",
      importantNoticeBody: "Please cancel or reschedule at least 24 hours before your scheduled session to avoid losing your booked session or credit. Late cancellations and missed appointments will result in the booked session or credit being considered used, including for members and session-pass holders.",
      sec1Title: "1. Cancellation and Rescheduling Policy",
      sec1Intro: "Customers may cancel or reschedule a wellness reservation up to ",
      sec1IntroBold: "24 hours before the scheduled start time.",
      sec1Point1Title: "More than 24 hours before the session:",
      sec1Point1Body: "Customers may cancel or reschedule their reservation in accordance with the applicable refund, credit, and booking policies.",
      sec1Point2Title: "Within 24 hours of the session:",
      sec1Point2Body: "Cancellations and rescheduling are no longer permitted free of charge. The applicable late cancellation policy will apply.",
      sec1Point3Title: "At or after the scheduled start time:",
      sec1Point3Body: "Cancellations or changes are not permitted under the standard cancellation policy.",
      sec2Title: "2. Policy for Members and Session-Pass Holders",
      sec2Intro: "The same 24-hour cancellation and rescheduling policy applies to all members and session-pass holders.",
      sec2Point1Title: "Timely cancellation (more than 24 hours in advance):",
      sec2Point1Body: "The session or credit used for the booking will be returned to the customer's account and made available for future bookings, subject to the applicable membership or session-pass terms.",
      sec2Point2Title: "Late cancellation (within 24 hours):",
      sec2Point2Body: "The booked session or credit will be considered used and will not be restored.",
      sec2Point3Title: "No-show:",
      sec2Point3Body: "If a customer fails to attend the booked session without cancelling in accordance with the policy, the session or credit will be considered used and will not be restored.",
      sec3Title: "3. Refunds and Credits",
      sec3Body: "Refunds, credits, and the restoration of sessions are subject to the applicable payment, membership, and session-pass terms. A timely cancellation does not automatically guarantee a monetary refund. Eligible refunds or credits will be processed according to the rules applicable to the original booking and payment method.",
      sec4Title: "4. Booking Confirmation and Customer Acknowledgment",
      sec4Body: "The cancellation and rescheduling policy will be clearly displayed during the booking process and included in the booking confirmation. By completing a reservation, customers acknowledge that they have read and accepted the applicable cancellation, rescheduling, refund, and credit rules.",
      agreeCheckboxLabel1: "I have read, understood, and accept the ",
      agreeCheckboxBold: "Cancellation, Rescheduling & Refund Policy",
      agreeCheckboxLabel2: ", including the 24-hour notice requirement.",
      cancelBtn: "Cancel",
      confirmBtn: "Confirm & Continue",
    },
  },
  nl: {
    paymentInformation: "Betalingsinformatie",
    secureCheckout: {
      badge: "Officiële Stripe Elements",
      title: "Veilige Kaartbetaling",
      pciBadge: "PCI-DSS Gecertificeerd 256-Bit SSL",
    },
    passIncluded: {
      title: "Sessie Inbegrepen bij Pas / Lidmaatschap",
      desc: "Geen betaalkaart vereist. Er wordt direct 1 sessietegoed van je account afgeschreven.",
    },
    methodSelector: {
      label: "Selecteer Betaalmethode",
      cardTitle: "Credit- / Debetkaart",
      cardDesc: "Visa, Mastercard, Amex",
      idealTitle: "iDEAL Online Bankieren",
      idealDesc: "Nederlandse banken (ING, Rabo, ABN)",
    },
    cardFields: {
      nameOnCard: "Naam op de Kaart",
      namePlaceholder: "bijv. Jan Jansen",
      cardNumber: "Kaartnummer",
      expires: "Vervaldatum (MM/JJ)",
      cvc: "CVC / CVV",
      zip: "Postcode",
      zipPlaceholder: "1011 AB",
    },
    idealFields: {
      selectBank: "Selecteer je Nederlandse bank",
      redirectNotice: "Je wordt veilig doorgestuurd naar je bankomgeving om de iDEAL-transactie te voltooien.",
    },
    totalDueToday: "Totaal Nu Verschuldigd",
    totalAmountDue: "Totaalbedrag",
    buttons: {
      confirmBookingCredit: "Boeking Bevestigen (Sessie Afschrijven)",
      confirmAndPay: "Bevestigen & Betalen",
      confirmingBooking: "Boeking Bevestigen...",
    },
    errors: {
      genericFailure: "Betalingsverwerking mislukt. Controleer je kaartgegevens en probeer het opnieuw.",
    },
    policyCard: {
      title: "Annulerings-, Verplaatsings- & Terugbetalingsbeleid",
      subtitlePrefix: "Annuleren of wijzigen is kosteloos toegestaan tot ",
      subtitleHighlight: "24 uur",
      subtitleSuffix: " voor aanvang van je sessie.",
      reviewPolicyBtn: "Bekijk Beleid",
      readPolicyBtn: "Lees Beleid",
      acknowledgedText: "Beleid erkend & geaccepteerd (24-uurs termijn akkoord)",
      unacknowledgedPrefix: "Klik hier om het annulerings- & terugbetalingsbeleid te ",
      unacknowledgedAction: "lezen en accepteren",
      unacknowledgedSuffix: "",
      openPolicyLink: "Beleid Openen",
      changePolicyLink: "Wijzigen",
    },
    policyModal: {
      title: "Annulerings-, Verplaatsings- & Terugbetalingsbeleid",
      subtitle: "Lees onze voorwaarden zorgvuldig door alvorens akkoord te gaan.",
      importantNoticeTitle: "Belangrijke Kennisgeving:",
      importantNoticeBody: "Annuleer of verplaats minimaal 24 uur voor aanvang van je geboekte sessie om verlies van je sessie of tegoed te voorkomen. Bij te late annulering of no-show wordt de sessie of het tegoed als verbruikt beschouwd, ook voor leden en pashouders.",
      sec1Title: "1. Annulerings- en Verplaatsingsbeleid",
      sec1Intro: "Klanten kunnen een wellnessreservering kosteloos annuleren of verplaatsen tot ",
      sec1IntroBold: "24 uur voor de geplande aanvangstijd.",
      sec1Point1Title: "Meer dan 24 uur voor de sessie:",
      sec1Point1Body: "Klanten kunnen hun reservering annuleren of verplaatsen conform de toepasselijke restitutie-, tegoed- en boekingsvoorwaarden.",
      sec1Point2Title: "Binnen 24 uur voor de sessie:",
      sec1Point2Body: "Kosteloos annuleren of verplaatsen is niet meer mogelijk. De regeling voor te late annulering is van toepassing.",
      sec1Point3Title: "Op of na de geplande aanvangstijd:",
      sec1Point3Body: "Annuleringen of wijzigingen zijn niet toegestaan onder het reguliere annuleringsbeleid.",
      sec2Title: "2. Beleid voor Leden en Rittenkaarthouders",
      sec2Intro: "Ditzelfde 24-uursbeleid voor annuleren en verplaatsen geldt voor alle leden en pashouders.",
      sec2Point1Title: "Tijdige annulering (meer dan 24 uur van tevoren):",
      sec2Point1Body: "De gebruikte sessie of credit wordt teruggestort op het account en blijft beschikbaar voor toekomstige boekingen volgens de lidmaatschapsvoorwaarden.",
      sec2Point2Title: "Te late annulering (binnen 24 uur):",
      sec2Point2Body: "De geboekte sessie of het tegoed wordt als verbruikt beschouwd en niet hersteld.",
      sec2Point3Title: "Niet opdagen (no-show):",
      sec2Point3Body: "Indien men zonder tijdige afmelding niet verschijnt, vervalt de sessie of het tegoed definitief.",
      sec3Title: "3. Terugbetalingen en Tegoeden",
      sec3Body: "Restituties, tegoeden en herstel van sessies zijn onderworpen aan de toepasselijke betalings- en lidmaatschapsvoorwaarden. Een tijdige annulering geeft niet automatisch recht op een geldelijke terugbetaling; eventuele restituties geschieden volgens de regels van de oorspronkelijke betaalmethode.",
      sec4Title: "4. Boekingsbevestiging en Akkoordverklaring",
      sec4Body: "Het annulerings- en verplaatsingsbeleid wordt duidelijk getoond tijdens het reserveringsproces en opgenomen in de bevestigingsmail. Door de reservering te voltooien verklaart de klant kennis te hebben genomen van en akkoord te gaan met deze voorwaarden.",
      agreeCheckboxLabel1: "Ik heb het ",
      agreeCheckboxBold: "Annulerings-, Verplaatsings- & Terugbetalingsbeleid",
      agreeCheckboxLabel2: " gelezen en ga akkoord met de 24-uurs annuleringsvoorwaarde.",
      cancelBtn: "Annuleren",
      confirmBtn: "Bevestigen & Doorgaan",
    },
  },
  de: {
    paymentInformation: "Zahlungsinformationen",
    secureCheckout: {
      badge: "Offizielle Stripe Elements",
      title: "Sichere Kartenzahlung",
      pciBadge: "PCI-DSS-Zertifiziertes 256-Bit SSL",
    },
    passIncluded: {
      title: "Sitzung im Pass / in der Mitgliedschaft Enthalten",
      desc: "Keine Zahlungskarte erforderlich. 1 Sitzungsguthaben wird direkt von Ihrem Konto abgebucht.",
    },
    methodSelector: {
      label: "Zahlungsmethode Wählen",
      cardTitle: "Kredit- / Debitkarte",
      cardDesc: "Visa, Mastercard, Amex",
      idealTitle: "iDEAL Online-Banking",
      idealDesc: "Niederländische Banken (ING, Rabo, ABN)",
    },
    cardFields: {
      nameOnCard: "Name auf der Karte",
      namePlaceholder: "z.B. Max Mustermann",
      cardNumber: "Kartennummer",
      expires: "Gültig bis (MM/JJ)",
      cvc: "CVC / CVV",
      zip: "Postleitzahl",
      zipPlaceholder: "1011 AB",
    },
    idealFields: {
      selectBank: "Wählen Sie Ihre niederländische Bank",
      redirectNotice: "Sie werden sicher zu Ihrer Bank weitergeleitet, um die iDEAL-Zahlung zu autorisieren.",
    },
    totalDueToday: "Heute Fälliger Gesamtbetrag",
    totalAmountDue: "Gesamtbetrag",
    buttons: {
      confirmBookingCredit: "Buchung Bestätigen (Guthaben Abbuchen)",
      confirmAndPay: "Bestätigen & Zahlen",
      confirmingBooking: "Buchung wird bestätigt...",
    },
    errors: {
      genericFailure: "Zahlungsabwicklung fehlgeschlagen. Bitte überprüfen Sie Ihre Kartendaten und versuchen Sie es erneut.",
    },
    policyCard: {
      title: "Stornierungs-, Umbuchungs- & Erstattungsrichtlinie",
      subtitlePrefix: "Stornierungen oder Änderungen sind bis zu ",
      subtitleHighlight: "24 Stunden",
      subtitleSuffix: " vor Ihrem gebuchten Termin kostenfrei möglich.",
      reviewPolicyBtn: "Richtlinie Ansehen",
      readPolicyBtn: "Richtlinie Lesen",
      acknowledgedText: "Richtlinie zur Kenntnis genommen & akzeptiert (24-Std.-Frist zugestimmt)",
      unacknowledgedPrefix: "Bitte klicken Sie hier, um die Stornierungs- & Erstattungsrichtlinie zu ",
      unacknowledgedAction: "lesen und zu akzeptieren",
      unacknowledgedSuffix: "",
      openPolicyLink: "Richtlinie Öffnen",
      changePolicyLink: "Ändern",
    },
    policyModal: {
      title: "Stornierungs-, Umbuchungs- & Erstattungsrichtlinie",
      subtitle: "Bitte lesen Sie unsere Bedingungen vor der Bestätigung sorgfältig durch.",
      importantNoticeTitle: "Wichtiger Hinweis:",
      importantNoticeBody: "Bitte stornieren oder verschieben Sie Ihre Sitzung mindestens 24 Stunden vor Beginn, um den Verlust Ihrer gebuchten Einheit oder Ihres Guthabens zu vermeiden. Bei verspäteten Stornierungen oder Nichterscheinen gilt die Einheit als in Anspruch genommen, auch für Mitglieder und Pass-Inhaber.",
      sec1Title: "1. Stornierungs- und Umbuchungsbedingungen",
      sec1Intro: "Kunden können eine Wellness-Reservierung bis zu ",
      sec1IntroBold: "24 Stunden vor dem geplanten Beginn stornieren oder verschieben.",
      sec1Point1Title: "Mehr als 24 Stunden vor der Sitzung:",
      sec1Point1Body: "Kunden können ihre Reservierung gemäß den geltenden Erstattungs-, Guthaben- und Buchungsbedingungen stornieren oder umbuchen.",
      sec1Point2Title: "Innerhalb von 24 Stunden vor der Sitzung:",
      sec1Point2Body: "Kostenfreie Stornierungen und Umbuchungen sind nicht mehr möglich. Es greift die Richtlinie für verspätete Stornierungen.",
      sec1Point3Title: "Zum oder nach dem geplanten Beginn:",
      sec1Point3Body: "Stornierungen oder Änderungen sind unter den Standardbedingungen ausgeschlossen.",
      sec2Title: "2. Regelung für Mitglieder und Pass-Inhaber",
      sec2Intro: "Dieselbe 24-Stunden-Regelung gilt gleichermaßen für alle Mitglieder und Mehrfachpass-Inhaber.",
      sec2Point1Title: "Rechtzeitige Stornierung (mehr als 24 Stunden vorher):",
      sec2Point1Body: "Die genutzte Einheit oder das Guthaben wird dem Kundenkonto wieder gutgeschrieben und steht für zukünftige Buchungen bereit.",
      sec2Point2Title: "Verspätete Stornierung (innerhalb von 24 Stunden):",
      sec2Point2Body: "Die gebuchte Sitzung oder das Guthaben gilt als verbraucht und wird nicht wiederhergestellt.",
      sec2Point3Title: "Nichterscheinen (No-Show):",
      sec2Point3Body: "Erscheint ein Kunde ohne rechtzeitige Absage nicht zum Termin, verfällt die Sitzung ersatzlos.",
      sec3Title: "3. Rückerstattungen und Guthaben",
      sec3Body: "Erstattungen, Gutschriften und die Wiederherstellung von Sitzungen richten sich nach den jeweils vereinbarten Zahlungs- und Mitgliedschaftsbedingungen. Eine rechtzeitige Stornierung garantiert keine automatische Barauszahlung; berechtigte Erstattungen erfolgen über die ursprüngliche Zahlungsmethode.",
      sec4Title: "4. Buchungsbestätigung und Kundenanerkennung",
      sec4Body: "Die Stornierungs- und Umbuchungsbedingungen werden während des Buchungsvorgangs deutlich angezeigt und in der Bestätigungs-E-Mail aufgeführt. Mit Abschluss der Buchung bestätigt der Kunde, diese Bedingungen gelesen und akzeptiert zu haben.",
      agreeCheckboxLabel1: "Ich habe die ",
      agreeCheckboxBold: "Stornierungs-, Umbuchungs- & Erstattungsrichtlinie",
      agreeCheckboxLabel2: " gelesen und akzeptiere die 24-Stunden-Frist.",
      cancelBtn: "Abbrechen",
      confirmBtn: "Bestätigen & Weiter",
    },
  },
};

