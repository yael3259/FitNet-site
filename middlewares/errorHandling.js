
export const errorHandling=(err, req, res, next) => {
    res.status(500).send("התרחשה שגיאה");
}