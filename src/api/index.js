import { getItemInLocalStorage } from "../utils/localStorage";
import axiosInstance from "./axiosInstance";
import vibeAuth from "./vibeAuth";
export const API_URL = "https://vibecopilot.ai";
export const vibeMedia = "https://vibecopilot.ai/api/media/";
const token = getItemInLocalStorage("TOKEN");
export const domainPrefix = "https://admin.vibecopilot.ai";
export const login = async (data) => axiosInstance.post("/login.json", data);

export const getLogin = async () => axiosInstance.get("/login.json");

// dashboard
export const getTicketDashboard = async () =>
  axiosInstance.get("/pms/admin/complaints/complaints_dashboard.json", {
    params: {
      token: token,
    },
  });
//Assets
export const getPerPageSiteAsset = async (page, perPage) =>
  axiosInstance.get(`/site_assets.json?per_page=${perPage}&page=${page}`, {
    params: {
      token: token,
    },
  });
export const getSiteAsset = async (page) =>
  axiosInstance.get(`/site_assets.json`, {
    params: {
      token: token,
    },
  });
export const getMeteredSiteAsset = async () =>
  axiosInstance.get(`/site_assets.json?q[is_meter]=true`, {
    params: {
      token: token,
    },
  });
export const getSiteSearchedAsset = async (oem, assetName, building, unit) =>
  axiosInstance.get(
    `/site_assets.json?q[oem_name_cont]=${oem}&q[name_cont]=${assetName}&q[building_name_cont]=${building}&q[unit_name_cont]=${unit}`,
    {
      params: {
        token: token,
      },
    }
  );
