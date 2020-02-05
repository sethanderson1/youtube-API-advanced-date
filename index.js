// ** to fix: 
// 1.)  make it so that can only click on a list item, 
// not the whole wide block of the item
// and not somewhere outside the item
// should i make them anchors maybe?
// 2.) hide artist buttons upon
// going to next step
// *********
// make logic for makeoffsetArtist and nextpage
// make album buttons
// 






"use strict";

const STORE = {
  artistQuery: ``,
  artistQueryResponse: "",
  releaseGroupsQueryResponse: "",
  releasesQueryResponse: ``,
  tracksQueryResponse: "",

  artistID: '',

  artistResultsPerPage: 5,
  artistCurrentPageNumber: 1,
  artistNextPageNumber: null,
  artistPrevPageNumber: null,

  albumsResultsPerPage: 5,
  albumsCurrentPageNumber: 1,
  albumsNextPageNumber: null,
  albumsPrevPageNumber: null,
  
  tracksResultsPerPage: 5,
  tracksCurrentPageNumber: 1,
  tracksNextPageNumber: null,
  tracksPrevPageNumber: null,

  videosResultsPerPage: 5,
  videosCurrentPageNumber: 1,
  videosNextPageNumber: null,
  videosPrevPageNumber: null,
};




const baseURL = `https://musicbrainz.org/ws/2/`
// put your own value below!
// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey= "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";
const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

function resetAll() {
  // clears lists in case user decides 
  // to search after lists have been generated
  $('.artists-list').empty();
  $('.albums-list').empty();
  $('.tracks-list').empty();
  $('.videos-list').empty();
  $('.list').addClass('hidden')

  STORE.artistResultsPerPage= 5,
  STORE.artistCurrentPageNumber=1
  STORE.artistNextPageNumber= null
  STORE.artistPrevPageNumber= null

  STORE.albumsResultsPerPage= 5
  STORE.albumsCurrentPageNumber= 1
  STORE.albumsNextPageNumber= null
  STORE.albumsPrevPageNumber= null
  
  STORE.tracksResultsPerPage= 5
  STORE.tracksCurrentPageNumber= 1
  STORE.tracksNextPageNumber= null
  STORE.tracksPrevPageNumber= null
  
  STORE.videosResultsPerPage= 5
  STORE.videosCurrentPageNumber= 1
  STORE.videosNextPageNumber= null
  STORE.videosPrevPageNumber= null
}

function makeOffsetArtists(pageNum) {
  return (pageNum - 1) * STORE.artistResultsPerPage
}

function makeOffsetAlbums(pageNum) {
  return (pageNum - 1) * STORE.albumsResultsPerPage
}

function getNextPageArtists() {
  console.log('STORE.artistQueryResponse(): ',STORE.artistQueryResponse)
  const itemCount = !STORE.artistQueryResponse ? 0 : STORE.artistQueryResponse.count
  const pageCount = Math.ceil(itemCount / STORE.artistResultsPerPage)
  console.log('pageCount ', pageCount)
  if (STORE.artistCurrentPageNumber < pageCount) {
    return STORE.artistCurrentPageNumber + 1
  }
  return null
}


// *** do below one like above one
function getNextPageAlbums() {
  console.log('STORE.releaseGroupsQueryResponse ',STORE.releaseGroupsQueryResponse)
  const itemCount = !STORE.releaseGroupsQueryResponse ? 0 : STORE.releaseGroupsQueryResponse.count
  const pageCount = Math.ceil(itemCount / STORE.releaseGroupsResultsPerPage)
  if (STORE.releaseGroupsCurrentPageNumber < pageCount) {
    return STORE.releaseGroupsCurrentPageNumber + 1
  }
  return null
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  console.log("queryItems ", queryItems);
  return queryItems.join("&");
}


///     DISPLAYERS      //////////////



