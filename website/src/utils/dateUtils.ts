// Date utility functions for Unlimited Planner

export const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const normalizeDayDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

export const startOfWeek = (date: Date) => {
    const normalized = normalizeDayDate(date);
    normalized.setDate(normalized.getDate() - normalized.getDay() + 1); // Set to Monday
    return normalized;
};