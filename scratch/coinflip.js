'use strict';

function coinflip(delay) {
  return new Promise((resolve, reject) => {
    const rand = Boolean(Math.round(Math.random()));
    setTimeout(function () {
      rand ? resolve('Heads!') : reject('Tails!');
    }, delay);
  });
}

const coin1 = coinflip(100); //.catch(err => err)  |  to show tails
const coin2 = coinflip(200);
const coin3 = coinflip(300);
const coin4 = coinflip(400);
const coin5 = coinflip(500);

Promise.all( [coin1, coin2, coin3, coin4, coin5 ] )
  .then(results => {
    console.log(results);
  })
  .catch(err => {
    console.log(err);
  });





// coinflip(200)
//   .then(res => {
//     console.log(1, res);
//     return coinflip();
//   }).then(res => {
//     console.log(2, res);
//     return coinflip();
//   }).then(res => {
//     console.log(3, res);
//     return coinflip();
//   }).then(res => {
//     console.log(4, res);
//     console.log('WINNER');
//   }).catch(err => {
//     console.log(err);
//     console.log('Loser');
//   });