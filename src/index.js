import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import CurrencyConverter from './CurrencyConverter';

// import StarRating from './StarRating';
// import TextExpanderChallenge from './TextExpanderChallenge';

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating size={98} textColor='black' starColor='black' onSetRating={setMovieRating} />
//       <p>This movie was rated {movieRating} stars.</p>
//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10} />
    <StarRating size={98} textColor='red' starColor='red' className='test' />
    <StarRating maxRating={5} size={48} textColor='greenyellow' starColor='greenyellow' className='test' messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']} defaultRating={3} /> */}

    {/* <TextExpanderChallenge /> */}
    {/* <CurrencyConverter /> */}
  </React.StrictMode>
);


