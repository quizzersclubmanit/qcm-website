import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ dets = {} }) => {
  const navigate = useNavigate();
  return (
    <StyledWrapper>
      <div className="card m-5 md:m-10  h-[440px] w-[300px] md:w-[400px] rounded-lg flex items-start justify-center bg-[rgb(255,255,255)]">
        <div className='img w-[300px] md:w-[400px] mt-0 rounded-lg '>
          <img className='cover object-cover h-[400px] w-[300px] md:w-[400px]' src={dets.cover} />
          <h4 className="title h-[40px] text-lg md:text-2xl text-center font-bold">{dets.title}</h4>
        </div>
        <div className="textBox h-[440px] w-[300px] md:w-[400px] bg-[rgba(0,0,0,0.38)] flex flex-col items-center justify-center text-cyan-50 gap-3 p-4">
          <h3 className='font-bold text-3xl overflow-hidden text-center'>{dets.title}</h3>
          <span className='text-[#fee102] text-center'>{dets.desc}</span>
          <Button
            label="Read More"
            className="text-[#fed002] hover:text-[#e1fe02] p-2 rounded bg-[#14213D] sm:text-lg text-sm"
            onClick={() => {
              navigate(`events/${dets.id}`)
            }}
          />

        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    transition: 0.2s ease-in-out;
  }

  .img {
    position: absolute;
    transition: 0.2s ease-in-out;
    z-index: 1;
  }

  .textBox {
    opacity: 0;
    transition: 0.2s ease-in-out;
    z-index: 2;
  }

  
  .card:hover > .textBox {
    opacity: 1;
  }

  .card:hover > .img {
    filter: blur(7px);
    animation: anim 3s infinite;
  }
  
  @keyframes anim {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0);
    }
  }

  .card:hover {
    transform: scale(1.04) rotate(-1deg);
  }`;

export default EventCard;
