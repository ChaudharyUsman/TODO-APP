const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.sendStatus(401);
	console.log(authHeader);
	const token = authHeader.split(' ')[1];
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(err, decoded) => {
			if (err) return res.sendStatus(403);

			req.user = {
				_id: decoded.UserInfo._id,
				username: decoded.UserInfo.username,
				role: decoded.UserInfo.role
			};
			// req.user = decoded.UserInfo;
			// req.user = decoded.username;
			next();
		}
	);
}

module.exports = verifyJWT