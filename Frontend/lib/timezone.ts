export const getISTTime = (): Date => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(utcTime + istOffset);
};

export const getISTDate = (): Date => {
    const istTime = getISTTime();
    istTime.setHours(0, 0, 0, 0);
    return istTime;
};
