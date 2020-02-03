"use strict";

const STORE = {
  artistQueryResponse: "",
  albumsQueryResponse: "",

};
// put your own value below!
// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; //mine
// const apiKey= "AIzaSyB3hw6YJqtiQRs1X5pNsmqWisgoifViVKE";

const apiKey = "AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

// publishedAfter=2020-01-24T05:55:00Z

const audioDbURL = `https://theaudiodb.com/api/v1/json/1/searchalbum.php?s=the_black_keys`;
console.log(audioDbURL);

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
    // for each video object in the items
    //array, add a list item to the results
    //list with the video title, description,
    //and thumbnail
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
  fromYear,
  fromMonth,
  fromDay,
  fromHour,
  toYear,
  toMonth,
  toDay,
  toHour
) {
  // const fromYear = '2006';
  // const fromMonth = '04';
  // const fromDay = '24';
  //  fromYear = '2006';
  //  fromMonth = '04';
  //  fromDay = '23';
  // const nextDay = (+fromDay+0)+'';
  // const nextMonth = (+fromMonth+1)+'';
  // const toYear = '2005';
  // const toMonth = '12';
  // const toDay = '31';
  // order =
  console.log("order ", order);
  const params = {
    key: apiKey,
    q: query,
    part: "snippet",
    maxResults,
    type: "video",
    // order: 'date',
    order,
    publishedAfter: `${fromYear}-${fromMonth}-${fromDay}T${fromHour}:00:00Z`,
    publishedBefore: `${toYear}-${toMonth}-${toDay}T${toHour}:00:00Z`

    // publishedAfter:`${fromYear}-${fromMonth}-${fromDay}T05:55:00Z`,
    // publishedBefore:`${toYear}-${toMonth}-${toDay}T05:55:00Z`

    // publishedAfter:`2005-04-23T05:55:00Z`,
    // publishedBefore:'2005-06-25T05:55:00Z'
    // publishedBefore or after ? is this possible lets find out
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

// function getYouTubeVideos(query, maxResults=10) {
//   const fromYear = '2005';
//   const fromMonth = '04';
//   const fromDay = '23';
//   const toYear = '2005';
//   const toMonth = '12';
//   const toDay = '31';
//   const params = {
//     key: apiKey,
//     q: query,
//     part: 'snippet',
//     maxResults,
//     type: 'video',
//     order: 'date',
//     publishedAfter:`${fromYear}-${fromMonth}-${fromDay}T05:55:00Z`,
//     publishedBefore:`${toYear}-${toMonth}-${toDay}T05:55:00Z`

//     // publishedAfter:`2005-04-23T05:55:00Z`,
//     // publishedBefore:'2005-06-25T05:55:00Z'
//     // publishedBefore or after ? is this possible lets find out
//   };
//   const queryString = formatQueryParams(params)
//   const url = searchURL + '?' + queryString;

//   console.log(url);

//   fetch(url)
//     .then(response => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then(responseJson => displayResults(responseJson))
//     .catch(err => {
//       $('#js-error-message').text(`Something went wrong: ${err.message}`);
//     });
// }

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    const fromYear = $("#js-from-year").val();
    const fromMonth = $("#js-from-month").val();
    const fromDay = $("#js-from-day").val();
    const fromHour = $("#js-from-hour").val();

    const toYear = $("#js-to-year").val();
    const toMonth = $("#js-to-month").val();
    const toDay = $("#js-to-day").val();
    const toHour = $("#js-to-hour").val();

    // const fromDay = $('#js-from-day').val();
    // const fromDay = $('#js-from-day').val();

    // const fromDay = $('#js-from-day').val();
    // const fromDay = $('#js-from-day').val();

    const order = $("input:checked").val();
    console.log($("input:checked").val());
    getYouTubeVideos(
      searchTerm,
      maxResults,
      order,
      fromYear,
      fromMonth,
      fromDay,
      fromHour,
      toYear,
      toMonth,
      toDay,
      toHour
    );
  });
}

$(watchForm);

getArtistListFromQuery();

