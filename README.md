# Single Page Timetracker

This is a single-page app built with Vue.js that just let's you make timelogs and export them. This was the precursor to [Timetracker](https://github.com/mateowatson/timetracker), another similar project I'm working on that will have data persistence to a SQL database.

## Usage

A live instance of this app is running at [timetracker.mattwatson.org](http://timetracker.mattwatson.org/). It is purely frontend HTML/CSS/JavaScript. If you close the browser, the timer will stop. Time logs are stored in local storage in the browser. I usually back up my time logs daily, or at least weekly, since local storage might inadvertantly get deleted. The export button makes this easy -- click it to save a file to your computer that has the data (JSON) for all your time logs. The filename will be saved with a timestamp, so you can just keep saving your data files to the same folder, without having naming conflicts. After you export, you can clear the table with the Clear Table button, and start over with new logs. Clearing each time after exporting is more efficient, in my opinion, than never clearing and saving an ever larger file each time. If you want to go back and see all your logs, you can import as many of your old data files as you want, using the Import button.

The interface is not great. I would like to make more dropdowns and an easier edit log UI with date pickers and such. However, most of these issues will be addressed in my PHP [Timetracker](https://github.com/mateowatson/timetracker) project, so I probably won't get around to working on this one much.

However, I'm keeping this repo and the web app around for the following reasons:

- The full-blown backend [Timetracker](https://github.com/mateowatson/timetracker) project is great, but it's unfinished. This is too, but it works well enough, and I use it from time to time.
- This is a lot simpler, cheaper to host, and doesn't require a login. It was borne out of my frustration one day that I couldn't find something like it without having to make an account. Therefore, this really is a different product than the other.
- There are some cool directions this app could go. It could be turned into a browser extension, for instance, or be connected to Google Drive for data persistence. Not sure, just some ideas.

## Installing

I plan to keep this up at [timetracker.mattwatson.org](http://timetracker.mattwatson.org/) for the foreseeable future, but if you want to install it on your own server, or on your local server for development purposes, clone the project and run

`npm install`

from the project root. Then run

`npm run prod`

Then just serve the project root as static files, being sure not to deploy the `node_modules` directory or git files in the case of a live website server, obviously. The `src` directory is also not needed to run the site, as all the files in it are transpiled to an `assets` directory.

## Built With

- [Laravel Mix](https://laravel-mix.com/)
- [Vue.js](https://vuejs.org/)