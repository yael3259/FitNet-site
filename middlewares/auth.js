import jwt from 'jsonwebtoken';

// authentication - אימות
// authorization - הרשאה


// הרשאת גישה למשתמש רשום
export const auth = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).json({ type: "not registered", message: "missing token" });

    try {
        // הפונקציה verify מחזירה את הפרטים המוצפנים שנמצאים בטוקן למקור
        let user = jwt.verify(token, process.env.SECRET_JWT);
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ type: "not registered", message: "invalid token/ token expired" });
    }
}


// הרשאת גישה למנהל
export const authAdmin = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).json({ type: "not registered", message: "missing token" });

    try {
        // הפונקציה verify מחזירה את הפרטים המוצפנים שנמצאים בטוקן למקור
        let user = jwt.verify(token, process.env.SECRET_JWT);

        if (user.role != "ADMIN")
            return res.status(401).json({ type: "not authorized", message: "This action is only authorized by the administrator" });

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ type: "not registered", message: "invalid token/ token expired" });
    }
}