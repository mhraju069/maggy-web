import { Language } from "./translations";

export interface AuthTranslations {
  login: {
    heroTitle: string;
    heroSubtitle: string;
    badge: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    signInButton: string;
    signingIn: string;
    orContinueWith: string;
    continueWithGoogle: string;
    continueWithApple: string;
    noAccount: string;
    createAccount: string;
    accountInactive: string;
    verifyOtpLink: string;
    errors: {
      fillAll: string;
      loginFailed: string;
      googleFailed: string;
      appleFailed: string;
    };
  };
  signup: {
    heroTitle: string;
    heroSubtitle: string;
    title: string;
    subtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    createAccountButton: string;
    creatingAccount: string;
    hasAccount: string;
    signInLink: string;
    errors: {
      fillAll: string;
      failed: string;
    };
  };
  forgotPassword: {
    heroTitle: string;
    heroSubtitle: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    sendResetCode: string;
    sendingOtp: string;
    rememberPassword: string;
    backToLogin: string;
    errors: {
      enterEmail: string;
      failed: string;
    };
    successMsg: string;
  };
  resetPassword: {
    heroTitle: string;
    heroSubtitle: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    otpLabel: string;
    otpPlaceholder: string;
    resendCode: string;
    sending: string;
    newPasswordLabel: string;
    newPasswordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    resetPasswordButton: string;
    resettingPassword: string;
    rememberPassword: string;
    backToLogin: string;
    errors: {
      enterEmail: string;
      enterOtp: string;
      minPassword: string;
      passwordMismatch: string;
      failed: string;
    };
    successMsg: string;
    resendSuccess: string;
  };
  verifyOtp: {
    heroTitle: string;
    heroSubtitle: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    otpLabel: string;
    otpPlaceholder: string;
    verifyButton: string;
    verifying: string;
    didNotReceive: string;
    signUpAgain: string;
    loadingForm: string;
    errors: {
      fillAll: string;
      failed: string;
    };
    successMsg: string;
  };
}

