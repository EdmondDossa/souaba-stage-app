const { PASSWORD_REGEX, EMAIL_REGEX, TELEPHONE_REGEX, FULLNAME_REGEX } = require("./regex");

export function isPaswordStrong(password) {
  return PASSWORD_REGEX.test(password);
}

export function isEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function isValidPhoneNumber(email) {
  return TELEPHONE_REGEX.test(email);
}

export function isValidFullname(email) {
  return FULLNAME_REGEX.test(email);
}
