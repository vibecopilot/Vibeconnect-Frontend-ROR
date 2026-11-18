import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { setPublicAuth } from "../api/axiosInstance";
import { getSiteData } from "../api";
import { updatePublicAuth } from "../utils/publicAuth";

import Checklist from "./Checklist";
import AddChecklist from "./SubPages/AddChecklist";
import EditChecklist from "./SubPages/EditChecklist";
import CopyChecklist from "./SubPages/CopyChecklist";
import AssociateAssetChecklist from "./SubPages/AssociateAssetChecklist";
import { clearPublicAuth } from "../api/axiosInstance";

/**
 * Public checklist screens launched by the mobile app.
 *
 *   /apps/checklist?token=<token>&siteId=<id>
 *   /apps/checklist/add?token=<token>&siteId=<id>
 *   /apps/checklist/edit/:id?mode=edit&token=<token>&siteId=<id>
 *   /apps/checklist/copy/:id?token=<token>&siteId=<id>
 *   /apps/checklist/associate/:id?token=<token>&siteId=<id>
 *
 * No protected-route wrapper and no app shell (navbar/sidebar) is used here.
 * The token from the URL seeds the shared axios auth before any child renders.
 */
const PublicChecklist = ({ view = "list" }) => {
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token") ||
    searchParams.get("api_key") ||
    searchParams.get("apiKey") ||
    searchParams.get("auth_token");
  const siteIdParam =
    searchParams.get("siteId") || searchParams.get("site_id");
  const userIdParam =
    searchParams.get("userId") || searchParams.get("user_id");
  const vibeUserIdParam = searchParams.get("vibeUserId");

  // Seeding during render guarantees children see the URL token on their very
  // first render (including state initialisers that read localStorage).
  setPublicAuth(token, siteIdParam, {
    userId: userIdParam,
    vibeUserId: vibeUserIdParam,
  });

  const [ready, setReady] = useState(() => Boolean(token && siteIdParam));
  const [authKey, setAuthKey] = useState(0);

  useEffect(() => {
    if (!token) return undefined;

    if (siteIdParam) {
      setReady(true);
      return undefined;
    }

    // The app may send only a token. Resolve the first accessible site from
    // the token itself so checklist APIs and form payloads get a site_id.
    setReady(false);
    let cancelled = false;
    (async () => {
      try {
        const response = await getSiteData();
        const sites = response?.data?.sites || [];
        const selected = sites[0];
        if (!cancelled && selected) {
          updatePublicAuth({ siteId: selected.id });
          setAuthKey((key) => key + 1);
        }
      } catch (error) {
        console.error("Unable to resolve site from token:", error);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, siteIdParam]);

  // Drop the in-memory public credentials when leaving the public flow.
  useEffect(
    () => () => {
      if (!window.location.pathname.startsWith("/apps/checklist")) {
        clearPublicAuth();
      }
    },
    []
  );

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow">
          <h1 className="text-lg font-semibold text-gray-800">
            Missing access token
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Open this page from the app so the access token is included in the
            link.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const screens = {
    list: <Checklist standalone key={authKey} />,
    add: <AddChecklist key={authKey} />,
    edit: <EditChecklist key={authKey} />,
    copy: <CopyChecklist key={authKey} />,
    associate: <AssociateAssetChecklist standalone key={authKey} />,
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {screens[view] || screens.list}
    </div>
  );
};

export default PublicChecklist;
