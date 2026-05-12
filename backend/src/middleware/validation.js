import { body, validationResult } from "express-validator";

export const signupValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters"),
];



export const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];