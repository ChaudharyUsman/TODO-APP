const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {

	if (req.body == undefined) {
		return res.status(500).json({
			"All Fields Required": [
				{
					"username": "Required",
					"Password": "Required",
				}]
		})
	}
	const { username, password } = req.body;
	console.log(req.body)

	if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

	const foundUser = await User.findOne({ username: username });
	// evaluate password 
	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					_id: foundUser._id,
					username: foundUser.username,
					role: foundUser.role
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		const refreshToken = jwt.sign(
			{
				"username": foundUser.username
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);
		// Saving refreshToken
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);

		// Creates Secure Cookie with refresh token
		res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });



		// Send authorization 
		res.json({ username, role: foundUser.role, accessToken });

	} else {
		res.sendStatus(401);
	}
}

module.exports = { handleLogin };