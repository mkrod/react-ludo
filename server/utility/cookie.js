const cookieConfig = {
    maxAge: 1000 * 60 * 1680, // 10 weeks
    httpOnly: true,
    secure: true, // must be HTTPS for SameSite none
    sameSite: 'none', // allows cross-site cookies
};


module.exports = { cookieConfig }