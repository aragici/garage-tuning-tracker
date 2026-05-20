const jwt = require('jsonwebtoken');
const SECRET_KEY = 'garage_gizli_anahtar'; 

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access denied. Token not found.' });

    try {
        const token = authHeader.split(' ')[1] || authHeader;
        
        const verified = jwt.verify(token, SECRET_KEY);
        
        req.user = verified; 
        
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};