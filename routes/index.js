'use strict';
const express = require('express');
const router = express.Router();

const {router: announcementsRouter} = require('./announcementsRouter');
const {router: eventevalsRouter} = require('./eventevalsRouter');
const {router: feedbacksRouter} = require('./feedbacksRouter');
const {router: trainingsRouter} = require('./trainingsRouter');
const {router: usersRouter} = require('./usersRouter');
const {router: authRouter} = require('./authRouter');
















module.exports = {announcementsRouter, eventevalsRouter, feedbacksRouter, trainingsRouter, usersRouter, authRouter};