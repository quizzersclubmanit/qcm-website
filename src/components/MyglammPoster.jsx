import React from 'react';
import { myglamm } from '../assets/assets';
const MyglammPoster = () => {
  return (
    <div className=" w-screen flex items-center justify-center bg-gray-800">
      
        <img
          src={myglamm}
          alt="Sponsor"
          className="w-full h-full object-cover"
        />
       
      
    </div>
  );
};

export default MyglammPoster;
