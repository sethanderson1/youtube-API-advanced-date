'use strict';

// put your own value below!
// const apiKey = 'AIzaSyCsxk-3l3HMjN4zZFQoOHpMj65lyEA8NW0'; 
const apiKey = 'AIzaSyDXpwzqSs41Kp9IZj49efV3CSrVxUDAwS0';
const searchURL = 'https://www.googleapis.com/youtube/v3/search';


// publishedAfter=2020-01-24T05:55:00Z

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    console.log('queryItems ', queryItems);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}"  target="_blank">
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      </a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getYouTubeVideos(query, maxResults,fromYear,fromMonth,fromDay){
  // const fromYear = '2006';
  // const fromMonth = '04';
  // const fromDay = '24';
  //  fromYear = '2006';
  //  fromMonth = '04';
  //  fromDay = '23';
  const nextDay = (+fromDay+0)+'';
  const nextMonth = (+fromMonth+1)+'';
  const toYear = '2005';
  const toMonth = '12';
  const toDay = '31';
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video',
    order: 'date',
    publishedAfter:`${fromYear}-${fromMonth}-${fromDay}T05:55:00Z`,
    publishedBefore:`${fromYear}-${nextMonth}-${nextDay}T05:55:00Z`

    // publishedAfter:`${fromYear}-${fromMonth}-${fromDay}T05:55:00Z`,
    // publishedBefore:`${toYear}-${toMonth}-${toDay}T05:55:00Z`

    // publishedAfter:`2005-04-23T05:55:00Z`,
    // publishedBefore:'2005-06-25T05:55:00Z'
    // publishedBefore or after ? is this possible lets find out
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

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
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
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
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const fromYear = $('#js-from-year').val();
    const fromMonth = $('#js-from-month').val();
    const fromDay = $('#js-from-day').val();
    getYouTubeVideos(searchTerm, maxResults,fromYear,fromMonth,fromDay);
  });
}

$(watchForm);