export const getSiteAssetDetails = async (id) =>
  axiosInstance.get(`/site_assets/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postSiteAsset = async (data) =>
  axiosInstance.post(`/site_assets.json`, data, {
    params: {
      token: token,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const EditSiteAsset = async (data, id) =>
  axiosInstance.put(`/site_assets/${id}.json`, data, {
    params: {
      token: token,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// other bills
export const postOtherBills = async (data) =>
  axiosInstance.post("/other_bills.json", data, {
    params: {
      token: token,
    },
  });
  export const getOtherBills = async () =>
    axiosInstance.get("/other_bills.json", {
      params: {
        token: token,
      },
    });
    export const getOtherBillsDetails = async (id) =>
      axiosInstance.get(`/other_bills/${id}.json`, {
        params: {
          token: token,
        },
      });
      export const editOtherBillsDetails = async (id, data) =>
        axiosInstance.put(`/other_bills/${id}.json`, data, {
          params: {
            token: token,
          },
        });
//polls
export const postPolls = async (data) =>
  axiosInstance.post("/polls.json", data, {
   
    params: {
      token: "775d6ae27272741669a65456ea10cc56cd4cce2bb99287b6",
    },
  });
  export const postPollVote = async (id,data) =>
    axiosInstance.post(`/polls/${id}/poll_votes.json`, data, {
     
      params: {
        token: "775d6ae27272741669a65456ea10cc56cd4cce2bb99287b6",
      },
    });
  export const getPolls = async () =>
    axiosInstance.get("/polls.json", {
      params: {
        token: "775d6ae27272741669a65456ea10cc56cd4cce2bb99287b6",
      },
    });
  
// vendor
export const getVendors = async () =>
  axiosInstance.get("/vendors.json", {
    params: {
      token: token,
    },
  });
export const getVendorCategory = async () =>
  axiosInstance.get("/vendor_categories.json", {
    params: {
      token: token,
    },
  });
export const getVendorCategoryDetails = async (id) =>
  axiosInstance.get(`/vendor_categories/${id}.json`, {
    params: {
      token: token,
    },
  });
export const deleteVendorCategory = async (id) =>
  axiosInstance.delete(`/vendor_categories/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postVendorCategory = async (data) =>
  axiosInstance.post("/vendor_categories.json", data, {
    params: {
      token: token,
    },
  });
export const postVendorType = async (data) =>
  axiosInstance.post("/vendor_suppliers.json", data, {
    params: {
      token: token,
    },
  });
export const editVendorTypeDetails = async (id, data) =>
  axiosInstance.put(`/vendor_suppliers/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const getVendorsType = async () =>
  axiosInstance.get("/vendor_suppliers.json", {
    params: {
      token: token,
    },
  });
export const getVendorsTypeDetails = async (id) =>
  axiosInstance.get(`/vendor_suppliers/${id}.json`, {
    params: {
      token: token,
    },
  });

export const editVendorType = async (id, data) =>
  axiosInstance.patch(`/vendor_suppliers/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const editVendorCategory = async (id, data) =>
  axiosInstance.patch(`/vendor_categories/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const getVendorsDetails = async (id) =>
  axiosInstance.get(`/vendors/${id}.json`, {
    params: {
      token: token,
    },
  });
export const deleteVendorType = async (id) =>
  axiosInstance.delete(`/vendor_suppliers/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postVendors = async (data) =>
  axiosInstance.post("/vendors.json", data, {
    params: {
      token: token,
    },
  });
export const EditVendors = async (id, data) =>
  axiosInstance.put(`/vendors/${id}.json`, data, {
    params: {
      token: token,
    },
  });

//
export const getComplaints = async () =>
  axiosInstance.get(`/pms/complaints.json`, {
    params: {
      token: token,
    },
  });
export const getHelpDeskCategoriesSetup = async () =>
  axiosInstance.get(`/pms/admin/helpdesk_categories.json`, {
    params: {
      token: token,
    },
  });

export const getHelpDeskCategoriesSetupDetails = async (id) =>
  axiosInstance.get(`/pms/admin/helpdesk_categories/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editHelpDeskCategoriesSetupDetails = async (id, data) =>
  axiosInstance.put(`/pms/admin/helpdesk_categories/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postHelpDeskCategoriesSetup = async (data) =>
  axiosInstance.post(`/pms/admin/helpdesk_categories.json`, data, {
    params: {
      token: token,
    },
  });
export const postHelpDeskSubCategoriesSetup = async (data) =>
  axiosInstance.post(`/pms/admin/create_helpdesk_sub_category.json`, data, {
    params: {
      token: token,
    },
  });
export const getHelpDeskEscalationSetup = async () =>
  axiosInstance.get(`/pms/admin/helpdesk_categories/complaint_workers.json`, {
    params: {
      token: token,
    },
  });
export const deleteEscalationRule = async (id) =>
  axiosInstance.delete(`/pms/admin/delete_complaint_worker/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postHelpDeskEscalationSetup = async (data) =>
  axiosInstance.post(`/pms/admin/create_complaint_worker.json`, data, {
    params: {
      token: token,
    },
  });
export const deleteHelpDeskCategorySetup = async (id, data) =>
  axiosInstance.patch(`/pms/admin/modify_helpdesk_category/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const getGRN = async () =>
  axiosInstance.get(`/grn_details.json`, {
    params: {
      token: token,
    },
  });

export const postHelpDeskResolutionEscalationSetup = async (data) =>
  axiosInstance.post(`/pms/admin/create_escalation.json`, data, {
    params: {
      token: token,
    },
  });
export const getHelpDeskSubCategoriesSetup = async () =>
  axiosInstance.get(`/pms/admin/get_sub_categories.json`, {
    params: {
      token: token,
    },
  });
export const getHelpDeskSubCategoriesSetupDetails = async (id) =>
  axiosInstance.get(`/pms/admin/get_sub_categories/${id}.json`, {
    params: {
      token: token,
    },
  });
export const getHelpDeskStatusSetup = async () =>
  axiosInstance.get(`/pms/admin/helpdesk_categories/complaint_statuses.json`, {
    params: {
      token: token,
    },
  });
export const getHelpDeskStatusDetailsSetup = async (id) =>
  axiosInstance.get(
    `/pms/admin/helpdesk_categories/complaint_statuses/${id}.json`,
    {
      params: {
        token: token,
      },
    }
  );
export const editHelpDeskStatusDetailsSetup = async (id, data) =>
  axiosInstance.put(
    `/pms/admin/helpdesk_categories/complaint_statuses/${id}.json`,
    data,
    {
      params: {
        token: token,
      },
    }
  );
export const postHelpDeskStatusSetup = async (data) =>
  axiosInstance.post(`/pms/admin/create_complaint_statuses.json`, data, {
    params: {
      token: token,
    },
  });
export const getAdminComplaints = async () =>
  axiosInstance.get(`/pms/admin/complaints.json`, {
    params: {
      token: token,
    },
  });
export const getCARItems = async (ticketId) =>
  axiosInstance.get(
    `/ticket_items.json?items=true&q[ticket_id_eq]=${ticketId}`,
    {
      params: {
        token: token,
      },
    }
  );

// perPage

export const getAdminPerPageComplaints = async (page, perPage) =>
  axiosInstance.get(`/pms/admin/complaints.json`, {
    params: {
      token: token,
      per_page: perPage,
      page: page,
    },
  });

export const getComplaintsDetails = async (id) =>
  axiosInstance.get(`pms/complaints/${id}.json`, {
    params: {
      token: token,
    },
  });

export const fetchSubCategories = async (categoryId) =>
  axiosInstance.get(`/pms/admin/get_sub_categories.json`, {
    params: {
      token: token,
      category_type_id: categoryId,
    },
  });

export const fetchUserComplaints = async (data) =>
  axiosInstance.get(`complaints.json`, data, {
    params: {
      token: token,
    },
  });

//

export const getUnits = async (floor_id) =>
  axiosInstance.get(`/units.json?q[floor_id_eq]=${floor_id}`, {
    params: {
      token: token,
      // floor_id_eq: floor_id,
    },
  });

export const getFloors = async (buildId) =>
  axiosInstance.get(`/floors.json?q[building_id_eq]=${buildId}`, {
    params: {
      token: token,
    },
  });

export const updateComplaintsDetails = async (id, data) =>
  axiosInstance.put(`pms/complaints/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const getAssignedTo = async (data) =>
  axiosInstance.get(`/users/pms_admins.json`, {
    params: {
      token: token,
    },
  });

export const getIssueType = async () =>
  axiosInstance.get(`pms/admin/complaint_issue_types.json`, {
    params: {
      token: token,
    },
  });

export const getfloorsType = async (buildId) =>
  axiosInstance.get(`/floors.json`, {
    params: {
      token: token,
      building_id: buildId,
    },
  });

export const postComplaintsDetails = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/pms/complaints.json?token=${token}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editComplaintsDetails = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/complaint_logs.json?token=${token}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) =>
  axiosInstance.post("/users/change_password.json", data, {
    params: {
      token: token,
    },
  });

// export const editComplaintsDetails = async (compData) => {
//   axiosInstance.post (`/complaint_logs.json?token=${token}`,{
//     params : {
//       token : token,
//       complaint : compData
//     }
//   })
// }

export const getAssetGroups = async () =>
  axiosInstance.get("/asset_groups.json?q[group_for_eq]=asset", {
    params: {
      token: token,
    },
  });
export const getAssetGroupsDetails = async (id) =>
  axiosInstance.get(`/asset_groups/${id}.json?q[group_for_eq]=asset`, {
    params: {
      token: token,
    },
  });
export const editAssetGroupsDetails = async (id, data) =>
  axiosInstance.put(`/asset_groups/${id}.json?q[group_for_eq]=asset`, data, {
    params: {
      token: token,
    },
  });
export const getParentAsset = async (id) =>
  axiosInstance.get(
    `/site_assets.json?q[asset_type_eq]=parent&q[asset_group_id_eq]=${id}`,

    {
      params: {
        token: token,
      },
    }
  );

export const getAssetSubGroups = async (groupId) => {
  try {
    const response = await axiosInstance.get("/sub_groups.json", {
      params: {
        token: token,
        group_id: groupId,
      },
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching asset subgroups:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const postAssetGroups = async (data) =>
  axiosInstance.post("/asset_groups.json", data, {
    params: {
      token: token,
    },
  });
export const postAssetSubGroups = async (data) =>
  axiosInstance.post("/sub_groups.json", data, {
    params: {
      token: token,
    },
  });

export const postAssetparams = async (data) =>
  axiosInstance.post("/asset_params.json", data, {
    params: {
      token: token,
    },
  });
export const getAssetparamsDetails = async (id) =>
  axiosInstance.get(`/asset_params/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editAssetparamsDetails = async (id, data) =>
  axiosInstance.put(`/asset_params/${id}.json`, data, {
    params: {
      token: token,
    },
  });

// asset checklist
// export const postChecklist = async (data) =>
//   axiosInstance.post("checklists.json", data, {
//     params: {
//       token: token,
//     },
//   });

// amc
export const getAMC = async () =>
  axiosInstance.get("/asset_amcs.json", {
    params: {
      token: token,
    },
  });
export const postAMC = async (data) =>
  axiosInstance.post("/asset_amcs.json", data, {
    params: {
      token: token,
    },
  });
export const getAMCDetails = async (assetId) =>
  axiosInstance.get(`/asset_amcs.json?q[asset_id_eq]=${assetId}`, {
    params: {
      token: token,
      // asset_id: assetId,
    },
  });
export const getEditAMCDetails = async (id) =>
  axiosInstance.get(`/asset_amcs/${id}.json`, {
    params: {
      token: token,
      // asset_id: assetId,
    },
  });

export const EditAMCDetails = async (data, id) =>
  axiosInstance.put(`/asset_amcs/${id}.json`, data, {
    params: {
      token: token,
      // asset_id: assetId,
    },
  });
export const getSubGroupsList = async () =>
  axiosInstance.get("/sub_groups.json", {
    params: {
      token: token,
    },
  });
export const getStockGroupsList = async () =>
  axiosInstance.get("/asset_groups.json?q[group_for_eq]=item", {
    params: {
      token: token,
    },
  });

export const postTicketAddItems = async (data) =>
  axiosInstance.post("/pms/admin/complaint_items.json", data, {
    params: {
      token: token,
    },
  });
// export const PostItemsApproval = async (data) =>
//   axiosInstance.post("/pms/admin/complaint_items.json", data, {
//     params: {
//       token: token,
//     },
//   });
export const getInventory = async () =>
  axiosInstance.get("/items.json", {
    params: {
      token: token,
    },
  });
export const postInventory = async (data) =>
  axiosInstance.post("/items.json", data, {
    params: {
      token: token,
    },
  });
export const editInventory = async (data, id) =>
  axiosInstance.put(`/items/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const getInventoryDetails = async (id) =>
  axiosInstance.get(`/items/${id}.json`, {
    params: {
      token: token,
    },
  });

export const getChecklist = async () =>
  axiosInstance.get("/checklists.json?q[ctype_eq]=routine", {
    params: {
      token: token,
    },
  });
export const getAssociationList = async (checklistId) =>
  axiosInstance.get(
    `/checklist_associations.json?checklist_id=${checklistId}`,
    {
      params: {
        token: token,
      },
    }
  );

export const getChecklistDetails = async (id) =>
  axiosInstance.get(`/checklists/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postAssetAssociation = async (data) =>
  axiosInstance.post(`/activities.json`, data, {
    params: {
      token: token,
    },
  });

export const getRoutineTask = async () =>
  axiosInstance.get("/activities.json?q[checklist_ctype_eq]=routine", {
    params: {
      token: token,
    },
  });
export const getPPMTask = async () =>
  axiosInstance.get("/activities.json?q[checklist_ctype_eq]=ppm", {
    params: {
      token: token,
    },
  });
export const getRoutineTaskDetails = async (assetId, activityId) =>
  axiosInstance.get(
    `/submissions.json?q[asset_id_eq]=${assetId}&q[activity_id_eq]=${activityId}`,
    {
      params: {
        token: token,
      },
    }
  );

export const getAssetPPMActivityDetails = async (assetId) =>
  axiosInstance.get(
    `/submissions.json?q[asset_id_eq]=${assetId}&q[checklist_ctype_eq]=ppm`,
    {
      params: {
        token: token,
      },
    }
  );
export const getAssetPPMs = async (assetId) =>
  axiosInstance.get(
    `/site_assets/${assetId}/asset_ppm_show.json`,
    {
      params: {
        token: token,
      },
    }
  );
export const getPPMDetails = async (assetId, activityId) =>
  axiosInstance.get(
    `/submissions.json?q[asset_id_eq]=${assetId}&q[activity_id_eq]=${activityId}`,
    {
      params: {
        token: token,
      },
    }
  );
// ppm details
export const getAssetReadingDetails = async (assetId) =>
  axiosInstance.get(
    `/submissions.json?q[asset_id_eq]=${assetId}&q[asset_param_id_null]=0`,

    {
      params: {
        token: token,
      },
    }
  );

export const getSetupUsers = async () =>
  axiosInstance.get("/users.json", {
    params: {
      token: token,
    },
  });
export const getHostList = async (siteId) =>
  axiosInstance.get(`/visitors/fetch_potential_hosts.json?site_id=${siteId}`, {
    params: {
      token: token,
    },
  });
export const postSetupUsers = async (data) =>
  axiosInstance.post("/users/create.json", data, {
    params: {
      token: token,
    },
  });
export const getVehicleParking = async () =>
  axiosInstance.get(`/parking_configurations.json`, {
    params: {
      token: token,
    },
  });
export const postVehicleParking = async (data) =>
  axiosInstance.post(`/parking_configurations.json`, data, {
    params: {
      token: token,
    },
  });
export const deleteVehicleParking = async (id) =>
  axiosInstance.delete(`/parking_configurations/${id}.json`, {
    params: {
      token: token,
    },
  });

export const getVehicleParkingDetails = async (id) =>
  axiosInstance.get(`/parking_configurations/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editVehicleParking = async (data, id) =>
  axiosInstance.patch(`/parking_configurations/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const postNewVisitor = async (data) =>
  axiosInstance.post("/visitors.json", data, {
    params: {
      token: token,
    },
  });

export const getPatrollings = async () =>
  axiosInstance.get("/patrollings.json", {
    params: {
      token: token,
    },
  });
export const getPatrollingDetails = async (id) =>
  axiosInstance.get(`/patrollings/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editPatrollingDetails = async (id, data) =>
  axiosInstance.put(`/patrollings/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postPatrolling = async (data) =>
  axiosInstance.post("/patrollings.json", data, {
    params: {
      token: token,
    },
  });
export const getGoods = async () =>
  axiosInstance.get("/goods_in_outs.json", {
    params: {
      token: token,
    },
  });
export const getGoodsDetails = async (id) =>
  axiosInstance.get(`/goods_in_outs/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postGoods = async (data) =>
  axiosInstance.post("/goods_in_outs.json", data, {
    params: {
      token: token,
    },
  });
export const getVisitorStaffCategory = async () =>
  axiosInstance.get("/visitor_staff_category.json", {
    params: {
      token: token,
    },
  });
export const postNewGoods = async (data) =>
  axiosInstance.post("/goods_in_outs.json", data, {
    params: {
      token: token,
    },
  });
export const getStaff = async () =>
  axiosInstance.get("/staffs.json", {
    params: {
      token: token,
    },
  });
export const getStaffDetails = async (id) =>
  axiosInstance.get(`/staffs/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editStaffDetails = async (id, data) =>
  axiosInstance.put(`/staffs/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postStaff = async (data) =>
  axiosInstance.post("/staffs.json", data, {
    params: {
      token: token,
    },
  });

export const sendMailToUsers = async (userId) =>
  axiosInstance.get(`/users/send_welcome_email.json?id=${userId}`, {
    params: {
      token: token,
    },
  });
export const getAttendance = async () =>
  axiosInstance.get("/attendances.json", {
    params: {
      token: token,
    },
  });
export const getEmployeeAttendance = async (userId) =>
  axiosInstance.get(`/attendances.json?q[attendance_of_id]=${userId}`, {
    params: {
      token: token,
    },
  });

// Events

export const getEvents = async () =>
  axiosInstance.get("/events.json", {
    params: {
      token: token,
      // token: "775d6ae27272741669a65456ea10cc56cd4cce2bb99287b6",
    },
  });
export const getEventsDetails = async (id) =>
  axiosInstance.get(`/events/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postEvents = async (data) =>
  axiosInstance.post("/events.json", data, {
    params: {
      token: token,
    },
  });

//broadcast
export const getBroadCast = async () =>
  axiosInstance.get("/notices.json", {
    params: {
      token: token,
      // token: "775d6ae27272741669a65456ea10cc56cd4cce2bb99287b6",
    },
  });
export const postBroadCast = async (data) =>
  axiosInstance.post("/notices.json", data, {
    params: {
      token: token,
    },
  });

export const getBroadcastDetails = async (id) =>
  axiosInstance.get(`/notices/${id}.json`, {
    params: {
      token: token,
    },
  });

//services
export const getServicesTaskDetails = async (serviceId, activityId) =>
  axiosInstance.get(
    `/submissions.json?q[soft_service_id_eq]=${serviceId}&q[activity_id_eq]=${activityId}`,
    {
      params: {
        token: token,
      },
    }
  );

export const postSoftServices = async (data) =>
  axiosInstance.post("/soft_services.json", data, {
    params: {
      token: token,
    },
  });
export const EditSoftServices = async (data, id) =>
  axiosInstance.put(`/soft_services/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const getSoftServicesDetails = async (id) =>
  axiosInstance.get(`/soft_services/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postServiceAssociation = async (data) =>
  axiosInstance.post(`/activities.json`, data, {
    params: {
      token: token,
    },
  });

export const getSoftServices = async () =>
  axiosInstance.get("/soft_services.json", {
    params: {
      token: token,
    },
  });
export const getServicesChecklist = async () =>
  axiosInstance.get("/checklists.json?q[ctype_eq]=soft_service", {
    params: {
      token: token,
    },
  });
export const postChecklist = async (data) =>
  axiosInstance.post("/checklists.json", data, {
    params: {
      token: token,
    },
  });
export const editChecklist = async (data, id) =>
  axiosInstance.put(`/checklists/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const getServicesChecklistDetails = async (checklistId) =>
  axiosInstance.get(`/checklists.json/${checklistId}`, {
    params: {
      token: token,
    },
  });

export const getAssetPPMList = async () =>
  axiosInstance.get(`/checklists.json?q[ctype_eq]=ppm`, {
    params: {
      token: token,
    },
  });
export const getServicesPPMDetails = async (id) =>
  axiosInstance.get(`/checklists/${id}.json?q[ctype_eq]=ppm`, {
    params: {
      token: token,
    },
  });

//
export const getServicesRoutineList = async () =>
  axiosInstance.get(`/activities.json?q[soft_service_id_null]=0`, {
    params: {
      token: token,
    },
  });
export const postServicePR = async (data) =>
  axiosInstance.post(`/service_orders.json`, data, {
    params: {
      token: token,
    },
  });
// export const getServicesRoutineList = async () =>
//   axiosInstance.get(`/checklists.json?q[ctype_eq]=routine`, {
//     params: {
//       token: token,
//     },
//   });
export const getServicesRoutineDetails = async (id) =>
  axiosInstance.get(`/checklists/${id}.json?q[ctype_eq]=routine`, {
    params: {
      token: token,
    },
  });
export const getExpectedVisitor = async () =>
  axiosInstance.get(`/visitors.json`, {
    params: {
      token: token,
    },
  });
export const getRegisteredVehicle = async () =>
  axiosInstance.get(`/registered_vehicles.json`, {
    params: {
      token: token,
    },
  });
export const getRegisteredVehicleDetails = async (id) =>
  axiosInstance.get(`/registered_vehicles/${id}.json`, {
    params: {
      token: token,
    },
  });
export const getPatrollingHistory = async () =>
  axiosInstance.get(`/patrolling_histories.json`, {
    params: {
      token: token,
    },
  });
export const editRegisteredVehicleDetails = async (id, data) =>
  axiosInstance.put(`/registered_vehicles/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const postRegisteredVehicle = async (data) =>
  axiosInstance.post(`/registered_vehicles.json`, data, {
    params: {
      token: token,
    },
  });
export const getParkingConfig = async () =>
  axiosInstance.get(`/parking_configurations.json`, {
    params: {
      token: token,
    },
  });
export const getVisitorApprovals = async () =>
  axiosInstance.get(`/visitors/approval_form.json`, {
    params: {
      token: token,
    },
  });
export const visitorApproval = async (id, data) =>
  axiosInstance.patch(`/visitors/${id}/approve_visitor.json`, data, {
    params: {
      token: token,
    },
  });
export const getVisitorHistory = async () =>
  axiosInstance.get(`/visitors/approval_history.json`, {
    params: {
      token: token,
    },
  });
export const getVisitorDetails = async (id) =>
  axiosInstance.get(`/visitors/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editVisitorDetails = async (id, data) =>
  axiosInstance.put(`/visitors/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const getVisitorCategory = async () =>
  axiosInstance.get("/visitor_staff_category.json", {
    params: {
      token: token,
    },
  });

export const postVisitorCategory = async (data) =>
  axiosInstance.post("/visitor_staff_categories.json", data, {
    params: {
      token: token,
    },
  });

export const deleteVisitorCategory = async (id) =>
  axiosInstance.delete(`/visitor_staff_categories/${id}.json`, {
    params: {
      token: token,
    },
  });

export const getVisitorCategoryDetails = async (id) =>
  axiosInstance.get(`/visitor_staff_categories/${id}.json`, {
    params: {
      token: token,
    },
  });

export const editVisitorCategory = async (id, data) =>
  axiosInstance.patch(`/visitor_staff_categories/${id}.json`, data, {
    params: {
      token: token,
    },
  });

export const postLOI = async (data) =>
  axiosInstance.post(`/loi_details.json`, data, {
    params: {
      token: token,
    },
  });
export const getLOI = async () =>
  axiosInstance.get(`/loi_details.json`, {
    params: {
      token: token,
    },
  });
export const getServicePR = async () =>
  axiosInstance.get(`/loi_services.json`, {
    params: {
      token: token,
    },
  });
export const getLOIDetails = async (id) =>
  axiosInstance.get(`/loi_details/${id}.json`, {
    params: {
      token: token,
    },
  });
export const getLOIItems = async () =>
  axiosInstance.get(`/loi_items.json`, {
    params: {
      token: token,
    },
  });
export const getLOIItemsDetails = async (id) =>
  axiosInstance.get(`/loi_items/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postLOIItems = async (data) =>
  axiosInstance.post(`/loi_items.json`, data, {
    params: {
      token: token,
    },
  });
export const getStandardUnits = async () =>
  axiosInstance.get(`/standard_units.json`, {
    params: {
      token: token,
    },
  });
export const getContactBook = async () =>
  axiosInstance.get(`/contact_books.json`, {
    params: {
      token: token,
    },
  });
export const postContactBook = async (data) =>
  axiosInstance.post(`/contact_books.json`, data, {
    params: {
      token: token,
    },
  });
export const editContactBook = async (id, data) =>
  axiosInstance.put(`/contact_books/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const getGenericCategory = async () =>
  axiosInstance.get(`/generic_infos.json`, {
    params: {
      token: token,
    },
  });
export const getGenericCategoryDetails = async (id) =>
  axiosInstance.get(`/generic_infos/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editGenericCategoryDetails = async (id, data) =>
  axiosInstance.put(`/generic_infos/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postGenericCategory = async (data) =>
  axiosInstance.post(`/generic_infos.json`, data, {
    params: {
      token: token,
    },
  });
export const postGenericSubCategory = async (data) =>
  axiosInstance.post(`/generic_sub_infos.json`, data, {
    params: {
      token: token,
    },
  });
export const getGenericSubCategory = async () =>
  axiosInstance.get(`/generic_sub_infos.json`, {
    params: {
      token: token,
    },
  });
export const getDependentGenericSubCategory = async (id) =>
  axiosInstance.get(`/generic_sub_infos.json?generic_info_id=${id}`, {
    params: {
      token: token,
    },
  });
export const getContactBookDetails = async (id) =>
  axiosInstance.get(`/contact_books/${id}.json`, {
    params: {
      token: token,
    },
  });

// setup
export const getCompanies = async () =>
  axiosInstance.get(`/sites/company_list.json`, {
    params: {
      token: token,
    },
  });
export const createCompany = async (data) =>
  axiosInstance.post(`/companies.json`, data, {
    params: {
      token: token,
    },
  });
export const getAllFeature = async () =>
  axiosInstance.get(`/sites/all_features.json`, {
    params: {
      token: token,
    },
  });
export const getBuildings = async () =>
  axiosInstance.get(`/buildings.json`, {
    params: {
      token: token,
    },
  });

export const getSites = async () =>
  axiosInstance.get(`/sites.json`, {
    params: {
      token: token,
    },
  });
export const getSiteDetails = async (id) =>
  axiosInstance.get(`/sites/${id}.json`, {
    params: {
      token: token,
    },
  });
export const EditSiteDetails = async (id, data) =>
  axiosInstance.put(`/sites/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postSite = async (data) =>
  axiosInstance.post(`/sites.json`, data, {
    params: {
      token: token,
    },
  });
export const postBuilding = async (data) =>
  axiosInstance.post(`/buildings.json`, data, {
    params: {
      token: token,
    },
  });
export const getAllFloors = async () =>
  axiosInstance.get(`/floors.json`, {
    params: {
      token: token,
    },
  });
export const getFloorDetails = async (id) =>
  axiosInstance.get(`/floors/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editFloorDetails = async (id, data) =>
  axiosInstance.put(`/floors/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postNewFloor = async (data) =>
  axiosInstance.post(`/floors.json`, data, {
    params: {
      token: token,
    },
  });
export const getAllUnits = async () =>
  axiosInstance.get(`/units.json`, {
    params: {
      token: token,
    },
  });
export const getUnitDetails = async (id) =>
  axiosInstance.get(`/units/${id}.json`, {
    params: {
      token: token,
    },
  });
export const editUnitDetails = async (id, data) =>
  axiosInstance.put(`/units/${id}.json`, data, {
    params: {
      token: token,
    },
  });
export const postNewUnit = async (data) =>
  axiosInstance.post(`/units.json`, data, {
    params: {
      token: token,
    },
  });
export const getAllAddress = async () =>
  axiosInstance.get(`/addresses.json`, {
    params: {
      token: token,
    },
  });
export const getAddressDetails = async (id) =>
  axiosInstance.get(`/addresses/${id}.json`, {
    params: {
      token: token,
    },
  });
export const postAddress = async (data) =>
  axiosInstance.post(`/addresses.json`, data, {
    params: {
      token: token,
    },
  });
export const editAddress = async (id, data) =>
  axiosInstance.put(`/addresses/${id}.json`, data, {
    params: {
      token: token,
    },
  });

// vibe

export const vibeLogin = async (data) => vibeAuth.post("/api/login/", data);

// VIBE CALENDAR
export const getVibeCalendar = async (vibeUserId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/calender/get-calender-events/?user_id=${vibeUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};

//VIBE USER
export const getVibeUsers = async (vibeUserId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get-users/?user_id=${vibeUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};
export const getVibeProjectUsers = async (vibeUserId, orgId, boardId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get-users/?user_id=${vibeUserId}&org_id=${orgId}&board_id=${boardId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};
export const getProjectUsers = async (vibeUserId, vibeOrgId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get-users/?user_id=${vibeUserId}&org_id=${vibeOrgId}&os:false`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project users events:", error);
    throw error;
  }
};
export const getOutsideUsers = async (vibeUserId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get_outsiders/?user_id=${vibeUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching outside users events:", error);
    throw error;
  }
};

// vibe Create calendar event
export const postNewCalendarEvent = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/calender/create-event/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
// vibe Create calendar Task
export const postCalendarTask = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/board/add-task/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};

// vibe meetings
// /api/employee/calender/meet/create-zoom-meeting/
export const CreateVibeZoomMeeting = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/calender/meet/create-zoom-meeting/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const CreateVibeTeamMeeting = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/calender/create-teams-meeting/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const CreateVibeMeeting = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/calender/create-meeting/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const UpdateVibeTask = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/calender/update-calender-event/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
// vibeMyBoardTask
export const getVibeMyBoardTask = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/my_board/get-task/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const updateTaskStatus = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/v1/employee/task/update-status/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeTaskUserAssign = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/task/get-task-assigned-users/?user_id=${userId}&task_id=${taskId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const deleteVibeTask = async (userId, taskId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/board/task/trash/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeTaskChecklist = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/get-checklist/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeSubTaskChecklist = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/task/get-subtask/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeActionAndChat = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/task/get-action-and-chats/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeTaskAttachment = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/task/get-attachment/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeComments = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/task/get-comments/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const updateVibeAssignedUser = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/task/update-assign-task/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const updateVibeUserTask = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/v1/employee/task/update_task/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeStatus = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/task/get-status/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const API_URL_WS = "wss://vibecopilot.ai/ws";
export const getVibeMedia = async () => {
  try {
    const response = await vibeAuth.get(
      `https://vibecopilot.ai/api/media/`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const postVibeTaskChat = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/task/add-message/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const postVibeBackground = async (data) => {
  try {
    const response = await vibeAuth.post(`/api/employee/add_bg_image/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeBackground = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get_bg_image/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeMeeting = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/calender/get-meeting/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const getVibeMeetingDetails = async (userId, meetingId) => {
  try {
    const response = await vibeAuth.get(
      // `/api/employee/calender/get-specific_event/?user_id=32&category=Meeting&object_id=349`,
      `/api/employee/calender/get-specific_event/?user_id=${userId}&category=Meeting&object_id=${meetingId}&summery=true`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting meeting details:", error);
    throw error;
  }
};
export const generateVibeMeetingSummary = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/calender/meet/generate-summery/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating calendar events:", error);
    throw error;
  }
};
export const requestVibeDueDate = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/request/make_request/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Requesting Due Date:", error);
    throw error;
  }
};
export const updateVibeChecklistItems = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/v1/employee/task/update-checklist/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Vibe checklist Items :", error);
    throw error;
  }
};
export const updateSalesView = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/filter/add-filter/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating sales view :", error);
    throw error;
  }
};
export const postVibeChecklist = async (data) => {
  try {
    const response = await vibeAuth.post(
      // `/api/employee/task/create-task-checklist/`,
      `/api/v1/employee/task/create-checklist/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating checklist :", error);
    throw error;
  }
};
export const deleteVibeTaskChecklist = async (
  taskDeleteIDCheckList,
  user_id
) => {
  try {
    const response = await vibeAuth.delete(
      `/api/v1/employee/task/delete-checklist/?checklist_id=${taskDeleteIDCheckList}&user_id=${user_id}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating checklist :", error);
    throw error;
  }
};
export const updateVibeSubTask = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/v1/employee/task/update_task/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating checklist :", error);
    throw error;
  }
};
export const updateVibeUserSubTask = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/task/sub_task/update-checklist-task/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subtask :", error);
    throw error;
  }
};
export const createVibeChecklistSubTask = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/v1/employee/create_task/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Creating subtask :", error);
    throw error;
  }
};
export const deleteVibeSubTask = async (taskId, userId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/task/checklist/task/trash/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Creating subtask :", error);
    throw error;
  }
};
export const createVibeChildSubTask = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/subtask/child/create/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Creating child subtask :", error);
    throw error;
  }
};
export const updateSubTaskChild = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/subtask/child/update/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating child subtask :", error);
    throw error;
  }
};
export const deleteTaskChecklistSubTaskChild = async (taskChildId, userId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/subtask/child/delete/?task_child_id=${taskChildId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating child subtask :", error);
    throw error;
  }
};
export const addVibeTaskAttachment = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/task/add-attachment/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting Attachments :", error);
    throw error;
  }
};
export const deleteVibeTaskAttachment = async (attachmentId, taskId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/task/delete-attachment/?attachment_id=${attachmentId}&task_id=${taskId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting Attachments :", error);
    throw error;
  }
};
export const postNewProjectBoard = async (data) => {
  try {
    const response = await vibeAuth.post(`/api/employee/add-board/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting new board :", error);
    throw error;
  }
};
export const getVibeSocialData = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/social-media/get-auth-info/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting social data :", error);
    throw error;
  }
};
export const getGmailAuthenticate = async (platform) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/social-media/gmail/get-auth/?platform=${platform}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting gmail data :", error);
    throw error;
  }
};
export const updateLoginGmailStatus = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/social-media/gmail/update-status-login/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting gmail data :", error);
    throw error;
  }
};
export const addGmailAuthenticate = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/social-media/gmail/create-auth/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding gmail data :", error);
    throw error;
  }
};
export const getVibeUserBoard = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get-user-board/?user_id=${userId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding gmail data :", error);
    throw error;
  }
};
export const deleteVibeUserBoard = async (boardId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/delete-board?board_id=${boardId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting board :", error);
    throw error;
  }
};
export const updateVibeBoardDate = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/board/update_date/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating board date :", error);
    throw error;
  }
};
export const getVibeBoardTemplate = async (userID) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get-template/?user_id=${userID}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Getting project template :", error);
    throw error;
  }
};
export const updateVibeBoardTemplate = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/update-board-template/`,
      data,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project template :", error);
    throw error;
  }
};
export const getVibeBoardData = async (boardId, userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/custom_board/get-task/?board_id=${boardId}&user_id=${userId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting project data :", error);
    throw error;
  }
};
export const getVibeBoardUser = async (userId, orgId, boardId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/get-board-users/?user_id=${userId}&org_id=${orgId}&board_id=${boardId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting project data :", error);
    throw error;
  }
};
export const getVibeCalenderEventsNew = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/calender/get-events/?user_id=${userId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting new events data :", error);
    throw error;
  }
};
export const deleteVibeCalenderTask = async (userId, category, id) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/calender/delete-calender-event/?user_id=${userId}&category=${category}&id=${id}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleing task data :", error);
    throw error;
  }
};
export const createVibeSchedule = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/work_schedule/create-schedule/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Creating Schedule :", error);
    throw error;
  }
};
export const getVibeSchedule = async (userID, startDate, endDate) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/work_schedule/get-schedule/?user_id=${userID}&from_date=${startDate}&to_date=${endDate}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting Schedule :", error);
    throw error;
  }
};
export const getVibeTodaySlots = async (userId, fromDate, endDate) => {
  try {
    const response = await vibeAuth.get(
      `/api/doctor/get-today-my-slots/?user_id=${userId}&from_date=${fromDate}&to_date=${endDate}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting slots :", error);
    throw error;
  }
};
export const postVisitorOTPApi = async (data) => {
  try {
    const response = await vibeAuth.post(
      `https://vibecopilot.ai/api/send-test-otp/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting slots :", error);
    throw error;
  }
};
export const postOutlookAuth = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/social-media/outlook/create-auth/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting slots :", error);
    throw error;
  }
};
export const getProjectTaskDependencies = async (userId, boardId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/get-dependencies/?user_id=${userId}&board_id=${boardId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting dependencies :", error);
    throw error;
  }
};
export const getDependencies = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/get-dependencies/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting dependencies :", error);
    throw error;
  }
};
export const getVibeUserBirthday = async (userId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/calender/get-users-birthday/?user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting birthday :", error);
    throw error;
  }
};
export const createVibeUserBirthday = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/calender/add-birthday/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Creating birthday :", error);
    throw error;
  }
};
export const deleteVibeUserBirthday = async (userId, BdId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/calender/delete-birthday/?user_id=${userId}&birthday_id=${BdId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting birthday :", error);
    throw error;
  }
};
export const postVibeTaskComment = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/v1/employee/task/add-comment/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Creating Comment :", error);
    throw error;
  }
};
export const getVibeMainTaskDependencies = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/get-depend_on/?user_id=${userId}&task_id=${taskId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting dependent task :", error);
    throw error;
  }
};
export const GetTaskBulk = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/children/get_task_bulk/?user_id=${userId}&task_id=${taskId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting bulk task :", error);
    throw error;
  }
};
export const GetVibeBoardTaskPermission = async (userId, boardId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/board/get_task_permission/?user_id=${userId}&board_id=${boardId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting task permission:", error);
    throw error;
  }
};
export const updateChecklistSequence = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/board/checklist/update-checklist-sequence/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating checklist sequence :", error);
    throw error;
  }
};
export const Updatetaskchecklist = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/v1/employee/task/relocate-task/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task checklist :", error);
    throw error;
  }
};
export const UpdateTaskAction = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/task/add-task-action/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task action :", error);
    throw error;
  }
};
export const UpdateProjectSectionTitle = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/board/update-board-checklist/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating title :", error);
    throw error;
  }
};

export const deleteSection = async (taskDeleteIDSection, userId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/employee/board/delete-board-checklist/?check_id=${taskDeleteIDSection}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting section :", error);
    throw error;
  }
};
export const addBoardChecklist = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/board/add-board-checklist/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting section :", error);
    throw error;
  }
};

export const deleteProjectTask = async (taskId, userId) => {
  try {
    const response = await vibeAuth.delete(
      `/api/v1/employee/tasks/trash/?task_id=${taskId}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data/",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task :", error);
    throw error;
  }
};
export const getProjectAssignedUser = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/get_task_assigned_users?user_id=${userId}&task_id=${taskId}`,

      {
        headers: {
          "Content-Type": "multipart/form-data/",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task :", error);
    throw error;
  }
};
export const updateProjectAssigned = async (data) => {
  try {
    const response = await vibeAuth.put(
      `/api/employee/board/update-board-assign/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data/",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating assign :", error);
    throw error;
  }
};
export const postOutSiderInvite = async (data) => {
  try {
    const response = await vibeAuth.post(
      `/api/employee/outsider/invite/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data/",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Assign task :", error);
    throw error;
  }
};
export const getTaskUsersAssign = async (userId, taskId) => {
  try {
    const response = await vibeAuth.get(
      `/api/v1/employee/task/get_task_assigned_users/?user_id=${userId}&task_id=${taskId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data/",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Assign task :", error);
    throw error;
  }
};
export const getBoardSection = async (userId, boardId) => {
  try {
    const response = await vibeAuth.get(
      `/api/employee/board/get_board_sections/?user_id=${userId}&board_id=${boardId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data/",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Assign task :", error);
    throw error;
  }
};
