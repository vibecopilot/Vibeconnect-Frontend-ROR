import axiosInstance from "./axiosInstance";
import { getItemInLocalStorage } from "../utils/localStorage";

const token = getItemInLocalStorage("TOKEN");

/** Surveys */
export const getSurveys = async (params = {}) => {
  const { page = 1, per_page = 100, ...rest } = params;
  return axiosInstance.get("/surveys.json", {
    params: { token, page, per_page, ...rest },
  });
};

export const getSurvey = async (id) =>
  axiosInstance.get(`/surveys/${id}.json`, { params: { token } });

export const createSurvey = async (data) => {
  const isFormData = data instanceof FormData;
  return axiosInstance.post("/surveys.json", data, {
    params: { token },
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  });
};

export const updateSurvey = async (id, data) => {
  const isFormData = data instanceof FormData;
  return axiosInstance.put(`/surveys/${id}.json`, data, {
    params: { token },
    headers: isFormData ? {} : { "Content-Type": "application/json" },
  });
};

export const deleteSurvey = async (id) =>
  axiosInstance.delete(`/surveys/${id}.json`, { params: { token } });

/** Survey questions (nested under survey) */
export const createSurveyQuestion = async (surveyId, data) =>
  axiosInstance.post(`/surveys/${surveyId}/survey_questions.json`, data, {
    params: { token },
    headers: { "Content-Type": "application/json" },
  });

export const updateSurveyQuestion = async (surveyId, questionId, data) =>
  axiosInstance.put(
    `/surveys/${surveyId}/survey_questions/${questionId}.json`,
    data,
    { params: { token }, headers: { "Content-Type": "application/json" } }
  );

export const deleteSurveyQuestion = async (surveyId, questionId) =>
  axiosInstance.delete(
    `/surveys/${surveyId}/survey_questions/${questionId}.json`,
    { params: { token } }
  );

/** Survey responses (submit answers) */
export const getSurveyResponses = async (surveyId) =>
  axiosInstance.get(`/surveys/${surveyId}/survey_responses.json`, {
    params: { token },
  });

export const createSurveyResponse = async (surveyId, data) =>
  axiosInstance.post(`/surveys/${surveyId}/survey_responses.json`, data, {
    params: { token },
    headers: { "Content-Type": "application/json" },
  });

/** Public (no auth): for shared link – anyone can open and submit */
export const getPublicSurvey = async (id) =>
  axiosInstance.get(`/public/surveys/${id}.json`);

export const createPublicSurveyResponse = async (surveyId, data) =>
  axiosInstance.post(`/public/surveys/${surveyId}/responses.json`, data, {
    headers: { "Content-Type": "application/json" },
  });
