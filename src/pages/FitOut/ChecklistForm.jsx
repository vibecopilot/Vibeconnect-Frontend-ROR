import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowLeft,
  X,
  Image,
  Send,
  FileX,
  Building2,
  Tag,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Grid,
  FormHelperText,
  Paper,
  CircularProgress,
} from "@mui/material";

import {
  getSnagChecklistByCategory,
  postSnagAnswer,
  getFitoutCategoriesSetupDetails,
  getSiteDetails,
} from "../../api";

import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const ChecklistForm = ({
  resourceId: propResourceId,
  onClose,
  isModal = false,
  checklistId: propChecklistId,
  isViewMode = false,
  submittedData = null,
  onSubmissionComplete,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [checklistData, setChecklistData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();

  const [siteName, setSiteName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const { id } = useParams();

  const searchChecklistId = searchParams.get("checklist_id");

  const resourceId =
    propResourceId || searchParams.get("resource_id");

  const checklistId =
    propChecklistId || searchChecklistId || id;

  console.log("resourceId", resourceId);
  console.log("checklistId", checklistId);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        setLoading(true);

        // API CALL
        const response = await getSnagChecklistByCategory(
          resourceId
        );

        console.log("Checklist API Response:", response);

        // HANDLE DIFFERENT RESPONSE STRUCTURES
        let checklist = null;

        // Case 1: response.data is array
        if (
          Array.isArray(response?.data) &&
          response.data.length > 0
        ) {
          checklist = response.data[0];
        }

        // Case 2: response.data.checklists
        else if (
          Array.isArray(response?.data?.checklists) &&
          response.data.checklists.length > 0
        ) {
          checklist = response.data.checklists[0];
        }

        // Case 3: single object
        else if (
          response?.data &&
          typeof response.data === "object"
        ) {
          checklist = response.data;
        }

        console.log("Final Checklist:", checklist);

        // NO DATA
        if (!checklist || !checklist.id) {
          setChecklistData(null);
          toast.error("Checklist not found");
          return;
        }

        // SET CHECKLIST
        setChecklistData(checklist);

        // FETCH SITE NAME
        if (checklist.site_id) {
          try {
            const siteResponse = await getSiteDetails(
              checklist.site_id
            );

            console.log("Site Response:", siteResponse);

            setSiteName(
              siteResponse?.data?.name || "Unknown Site"
            );
          } catch (error) {
            console.log(error);
            setSiteName("Unknown Site");
          }
        }

        // FETCH CATEGORY NAME
        if (checklist.snag_audit_category_id) {
          try {
            const categoryResponse =
              await getFitoutCategoriesSetupDetails(
                checklist.snag_audit_category_id
              );

            console.log(
              "Category Response:",
              categoryResponse
            );

            setCategoryName(
              categoryResponse?.data?.name ||
                "Unknown Category"
            );
          } catch (error) {
            console.log(error);
            setCategoryName("Unknown Category");
          }
        }
      } catch (error) {
        console.log("Checklist Fetch Error:", error);

        toast.error("Failed to load checklist");

        setChecklistData(null);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      fetchChecklist();
    } else {
      setLoading(false);
    }
  }, [resourceId]);

  // VIEW MODE DATA
  useEffect(() => {
    if (
      isViewMode &&
      submittedData &&
      checklistData
    ) {
      const populatedData = {};

      if (Array.isArray(submittedData)) {
        submittedData.forEach((answer) => {
          if (answer.question_id) {
            populatedData[`question_${answer.question_id}`] =
              answer.ans_descr ||
              answer.comments ||
              "";
          }
        });
      }

      setFormData(populatedData);
    }
  }, [isViewMode, submittedData, checklistData]);

  // INPUT CHANGE
  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};

    checklistData?.questions?.forEach((question) => {
      const fieldName = `question_${question.id}`;

      if (
        question.quest_mandatory &&
        (!formData[fieldName] ||
          formData[fieldName].trim() === "")
      ) {
        newErrors[fieldName] =
          "This field is required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (isViewMode) return;

    try {
      setSubmitting(true);

      const userId =
        getItemInLocalStorage("UserId") ||
        getItemInLocalStorage("VIBEUSERID");

      const companyId =
        getItemInLocalStorage("COMPANYID");

      const answers = [];

      checklistData.questions?.forEach((question) => {
        const fieldName = `question_${question.id}`;

        const value = formData[fieldName];

        if (value && value.trim() !== "") {
          let answerData = {
            question_id: question.id,
            user_id: userId,
            company_id: companyId,
            checklist_id: checklistData.id,
            answer_type: question.qtype,
            answer_mode: "form",
            comments: value,
            ans_descr: value,
            resource_id: resourceId,
            resource_type: "FitoutRequestCategory",
          };

          if (question.qtype === "Multiple Choice") {
            const selectedOption =
              question.options?.find(
                (opt) => opt.qname === value
              );

            if (selectedOption) {
              answerData.quest_option_id =
                selectedOption.id;
            }
          }

          answers.push(answerData);
        }
      });

      if (answers.length === 0) {
        toast.error(
          "Please answer at least one question"
        );
        return;
      }

      for (const answer of answers) {
        await postSnagAnswer({
          snag_answer: answer,
        });
      }

      toast.success("Checklist submitted successfully");

      if (onSubmissionComplete) {
        onSubmissionComplete();
      }

      if (isModal && onClose) {
        onClose();
      } else {
        navigate("/fitout/request/list");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit checklist");
    } finally {
      setSubmitting(false);
    }
  };

  // FORM SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await handleSubmit();
    }
  };

  // FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return "NA";

    return new Date(dateString).toLocaleString();
  };

  // QUESTION TYPE ICON
  const getQuestionTypeIcon = (qtype) => {
    switch (qtype) {
      case "Yes/No":
        return <CheckCircle2 size={16} />;

      case "Text":
        return <FileText size={16} />;

      default:
        return <HelpCircle size={16} />;
    }
  };

  // QUESTION COLOR
  const getQuestionTypeBadgeColor = (qtype) => {
    switch (qtype) {
      case "Yes/No":
        return "success";

      case "Text":
        return "primary";

      case "Multiple Choice":
        return "secondary";

      default:
        return "default";
    }
  };

  // INPUT RENDER
  const renderQuestionInput = (question) => {
    const fieldName = `question_${question.id}`;

    const value = formData[fieldName] || "";

    switch (question.qtype) {
      case "Multiple Choice":
        return (
          <FormControl
            fullWidth
            error={!!errors[fieldName]}
            sx={{ mt: 2 }}
          >
            <InputLabel>
              {question.descr}
            </InputLabel>

            <Select
              value={value}
              label={question.descr}
              disabled={isViewMode}
              onChange={(e) =>
                handleInputChange(
                  fieldName,
                  e.target.value
                )
              }
            >
              {question.options?.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.qname}
                >
                  {option.qname}
                </MenuItem>
              ))}
            </Select>

            {errors[fieldName] && (
              <FormHelperText>
                {errors[fieldName]}
              </FormHelperText>
            )}
          </FormControl>
        );

      case "Yes/No":
        return (
          <FormControl
            fullWidth
            error={!!errors[fieldName]}
            sx={{ mt: 2 }}
          >
            <InputLabel>
              {question.descr}
            </InputLabel>

            <Select
              value={value}
              label={question.descr}
              disabled={isViewMode}
              onChange={(e) =>
                handleInputChange(
                  fieldName,
                  e.target.value
                )
              }
            >
              <MenuItem value="yes">
                Yes
              </MenuItem>

              <MenuItem value="no">
                No
              </MenuItem>
            </Select>

            {errors[fieldName] && (
              <FormHelperText>
                {errors[fieldName]}
              </FormHelperText>
            )}
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={question.descr}
            value={value}
            InputProps={{
              readOnly: isViewMode,
            }}
            onChange={(e) =>
              handleInputChange(
                fieldName,
                e.target.value
              )
            }
            error={!!errors[fieldName]}
            helperText={errors[fieldName]}
            sx={{ mt: 2 }}
          />
        );
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <CircularProgress />
          <p className="text-gray-600 text-lg">
            Loading Checklist...
          </p>
        </div>
      </div>
    );
  }

  // NO CHECKLIST
  if (!loading && !checklistData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FileX
            size={50}
            className="mx-auto text-gray-400"
          />

          <h2 className="text-xl font-semibold mt-3">
            Checklist Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            No checklist available for this category.
          </p>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() =>
              navigate("/fitout/request/list")
            }
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        {/* HEADER */}
        <Box sx={{ mb: 3 }}>
          {!isModal && (
            <Button
              variant="text"
              startIcon={<ArrowLeft size={16} />}
              onClick={() =>
                navigate("/fitout/request/list")
              }
            >
              Back
            </Button>
          )}

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            {checklistData?.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Checklist ID : #{checklistData?.id}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<Tag size={14} />}
              label={categoryName || "Category"}
              color="primary"
              variant="outlined"
            />

            <Chip
              icon={<Building2 size={14} />}
              label={siteName || "Site"}
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* OVERVIEW */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Checklist Overview" />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold">
                  Total Questions
                </Typography>

                <Typography>
                  {checklistData?.total_questions}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography fontWeight="bold">
                  Created On
                </Typography>

                <Typography>
                  {formatDate(
                    checklistData?.created_at
                  )}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* FORM */}
        <Card>
          <CardHeader title="Checklist Questions" />

          <CardContent>
            <form onSubmit={onSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {checklistData?.questions?.map(
                  (question) => (
                    <Paper
                      key={question.id}
                      sx={{
                        p: 3,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          mb: 2,
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={`Q${question.qnumber}`}
                            color="error"
                          />

                          <Chip
                            icon={getQuestionTypeIcon(
                              question.qtype
                            )}
                            label={question.qtype}
                            color={getQuestionTypeBadgeColor(
                              question.qtype
                            )}
                            variant="outlined"
                          />
                        </Box>

                        {question.quest_mandatory && (
                          <Chip
                            label="Required"
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {renderQuestionInput(question)}
                    </Paper>
                  )
                )}

                {!isViewMode && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      startIcon={<Send size={16} />}
                      sx={{
                        bgcolor: "#d32f2f",
                        "&:hover": {
                          bgcolor: "#b71c1c",
                        },
                      }}
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Form"}
                    </Button>
                  </Box>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

ChecklistForm.propTypes = {
  resourceId: PropTypes.string,
  onClose: PropTypes.func,
  isModal: PropTypes.bool,
  checklistId: PropTypes.string,
  isViewMode: PropTypes.bool,
  submittedData: PropTypes.array,
  onSubmissionComplete: PropTypes.func,
};

ChecklistForm.defaultProps = {
  resourceId: null,
  onClose: null,
  isModal: false,
  checklistId: null,
  isViewMode: false,
  submittedData: null,
  onSubmissionComplete: null,
};

export default ChecklistForm;