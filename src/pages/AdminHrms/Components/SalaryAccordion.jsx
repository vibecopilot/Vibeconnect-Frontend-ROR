import { useState, useRef, useEffect } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const SalaryAccordion = ({
  title,
  items = [],
  totalMonthly = 0,
  totalYearly = 0,
  onMonthlyChange,
  showInput = true,
  isFromTemplate = false,
  showPercentage = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  // Handle expand/collapse animation
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isExpanded
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }
  }, [isExpanded, items]);

  // Calculate yearly amount from monthly or use provided value
  const getYearlyAmount = (item) => {
    if (item.yearly !== undefined) return item.yearly;
    if (item.value !== undefined) return item.value * 12;
    return (item.monthly || 0) * 12;
  };

  // Get display name from item
  const getDisplayName = (item) => {
    return item.name || item.component_name || item.label || "Unnamed Item";
  };

  // Get display value (monthly amount)
  const getDisplayValue = (item) => {
    return item.value || item.monthly || 0;
  };

  return (
    <div className="border-b border-gray-200 mb-2 last:border-b-0">
      {/* Header Section */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-4 text-left focus:outline-none hover:bg-gray-50 transition-colors rounded"
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${title}`}
      >
        <span className="text-lg font-medium text-blue-600 w-1/2 truncate pr-2">
          {title}
        </span>
        <div className="flex items-center w-1/2 min-w-0">
          <span className="text-lg font-medium text-green-500 w-1/3 text-center truncate">
            ₹{totalMonthly.toLocaleString()}
          </span>
          <span className="text-lg font-medium text-green-500 w-1/3 text-right truncate">
            ₹{totalYearly.toLocaleString()}
          </span>
          <span className="w-1/3 flex justify-end pl-2">
            {isExpanded ? (
              <MdExpandLess className="w-6 h-6 text-gray-500" />
            ) : (
              <MdExpandMore className="w-6 h-6 text-gray-500" />
            )}
          </span>
        </div>
      </button>

      {/* Content Section */}
      <div
        id={`accordion-content-${title}`}
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="pb-2">
          {items.map((item, index) => (
            <div
              key={`${title}-${index}`}
              className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 rounded"
            >
              {/* Item Name */}
              <span className="text-gray-700 w-1/2 truncate pr-2">
                {getDisplayName(item)}
              </span>

              {/* Values */}
              <div className="flex items-center w-1/2 min-w-0">
                {/* Monthly Amount */}
                <div className="w-1/3 flex justify-center">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">₹</span>
                    {showInput && !isFromTemplate ? (
                      <input
                        type="number"
                        value={getDisplayValue(item)}
                        onChange={(e) => onMonthlyChange(index, e.target.value)}
                        className="w-20 p-1 border rounded text-right focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        aria-label={`Edit ${getDisplayName(item)} monthly amount`}
                      />
                    ) : (
                      <span className="text-right">
                        {getDisplayValue(item).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Yearly Amount */}
                <span className="w-1/3 text-right truncate">
                  ₹{getYearlyAmount(item).toLocaleString()}
                </span>

                {/* Percentage (conditional) */}
                {showPercentage && (
                  <span className="w-1/3 text-right text-sm text-gray-500 truncate">
                    {item.percentage_of_ctc || item.percentage_of_salary || '0'}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalaryAccordion;