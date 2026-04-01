export const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email) {
        return { valid: false, error: 'Email is required' };
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Please enter a valid email' };
    }
    
    return { valid: true };
};

export const validatePassword = (password: string, minLength: number = 6): { valid: boolean; error?: string } => {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }
    
    if (password.length < minLength) {
        return { valid: false, error: `Password must be at least ${minLength} characters` };
    }
    
    return { valid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): { valid: boolean; error?: string } => {
    if (password !== confirmPassword) {
        return { valid: false, error: 'Passwords do not match' };
    }
    
    return { valid: true };
};

export const validateUsername = (username: string): { valid: boolean; error?: string } => {
    if (!username) {
        return { valid: false, error: 'Username is required' };
    }
    
    if (username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }
    
    return { valid: true };
};

export const validateLoginForm = (email: string, password: string): { valid: boolean; error?: string } => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return emailValidation;
    }
    
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }
    
    return { valid: true };
};

export const validateRegisterForm = (
    email: string,
    password: string,
    confirmPassword: string,
    username: string
): { valid: boolean; error?: string } => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return emailValidation;
    }
    
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
        return usernameValidation;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        return passwordValidation;
    }
    
    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.valid) {
        return passwordMatchValidation;
    }
    
    return { valid: true };
};
