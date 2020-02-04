"use strict";

const STORE = {
    artistQueryResponse: "",
    releaseGroupsQueryResponse: "",
    releasesQueryResponse: ``,
    tracksQueryResponse: "",
    currentPageNumber: 1,
    resultsPerPage: 5,
    nextPageNumber: null,
    prevPageNumber: null,
};

const baseURL = `https://musicbrainz.org/ws/2/`
// put your own value below!
// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey= "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";
const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

function makeOffset(pageNum) {
    return (pageNum - 1) * STORE.resultsPerPage
}
function getNextPage() {
    const itemCount = !STORE.artistQueryResponse ? 0 : STORE.artistQueryResponse.count
    const pageCount = Math.ceil(itemCount / STORE.resultsPerPage)
    if (pageCount > STORE.currentPageNumber) {
        return STORE.currentPageNumber + 1
    }
    return null
}

function getArtistListFromQuery() {
    const artist = STORE.artistQuery
    let offset = makeOffset(STORE.currentPageNumber)
    let url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}&limit=${STORE.resultsPerPage}`;
    console.log("query artist url ", url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
            STORE.artistQueryResponse = responseJson;
            const nextPage = getNextPage()
            console.log('next page:', nextPage)
            STORE.nextPageNumber = null
            if (nextPage) {
                // offset = makeOffset(nextPage)
                // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
                STORE.nextPageNumber = nextPage
            }
            STORE.prevPageNumber = null
            if (STORE.currentPageNumber > 1) {
                // offset = makeOffset(STORE.currentPageNumber-1)
                // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
                STORE.prevPageNumber = STORE.currentPageNumber - 1
            }
            displayArtistList();
            // ** move handlers to watchform() thing
            // handleSelectArtist();
        })
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}


function displayArtistList() {
    $(".artists-list").empty();

    console.log(STORE.artistQueryResponse.artists.length);
    const artists = STORE.artistQueryResponse.artists;
    console.log(artists.length)

    // const url = get request for artist id
    // populate list of artists to choose from 
    for (let i = 0; i < artists.length; i++) {
        console.log(artists[i].name);
        $(".artists-list").append(
            `<li>
      <p id=${artists[i].id}>${artists[i].name}</p>
      </li>`
        );

        // <a href=${baseURL}artist/${artists[i].id}?inc=release-groups&fmt=json >

    }

    $(".artists-nav").empty()

    if (STORE.prevPageNumber) {
        const btn = `
        
        <button>page ${STORE.prevPageNumber}</button>
        
        `
        const $btn = $(btn)
        $btn.click(ev => {
            ev.preventDefault()
            STORE.currentPageNumber = STORE.prevPageNumber
            console.log('PREV PAGE')
            getArtistListFromQuery()
            //refetch
        })
        $(".artists-nav").append($btn)
    }


    if (STORE.nextPageNumber) {
        const nextBtn = `
        
        <button>page ${STORE.nextPageNumber}</button>
        
        `
        const $next = $(nextBtn)
        $next.click(ev => {
            ev.preventDefault()
            STORE.currentPageNumber = STORE.nextPageNumber
            console.log('NEXT PAGE')
            getArtistListFromQuery()
            //refetch
        })
        $(".artists-nav").append($next)
    }
    

    $("#results").removeClass("hidden");
}

function handleSelectArtist() {
    $('.artists-list').on('click', function (event) {
        event.preventDefault();
        // grab the element that was clicked
        console.log('event target: clicked', $(event.target).attr('id'))
        getReleaseGroupsFromArtistID($(event.target).attr('id'));
        console.log('selected Artist ', $(event.target).text())
        STORE.selectedArtist = $(event.target).text();
        $('.artists-list').addClass('hidden')
    })
    // gets release groups (basically release group is an album)
}

function getReleaseGroupsFromArtistID(artistID) {

    const releaseID = ``
    const recordingID = ``
    const type = ``

    const url = `https://musicbrainz.org/ws/2/artist/${artistID}?inc=release-groups&fmt=json`

    console.log("query release groups url ", url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
            STORE.releaseGroupsQueryResponse = responseJson;
            displayReleaseGroupsList();
            // getTracksFromAlbumID();
        })
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}


function displayReleaseGroupsList() {
    // console.log(STORE.artistQueryResponse.artists.length);
    const albums = STORE.releaseGroupsQueryResponse["release-groups"];
    // const albums = STORE.releaseGroupsQueryResponse["releases"];
    console.log(albums)
    // populate list of albums to choose from 
    for (let i = 0; i < albums.length; i++) {
        console.log(i + ' ' + albums[i].title);
        $(".albums-list").append(
            `<li>
      <p id=${albums[i].id}>
      ${albums[i].title}
      </p>
      </li>`
        );
    }
}


