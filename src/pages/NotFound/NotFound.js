import './NotFound.css';
import { Link } from 'react-router-dom';

import SnowError from '../../assets/snoweror.jpg'; 
import Page from '../../assets/page.jpg'; 

export default function NotFound() {
  return (
    <div className='errorPage'>

      <div>
    <img className='snow' src={SnowError} alt="Error page" />

    <div className='errorMsg'>
      <img className='err404' src={Page} alt="404 error" />
      <h2>You've landed in the middle of nowhere.</h2>
      <p className='second-msg'>It's a great place to be, except in this case...</p>
      <button><Link className='btnError' to="/">Return To Home</Link></button>
    </div>
      </div>

    </div>
    

    
  )
}