export const authTranslations: Record<Language, AuthTranslations> = {
  en: {
    login: {
      heroTitle: "Welcome to the\nCircle of Stillness.",
      heroSubtitle:
        "Membership unlocks exclusive arrangements, priority reservations, and personalized wellness concierge services.",
      badge: "MEMBER ACCESS",
      title: "Member Access",
      subtitle: "Welcome back. Your Heaven awaits.",
      emailLabel: "EMAIL ADDRESS",
      emailPlaceholder: "user@example.com",
      passwordLabel: "PASSWORD",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Forgot password?",
      signInButton: "Sign In",
      signingIn: "Signing in...",
      orContinueWith: "Or continue with",
      continueWithGoogle: "Continue with Google",
      continueWithApple: "Continue with Apple",
      noAccount: "Don't have an account?",
      createAccount: "Create account",
      accountInactive: "Your account is not activated yet.",
      verifyOtpLink: "Verify with OTP",
      errors: {
        fillAll: "Please fill in all fields.",
        loginFailed: "Login failed. Please check your credentials.",
        googleFailed: "Failed to sign in with Google.",
        appleFailed: "Failed to sign in with Apple.",
      },
    },
    signup: {
      heroTitle: "Welcome to the\nCircle of Stillness.",
      heroSubtitle:
        "Membership unlocks exclusive arrangements, priority reservations, and personalized wellness concierge services.",
      title: "Member Access",
      subtitle: "Create your account. Your Heaven awaits.",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Enter your name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      createAccountButton: "Create Account",
      creatingAccount: "Creating Account...",
      hasAccount: "Already have an account?",
      signInLink: "Log In",
      errors: {
        fillAll: "Please fill in all fields.",
        failed: "Registration failed. Please try again.",
      },
    },
    forgotPassword: {
      heroTitle: "Reset Your\nSanctuary Access.",
      heroSubtitle:
        "Enter your email to receive a secure 4-digit verification code to reset your password.",
      title: "Forgot Password",
      subtitle: "We will send a 4-digit OTP code to verify your identity.",
      emailLabel: "EMAIL ADDRESS",
      emailPlaceholder: "user@example.com",
      sendResetCode: "Send Reset Code",
      sendingOtp: "Sending OTP…",
      rememberPassword: "Remember your password?",
      backToLogin: "Back to Log In",
      errors: {
        enterEmail: "Please enter your registered email address.",
        failed: "Failed to send reset code. Please try again.",
      },
      successMsg: "Password reset OTP sent to your email.",
    },
    resetPassword: {
      heroTitle: "Secure Your\nCredentials.",
      heroSubtitle:
        "Set a strong, new password to restore your private access to Haven on Earth.",
      title: "Reset Password",
      subtitle: "Enter the 4-digit code sent to your email along with your new password.",
      emailLabel: "EMAIL ADDRESS",
      emailPlaceholder: "user@example.com",
      otpLabel: "4-DIGIT OTP CODE",
      otpPlaceholder: "e.g. 4829",
      resendCode: "Resend Code",
      sending: "Sending…",
      newPasswordLabel: "NEW PASSWORD",
      newPasswordPlaceholder: "Min. 6 characters",
      confirmPasswordLabel: "CONFIRM NEW PASSWORD",
      confirmPasswordPlaceholder: "Repeat new password",
      resetPasswordButton: "Reset Password",
      resettingPassword: "Resetting…",
      rememberPassword: "Remember your password?",
      backToLogin: "Back to Log In",
      errors: {
        enterEmail: "Please enter your registered email address.",
        enterOtp: "Please enter the 4-digit verification code sent to your email.",
        minPassword: "New password must be at least 6 characters.",
        passwordMismatch: "Passwords do not match.",
        failed: "Failed to reset password. Please check your OTP code.",
      },
      successMsg: "Password reset successful! Redirecting to login…",
      resendSuccess: "A new reset OTP code has been sent to your email.",
    },
    verifyOtp: {
      heroTitle: "Account\nVerification.",
      heroSubtitle:
        "Enter the activation code sent to your registered email to complete your registration.",
      title: "Verify Email OTP",
      subtitle: "Check your inbox for the activation code.",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      otpLabel: "OTP Code",
      otpPlaceholder: "Enter OTP code",
      verifyButton: "Verify OTP",
      verifying: "Verifying...",
      didNotReceive: "Didn't receive code or need to re-register?",
      signUpAgain: "Sign Up Again",
      loadingForm: "Loading verification form...",
      errors: {
        fillAll: "Please enter both email and OTP code.",
        failed: "OTP verification failed. Please check your code.",
      },
      successMsg: "OTP verified successfully. Please log in to continue.",
    },
  },
  nl: {
    login: {
      heroTitle: "Welkom bij de\nCirkel van Rust.",
      heroSubtitle:
        "Lidmaatschap geeft toegang tot exclusieve arrangementen, voorrang bij reserveringen en persoonlijke wellness conciërgediensten.",
      badge: "LEDEN TOEGANG",
      title: "Leden Toegang",
      subtitle: "Welkom terug. Uw Heaven wacht op u.",
      emailLabel: "E-MAILADRES",
      emailPlaceholder: "gebruiker@voorbeeld.nl",
      passwordLabel: "WACHTWOORD",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Wachtwoord vergeten?",
      signInButton: "Inloggen",
      signingIn: "Inloggen...",
      orContinueWith: "Of ga verder met",
      continueWithGoogle: "Doorgaan met Google",
      continueWithApple: "Doorgaan met Apple",
      noAccount: "Heeft u nog geen account?",
      createAccount: "Account aanmaken",
      accountInactive: "Uw account is nog niet geactiveerd.",
      verifyOtpLink: "Verifieer met OTP",
      errors: {
        fillAll: "Vul alstublieft alle velden in.",
        loginFailed: "Inloggen mislukt. Controleer uw gegevens.",
        googleFailed: "Inloggen met Google mislukt.",
        appleFailed: "Inloggen met Apple mislukt.",
      },
    },
    signup: {
      heroTitle: "Welkom bij de\nCirkel van Rust.",
      heroSubtitle:
        "Lidmaatschap geeft toegang tot exclusieve arrangementen, voorrang bij reserveringen en persoonlijke wellness conciërgediensten.",
      title: "Leden Toegang",
      subtitle: "Maak uw account aan. Uw Heaven wacht op u.",
      fullNameLabel: "Volledige Naam",
      fullNamePlaceholder: "Voer uw naam in",
      emailLabel: "E-mailadres",
      emailPlaceholder: "uw@voorbeeld.nl",
      passwordLabel: "Wachtwoord",
      passwordPlaceholder: "••••••••",
      createAccountButton: "Account Aanmaken",
      creatingAccount: "Account aanmaken...",
      hasAccount: "Heeft u al een account?",
      signInLink: "Inloggen",
      errors: {
        fillAll: "Vul alstublieft alle velden in.",
        failed: "Registratie mislukt. Probeer het opnieuw.",
      },
    },
    forgotPassword: {
      heroTitle: "Herstel Uw\nToegang tot de Oase.",
      heroSubtitle:
        "Voer uw e-mailadres in om een veilige 4-cijferige verificatiecode te ontvangen voor uw wachtwoordherstel.",
      title: "Wachtwoord Vergeten",
      subtitle: "We sturen een 4-cijferige OTP-code om uw identiteit te verifiëren.",
      emailLabel: "E-MAILADRES",
      emailPlaceholder: "gebruiker@voorbeeld.nl",
      sendResetCode: "Herstelcode Verzenden",
      sendingOtp: "OTP verzenden…",
      rememberPassword: "Kent u uw wachtwoord nog?",
      backToLogin: "Terug naar Inloggen",
      errors: {
        enterEmail: "Vul alstublieft uw geregistreerde e-mailadres in.",
        failed: "Verzenden van herstelcode mislukt. Probeer het opnieuw.",
      },
      successMsg: "OTP voor wachtwoordherstel verzonden naar uw e-mailadres.",
    },
    resetPassword: {
      heroTitle: "Beveilig Uw\nToegangsgegevens.",
      heroSubtitle:
        "Stel een sterk nieuw wachtwoord in om uw toegang tot Haven on Earth te herstellen.",
      title: "Wachtwoord Opnieuw Instellen",
      subtitle: "Voer de 4-cijferige code in die naar uw e-mail is gestuurd samen met uw nieuwe wachtwoord.",
      emailLabel: "E-MAILADRES",
      emailPlaceholder: "gebruiker@voorbeeld.nl",
      otpLabel: "4-CIJFERIGE OTP-CODE",
      otpPlaceholder: "bijv. 4829",
      resendCode: "Code Opnieuw Verzenden",
      sending: "Verzenden…",
      newPasswordLabel: "NIEUW WACHTWOORD",
      newPasswordPlaceholder: "Min. 6 tekens",
      confirmPasswordLabel: "BEVESTIG NIEUW WACHTWOORD",
      confirmPasswordPlaceholder: "Herhaal nieuw wachtwoord",
      resetPasswordButton: "Wachtwoord Resetten",
      resettingPassword: "Bezig met resetten…",
      rememberPassword: "Kent u uw wachtwoord nog?",
      backToLogin: "Terug naar Inloggen",
      errors: {
        enterEmail: "Vul alstublieft uw geregistreerde e-mailadres in.",
        enterOtp: "Voer de 4-cijferige verificatiecode in die naar uw e-mail is verzonden.",
        minPassword: "Nieuw wachtwoord moet minstens 6 tekens bevatten.",
        passwordMismatch: "Wachtwoorden komen niet overeen.",
        failed: "Wachtwoord resetten mislukt. Controleer uw OTP-code.",
      },
      successMsg: "Wachtwoord succesvol opnieuw ingesteld! U wordt doorgestuurd…",
      resendSuccess: "Er is een nieuwe resetcode naar uw e-mail gestuurd.",
    },
    verifyOtp: {
      heroTitle: "Account\nVerificatie.",
      heroSubtitle:
        "Voer de activatiecode in die naar uw geregistreerde e-mailadres is verzonden om uw registratie te voltooien.",
      title: "E-mail OTP Verifiëren",
      subtitle: "Controleer uw inbox voor de activatiecode.",
      emailLabel: "E-mailadres",
      emailPlaceholder: "uw@voorbeeld.nl",
      otpLabel: "OTP-Code",
      otpPlaceholder: "Voer OTP-code in",
      verifyButton: "OTP Verifiëren",
      verifying: "Verifiëren...",
      didNotReceive: "Geen code ontvangen of opnieuw registreren?",
      signUpAgain: "Opnieuw Registreren",
      loadingForm: "Verificatieformulier laden...",
      errors: {
        fillAll: "Vul alstublieft zowel e-mailadres als OTP-code in.",
        failed: "OTP-verificatie mislukt. Controleer uw code.",
      },
      successMsg: "OTP succesvol geverifieerd. Log alstublieft in om door te gaan.",
    },
  },
  de: {
    login: {
      heroTitle: "Willkommen im\nKreis der Stille.",
      heroSubtitle:
        "Ihre Mitgliedschaft eröffnet exklusive Arrangements, bevorzugte Reservierungen und persönlichen Wellness-Concierge-Service.",
      badge: "MITGLIEDERZUGANG",
      title: "Mitgliederzugang",
      subtitle: "Willkommen zurück. Ihr Himmel erwartet Sie.",
      emailLabel: "E-MAIL-ADRESSE",
      emailPlaceholder: "benutzer@beispiel.de",
      passwordLabel: "PASSWORT",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Passwort vergessen?",
      signInButton: "Anmelden",
      signingIn: "Anmelden...",
      orContinueWith: "Oder fortfahren mit",
      continueWithGoogle: "Weiter mit Google",
      continueWithApple: "Weiter mit Apple",
      noAccount: "Noch kein Konto?",
      createAccount: "Konto erstellen",
      accountInactive: "Ihr Konto ist noch nicht aktiviert.",
      verifyOtpLink: "Mit OTP verifizieren",
      errors: {
        fillAll: "Bitte füllen Sie alle Felder aus.",
        loginFailed: "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.",
        googleFailed: "Anmeldung mit Google fehlgeschlagen.",
        appleFailed: "Anmeldung mit Apple fehlgeschlagen.",
      },
    },
    signup: {
      heroTitle: "Willkommen im\nKreis der Stille.",
      heroSubtitle:
        "Ihre Mitgliedschaft eröffnet exklusive Arrangements, bevorzugte Reservierungen und persönlichen Wellness-Concierge-Service.",
      title: "Mitgliederzugang",
      subtitle: "Erstellen Sie Ihr Konto. Ihr Himmel erwartet Sie.",
      fullNameLabel: "Vollständiger Name",
      fullNamePlaceholder: "Geben Sie Ihren Namen ein",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "ihre@beispiel.de",
      passwordLabel: "Passwort",
      passwordPlaceholder: "••••••••",
      createAccountButton: "Konto Erstellen",
      creatingAccount: "Konto wird erstellt...",
      hasAccount: "Bereits ein Konto?",
      signInLink: "Anmelden",
      errors: {
        fillAll: "Bitte füllen Sie alle Felder aus.",
        failed: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      },
    },
    forgotPassword: {
      heroTitle: "Zugang zum\nRefugium Wiederherstellen.",
      heroSubtitle:
        "Geben Sie Ihre E-Mail-Adresse ein, um einen sicheren 4-stelligen Verifizierungscode zum Zurücksetzen Ihres Passworts zu erhalten.",
      title: "Passwort Vergessen",
      subtitle: "Wir senden Ihnen einen 4-stelligen OTP-Code zur Bestätigung Ihrer Identität.",
      emailLabel: "E-MAIL-ADRESSE",
      emailPlaceholder: "benutzer@beispiel.de",
      sendResetCode: "Reset-Code Senden",
      sendingOtp: "OTP wird gesendet…",
      rememberPassword: "Erinnern Sie sich an Ihr Passwort?",
      backToLogin: "Zurück zur Anmeldung",
      errors: {
        enterEmail: "Bitte geben Sie Ihre registrierte E-Mail-Adresse ein.",
        failed: "Senden des Reset-Codes fehlgeschlagen. Bitte erneut versuchen.",
      },
      successMsg: "OTP zum Zurücksetzen des Passworts an Ihre E-Mail gesendet.",
    },
    resetPassword: {
      heroTitle: "Sichern Sie Ihre\nZugangsdaten.",
      heroSubtitle:
        "Legen Sie ein starkes neues Passwort fest, um Ihren Zugang zu Haven on Earth wiederherzustellen.",
      title: "Passwort Zurücksetzen",
      subtitle: "Geben Sie den 4-stelligen Code aus Ihrer E-Mail zusammen mit Ihrem neuen Passwort ein.",
      emailLabel: "E-MAIL-ADRESSE",
      emailPlaceholder: "benutzer@beispiel.de",
      otpLabel: "4-STELLIGER OTP-CODE",
      otpPlaceholder: "z.B. 4829",
      resendCode: "Code Erneut Senden",
      sending: "Wird gesendet…",
      newPasswordLabel: "NEUES PASSWORT",
      newPasswordPlaceholder: "Mind. 6 Zeichen",
      confirmPasswordLabel: "NEUES PASSWORT BESTÄTIGEN",
      confirmPasswordPlaceholder: "Neues Passwort wiederholen",
      resetPasswordButton: "Passwort Zurücksetzen",
      resettingPassword: "Wird zurückgesetzt…",
      rememberPassword: "Erinnern Sie sich an Ihr Passwort?",
      backToLogin: "Zurück zur Anmeldung",
      errors: {
        enterEmail: "Bitte geben Sie Ihre registrierte E-Mail-Adresse ein.",
        enterOtp: "Bitte geben Sie den 4-stelligen Code aus Ihrer E-Mail ein.",
        minPassword: "Das neue Passwort muss mindestens 6 Zeichen lang sein.",
        passwordMismatch: "Passwörter stimmen nicht überein.",
        failed: "Zurücksetzen des Passworts fehlgeschlagen. Bitte prüfen Sie Ihren OTP-Code.",
      },
      successMsg: "Passwort erfolgreich zurückgesetzt! Weiterleitung zur Anmeldung…",
      resendSuccess: "Ein neuer OTP-Code wurde an Ihre E-Mail gesendet.",
    },
    verifyOtp: {
      heroTitle: "Konto-\nVerifizierung.",
      heroSubtitle:
        "Geben Sie den Aktivierungscode aus Ihrer E-Mail ein, um Ihre Registrierung abzuschließen.",
      title: "E-Mail OTP Verifizieren",
      subtitle: "Prüfen Sie Ihren Posteingang auf den Aktivierungscode.",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "ihre@beispiel.de",
      otpLabel: "OTP-Code",
      otpPlaceholder: "OTP-Code eingeben",
      verifyButton: "OTP Verifizieren",
      verifying: "Verifizieren...",
      didNotReceive: "Keinen Code erhalten oder erneut registrieren?",
      signUpAgain: "Erneut Registrieren",
      loadingForm: "Verifizierungsformular wird geladen...",
      errors: {
        fillAll: "Bitte geben Sie sowohl E-Mail als auch den OTP-Code ein.",
        failed: "OTP-Verifizierung fehlgeschlagen. Bitte prüfen Sie Ihren Code.",
      },
      successMsg: "OTP erfolgreich verifiziert. Bitte melden Sie sich an, um fortzufahren.",
    },
  },
};

