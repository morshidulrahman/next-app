export const formatError = (error) => {
  if (error.response?.data?.errors) {
    return {
      success: false,
      error: error.response.data.errors[0].message,
    };
  } else if (error.response?.data?.message) {
    return { success: false, error: error.response.data.message };
  } else {
    return { success: false, error: "An error occurred" };
  }
};
