const User = require("../models/user");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {

	if (req.body == undefined) {
		return res.status(500).json({
			"All Fields Required": [
				{
					"username": "Required",
					"Password": "Required",
				}]
		})
	}

	const { username, password, role } = req.body;
	console.log(username, password, role)

	if (!username || !password)
		return res
			.status(400)
			.json({ message: "Username and password are required." });

	// check duplicate in db
	const duplicate = await User.findOne({ username: username });
	console.log("send data");
	if (duplicate) return res.sendStatus(409); //Conflict

	try {
		const hashedPwd = await bcrypt.hash(password, 10);
		//create and store the new user
		const result = await User.create({
			username: username,
			password: hashedPwd,
			role: role || 'user'
		});

		console.log(result);

		res.status(201).json({ success: `New user ${username} created!` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { handleNewUser };
