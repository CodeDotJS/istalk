#!/usr/bin/env node

'use strict';

const dns = require('dns');
const got = require('got');
const chalk = require('chalk');
const ora = require('ora');
const logUpdate = require('log-update');
const updateNotifier = require('update-notifier');
const strip = require('unicodechar-string');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const arg = process.argv[2];
const pre = chalk.cyan.bold('›');
const pos = chalk.red.bold('›');
const profile = `https://www.instagram.com/${arg}`;
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
		spinner.text = 'Hold your breath, sucker!';
		spinner.start();

		got(profile).then(res => {
			let message = '';
			const privacy = res.body.split('"is_private":')[1].split(',"')[0] === 'false' ? 'Public' : 'Private';
			const usr = res.body.split('"external_url":')[1].split(',"')[0] === 'null' ? message += chalk.red('no external url found') : message += res.body.split('"external_url":"')[1].split('","')[0];

			logUpdate(`
${pre} Full Name      :  ${strip(res.body.split('full_name":"')[1].split('","')[0]) || chalk.red(`${arg}'s full name is not available!`)}

${pre} Profile        :  ${privacy}

${pre} Posts          :  ${res.body.split(',"edge_owner_to_timeline_media":{"count":')[1].split(',"')[0]}

${pre} Biography      :  ${strip(res.body.split('"biography":"')[1].split('","')[0]) || `${chalk.red('no biography found')}`}

${pre} Followers      :  ${res.body.split(',"edge_followed_by":{"count":')[1].split('},"')[0]}

${pre} Following      :  ${res.body.split(',"edge_follow":{"count":')[1].split('},"')[0]}

${pre} External link  :  ${usr}
				`);
			spinner.stop();
		}).catch(error => {
			if (error) {
				logUpdate(`\n${pos} ${arg} is not an Instagram user! \n`);
				process.exit(1);
			}
		});
	}
});