function displayArtistList() {
  $(".artists-list").empty();
  $('.artists-list').removeClass('hidden')
  console.log(STORE.artistQueryResponse.artists.length);
  const artists = STORE.artistQueryResponse.artists;
  console.log(artists.length) 
  for (let i = 0; i < artists.length; i++) {
    console.log(artists[i].name);
    $(".artists-list").append(
      `<li class="artist-item">
      <p><span class="artist-name" id=${artists[i].id}>${artists[i].name}</span></p>
      </li>`
    );
  }
  $(".artists-list-nav").empty()     
  if (STORE.artistPrevPageNumber) {
    const btn = `
        <button class="artist-button">artist page ${STORE.artistPrevPageNumber}</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.artistCurrentPageNumber = STORE.artistPrevPageNumber
      console.log('PREV PAGE')
      getArtistListFromQuery()
      //refetch
    })
    $(".artists-list-nav").append($btn)
  }
  if (STORE.artistNextPageNumber) {
    const nextBtn = `
        
        <button class="artist-button">artist page ${STORE.artistNextPageNumber}</button>
        
        `
    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()
      STORE.artistCurrentPageNumber = STORE.artistNextPageNumber
      console.log('NEXT PAGE')
      getArtistListFromQuery()
      //refetch
    })
    $(".artists-list-nav").append($next)
  }
  $("#results").removeClass("hidden");
}

function displayReleaseGroupsList() {
  $('.albums-list').removeClass('hidden')
  const artistID = STORE.artistID
  const albums = STORE.releaseGroupsQueryResponse["release-groups"];
  console.log(albums)
  // populate list of albums to choose from 
  for (let i = 0; i < albums.length; i++) {
    console.log(i + ' ' + albums[i].title);
    $(".albums-list").append(
      `<li class="albums-item">
      <p><span class="album-name" id=${albums[i].id}>${albums[i].title}</span></p>
      </li>`
    );
  }

  $(".albums-list-nav").empty()     
  if (STORE.albumsPrevPageNumber) {
    const btn = `
        <button class="albums-button">albums page ${STORE.albumsPrevPageNumber}</button>
        
        `
    const $btn = $(btn)
    $btn.click(ev => {
      ev.preventDefault()
      STORE.albumsCurrentPageNumber = STORE.albumsPrevPageNumber
      console.log('PREV PAGE')
      // getArtistListFromQuery()
      getReleaseGroupsFromArtistID(artistID);
      //refetch
    })
    $(".albums-list-nav").append($btn)
  }
  if (STORE.albumsNextPageNumber) {
    const nextBtn = `
        
        <button class="albums-button">artist page ${STORE.albumsNextPageNumber}</button>
        
        `
    const $next = $(nextBtn)
    $next.click(ev => {
      ev.preventDefault()
      STORE.albumsCurrentPageNumber = STORE.albumsNextPageNumber
      console.log('NEXT PAGE')
      // getArtistListFromQuery()
      getReleaseGroupsFromArtistID(artistID)
      //refetch
    })
    $(".albums-list-nav").append($next)
  }
  $("#results").removeClass("hidden");












}

function displayTracksList() {
  $('.tracks-list').removeClass('hidden')

  const tracks = STORE.tracksQueryResponse["media"];
  console.log(tracks)
  // populate list of tracks to choose from 
  for (let i = 0; i < tracks[0].tracks.length; i++) {
    console.log(i + ' ' + tracks[0].tracks[i].title);
    $(".tracks-list").append(
      `<li class="tracks-item">
        <p><span class="track-name">${tracks[0].tracks[i].title}</span></p>
        </li>`
    );
  }
}

function displayVideoResults(responseJson) {
  $('.videos-list').removeClass('hidden')

  // if there are previous results, remove them
  console.log('from displayVideoResults() ', responseJson);
  $(".videos-list").empty();
  // iterate through the items array
  console.log('from displayVideoResults() ', responseJson.items.length);
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



///     GETTERS      //////////////


function getArtistListFromQuery() {
  const artist = STORE.artistQuery
  let offset = makeOffsetArtists(STORE.artistCurrentPageNumber)
  let url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}&limit=${STORE.artistResultsPerPage}`;
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
      const nextPage = getNextPageArtists()
      console.log('next page:', nextPage)
      STORE.artistNextPageNumber = null
      if (nextPage) {
        // offset = makeOffsetArtists(nextPage)
        // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
        STORE.artistNextPageNumber = nextPage
      }
      STORE.artistPrevPageNumber = null
      if (STORE.artistCurrentPageNumber > 1) {
        // offset = makeOffsetArtists(STORE.artistCurrentPageNumber-1)
        // url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json&offset=${offset}`;    
        STORE.artistPrevPageNumber = STORE.artistCurrentPageNumber - 1
      }
      displayArtistList();
      // ** move handlers to watchform() thing
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getReleaseGroupsFromArtistID(artistID) {
  const albums = STORE.albumsQuery
  let offset = makeOffsetArtists(STORE.artistCurrentPageNumber)
  offset = '0' // to test 
  // const url = `https://musicbrainz.org/ws/2/artist/${artistID}?inc=release-groups&offset=${offset}&limit=${STORE.artistResultsPerPage}&fmt=json`
  // const url = `https://musicbrainz.org/ws/2/artist/?query=arid:${artistID}?inc=release-groups&offset=${offset}&limit=${STORE.artistResultsPerPage}&fmt=json`
    const url = `https://musicbrainz.org/ws/2/artist/${artistID}?inc=release-groups&limit=1&fmt=json`
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
      STORE.releaseGroupsQueryResponse = responseJson;
      console.log('STORE.releaseGroupsQueryResponse ',STORE.releaseGroupsQueryResponse);
      // ********* this goddamn response doesnt have the offset or count in it??
      // ********* will have to investigate. or maybe say fuck it and 100 will be max and no more pages
      // ********* also look at postman and links on chrome
      const nextPage = getNextPageAlbums();

      console.log('testtest')
      displayReleaseGroupsList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getReleasesFromReleaseGroupID(releaseGroupID) {
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
      console.log('should be releaseID ', STORE.releasesQueryResponse.releases[0].id)
      getTracksFromReleaseID(STORE.releasesQueryResponse.releases[0].id);
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getTracksFromReleaseID(releaseID) {

  const url = `${baseURL}release/${releaseID}?inc=recordings&fmt=json`
  console.log("query tracks url ", url);
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
      STORE.tracksQueryResponse = responseJson;
      displayTracksList();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function getYouTubeVideos(trackTitle) {
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
    .then(responseJson => displayVideoResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}



///     HANDLERS      //////////////



function handleSelectArtist() {
  $('.artists-list').on('click','.artist-name', function (event) {
    event.preventDefault();
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    // console.log('event target: clicked', $(event.target).attr('id'))
    STORE.artistID = $(event.target).attr('id');
    getReleaseGroupsFromArtistID($(event.target).attr('id'));
    console.log('selected Artist ', $(event.target).text())
    STORE.selectedArtist = $(event.target).text();
    $('.artists-list').addClass('hidden')
    $('.artists-list-nav').addClass('hidden')
  })
  // gets release groups (basically release group is an album)
}

function handleSelectReleaseGroup() {
  $('.albums-list').on('click', '.album-name',function (event) {
    event.preventDefault();
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    getReleasesFromReleaseGroupID($(event.target).attr('id'));
    $('.albums-list').addClass('hidden')
  })
}

function handleSelectTrack() {
  $('.tracks-list').on('click', '.track-name', function (event) {
    event.preventDefault();
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    // console.log(typeof $(event.target).text())
    getYouTubeVideos($(event.target).text());
    $('.tracks-list').addClass('hidden')
    console.log('handleSelectTrack() done')
  })
}

function handleSearchForm() {
  $("form").submit(event => {
    event.preventDefault();
    resetAll()
    $('.artists-list-nav').removeClass('hidden')
    const artist = $('#js-search-term').val();
    console.log(artist)
    STORE.artistQuery = encodeURIComponent(artist)
    getArtistListFromQuery();
    console.log(encodeURIComponent(artist))
  });
}



function watchForm() {
  handleSearchForm();
  handleSelectArtist();
  handleSelectReleaseGroup();
  handleSelectTrack();
}

$(watchForm);





