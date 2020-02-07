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
// ** 
// need to catch 503 errors. maybe response to 
// 503 error should be trying again after 1 second?




// base url
const baseURL = `https://musicbrainz.org/ws/2/`
const limit = 100

// const artistMBID = `b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d`

const STORE = {
  artistQuery: ``,
  artistQueryResponse: "",
  releaseGroupsQueryResponse: "",
  releasesQueryResponse: ``,
  tracksQueryResponse: "",

  artistMBID: '',

  releaseGroupResponse: [],
  releaseGroupResponseReleaseGroup: [],
  releaseDate: [],
  sortedReleaseGroupDates: null,
  releaseGroupResponseReleaseGroupFiltered: null,


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




function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  console.log("queryItems ", queryItems);
  return queryItems.join("&");
}

function displayReleaseGroupsList() {
  $('.albums-list').removeClass('hidden')
  const artistMBID = STORE.artistMBID
  // const albums = STORE.releaseGroupsQueryResponse["release-groups"];
  const albums = STORE.releaseGroupResponseReleaseGroupFiltered;
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
      getReleaseGroupsFromartistMBID(artistMBID);
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
      getReleaseGroupsFromartistMBID(artistMBID)
      //refetch
    })
    $(".albums-list-nav").append($next)
  }
  $("#results").removeClass("hidden");


}


getAllReleaseGroups(artistMBID = `b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d`)

function getAllReleaseGroups() {
  const releaseGroupCount = 715;
  const pagesCount = Math.ceil(releaseGroupCount / limit)
  const fetches = []
  for (let i = 0; i < pagesCount; i++) {
    const offset = limit * i;
    const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistMBID}&offset=${offset}&limit=${limit}&fmt=json`
    fetches.push(
      fetch(url)
        .then(response => {
          if (response.ok) {
            console.log('response.json() ', response);
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(responseJson => {
          console.log('responseJson', responseJson);
          STORE.releaseGroupResponse.push(responseJson)
          STORE.releaseGroupResponseReleaseGroup.push(responseJson[`release-groups`])
        })
        .catch(err => {
          $("#js-error-message").text(`Something went wrong: ${err.message}`);
        })
    )
  }
  Promise.all(fetches).then(() => {
    STORE.releaseGroupResponseReleaseGroup = STORE.releaseGroupResponseReleaseGroup.flat()
    // console.log(STORE.releaseGroupResponseReleaseGroup)
    filteredResponse(STORE.releaseGroupResponseReleaseGroup)
    sortReleaseGroupsByDate(STORE.releaseGroupResponseReleaseGroupFiltered)
    displayReleaseGroupsList()
  })
}

function displayFilteredResponse() {

}

function filteredResponse(array) {
  const filteredArr = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i][`first-release-date`].length > 0
      && array[i][`secondary-types`].length == 0
      && array[i][`primary-type`] != `Single`
      && array[i][`primary-type`] != `EP`
      && array[i][`primary-type`] != `Compilation`
      && array[i][`primary-type`] != `Remix`
      && array[i][`primary-type`] != `Interview`
      && array[i][`primary-type`] != `Audiobook`
      && array[i][`primary-type`] != `Other`
      // || array[i][`primary-type`] == `Soundtrack`
      ) {
      filteredArr.push(array[i])
    }
  }
  // console.log(filteredArr)
  STORE.releaseGroupResponseReleaseGroupFiltered = filteredArr
}

function sortReleaseGroupsByDate(toBeSorted) {
  toBeSorted.sort(function (a, b) {
    a = new Date(a[`first-release-date`])
    b = new Date(b[`first-release-date`])
    return a - b
  })
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

function handleSelectReleaseGroup() {
  $('.albums-list').on('click', '.album-name',function (event) {
    event.preventDefault();
    // grab the element that was clicked
    console.log('event target: clicked', $(event.target).text())
    getReleasesFromReleaseGroupID($(event.target).attr('id'));
    $('.albums-list').addClass('hidden')
  })
}


function watchForm() {
  // handleSearchForm();
  // handleSelectArtist();
  handleSelectReleaseGroup();
  // handleSelectTrack();
}

$(watchForm);


// const delay = function (millis) {
//   return new Promise((resolve, reject) => {
//     window.setTimeout(() => {
//       resolve(true);
//     }, millis);
//   });
// };










