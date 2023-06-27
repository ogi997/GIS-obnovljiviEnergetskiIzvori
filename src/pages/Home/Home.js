
import './Home.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { Link } from 'react-router-dom';
//Logos & component
import Logo from '../../assets/logo.jpg'; 
import backgroundPic from '../../assets/homebackground.jpeg';
// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

import {useSelector} from "react-redux";
function Home() {
  const {authenticated, user} = useSelector((state) => state.users);

  return (
    <div className='whole-page'>

    <img className='img' src={backgroundPic} alt="Home page" />
      { !authenticated ?
    <Swiper 
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
         <SwiperSlide>Welcome
            <p className='margBottom'>Have an account?
            <Link to="/login" style={{textDecoration:"none"}}> Login</Link>
            </p>
           <img style={{height:"80px", width:"142px"}} src={Logo} alt="Logo" />
          </SwiperSlide>
          <SwiperSlide>
          <p>No account?</p>
          <p><Link to="/register" style={{textDecoration:"none"}}>Create an account</Link></p>
          </SwiperSlide>
          <SwiperSlide>
          <p>Only interested in the map?</p>
            <p className='margBottom'>You can still access the map</p>
            <p><Link to="/map" style={{textDecoration:"none"}}>Map</Link></p>

          </SwiperSlide>

        </Swiper>
          :
          <Swiper
              pagination={{
                type: "fraction",
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
          >

            <SwiperSlide>
              <h4 style={{marginBottom:"30px"}}>Hey, nice to see you again!</h4>
              {
                <div>
                  <p className='animate__animated animate__slideInDown animate__delay-1s'>First name: {user?.first_name}</p>
                  <p className='animate__animated animate__slideInDown animate__delay-1s'>Last name: {user?.last_name}</p>
                  <p className='animate__animated animate__slideInDown animate__delay-1s'>Email: {user?.email}</p>
                </div>
              }
              <img src={Logo} alt="Logo" />
            </SwiperSlide>
          </Swiper>
       }
    </div>
  )
}
export default Home
