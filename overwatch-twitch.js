const puppeteer = require('puppeteer');
var config = require('./secrets');
var schedule = require('node-schedule');

const ow_twitch_url = 'https://www.twitch.tv/overwatchleague';
const gchrome_uri = '/usr/bin/google-chrome';

const  owlSchedule = [
    [new Date(2019, 5, 6, 16), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 7, 16), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 8, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 9, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 13, 16), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 14, 16), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 15, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 16, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 20, 16), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 21, 16), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 22, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 23, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 27, 17, 30), 1.5 * 60 * 3 * 60 * 1000],
    [new Date(2019, 5, 28, 17, 30), 1.5 * 60 * 3 * 60 * 1000],
    [new Date(2019, 5, 29, 12), 1.5 * 60 * 4 * 60 * 1000],
    [new Date(2019, 5, 30, 12), 1.5 * 60 * 4 * 60 * 1000]
];


async function bootstrap_browser(duration) {
    const browser = await puppeteer.launch({executablePath: gchrome_uri, headless: false});
    const page = await browser.newPage();
    await page.goto(ow_twitch_url, {waitUntil: 'networkidle2'});
    const login_button_selector = '[data-a-target=login-button]';
    login_button = await page.$(login_button_selector);
    if (login_button) {
        console.log('Starting session...');
        console.log('Session duration ' + duration);
        // Login using my credentials
        let tw_username = config.tw_username;
        let tw_password = config.tw_password;

        await login_button.click();
        await page.waitFor(1500);

        const login_input_selector = '[autocomplete=username]';
        const pw_input_selector = '[autocomplete=current-password]';
        await page.type(login_input_selector, tw_username);
        await page.type(pw_input_selector, tw_password);

        do_login_button = await page.$('[data-a-target=passport-login-button]');
        await do_login_button.click();
        await page.waitFor(duration);
        console.log('Session complete');
    }
    else {
        console.log('Login button not found, something went horribly wrong');
    }
    await browser.close();
};

let jobs = [];

for (let ds of owlSchedule) {
    jobs.push(schedule.scheduleJob(ds[0], () => {bootstrap_browser(ds[1])}));
};

console.log(jobs);
for (let j of jobs) {
    console.log(j.nextInvocation());
};
