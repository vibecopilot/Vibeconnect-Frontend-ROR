import { useEffect, useState } from "react";
import { getVisitorDynamicQr, getUserOtp } from "../api";
import { useSearchParams } from "react-router-dom";
import QRCode from "qrcode.react";
import LotusLogo from "../assets/LotusLogo.png"
import GoyalLogo from "../assets/GoyalLogo.png"

const getOrdinalSuffix = (day) => {
  const value = Number(day);
  if (!value) return "";
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) return "TH";
  switch (value % 10) {
    case 1:
      return "ST";
    case 2:
      return "ND";
    case 3:
      return "RD";
    default:
      return "TH";
  }
};

const OtpAndQr = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("v");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [otpDigits, setOtpDigits] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [dynamicQrToken, setDynamicQrToken] = useState("");
  const [qrSecondsLeft, setQrSecondsLeft] = useState(30);
  const isCompany57 =
    Number(companyId) === 57 ||
    Number(userData?.site_company_id) === 57 ||
    /titanium\s*tech\s*park/i.test(userData?.site_name || "");

  // Fetch a fresh 32-character QR token every 30 seconds for company 57 only.
  // All other companies keep their existing QR behaviour.
  useEffect(() => {
    if (!id || !isCompany57) {
      setDynamicQrToken("");
      return undefined;
    }
    let cancelled = false;
    let refreshTimer;

    const fetchDynamicQr = async () => {
      try {
        const response = await getVisitorDynamicQr(id);
        if (cancelled) return;

        setDynamicQrToken(response.data?.token || "");
        const refreshIn = Number(response.data?.refresh_in) || 30;
        setQrSecondsLeft(refreshIn);
        refreshTimer = setTimeout(
          fetchDynamicQr,
          Math.max(1, refreshIn) * 1000 + 250
        );
      } catch (error) {
        if (cancelled) return;
        console.error("Error fetching dynamic QR token:", error);
        refreshTimer = setTimeout(fetchDynamicQr, 5000);
      }
    };

    fetchDynamicQr();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(refreshTimer);
        fetchDynamicQr();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      clearTimeout(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [id, isCompany57]);

  useEffect(() => {
    if (!dynamicQrToken) return undefined;
    const countdown = setInterval(() => {
      setQrSecondsLeft((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [dynamicQrToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const response = await getUserOtp(id);
     setUserData(response.data);
setCompanyId(response.data.company_id);

        if (response.data.otp) {
          setOtpDigits(response.data.otp.toString().split(""));
        }
      } catch (error) {
        console.error("Error fetching OTP data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
      // style={{ backgroundColor: "#2b1f14" }}
      >
        <p style={{ color: "#c9a84c" }} className="text-sm tracking-widest uppercase">
          Loading...
        </p>
      </div>
    );
  }

  const ProfilePic = userData.profile_picture ? userData.profile_picture : "/visitor.png";
  const QrCodePic = userData.qr_code ? userData.qr_code : null;
  const isApproved = userData?.hosts?.some((host) => host.is_approved === true);
  const hasHosts = Boolean(userData?.hosts?.length);
  const qrValue = userData?.card_id ? String(userData.card_id) : "";

  // ─── Company 57 — Goyal & Co / Titanium Tech Park Layout ────────────────────
  if (isCompany57) {
    const company57QrValue =
      dynamicQrToken ||
      (userData?.card_id
        ? String(userData.card_id)
        : userData?.id
          ? String(userData.id)
          : id
            ? String(id)
            : "");
    const gold = "#E8A33D";
    const charcoal = "#1F1F1F";
    const softCream = "#FAF7F2";

    let formattedDay = "";
    let formattedMonth = "";
    let formattedTime = "";

    if (userData?.expected_date) {
      const d = new Date(userData.expected_date);
      formattedDay = d.getDate();
      formattedMonth = d
        .toLocaleDateString("en-GB", { month: "long" })
        .toUpperCase();
    }

    if (userData?.expected_time) {
      formattedTime = new Date(
        `2000-01-01T${userData.expected_time}`
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    const host = userData?.hosts?.[0];
    const location = [host?.unit_name, userData?.site_name]
      .filter(Boolean)
      .join(" · ");
    const shouldBlurQr = hasHosts && !isApproved;
    const readableQrToken = dynamicQrToken
      ? dynamicQrToken.match(/.{1,8}/g).join(" ")
      : "";

    const qrCode = company57QrValue ? (
      <QRCode
        value={company57QrValue}
        size={214}
        level="H"
        includeMargin={true}
        fgColor={charcoal}
        bgColor="#FFFFFF"
        imageSettings={{
          src: GoyalLogo,
          width: 48,
          height: 24,
          excavate: true,
        }}
      />
    ) : QrCodePic ? (
      <img
        src={QrCodePic}
        alt="QR Code"
        className="w-[214px] h-[214px] object-contain"
      />
    ) : (
      <div className="w-[214px] h-[214px] flex items-center justify-center">
        <p className="text-gray-400 text-xs text-center">QR not available</p>
      </div>
    );

    return (
      <div
        className="flex flex-col items-center min-h-screen py-10 px-4"
        style={{ backgroundColor: "#0F0F0F" }}
      >
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* ── Brand Header ── */}
          <div
            className="flex flex-col items-center px-6 pt-7 pb-5"
            style={{ backgroundColor: charcoal }}
          >
            <div className="rounded-lg bg-white px-4 py-2">
              <img
                src={GoyalLogo}
                alt="Goyal & Co"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p
              className="mt-4 text-[10px] uppercase text-center"
              style={{
                color: gold,
                letterSpacing: "0.42em",
                fontFamily: "Century Gothic",
              }}
            >
              Titanium Tech Park
            </p>
          </div>
          <div className="h-1.5 w-full" style={{ backgroundColor: gold }} />

          <div className="flex flex-col items-center px-6 pt-6 pb-5">
            <p
              className="text-[10px] uppercase text-gray-400"
              style={{ letterSpacing: "0.35em" }}
            >
              Visitor Pass
            </p>
            <h2
              className="mt-2 text-2xl font-bold uppercase text-center"
              style={{
                color: charcoal,
                fontFamily: "Century Gothic",
                letterSpacing: "0.08em",
              }}
            >
              {userData?.name || "Visitor"}
            </h2>
            <p
              className="mt-1 text-xs uppercase text-gray-500 text-center"
              style={{ letterSpacing: "0.18em" }}
            >
              {userData?.comming_from || "Guest"}
            </p>

            {/* ── Dynamic QR ── */}
            <div
              className="mt-6 rounded-2xl bg-white p-3"
              style={{
                border: `2px solid ${gold}`,
                boxShadow: `0 0 0 4px #FFFFFF, 0 0 0 6px ${gold}33`,
              }}
            >
              <div className={shouldBlurQr ? "blur-sm opacity-50" : ""}>
                {qrCode}
              </div>
            </div>
            <p
              className="mt-3 text-[10px] uppercase text-gray-400"
              style={{ letterSpacing: "0.25em" }}
            >
              Scan at gate
            </p>
            {readableQrToken && (
              <>
                <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-gray-500 text-center">
                  {readableQrToken}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-widest text-gray-400">
                  {qrSecondsLeft > 0
                    ? `Changes in ${qrSecondsLeft}s`
                    : "Refreshing..."}
                </p>
              </>
            )}

            {otpDigits.length > 0 && (
              <>
                <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">
                  Or use OTP
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  {otpDigits.map((digit, index) => (
                    <div
                      key={index}
                      className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm"
                      style={{
                        backgroundColor: softCream,
                        color: charcoal,
                        border: `1px solid ${gold}55`,
                      }}
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Date & Time ── */}
            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <div
                className="rounded-xl px-3 py-3 text-center"
                style={{ backgroundColor: softCream }}
              >
                <p className="text-[9px] uppercase tracking-widest text-gray-400">
                  Date
                </p>
                <p
                  className="mt-1 text-sm font-semibold uppercase"
                  style={{ color: charcoal }}
                >
                  {formattedDay
                    ? `${formattedDay}${getOrdinalSuffix(formattedDay)} ${formattedMonth}`
                    : "--"}
                </p>
              </div>
              <div
                className="rounded-xl px-3 py-3 text-center"
                style={{ backgroundColor: softCream }}
              >
                <p className="text-[9px] uppercase tracking-widest text-gray-400">
                  Time
                </p>
                <p
                  className="mt-1 text-sm font-semibold uppercase"
                  style={{ color: charcoal }}
                >
                  {formattedTime || "--"}
                </p>
              </div>
            </div>

            {/* ── Host / Location ── */}
            <div
              className="mt-4 w-full rounded-xl px-4 py-3"
              style={{ backgroundColor: softCream }}
            >
              <p className="text-[9px] uppercase tracking-widest text-gray-400">
                Host
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: charcoal }}>
                {host?.full_name || "-"}
              </p>
              <p className="mt-1 text-xs text-gray-500">{location || "-"}</p>
            </div>
          </div>

          <div
            className="px-6 py-4 text-center text-[10px] uppercase text-gray-400"
            style={{
              backgroundColor: "#F7F7F7",
              letterSpacing: "0.25em",
            }}
          >
            Powered by VibeConnect
          </div>
        </div>
      </div>
    );
  }

  // ─── Company 56 — Lotus Developers Layout ────────────────────────────────────
if (Number(userData?.company_id) === 56) {
    const getOrdinal = (n) => {
      const s = [ "RD"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    let formattedDay = "";
    let formattedMonth = "";
    if (userData?.expected_date) {
      const d = new Date(userData.expected_date);
      formattedDay = d.getDate();
      formattedMonth = d.toLocaleDateString("en-GB", { month: "long" }).toUpperCase();
    }

    const formattedTime = userData?.expected_time
      ? new Date(`2000-01-01T${userData.expected_time}`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      : "";

    const comingForm = userData?.comming_from || "-";
    const gold = "#D39A43";
    const white = "#FFFFFF";
    const darkBrown = "#382b24";

    return (
      <div
        className="flex flex-col items-center min-h-screen py-12 px-4"
      >
        <div
          className="relative max-w-lg w-full rounded-xl shadow-lg overflow-hidden flex flex-col items-center p-6"
          style={{
            backgroundColor: darkBrown,
            border: `1px solid ${gold}`,
          }}
        >

          {/* ── Logo ── */}
          <img
            src={LotusLogo}
            alt="Lotus Developers"
            className="w-[360px] mb-4"
          />


          {/* ── QR Code ── */}
          <div
            className="rounded-2xl p-2 shadow-2xl"
            style={{
              backgroundColor: "#ffffff",
              border: `2px solid ${gold}`,
              boxShadow: `0 0 0 4px ${darkBrown}, 0 0 0 6px ${gold}55`,
            }}
          >
            {QrCodePic ? (
              <img
                src={QrCodePic}
                alt="QR Code"
                className={`w-full max-w-[230px] h-auto ${!isApproved ? "blur-sm opacity-50" : ""
                  }`}
              />
            ) : (
              <div className="w-[230px] h-[230px] flex items-center justify-center">
                <p className="text-gray-400 text-xs text-center">QR not available</p>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center w-full my-5 px-2">
            <div className="flex-1 h-px" style={{ backgroundColor: gold, opacity: 0.45 }} />
            <div className="mx-3 w-2 h-2 rounded-full" style={{ backgroundColor: gold }} />
            <div className="flex-1 h-px" style={{ backgroundColor: gold, opacity: 0.45 }} />
          </div>

          {/* ── Visitor Name ── */}
          <h2
            className="text-2xl font-bold uppercase text-center mb-1"
            style={{ color: gold, fontFamily: "Century Gothic", letterSpacing: "0.12em" }}
          >
            {userData?.name || "N/A"}
          </h2>

          {/* ── Site Name ── */}
          <p
            className="text-sm uppercase text-center mb-5"
            style={{ color: gold, fontFamily: "Century Gothic",opacity: 0.85, letterSpacing: "0.18em" }}
          >
            {comingForm}
          </p>

          {/* ── Date & Time Row ── */}
          {(formattedDay || formattedTime) && (
            <div
              className="flex items-center justify-center gap-6 w-full mb-5  px-4 "
            >
              {formattedDay && (
                <div className="flex items-center gap-2">
                  {/* Calendar SVG */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.6">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <rect x="7" y="14" width="2" height="2" fill={gold} stroke="none" />
                    <rect x="11" y="14" width="2" height="2" fill={gold} stroke="none" />
                    <rect x="15" y="14" width="2" height="2" fill={gold} stroke="none" />
                  </svg>
                  <span
                    className="text-lg uppercase"
                    style={{ color: white, letterSpacing: "0.05em", }}
                  >
                    {formattedDay}
                    <sup className="text-xs">{getOrdinal(formattedDay)}</sup>{" "}
                    {formattedMonth}
                  </span>
                </div>
              )}

              {formattedTime && (
                <div className="flex items-center gap-2">
                  {/* Clock SVG */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.6">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span
                    className="text-lg uppercase"
                    style={{ color: white, letterSpacing: "0.05em", }}
                  >
                    {formattedTime}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Divider ── */}
          <div className="flex items-center w-full py-3 px-2">
            <div className="flex-1 h-px" style={{ backgroundColor: gold, opacity: 0.45 }} />
            <div className="mx-3 w-2 h-2 rounded-full" style={{ backgroundColor: gold }} />
            <div className="flex-1 h-px" style={{ backgroundColor: gold, opacity: 0.45 }} />
          </div>

          {/* ── Location / Host / Unit ── */}
          {(userData?.hosts?.[0]?.unit_name || userData?.hosts?.[0]?.full_name) && (
            <div className="flex items-start gap-3 text-center justify-center">
              {/* Location pin SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill={gold} stroke="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div>
                <p
                  className="text-lg  uppercase"
                  style={{ color: white, letterSpacing: "0.1em" ,fontFamily: "Century Gothic",}}
                >
                  {userData?.site_name || "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Default Layout ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-3 pb-8">
      <div className="relative max-w-lg w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex items-center p-4">
          <h1 className="text-xl font-bold text-center flex-1">Visiting Pass</h1>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <img src={ProfilePic} alt="Profile Picture" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="font-bold text-lg">Name : <span>{userData.name}</span></h2>
              <p className="font-medium text-xs">Purpose: <span className="font-normal text-gray-600 mx-1">{userData.purpose}</span></p>
              <p className="font-medium text-xs">Type: <span className="font-normal text-gray-600 mx-1">{userData.visit_type}</span></p>
              <p className="font-medium text-xs">Host: <span className="font-normal text-gray-600 mx-1">{userData.hosts?.length ? userData.hosts[0].full_name : "N/A"}</span></p>
            </div>
            <div className="text-xs text-gray-500">{userData.wing} {userData.floor}</div>
          </div>

          <div className="flex justify-between mb-6">
            {userData.pass_start_date && userData.pass_end_date ? (
              <>
                <div className="bg-yellow-100 rounded-lg p-2 text-center w-[30%]">
                  <p className="text-xs font-medium">Start Date</p>
                  <p className="text-sm font-bold">{new Date(userData.pass_start_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-yellow-100 rounded-lg p-2 text-center w-[30%]">
                  <p className="text-xs font-medium">End Date</p>
                  <p className="text-sm font-bold">{new Date(userData.pass_end_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-yellow-100 rounded-lg p-2 text-center w-[30%]">
                  <p className="text-xs font-medium">{userData.expected_date ? "Expected Date" : "Created At"}</p>
                  <p className="text-sm font-bold">{new Date(userData?.expected_date || userData?.created_at).toLocaleDateString()}</p>
                </div>
              </>
            ) : (
              <div className="bg-yellow-100 rounded-lg p-2 text-center w-full">
                <p className="text-xs font-medium">{userData.expected_date ? "Expected Date" : "Created At"}</p>
                <p className="text-sm font-bold">{new Date(userData.expected_date || userData.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Site Details</p>
            <h2 className="text-xl font-bold">{userData?.site_name}</h2>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm font-medium mb-2">Scan QR For Entry</p>
            <div className="flex justify-center mb-2">
              <div className="h-40 w-40 bg-white border border-gray-300 flex items-center justify-center">
                {qrValue ? (
                  <QRCode value={qrValue} size={140} level="H" includeMargin={true} />
                ) : QrCodePic ? (
                  <img src={QrCodePic} alt="QR Code" width={140} height={140} className={!isApproved ? "blur-sm opacity-50" : ""} />
                ) : (
                  <p className="text-xs text-gray-400">QR not available</p>
                )}
              </div>
            </div>
            {otpDigits.length > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-2">Or</p>
                <p className="text-sm font-medium mb-2">OTP</p>
                <div className="flex justify-center space-x-2">
                  {otpDigits.map((digit, index) => (
                    <div key={index} className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">{digit}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="text-center text-xs text-gray-400">Powered by VibeConnect</div>
        </div>
      </div>
    </div>
  );
};

export default OtpAndQr;