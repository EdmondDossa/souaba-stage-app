export const EMAIL_REGEX = /^[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}$/;

export const FULLNAME_REGEX = /^([A-ZÀ-ÖØ-Ýa-zà-öø-ÿ'-\s]{3,})+$/;

export const TEXT_INPUT_REGEX = /^([A-ZÀ-ÖØ-Ýa-zà-öø-ÿ0-9<>";(),.'-\s]{3,})+$/;

export const TELEPHONE_REGEX = /^\+?[0-9\s]{8,20}$/;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/;
