#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const chalk = require('chalk');
const ora = require('ora');
const logUpdate = require('log-update');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const pre = chalk.cyan.bold('›');
const pos = chalk.red.bold('›');
const profile = `https://www.instagram.com/${arg}/?__a=1`;
const spinner = ora();

if (arg === '-h' || arg === '--help') {
	console.log(`
 Usage: stalk <user>

 Commands: 
  -h, ${chalk.dim('--help')}    Display help

 Help:
  $ stalk 9gag
 
 You can also use:

 ${pre} ${chalk.dim('instavim  : complete instagram media downloader')}
 ${pre} ${chalk.dim('instafy   : new instagram post notifications from command line')}

 Don't pollute your browser history. Do things from the command line.
  `);
	process.exit(1);
}

if (!arg) {
	logUpdate(`\n${pos} Username required! \n\n ${chalk.dim('$ stalk -h or --help for more help')}\n`);
	process.exit(1);
}

dns.lookup('instagram.com', err => {
	if (err) {
		logUpdate(`\n${pos} Please check your Internet Connection! \n`);
	} else {
		logUpdate();
		spinner.text = `Hold your breath, sucker!`;
		spinner.start();

		got(profile, {json: true}).then(res => {
			logUpdate(`
${pre} Full Name      :  ${res.body.user.full_name || `${arg}'s full name is not available!`} 

${pre} Biography      :  ${res.body.user.biography}

${pre} Followers      :  ${res.body.user.followed_by.count}

${pre} Following      :  ${res.body.user.follows.count}

${pre} External link  :  ${res.body.user.external_url || `no external url provided by ${arg}`}
				`);
			spinner.stop();
		}).catch(err => {
			if (err) {
				logUpdate(`\n${pos} ${arg} is not an Instagram user! \n`);
				process.exit(1);
			}
		});
	}
});