function getArtistListFromQuery(artist = "the_beatles") {
  const url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artist}&fmt=json`;
  console.log("query artist url ", url);

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

      STORE.artistQueryResponse = responseJson;
      displayArtistList();

      // ** have to move this into handleChooseArtist function later
      getAlbumsFromArtistID("b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d");
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




// then, upon clicking the desired artist, another 
// fetch request back to the server using that artist's
// id to get back the album data for that artist
// ** improvements: make sure to get all albums
// and maybe sort by date... and get album art
// 

function getAlbumsFromArtistID(artistID = "b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d") {
  // const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistID}&type=album&fmt=json`;
  // const url = `https://musicbrainz.org/ws/2/release-group?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&type=album|ep&limit=100&fmt=json`
  // const url = `http://musicbrainz.org/ws/2/artist/a74b1b7f-71a5-4011-9441-d0b5e4122711?inc=release-groups&fmt=json`


  // const url = `https://musicbrainz.org/ws/2/release-group?query=arid:494e8d09-f85b-4543-892f-a5096aed1cd4&fmt=json`
  // const url =`https://musicbrainz.org/ws/2/release?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json&inc=release-groups&limit=100`
  // const url =`https://musicbrainz.org/ws/2/release?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json&inc=release-groups&limit=100`
  // const url =`https://musicbrainz.org/ws/2/release?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json&inc=release-groups&limit=100`
  // const url =`https://musicbrainz.org/ws/2/release?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json&inc=release-groups&limit=100`
  // const url =`http://musicbrainz.org/ws/2/release-group?query=arid:b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json`
  // const url =`http://musicbrainz.org/ws/2/release-group?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json`

  // this is the best version for finding most albums in correct order but excludes soundtracks
  const url = `http://musicbrainz.org/ws/2/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d?inc=release-groups&fmt=json`

  

  // const url = `http://musicbrainz.org/ws/2/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d?inc=release-groups&primarytype:soundtrack&fmt=json`

  // this only returns soundtracks... it should return both soundtracks and albums
  // const url = `http://musicbrainz.org/ws/2/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d?inc=release-groups&type=soundtrack|album&fmt=json`

  // const url = `http://musicbrainz.org/ws/2/artist/b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d?inc=release-groups&fmt=json`
  // const url = `https://musicbrainz.org/ws/2/release?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json&inc=release-groups`
  // const url = `https://musicbrainz.org/ws/2/release-group?artist=b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d&fmt=json`



  // lets find how to get tracks from album


  // lets find how to query certain album 


  console.log("query albums url ", url);

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

      STORE.albumsQueryResponse = responseJson;
      displayAlbumsList();

      getTracksFromAlbumID();
    })

    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}


function displayAlbumsList() {
  // console.log(STORE.artistQueryResponse.artists.length);
  const albums = STORE.albumsQueryResponse["release-groups"];
  // const albums = STORE.albumsQueryResponse["releases"];
  console.log(albums)
  // populate list of albums to choose from 
  for (let i = 0; i < albums.length; i++) {
    console.log(i + ' ' + albums[i].title);
  }
}




// then get tracks from album ID


function getTracksFromAlbumID(albumID = "72d15666-99a7-321e-b1f3-a3f8c09dff9f") {
  // const url = `https://musicbrainz.org/ws/2/release-group?artist=${albumID}&type=album&fmt=json`;
  // const url = `https://musicbrainz.org/ws/2/release-group/9f7a4c28-8fa2-3113-929c-c47a9f7982c3?inc=release&fmt=json`
  // const url = `https://musicbrainz.org/ws/2/release-group/9f7a4c28-8fa2-3113-929c-c47a9f7982c3`

  // const url = `https://musicbrainz.org/ws/2/release-group/9f7a4c28-8fa2-3113-929c-c47a9f7982c3`
  // const url = `https://musicbrainz.org/ws/2/release-group/9f7a4c28-8fa2-3113-929c-c47a9f7982c3`
  // const url = `https://musicbrainz.org/ws/2/release/26d5e76b-1640-3883-887b-507e3a287116`


  // const url = `http://musicbrainz.org/ws/2/release-group/9f7a4c28-8fa2-3113-929c-c47a9f7982c3&inc=tracks`
  
  // const url = `https://musicbrainz.org/ws/1/release/9f7a4c28-8fa2-3113-929c-c47a9f7982c3?type=xml&inc=tracks`

  // const url = `https://musicbrainz.org/ws/2/recording/ba0aff15-7701-4c77-a6cd-6e0b151801c6?inc=releases+release-groups&fmt=json`
  const url = `https://musicbrainz.org/ws/2/recording/?query=isrc:GBAHT1600302`






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
      getTracksFromAlbumID("b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d");
    })

    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}





// function displayTracksList() {
//   const tracks = STORE.tracksQueryResponse["release-groups"];
//   console.log(tracks)
//   // populate list of albums to choose from 
//   for (let i = 0; i < tracks.length; i++) {
//     console.log(i + ' ' + tracks[i].title);
//   }
// }





