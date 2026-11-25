/* eslint-disable react/prop-types */

const fmtAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
};

const ParineeInvoicePreview = ({
  invoice,
  formData,
  billingConfig,
  siteInfo,
  unitDetails,
  camUnitConfigs,
  totals,
  paymentData,
  unitName,
}) => {
  const config = Array.isArray(billingConfig) ? billingConfig[0] || {} : billingConfig || {};

  const invoiceDate = formData.invoice_date
    ? new Date(formData.invoice_date)
    : new Date();
  const periodYear = Number(formData.income_year || invoiceDate.getFullYear());
  const periodMonth = Number(formData.income_month || invoiceDate.getMonth() + 1);
  const periodDate = new Date(periodYear, periodMonth - 1, 1);
  const periodLabel = `${periodDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })} to ${periodDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;

  const flatNo = unitName || formData.unit_no || "Office";
  const ownerName = formData.customer_name || "N/A";

  // Match the PDF mapping: CAM unit config (carpet_area_sqft) first, then the
  // unit configuration's carpet_area as a fallback.
  const resolvedUnitId =
    formData.unit_id || unitDetails?.id || invoice?.unit_id || invoice?.unit?.id;
  const camConfig = (camUnitConfigs || []).find(
    (config) => String(config.unit_id) === String(resolvedUnitId)
  );
  const area =
    camConfig?.carpet_area_sqft ??
    unitDetails?.carpet_area_sqft ??
    unitDetails?.carpet_area ??
    unitDetails?.unit_configuration?.carpet_area ??
    "";

  const service =
    (formData.items || [])
      .map((item) => item.service_description || item.description)
      .filter(Boolean)
      .filter((value, index, all) => all.indexOf(value) === index)
      .join(", ") || "Maintenance Charges";

  const advancePaid = Number(paymentData?.amount || 0);
  const balancePayable = Math.max(Number(totals.total || 0) - advancePaid, 0);
  const bank = {
    favouring_name: config.favouring_name || config.company_name || "",
    bank_name: config.bank_name || "",
    branch_name: config.branch_name || "",
    account_number: formData.bank_account || config.account_number || "",
    ifsc_code: formData.bank_ifsc || config.ifsc_code || "",
  };

  const rows = [
    ["1", "Period of Maintenance", periodLabel],
    ["2", "Office NO", flatNo],
    ["3", "Name of Owner / Office", ownerName],
    ["4", "chargeable area of the unit", area !== "" ? fmtAmount(area) : ""],
    ["", "Service", service],
    ["5", "Maintenance amount", fmtAmount(totals.taxableValue)],
    ["6", "SGST", fmtAmount(totals.sgst)],
    ["7", "CGST", fmtAmount(totals.cgst)],
    ["8", "Total amount", fmtAmount(totals.total)],
    ["9", "Less", ""],
    ["10", "Advance Maintenance amount Paid", fmtAmount(advancePaid)],
    ["11", "Amount Balance Payable", fmtAmount(balancePayable)],
    ["12", "Due date", fmtDate(formData.due_date)],
    ["13", "Arrears showing on last Bill", fmtAmount(0)],
    ["14", "Over due Interest @ 18%", fmtAmount(0)],
    ["15", "Total Amount Payable", fmtAmount(balancePayable)],
    [
      "16",
      "Bank Details",
      <span key="bank">
        Favouring: {bank.favouring_name}
        <br />
        Bank: {bank.bank_name} | Branch: {bank.branch_name}
        <br />
        A/C No: {bank.account_number} | IFSC: {bank.ifsc_code}
      </span>,
    ],
  ];

  const cellClass = "border border-black px-1 py-0.5 align-top";
  const shaded = "bg-gray-200";

  return (
    <div className="border border-black bg-white font-serif text-[11px] leading-tight text-black">
      {/* Table 1 - header statement */}
      <table className="w-full table-fixed border-collapse">
        <tbody>
          <tr>
            <th
              colSpan="2"
              className={`${cellClass} bg-gray-200 text-center font-bold`}
            >
              STATEMENT OF COMMON AREA MAINTENANCE EXPENSES
            </th>
          </tr>
          <tr>
            <td className={`${cellClass} bg-gray-50`}>Period: {periodLabel}</td>
            <td className={`${cellClass} bg-gray-50 text-right`}>
              No.: NGC/E/{periodYear}-{String(periodMonth).padStart(2, "0")}/{invoice?.id || 1}
            </td>
          </tr>
          <tr>
            <td className={`${cellClass} bg-gray-50`}>Flat No: {flatNo}</td>
            <td className={`${cellClass} bg-gray-50 text-right`}>
              Date: {fmtDate(formData.invoice_date)}
            </td>
          </tr>
          <tr>
            <td className={cellClass} colSpan="2">
              Name: {ownerName}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Table 2 - maintenance expenses statement */}
      <table className="mt-2 w-full table-fixed border-collapse font-mono">
        <thead>
          <tr>
            <th
              colSpan="3"
              className={`${cellClass} bg-gray-200 text-left text-sm font-bold`}
            >
              {(invoice?.site?.name || siteInfo?.name || config.company_name || "PARINEE I").toUpperCase()}
            </th>
          </tr>
          <tr>
            <th colSpan="3" className={`${cellClass} bg-gray-200 text-left text-sm font-normal`}>
              STATEMENT OF MAINTENANCE EXPENSES
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([sr, label, value], index) => {
            const isShaded = label === "Office NO" || label === "Maintenance amount";
            const isBold = label === "Maintenance amount" || label === "Total Amount Payable";
            const isBank = label === "Bank Details";
            return (
              <tr key={`${sr || "service"}-${index}`} className={isBold ? "font-bold" : ""}>
                <td className={`${cellClass} w-[6%] text-center`}>{sr}</td>
                <td className={`${cellClass} ${isShaded ? shaded : ""}`}>{label}</td>
                <td
                  className={`${cellClass} w-[32%] text-right ${isBank ? "text-left font-serif text-[10px]" : ""} ${isShaded ? shaded : ""}`}
                >
                  {value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ParineeInvoicePreview;
