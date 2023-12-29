const express = require('express');
const axios = require('axios')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', (req,res) => {
  res.status(200).json({test: 'gucci'});
});

router.get('/trending', (req, res) => {
  getTrending()
    .then( results => {
      res.status(200).json(results);
    })
    .catch( error => {
      console.log(error.response);
      res.status(error.response.status).json({status: error.response.status, statusText: error.response.statusText});
    });
});

router.get('/search', (req, res) => {
  search(req.query.keyword)
    .then( results => {
      res.status(200).json(results);
    })
    .catch(error => {
      console.log(error.response);
      res.status(error.response.status).json({status: error.response.status, statusText: error.response.statusText});
    })
})

router.get('/collections', (req, res) => {
  collections()
    .then( results => {
      res.status(200).json(results);
    })
    .catch(error => {
      console.log(error.response);
      res.status(error.response.status).json({status: error.response.status, statusText: error.response.statusText});
    })
})


async function getTrending(){
  let results = await axios({
    method: 'get',
    // url: 'https://api.twitter.com/2/tweets/sample/stream',
    // url: 'https://api.twitter.com/1.1/trends/available.json',
    url: 'https://api.twitter.com/1.1/trends/place.json?id=23424977', // Return US trending items
    headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
  });
  console.log(results.status);
  return results.data;
}

async function search(keyword){
    let results = await axios({
      method: 'get',
      // url: 'https://api.twitter.com/2/tweets/search/recent',
      url: 'https://api.twitter.com/1.1/search/tweets.json',
      headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      },
      params: {
        q: keyword,
        result_type: "popular"
      }
    });
    return results.data;
}

async function collections(){
  let results = await axios({
    method: 'get',
    url: 'https://api.twitter.com/1.1/collections/entries.json',
    headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
  });
  return results.data;
}


module.exports = router;
