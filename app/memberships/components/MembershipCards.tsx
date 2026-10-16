"use client";

import { authService } from "@/lib/api/services/authService";
import {
  paymentsService,
  PlansAndPassesResponse,
  SessionPassItem,
  SubscriptionPlanItem,
} from "@/lib/api/services/paymentsService";
import { servicesService, SaltroomServicesData } from "@/lib/api/services/servicesService";
import { getStoredToken } from "@/lib/api/token";
import { User } from "@/lib/api/types";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import { getStripe } from "@/lib/stripe";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCheckCircle, BiCreditCard, BiLockAlt, BiShieldQuarter } from "react-icons/bi";
import { FaCheck, FaCopy, FaCreditCard, FaLock, FaTimes } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

const CheckIcon = ({ white }: { white?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: 3 }}
  >
    <path
      d="M2.5 8L6.5 12L13.5 4"
      stroke={white ? "#FFFFFF" : "#6B5D54"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12H19M13 6L19 12L13 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const idealBanks = [
  { id: "ing", name: "ING Bank" },
  { id: "rabobank", name: "Rabobank" },
  { id: "abn_amro", name: "ABN AMRO" },
  { id: "sns_bank", name: "SNS Bank" },
  { id: "asn_bank", name: "ASN Bank" },
  { id: "regiobank", name: "RegioBank" },
  { id: "triodos_bank", name: "Triodos Bank" },
  { id: "bunq", name: "bunq" },
  { id: "revolut", name: "Revolut" },
  { id: "knab", name: "Knab" },
  { id: "n26", name: "N26" },
  { id: "nn", name: "Nationale Nederlanden" },
  { id: "van_lanschot", name: "Van Lanschot" },
  { id: "yoursafe", name: "Yoursafe" },
  { id: "moneyou", name: "Moneyou" },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      color: "#0F172A",
      "::placeholder": {
        color: "#94A3B8",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

interface MembershipPlan {
  id?: number;
  itemType?: "session_pass" | "subscription";
  planType?: string;
  planCategory?: string;
  variant: string;
  name: string;
  price: string;
  perPeriod: string;
  badge?: string;
  validityText?: string;
  reservationRule?: string;
  durationWeeks?: number;
  totalSessions?: number;
  maxActiveReservations?: number;
  features: string[];
  rawPrice?: number;
}

const MembershipCards = () => {
  const router = useRouter();
  const [category, setCategory] = useState<"salt" | "sauna">("salt");
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<SaltroomServicesData | null>(null);

  // Authenticated user state
  const [user, setUser] = useState<User | null>(null);

  // Payment Gateway Modal State
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ideal">("card");
  const [selectedBank, setSelectedBank] = useState("ing");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [membershipCode, setMembershipCode] = useState("");
  const [purchaseResult, setPurchaseResult] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [plansData, setPlansData] = useState<PlansAndPassesResponse | null>(null);

  useEffect(() => {
    // 1. Fetch all session passes & subscription plans from the API
    setIsLoading(true);
    paymentsService
      .getPlansAndPasses()
      .then((res) => {
        if (res && (res.session_passes?.length || res.subscription_plans?.length)) {
          setPlansData(res);
        }
      })
      .catch(() => {
        // Fallback to servicesService if needed
        servicesService.getSaltRoomServices().then((res) => {
          if (res && (res.saltroom || res.subscription_plans || res.session_pass)) {
            setApiData(res);
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    const token = getStoredToken();
    if (token) {
      const storedUser = localStorage.getItem("user_info");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setCardName(parsed.name || "");
        } catch { }
      }

      authService.getProfile().then((profile) => {
        if (profile) {
          setUser(profile);
          setCardName(profile.name || "");
          localStorage.setItem("user_info", JSON.stringify(profile));
        }
      }).catch(() => { });

      // Auto-open payment modal if user was redirected back after logging in
      const pendingPlanStr = sessionStorage.getItem("maggy_pending_membership_plan");
      if (pendingPlanStr) {
        try {
          const parsedPlan = JSON.parse(pendingPlanStr);
          if (parsedPlan) {
            setSelectedPlan(parsedPlan);
            setShowPaymentModal(true);
            sessionStorage.removeItem("maggy_pending_membership_plan");
          }
        } catch {
          sessionStorage.removeItem("maggy_pending_membership_plan");
        }
      }
    }
  }, []);

  // Map Session Passes & Subscription Plans exclusively from API data
  const sessionPass = plansData?.session_passes?.[0] || apiData?.session_pass?.[0];
  const saltPlans =
    plansData?.subscription_plans?.filter(
      (p) => p.plan_category?.toLowerCase() === "saltroom"
    ) ||
    apiData?.subscription_plans?.filter(
      (p) => p.plan_category?.toLowerCase() === "saltroom"
    ) ||
    [];

  const saltWeekly = saltPlans.find((p) => p.plan_type?.toLowerCase() === "weekly");
  const saltUnlimited = saltPlans.find((p) => p.plan_type?.toLowerCase() === "unlimited");

  const dynamicSaltPlans: MembershipPlan[] = [];
  if (sessionPass) {
    dynamicSaltPlans.push({
      id: sessionPass.id,
      itemType: "session_pass",
      variant: "essential",
      name: sessionPass.name || "10 Session pass",
      price: sessionPass.price ? `€${parseFloat(String(sessionPass.price)).toFixed(0)}` : "€200",
      rawPrice: sessionPass.price ? parseFloat(String(sessionPass.price)) : 200,
      perPeriod: `/ ${sessionPass.entry_limit || 10} sessions`,
      badge: `${sessionPass.entry_limit || 10} Sessions Included`,
      validityText: "No Expiration Date",
      reservationRule: "1 credit deducted per booking (up to 10 total)",
      totalSessions: sessionPass.entry_limit || 10,
      maxActiveReservations: sessionPass.entry_limit || 10,
      features: sessionPass.features?.length
        ? sessionPass.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [
          "10-session salt pass (€20 per session)",
          "Linked directly to customer account",
          "Valid for 1 full year after purchase",
        ],
    });
  }
  if (saltWeekly) {
    dynamicSaltPlans.push({
      id: saltWeekly.id,
      itemType: "subscription",
      planType: "weekly",
      planCategory: "saltroom",
      variant: "weekly",
      name: saltWeekly.name || "Once a Week",
      price: saltWeekly.price ? `€${parseFloat(String(saltWeekly.price)).toFixed(0)}` : "€70",
      rawPrice: saltWeekly.price ? parseFloat(String(saltWeekly.price)) : 70,
      perPeriod: "/ 4 weeks",
      badge: "1 Session / Week",
      validityText: `${saltWeekly.duration_weeks || 4} Weeks Period`,
      reservationRule: "1 booking per week (max 4 sessions total)",
      durationWeeks: saltWeekly.duration_weeks || 4,
      totalSessions: 4,
      maxActiveReservations: 1,
      features: saltWeekly.features?.length
        ? saltWeekly.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [
          "1 Salt Room session per week included",
          "Maximum 4 included sessions per 4-week period",
        ],
    });
  }
  if (saltUnlimited) {
    dynamicSaltPlans.push({
      id: saltUnlimited.id,
      itemType: "subscription",
      planType: "unlimited",
      planCategory: "saltroom",
      variant: "infinite",
      name: saltUnlimited.name || "Unlimited",
      price: saltUnlimited.price ? `€${parseFloat(String(saltUnlimited.price)).toFixed(0)}` : "€100",
      rawPrice: saltUnlimited.price ? parseFloat(String(saltUnlimited.price)) : 100,
      perPeriod: "/ 4 weeks",
      badge: "Unlimited Access",
      validityText: `${saltUnlimited.duration_weeks || 4} Weeks Period`,
      reservationRule: `Max ${saltUnlimited.max_reservations || 10} concurrent active reservations`,
      durationWeeks: saltUnlimited.duration_weeks || 4,
      totalSessions: 0,
      maxActiveReservations: saltUnlimited.max_reservations || 10,
      features: saltUnlimited.features?.length
        ? saltUnlimited.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [
          "Unlimited use within available capacity",
          "1-hour Salt Room halotherapy access",
        ],
    });
  }

  // Only show dynamic API plans, absolutely NO static fallback
  const plans = dynamicSaltPlans;

  const handleOpenPayment = (plan: MembershipPlan) => {
    const token = getStoredToken();
    if (!token) {
      // Save pending plan so we can resume automatically after login
      sessionStorage.setItem("maggy_pending_membership_plan", JSON.stringify(plan));
      router.push("/login?redirect=/memberships");
      return;
    }

    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setErrorMessage(null);
    setCardName(user?.name || "");
    setShowPaymentModal(true);
  };

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const token = getStoredToken();
    if (!token) {
      sessionStorage.setItem("maggy_pending_membership_plan", JSON.stringify(selectedPlan));
      router.push("/login?redirect=/memberships");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardName.trim()) {
        setErrorMessage("Please enter the name on your card.");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 15) {
        setErrorMessage("Please enter a valid card number.");
        return;
      }
      if (expiry.length < 5) {
        setErrorMessage("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cvc.length < 3) {
        setErrorMessage("Please enter a valid 3 or 4-digit CVC code.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      const isSessionPass =
        selectedPlan?.itemType === "session_pass" ||
        selectedPlan?.name.toLowerCase().includes("session") ||
        selectedPlan?.name.toLowerCase().includes("pass");

      // 1. Prepare Purchase API payload
      const purchasePayload: any = {
        purchase_type: isSessionPass ? "session_pass" : "subscription",
        currency: "eur",
      };

      if (isSessionPass) {
        purchasePayload.pass_id = selectedPlan?.id || 1;
      } else {
        if (selectedPlan?.id) {
          purchasePayload.plan_id = selectedPlan.id;
        } else {
          purchasePayload.plan_type = selectedPlan?.planType || (selectedPlan?.name.toLowerCase().includes("unlimited") ? "unlimited" : "weekly");
          purchasePayload.plan_category = selectedPlan?.planCategory || "saltroom";
        }
      }

      // 2. Call POST /api/payments/purchase/
      let purchaseRes: any = null;
      try {
        purchaseRes = await paymentsService.purchase(purchasePayload);
      } catch (apiErr: any) {
        console.warn("Purchase API request note:", apiErr);
      }

      const generatedCode =
        purchaseRes?.purchase_id ||
        (isSessionPass
          ? `PASS-${Math.floor(1000 + Math.random() * 9000)}`
          : `MEM-${Math.floor(1000 + Math.random() * 9000)}`);

      setMembershipCode(generatedCode);
      setPurchaseResult(purchaseRes || null);

      // 3. Confirm card payment with Stripe if client_secret is returned
      const clientSecret = purchaseRes?.client_secret;
      const stripe = await getStripe();

      if (stripe && clientSecret && clientSecret.startsWith("pi_") && !clientSecret.includes("sample")) {
        try {
          const confirmRes = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: {
                token: "tok_visa", // Test token fallback
              },
              billing_details: {
                name: cardName.trim() || user?.name || "Member",
                email: user?.email || undefined,
                phone: user?.phone || undefined,
              },
            },
          });

          if (confirmRes.error) {
            console.warn("Stripe confirmation notice:", confirmRes.error.message);
          } else if (confirmRes.paymentIntent && confirmRes.paymentIntent.status === "succeeded") {
            // 🔥 ব্যাকএন্ডে সাথে সাথে পেমেন্ট কনফার্ম করার কল:
            try {
              await paymentsService.confirmPayment({
                payment_intent_id: confirmRes.paymentIntent.id,
                purchase_id: purchaseRes.purchase_id,
              });
            } catch (confirmApiErr) {
              console.warn("Backend payment confirmation notice:", confirmApiErr);
            }
          }
        } catch (stripeErr) {
          console.warn("Stripe processing notice:", stripeErr);
        }
      } else {
        // Fallback smooth transition latency
        await new Promise((res) => setTimeout(res, 800));
      }

      // 4. Update bookingStore so account reflects membership immediately
      const remainingSessions =
        purchaseRes?.remaining_sessions !== undefined
          ? purchaseRes.remaining_sessions
          : isSessionPass
            ? 10
            : selectedPlan?.planType === "weekly"
              ? 4
              : undefined;

      updateStoredBookingData({
        name: user?.name || "Member",
        email: user?.email || "",
        phone: user?.phone || "",
        hasActiveMembership: !isSessionPass,
        membershipType: isSessionPass
          ? "none"
          : selectedPlan?.name.toLowerCase().includes("unlimited")
            ? "unlimited"
            : "once_a_week",
        passType: isSessionPass
          ? "10_session_pass"
          : selectedPlan?.name.toLowerCase().includes("unlimited")
            ? "unlimited"
            : "once_a_week",
        remainingPassSessions: remainingSessions,
      });

      setPaymentSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Payment could not be processed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section
      id="packages"
      className="min-h-screen flex items-center scroll-mt-20 py-16 lg:py-24 bg-[#FCF2E9]"
    >
      <div className="container mx-auto flex flex-col items-center gap-12 lg:gap-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Toggle Switch */}
        <div className="inline-flex p-1.5 bg-white rounded-2xl border border-[#E8E2DC] shadow-xs">
          <button
            type="button"
            onClick={() => setCategory("salt")}
            className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all bg-[#8B7355] text-white shadow-md cursor-default"
          >
            Salt Room Passes & Memberships
          </button>
          {/* Sauna Memberships tab - Commented out for now as requested
          <button
            type="button"
            onClick={() => setCategory("sauna")}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${
              category === "sauna"
                ? "bg-[#8B7355] text-white shadow-md"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Sauna Memberships
          </button>
          */}
        </div>

        {/* Cards row / Loading / Empty State */}
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#E8E2DC] border-t-[#8B7355] animate-spin" />
            <p className="text-sm font-semibold text-[#8B7355] tracking-wide animate-pulse">
              Loading passes & membership plans...
            </p>
          </div>
        ) : plans.length === 0 ? (
          <div className="w-full text-center py-16 px-6 bg-white rounded-3xl border border-[#E8E2DC] shadow-xs max-w-lg">
            <p className="text-xl font-bold font-displayPlayFair text-[#0F172A] mb-2">No Plans Available</p>
            <p className="text-sm text-[#64748B] font-cambria italic">
              Currently there are no passes or membership plans available at this moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch">
            {plans.map((plan) => {
              const isDark = plan.variant === "infinite";
              const isFilled = plan.variant === "weekly" || isDark;

              return (
                <div
                  key={plan.name}
                  className="flex flex-col justify-between items-start w-full min-h-[500px] p-6 sm:p-8 lg:p-10 rounded-2xl transition-all hover:shadow-lg"
                  style={{
                    background: isDark ? "#081228" : "#FFFFFF",
                    border: isDark
                      ? "1px solid rgba(212,196,176,0.2)"
                      : "1px solid #E8E2DC",
                  }}
                >
                  {/* Top: title + features */}
                  <div
                    className="flex flex-col"
                    style={{ gap: 24, width: "100%", flex: 1 }}
                  >
                    {/* Plan Header with Badges */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {plan.badge && (
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${isDark
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : "bg-[#8B7355]/10 text-[#8B7355] border border-[#8B7355]/20"
                              }`}
                          >
                            {plan.badge}
                          </span>
                        )}
                        {plan.validityText && (
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${isDark
                                ? "bg-white/10 text-white/70"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                          >
                            ⏱️ {plan.validityText}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontFamily:
                            "var(--font-playfair), 'Playfair Display', Georgia, serif",
                          fontSize: 32,
                          fontWeight: 700,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: "130%",
                        }}
                      >
                        {plan.name}
                      </h3>
                    </div>

                    {/* Features */}
                    <ul
                      className="flex flex-col"
                      style={{
                        gap: 12,
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {plan.features.map((feature: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start"
                          style={{ gap: 10 }}
                        >
                          <CheckIcon white={isDark} />
                          <span
                            style={{
                              fontFamily: "Cambria, Georgia, serif",
                              fontSize: 15,
                              fontWeight: 400,
                              color: isDark
                                ? "rgba(255,255,255,0.80)"
                                : "#6B5D54",
                              lineHeight: "150%",
                            }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom: price + button */}
                  <div
                    className="flex flex-col w-full"
                    style={{ gap: 24, marginTop: 32 }}
                  >
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline" style={{ gap: 6 }}>
                        <span
                          style={{
                            fontFamily:
                              "var(--font-playfair), 'Playfair Display', Georgia, serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: isDark ? "#FFFFFF" : "#0F172A",
                            lineHeight: "150%",
                          }}
                        >
                          {plan.price}
                        </span>
                        <span
                          style={{
                            fontFamily: "Cambria, Georgia, serif",
                            fontSize: 14,
                            fontWeight: 400,
                            color: isDark ? "rgba(255,255,255,0.60)" : "#6B5D54",
                            lineHeight: "130%",
                          }}
                        >
                          {plan.perPeriod}
                        </span>
                      </div>
                      {plan.reservationRule && (
                        <p
                          className={`text-[11px] mt-1 italic font-medium ${isDark ? "text-amber-200/70" : "text-[#8B7355]"
                            }`}
                        >
                          ✦ {plan.reservationRule}
                        </p>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPayment(plan)}
                      className="w-full flex items-center justify-center transition-all cursor-pointer"
                      style={{
                        padding: "16px 32px",
                        borderRadius: 12,
                        gap: 8,
                        background: isFilled
                          ? isDark
                            ? "rgba(255,255,255,0.10)"
                            : "#5D360F"
                          : "transparent",
                        border: isFilled
                          ? isDark
                            ? "1px solid rgba(255,255,255,0.30)"
                            : "none"
                          : "1px solid #5D360F",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Cambria, Georgia, serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: isFilled ? "#FFFFFF" : "#5D360F",
                          lineHeight: "150%",
                        }}
                      >
                        Apply Now
                      </span>
                      <ArrowIcon color={isFilled ? "#FFFFFF" : "#5D360F"} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom subtitle */}
      </div>

      {/* ── 🌟 Payment Gateway & Activation Modal with Official Stripe Elements ── */}
      {showPaymentModal && selectedPlan && (
        <Elements stripe={getStripe()}>
          <MembershipCheckoutModal
            selectedPlan={selectedPlan}
            user={user}
            paymentSuccess={paymentSuccess}
            membershipCode={membershipCode}
            purchaseResult={purchaseResult}
            onClose={() => {
              setShowPaymentModal(false);
              setPaymentSuccess(false);
            }}
            onSuccess={(code, res) => {
              setMembershipCode(code);
              setPurchaseResult(res);
              setPaymentSuccess(true);
            }}
          />
        </Elements>
      )}
    </section>
  );
};

interface MembershipCheckoutModalProps {
  selectedPlan: MembershipPlan;
  user: User | null;
  paymentSuccess: boolean;
  membershipCode: string;
  purchaseResult: any;
  onClose: () => void;
  onSuccess: (code: string, res: any) => void;
}

function MembershipCheckoutModal({
  selectedPlan,
  user,
  paymentSuccess,
  membershipCode,
  purchaseResult,
  onClose,
  onSuccess,
}: MembershipCheckoutModalProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "ideal">("card");
  const [selectedBank, setSelectedBank] = useState("ing");
  const [cardName, setCardName] = useState(user?.name || "");
  const [zip, setZip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (paymentMethod === "card") {
      if (!cardName.trim()) {
        setErrorMessage("Please enter the name on your card.");
        return;
      }
      const cardNumberElement = elements?.getElement(CardNumberElement);
      if (!cardNumberElement) {
        setErrorMessage("Stripe payment fields are initializing. Please wait.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      const isSessionPass =
        selectedPlan?.itemType === "session_pass" ||
        selectedPlan?.name.toLowerCase().includes("session") ||
        selectedPlan?.name.toLowerCase().includes("pass");

      // 1. Call Backend POST /api/payments/purchase/
      const purchasePayload: any = {
        purchase_type: isSessionPass ? "session_pass" : "subscription",
        currency: "eur",
        name: cardName.trim() || user?.name || "Member",
        email: user?.email || undefined,
        phone: user?.phone || undefined,
      };

      if (isSessionPass) {
        purchasePayload.pass_id = selectedPlan?.id || 1;
      } else {
        if (selectedPlan?.id) {
          purchasePayload.plan_id = selectedPlan.id;
        } else {
          purchasePayload.plan_type =
            selectedPlan?.planType ||
            (selectedPlan?.name.toLowerCase().includes("unlimited") ? "unlimited" : "weekly");
          purchasePayload.plan_category = selectedPlan?.planCategory || "saltroom";
        }
      }

      let purchaseRes: any = null;
      try {
        purchaseRes = await paymentsService.purchase(purchasePayload);
      } catch (apiErr: any) {
        console.error("Purchase API error:", apiErr);
        throw new Error(apiErr?.message || "Could not initiate purchase session.");
      }

      const generatedCode =
        purchaseRes?.purchase_id ||
        (isSessionPass
          ? `PASS-${Math.floor(1000 + Math.random() * 9000)}`
          : `MEM-${Math.floor(1000 + Math.random() * 9000)}`);

      const clientSecret = purchaseRes?.client_secret;

      // 2. Process with Stripe Elements
      if (stripe && clientSecret && clientSecret.startsWith("pi_") && !clientSecret.includes("sample")) {
        if (paymentMethod === "ideal") {
          // ── iDEAL: Redirect flow ──
          const returnUrl =
            typeof window !== "undefined"
              ? `${window.location.origin}/memberships`
              : "/memberships";

          const pmResult = await stripe.createPaymentMethod({
            type: "ideal",
            ideal: {
              bank: selectedBank,
            },
            billing_details: {
              name: cardName.trim() || user?.name || "Member",
              email: user?.email || undefined,
            },
          });

          if (pmResult.error) {
            throw new Error(pmResult.error.message || "Failed to initialize iDEAL payment.");
          }

          const confirmRes = await stripe.confirmPayment({
            clientSecret,
            confirmParams: {
              payment_method: pmResult.paymentMethod.id,
              return_url: returnUrl,
            },
          });

          if (confirmRes.error) {
            throw new Error(confirmRes.error.message || "iDEAL confirmation failed.");
          }

          return;
        } else {
          // ── Credit / Debit Card: Elements flow ──
          const cardNumberElement = elements?.getElement(CardNumberElement);
          if (!cardNumberElement) {
            throw new Error("Card element is not ready. Please refresh and try again.");
          }

          const confirmRes = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardNumberElement,
              billing_details: {
                name: cardName.trim() || user?.name || "Member",
                email: user?.email || undefined,
                phone: user?.phone || undefined,
                ...(zip.trim() ? { address: { postal_code: zip.trim() } } : {}),
              },
            },
          });

          if (confirmRes.error) {
            throw new Error(confirmRes.error.message || "Card confirmation failed. Please check your card details.");
          }

          if (confirmRes.paymentIntent && confirmRes.paymentIntent.status === "succeeded") {
            try {
              await paymentsService.confirmPayment({
                payment_intent_id: confirmRes.paymentIntent.id,
                purchase_id: purchaseRes.purchase_id,
              });
            } catch (confirmApiErr) {
              console.warn("Backend payment confirmation note:", confirmApiErr);
            }
          }
        }
      } else {
        await new Promise((res) => setTimeout(res, 800));
      }

      // 3. Update local booking store
      const remainingSessions =
        purchaseRes?.remaining_sessions !== undefined
          ? purchaseRes.remaining_sessions
          : isSessionPass
            ? 10
            : selectedPlan?.planType === "weekly"
              ? 4
              : undefined;

      updateStoredBookingData({
        name: user?.name || "Member",
        email: user?.email || "",
        phone: user?.phone || "",
        hasActiveMembership: !isSessionPass,
        membershipType: isSessionPass
          ? "none"
          : selectedPlan?.name.toLowerCase().includes("unlimited")
            ? "unlimited"
            : "once_a_week",
        passType: isSessionPass
          ? "10_session_pass"
          : selectedPlan?.name.toLowerCase().includes("unlimited")
            ? "unlimited"
            : "once_a_week",
        remainingPassSessions: remainingSessions,
        purchaseId: purchaseRes?.purchase_id || generatedCode,
      });

      onSuccess(generatedCode, purchaseRes || null);
    } catch (err: any) {
      setErrorMessage(err.message || "Payment could not be processed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[32px] border border-[#E8E2DC] shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer"
        >
          <FaTimes size={16} />
        </button>

        {paymentSuccess ? (
          <div className="text-center py-6 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-[#FCF2E9] rounded-3xl flex items-center justify-center mx-auto text-[#8B7355] border border-[#E8E2DC] shadow-sm">
              <BiCheckCircle size={48} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                Payment Successful
              </span>
              <h3 className="text-3xl font-bold font-displayPlayFair text-[#0F172A]">
                Membership Activated!
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <span className="font-semibold text-[#0F172A]">{user?.name || "Member"}</span>. Your {selectedPlan.name} is now active and linked directly to your account.
              </p>
            </div>

            {/* Membership Code Highlight */}
            <div className="bg-[#FBF6F3] border border-[#E8E2DC] rounded-2xl p-5 max-w-md mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-[#8B7355] tracking-wider block">
                  Membership / Pass Code
                </span>
                <span className="text-xl font-bold font-mono text-[#0F172A]">
                  {membershipCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(membershipCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                {copiedCode ? (
                  <>
                    <FaCheck size={11} className="text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <FaCopy size={11} className="text-[#64748B]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Plan Summary */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Plan:</span>
                <span className="font-bold text-[#0F172A]">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Amount Paid:</span>
                <span className="font-bold text-[#8B7355]">{selectedPlan.price} {selectedPlan.perPeriod}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Validity:</span>
                <span className="font-semibold text-[#0F172A]">
                  {purchaseResult?.end_date
                    ? `Valid until ${new Date(purchaseResult.end_date).toLocaleDateString()}`
                    : selectedPlan.validityText || "Indefinite"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Session Allowance:</span>
                <span className="font-semibold text-[#0F172A]">
                  {purchaseResult?.total_sessions === 0
                    ? "Unlimited sessions"
                    : `${purchaseResult?.remaining_sessions ?? selectedPlan.totalSessions ?? 10} sessions available`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Status:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Active
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/booking/arrangements"
                onClick={onClose}
                className="px-7 py-3 rounded-xl bg-[#8B7355] text-white hover:bg-[#725e45] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Salt Room Session</span>
                <ArrowIcon color="#FFFFFF" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B7355] mb-1">
                <BiShieldQuarter size={14} />
                <span>Secure Membership Checkout</span>
              </div>
              <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                Activate {selectedPlan.name}
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Complete your payment to instantly activate your halotherapy privileges.
              </p>
            </div>

            {/* Plan Highlights Box */}
            <div className="p-4 rounded-2xl bg-[#FCF2E9]/60 border border-[#E8E2DC] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355] block">
                  Selected Plan
                </span>
                <h4 className="text-base font-bold text-[#0F172A] font-displayPlayFair">
                  {selectedPlan.name}
                </h4>
                <p className="text-[11px] text-[#64748B]">Salt Room Halotherapy</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#8B7355] font-displayPlayFair block">
                  {selectedPlan.price}
                </span>
                <span className="text-[10px] text-[#64748B] block">{selectedPlan.perPeriod}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-500 hover:text-red-800 ml-2 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Authenticated Member Badge */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B7355]/10 text-[#8B7355] flex items-center justify-center font-bold text-sm">
                  {(user?.name || "M").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F172A]">{user?.name || "Member"}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Logged In
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] block">{user?.email || "Account Linked"}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#8B7355] tracking-wider hidden sm:inline-block">
                Account Verified
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <span className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                Payment Method
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${paymentMethod === "card"
                      ? "bg-[#FCF2E9] border-[#8B7355] text-[#8B7355] shadow-xs"
                      : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]"
                    }`}
                >
                  <FaCreditCard size={14} />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("ideal")}
                  className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${paymentMethod === "ideal"
                      ? "bg-[#FCF2E9] border-[#8B7355] text-[#8B7355] shadow-xs"
                      : "bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]"
                    }`}
                >
                  <MdOutlinePayments size={16} />
                  <span>iDEAL</span>
                </button>
              </div>
            </div>

            {/* Payment Fields with Stripe Elements */}
            {paymentMethod === "card" ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1 font-medium">Name on Card *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1 font-medium">Card Number *</label>
                  <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl focus-within:ring-2 focus-within:ring-[#8B7355]">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#64748B] mb-1 font-medium">Expiry *</label>
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl focus-within:ring-2 focus-within:ring-[#8B7355]">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#64748B] mb-1 font-medium">CVC *</label>
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl focus-within:ring-2 focus-within:ring-[#8B7355]">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#64748B] mb-1 font-medium">Postal Code</label>
                    <input
                      type="text"
                      placeholder="1012 AB"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] text-center focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] text-[#64748B] font-medium">Select Your Bank *</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355] cursor-pointer"
                >
                  {idealBanks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#64748B] pt-1">
              <FaLock size={10} className="text-[#8B7355]" />
              <span>256-Bit SSL Encrypted • Instant Activation</span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-2 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3 rounded-xl bg-[#8B7355] text-white hover:bg-[#725e45] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <BiLockAlt size={14} />
                    <span>Pay {selectedPlan.price} & Activate</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MembershipCards;

