'use strict';

const databaseURL = 'js/database.json';
let isAdminLogin = false;
let indicatorState = 'overview';
let database;

function renderOverview(data) {
    let overview = document.querySelector('.overview-editable');
    let pd = document.createElement('h2');
    pd.textContent = data.overview['primary-description'];
    overview.appendChild(pd);
    let sd = document.createElement('p');
    sd.textContent = data.overview['secondary-description'];
    overview.appendChild(sd);
    let links = document.createElement('div');
    links.classList.add('links');

    // Apple Podcasts Icon
    let ap = document.createElement('a');
    ap.classList.add('link');
    ap.title = 'Apple Podcasts';
    ap.setAttribute('aria-label', 'Go to the podcast page on Apple Podcasts')
    ap.setAttribute('href', data.links['apple-podcasts']);
    ap.appendChild(links);
    ap.innerHTML = '<i class="fa fa-podcast" aria-hidden="true"></i>';
    links.appendChild(ap);

    // Spotify Icon
    let sf = document.createElement('a');
    sf.classList.add('link');
    sf.title = 'Spotify';
    sf.setAttribute('aria-label', 'Go to the podcast page on Spotify')
    sf.setAttribute('href', data.links['spotify']);
    sf.appendChild(links);
    sf.innerHTML = '<i class="fa fa-spotify" aria-hidden="true"></i>';
    links.appendChild(sf);

    // Google Podcasts Icon
    let gp = document.createElement('a');
    gp.classList.add('link');
    gp.title = 'Apple Podcasts';
    gp.setAttribute('aria-label', 'Go to the podcast page on Google Podcasts')
    gp.setAttribute('href', data.links['google-podcasts']);
    gp.appendChild(links);
    gp.innerHTML = '<i class="fa fa-android" aria-hidden="true"></i>';
    links.appendChild(gp);

    overview.appendChild(links);
}

function renderHosts(data) {

}

function renderEpisodes(data) {
    let episodesList = document.querySelector('.episodes');
    let episodes = data.episodes;
    episodes.sort((episode1, episode2) => episode2.episode - episode1.episode);
    episodes.forEach((episode) => {
        console.log(episode);
        let ep = document.createElement('div');
        ep.classList.add('episode');
        let cover = document.createElement('div');
        cover.setAttribute('style', 'background-image: url(' + episode['cover-photo'] + ');');
        cover.classList.add('episode-cover');
        let description = document.createElement('div');
        description.classList.add('episode-description');
        let number = document.createElement('h4');
        number.innerText = 'Episode ' + episode.episode;
        let title = document.createElement('h3');
        title.innerText = episode.title;
        description.appendChild(number);
        description.appendChild(title);
        ep.appendChild(cover);
        ep.appendChild(description);
        episodesList.appendChild(ep);
    });
}

function fetchDatabase(url) {
	let promise = fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
            database = JSON.parse(JSON.stringify(data));
            renderOverview(database);
            renderEpisodes(database);
		})
		.catch(function(err) {
			// renderError(err);
        })
    return promise;
}

fetchDatabase(databaseURL);

let overviewIndicator = document.querySelector('#to-overview');
overviewIndicator.addEventListener('click', () => {
    if(indicatorState != 'overview') {
        indicatorState = 'overview';
        hostsIndicator.classList.remove('active');
        overviewIndicator.classList.add('active');
        document.querySelector('.overview-editable').innerHTML = '';
        renderOverview(database);
    }
});


let hostsIndicator = document.querySelector('#to-hosts');
hostsIndicator.addEventListener('click', () => {
    if(indicatorState != 'hosts') {
        indicatorState = 'hosts';
        overviewIndicator.classList.remove('active');
        hostsIndicator.classList.add('active');
        document.querySelector('.overview-editable').innerHTML = '';
        renderHosts(database);
    }
});

