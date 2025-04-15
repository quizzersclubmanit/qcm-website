import React from 'react';
const MessageCard = ({dets={}}) => {
  return (
    <div className='mt-20 mb-5 w-[350px] h-[480px] md:w-[400px] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(22,22,22,0.73)] text-white font-nunito p-[1em] flex justify-center items-center flex-col backdrop-blur-[12px]'>

      <img src={dets.image} alt='Profile' className='w-[6.5em] h-[6.5em] rounded-full object-cover border-2 border-white' />
      <p className='text-l font-bold text-white/90 '>{dets.name}</p>

      <p className='text-sm text-white/90'>{dets.designation}
      </p>

      <p className='text-sm text-[rgb(210,186,255)] leading-relaxed pt-5'>{dets.message}
      </p>
      </div>
  );
}

export default MessageCard;
