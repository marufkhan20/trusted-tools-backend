const registerValidator = (user) => {
  const { email, password, confirmPassword, firstName, lastName } = user;
  const validationError = {};

  if (!firstName) {
    validationError.firstName = "First Name is required";
  }

  if (!lastName) {
    validationError.lastName = "Last Name is required";
  }

  if (!email) {
    validationError.email = "Email is required";
  }

  if (!password) {
    validationError.password = "Password is required";
  }

  if (!confirmPassword) {
    validationError.confirmPassword = "Confirm password is required";
  }

  if (password !== confirmPassword) {
    validationError.confirmPassword =
      "Password and Confirm Password Does Not match";
  }

  return validationError;
};

// login validator
const loginValidator = (user) => {
  const { email, password } = user;
  const validationError = {};

  if (!email) {
    validationError.email = "Email is required";
  }

  if (!password) {
    validationError.password = "Password is required";
  }

  return validationError;
};

module.exports = {
  registerValidator,
  loginValidator,
};
