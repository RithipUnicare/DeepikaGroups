import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import reducer from './reducer'; // notice: it's a single function

const store = createStore(reducer, applyMiddleware(thunk))
export default store

// store.js
// store.js
// import { configureStore } from '@reduxjs/toolkit';
// import reducer from './reducer'; // notice: it's a single function

// const store = configureStore({
//   reducer, // this works with a plain reducer function
// });
// console.log(reducer);

// export default store;


