const express = require('express');
const TODO = require('../models/todo');

exports.FetchTask = async (req, res) => {
	try {
		const GetTask = await TODO.find({ user: req.user._id });
		res.json(GetTask);
	} catch (err) {
		console.error("FetchTask Error:", err);
		res.status(500).json({ message: err.message });
	}
};

exports.CreateTask = async (req, res) => {

	if (req.body == undefined) {
		return res.status(500).json({
			"All Fields Required": [
				{
					"Task": "Required",
					"Description": "Required",
				}]
		})
	}
	const { task, description } = req.body;

	const newTask = new TODO({
		task: task,
		description: description,
		user: req.user._id
	});
	console.log(newTask)
	try {
		const savedTask = await newTask.save();
		res.status(201).json(savedTask);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.UpdateTask = async (req, res) => {
	try {
		const UpdatedTask = await TODO.findByIdAndUpdate(

			req.params.id,
			{
				task: req.body.task,
				description: req.body.description,
				completed: req.body.completed
			},
			{ new: true }
		);
		if (!UpdatedTask) return res.status(404).json({ message: 'Todo not found' });
		res.json(UpdatedTask);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.deleteTask = async (req, res) => {
	try {
		const deletedTask = await TODO.findByIdAndDelete(req.params.id);
		if (!deletedTask) return res.status(404).json({ message: 'Todo not found' });
		res.json({ message: 'Todo deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