function handleSelectReleaseGroup() {
    $('.albums-list').on('click', function (event) {
        event.preventDefault();
        // grab the element that was clicked
        console.log('event target: clicked', $(event.target).attr('id'))
        getReleasesFromReleaseGroupID($(event.target).attr('id'));
        $('.albums-list').addClass('hidden')
    })
    // getReleasesFromReleaseGroupID("72d15666-99a7-321e-b1f3-a3f8c09dff9f");
}


function getReleasesFromReleaseGroupID(releaseGroupID) {

    const releaseID = ``
    const recordingID = ``
    const type = ``


    const url = `https://musicbrainz.org/ws/2/release-group/${releaseGroupID}?inc=releases&fmt=json`

    console.log("query releases url ", url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
            STORE.releasesQueryResponse = responseJson;
            // displayReleasesList( );
            console.log('should be releaseID ', STORE.releasesQueryResponse.releases[0].id)
            // console.log('should be releaseID ', STORE.releasesQueryResponse[0].id)
            getTracksFromReleaseID(STORE.releasesQueryResponse.releases[0].id);
        })
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}


// then get tracks from album ID


function getTracksFromReleaseID(releaseID) {

    // const url = `https://musicbrainz.org/ws/2/recording/?query=isrc:GBAHT1600302`

    const artistID = "b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d"
    // revolver release group
    const releaseGroupID = "72d15666-99a7-321e-b1f3-a3f8c09dff9f"
    // revolver release
    // const releaseID = `5f3ba07b-4a24-4cd5-b8ad-95ba0fcebec1`
    const recordingID = ``
    const type = `release`



    // const url = `${baseURL}${type}/?inc=&fmt=json`
    const url = `${baseURL}release/${releaseID}?inc=recordings&fmt=json`

    // const url = `https://musicbrainz.org/ws/2/release-group?query=arid:b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d%20and%20primarytype:Album&fmt=json`


    console.log("query tracks url ", url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
                // return response;
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
            STORE.tracksQueryResponse = responseJson;
            // displayTracksList();
            // ** have to move this into handleChooseArtist function later
            // displayTracksList("b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d");

            displayTracksList();
        })
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}





function displayTracksList() {
    const tracks = STORE.tracksQueryResponse["media"];
    console.log(tracks)

    // populate list of tracks to choose from 
    for (let i = 0; i < tracks[0].tracks.length; i++) {
        console.log(i + ' ' + tracks[0].tracks[i].title);
        $(".tracks-list").append(
            `<li>
        <p>${tracks[0].tracks[i].title}</p>
        </li>`
        );
    }
}

function handleSelectTrack() {

    $('.tracks-list').on('click', function (event) {
        event.preventDefault();
        // grab the element that was clicked
        const trackClicked = $(event.target).text();
        console.log('event target: clicked', $(event.target).text())
        // console.log(typeof $(event.target).text())
        getYouTubeVideos($(event.target).text());
        $('.tracks-list').addClass('hidden')

        console.log('handleSelectTrack() done')

    })
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    );
    console.log("queryItems ", queryItems);
    return queryItems.join("&");
}

function displayResults(responseJson) {
    // if there are previous results, remove them
    console.log('from displayResults() ', responseJson);
    $(".videos-list").empty();
    // iterate through the items array
    console.log('from displayResults() ', responseJson.items.length);

    for (let i = 0; i < responseJson.items.length; i++) {
        $(".videos-list").append(
            `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"  target="_blank">
      <img src='${responseJson.items[i].snippet.thumbnails.medium.url}'>
      </a>
      </li>`
        );
    }
    //display the results section
    $("#results").removeClass("hidden");
}


function getYouTubeVideos(trackTitle) {
    // console.log("order ", order);
    const params = {
        key: apiKey,
        q: `"${STORE.selectedArtist}" "${trackTitle}" guitar lesson`,
        part: "snippet",
        maxResults: '10',
        type: "video",
        order: 'relevance',

    };
    const queryString = formatQueryParams(params);
    const url = searchURL + "?" + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    $("form").submit(event => {
        event.preventDefault();
        const artist = $('#js-search-term').val();
        console.log(artist)
        STORE.artistQuery = encodeURIComponent(artist)
        getArtistListFromQuery();
        console.log(encodeURIComponent(artist))
    });
    handleSelectArtist();
    handleSelectReleaseGroup();
    handleSelectTrack();
}

$(watchForm);



















