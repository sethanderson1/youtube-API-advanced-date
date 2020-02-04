"use strict";

const STORE = {
  artistQueryResponse: "",
  releaseGroupsQueryResponse: "",
  releasesQueryResponse: ``,
  tracksQueryResponse: "",
};
// put your own value below!
// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey= "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";
const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  console.log("queryItems ", queryItems);
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++) {

    $("#results-list").append(
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

function getYouTubeVideos(
  query,
  maxResults,
  order,
) {
}

// function watchForm() {
//   $("form").submit(event => {
//     event.preventDefault();
//     const searchTerm = $("#js-search-term").val();
//     const maxResults = $("#js-max-results").val();
//     const fromYear = $("#js-from-year").val();
//     const fromMonth = $("#js-from-month").val();
//     const fromDay = $("#js-from-day").val();
//     const fromHour = $("#js-from-hour").val();

//     const toYear = $("#js-to-year").val();
//     const toMonth = $("#js-to-month").val();
//     const toDay = $("#js-to-day").val();
//     const toHour = $("#js-to-hour").val();

//     const order = $("input:checked").val();
//     console.log($("input:checked").val());
//     getYouTubeVideos(
//       searchTerm,
//       maxResults,
//       order,
//       fromYear,
//       fromMonth,
//       fromDay,
//       fromHour,
//       toYear,
//       toMonth,
//       toDay,
//       toHour
//     );
//   });
// }

// $(watchForm);















































getArtistListFromQuery();

function getArtistListFromQuery(artist = "the%20beatles") {

  const url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`;
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
      displayArtistList();
      // ** move handlers to watchform() thing
      handleSelectArtist();
    })
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayArtistList() {
  console.log(STORE.artistQueryResponse.artists.length);
  const artists = STORE.artistQueryResponse.artists;
  // populate list of artists to choose from 
  for (let i = 0; i < artists.length; i++) {
    console.log(artists[i].name);
  }
}

function handleSelectArtist() {
  // gets release groups (basically release group is an album)
  getReleaseGroupsFromArtistID("b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d");
}

function getReleaseGroupsFromArtistID(artistID) {

  const releaseID = ``
  const recordingID = ``
  const type = ``

  const baseURL = `https://musicbrainz.org/ws/2/`
  const url = `http://musicbrainz.org/ws/2/artist/${artistID}?inc=release-groups&fmt=json`



  console.log("query release groups url ", url);

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
      STORE.releaseGroupsQueryResponse = responseJson;
      displayReleaseGroupsList();
      // ** handlers to go in watchFrom()
      handleSelectReleaseGroup()
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
  }
}


function handleSelectReleaseGroup() {
  getReleasesFromReleaseGroupID("72d15666-99a7-321e-b1f3-a3f8c09dff9f");
}



function getReleasesFromReleaseGroupID(releaseGroupID) {

  const releaseID = ``
  const recordingID = ``
  const type = ``

  const baseURL = `https://musicbrainz.org/ws/2/`

  const url = `http://musicbrainz.org/ws/2/release-group/${releaseGroupID}?inc=releases&fmt=json`

  console.log("query releases url ", url);

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

  const baseURL = `https://musicbrainz.org/ws/2/`


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
      handleSelectTrack();
    })

    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}





function displayTracksList() {
  const tracks = STORE.tracksQueryResponse["media"];
  console.log(tracks)
  // populate list of albums to choose from 
  for (let i = 0; i < tracks[0].tracks.length; i++) {
    console.log(i + ' ' + tracks[0].tracks[i].title);
  }
}

function handleSelectTrack() {
  getYouTubeVideos("I'm Only Sleeping");
}

function getYouTubeVideos(trackTitle,maxResults,order) {
  console.log("order ", order);
  const params = {
    key: apiKey,
    q: `${trackTitle} guitar lesson`,
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



// getYouTubeVideos(
//   `I'm only sleeping guitar lesson`,
//   `1`,
//   order,
//   fromYear,
//   fromMonth,
//   fromDay,
//   fromHour,
//   toYear,
//   toMonth,
//   toDay,
//   toHour
// );

// console.log(
//   getYouTubeVideos(
//     `I'm only sleeping guitar lesson`,
//     `1`,
//     order,
//     fromYear,
//     fromMonth,
//     fromDay,
//     fromHour,
//     toYear,
//     toMonth,
//     toDay,
//     toHour
//   ))
  

