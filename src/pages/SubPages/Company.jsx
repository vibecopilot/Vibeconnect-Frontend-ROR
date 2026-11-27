import React, { useEffect, useMemo, useRef, useState } from "react";
import Account from "./Account";
import defaultLogo from "../SVG/VCLogo.svg";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import {
  createCompany,
  getCompanies,
  getCompanyLogo,
  removeCompanyLogo,
  uploadCompanyLogo,
} from "../../api";

const Company = () => {
  const userId = getItemInLocalStorage("userId");
  const currentCompanyId = getItemInLocalStorage("COMPANYID");
  const [companies, setCompanies] = useState([]);
  const [currentLogoUrl, setCurrentLogoUrl] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    getCompanies()
      .then((res) => {
        if (!active) return;
        const data = res?.data ?? res;
        setCompanies(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load companies:", err));
    return () => {
      active = false;
    };
  }, []);

  const selectedCompany = useMemo(
    () => companies.find((c) => String(c.id) === String(selectedCompanyId)),
    [companies, selectedCompanyId],
  );
  const currentCompany = useMemo(
    () => companies.find((c) => String(c.id) === String(currentCompanyId)),
    [companies, currentCompanyId],
  );

  // Always read the selected company's logo fresh after a change/upload.
  useEffect(() => {
    let active = true;
    setCurrentLogoUrl(null);
    if (selectedCompanyId) {
      getCompanyLogo(selectedCompanyId)
        .then((res) => {
          const data = res?.data ?? res;
          if (active) setCurrentLogoUrl(data?.logo_url || null);
        })
        .catch(() => {
          if (active) setCurrentLogoUrl(null);
        });
    }
    return () => {
      active = false;
    };
  }, [selectedCompanyId]);

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    clearSelection();
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveLogo = async () => {
    if (!selectedCompanyId) {
      toast.error("Please select a company.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a logo image.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", selectedFile);
    setSavingLogo(true);
    try {
      const res = await uploadCompanyLogo(selectedCompanyId, formData);
      const data = res?.data ?? res;
      if (!data?.success && data?.error) throw new Error(data.error);

      setCompanies((prev) =>
        prev.map((c) =>
          String(c.id) === String(selectedCompanyId)
            ? { ...c, logo_url: data.logo_url }
            : c,
        ),
      );
      setCurrentLogoUrl(data.logo_url || null);
      window.dispatchEvent(new Event("company-logo-updated"));
      toast.success(data?.message || "Company logo saved successfully.");
      clearSelection();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload logo.");
    } finally {
      setSavingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!selectedCompanyId) {
      toast.error("Please select a company.");
      return;
    }
    setSavingLogo(true);
    try {
      await removeCompanyLogo(selectedCompanyId);
      setCompanies((prev) =>
        prev.map((c) =>
          String(c.id) === String(selectedCompanyId) ? { ...c, logo_url: null } : c,
        ),
      );
      setCurrentLogoUrl(null);
      window.dispatchEvent(new Event("company-logo-updated"));
      toast.success("Company logo removed.");
      clearSelection();
    } catch (err) {
      toast.error("Failed to remove logo.");
    } finally {
      setSavingLogo(false);
    }
  };

  const handleCreateCompany = async (event) => {
    event.preventDefault();
    if (!companyName.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    const formData = new FormData();
    formData.append("company[name]", companyName.trim());
    formData.append("company[created_by]", userId || "");

    setCreating(true);
    try {
      const res = await createCompany(formData);
      const created = res?.data ?? res;
      const newCompanyId = created?.id ?? created?.company?.id;
      const logoFile = selectedFile;
      const createdName = created?.name || companyName.trim();

      if (newCompanyId && logoFile) {
        const logoData = new FormData();
        logoData.append("logo", logoFile);
        await uploadCompanyLogo(newCompanyId, logoData);
      }

      setCompanyName("");
      clearSelection();
      if (fileInputRef.current) fileInputRef.current.value = "";

      setCompanies((prev) => [
        {
          id: newCompanyId,
          name: createdName,
          logo_url: logoFile ? URL.createObjectURL(logoFile) : null,
        },
        ...prev,
      ]);
      if (newCompanyId) setSelectedCompanyId(newCompanyId);
      window.dispatchEvent(new Event("company-logo-updated"));
      toast.success("Company created successfully.");
    } catch (err) {
      toast.error("Failed to create company.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full mt-1">
      <Account />
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center my-10 px-4">
        {/* Company-wise logo */}
        <section className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Company Logo</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload a logo for a company. It will be shown in the app header and
            sidebar for that company.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              clearSelection();
            }}
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          {selectedCompanyId &&
            String(selectedCompanyId) !== String(currentCompanyId) && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2 mb-4">
                This logo applies to “{selectedCompany?.name}”. Your current
                header shows “{currentCompany?.name || "your company"}”. Log in
                as the selected company to see it in the header.
              </p>
            )}

          <div className="flex items-center gap-4 mb-4">
            <img
              key={previewUrl || currentLogoUrl || "default"}
              src={previewUrl || currentLogoUrl || defaultLogo}
              alt="Company logo preview"
              className="h-16 w-16 object-contain rounded-md border border-gray-200 p-1 bg-white"
              onError={(e) => {
                e.currentTarget.src = defaultLogo;
              }}
            />
            <div>
              <label className="cursor-pointer inline-block border-2 border-gray-700 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white transition">
                Choose Logo
                <input
                  id="company-logo-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                  {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={savingLogo}
              onClick={handleSaveLogo}
              className="bg-green-500 text-white rounded-md py-2 px-4 text-sm transition hover:bg-green-600 disabled:opacity-50"
            >
              {savingLogo ? "Saving..." : "Save Logo"}
            </button>
            <button
              type="button"
              disabled={savingLogo || !currentLogoUrl}
              onClick={handleRemoveLogo}
              className="border border-gray-400 text-gray-700 rounded-md py-2 px-4 text-sm transition hover:bg-gray-100 disabled:opacity-50"
            >
              Remove Logo
            </button>
          </div>
        </section>

        {/* Create company (logo can be added at creation time too) */}
        <section className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Add Company</h2>
          <form className="flex flex-col gap-4" onSubmit={handleCreateCompany}>
            <div>
              <label
                htmlFor="company-name"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter company name"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-black text-white rounded-md py-2 px-4 transition hover:bg-gray-800 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Company"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Company;
