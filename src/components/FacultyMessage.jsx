import React from 'react'
import MessageCard from './MessageCard'
import { Container } from 'postcss';
import SectionHead from './SectionHead';
import Slider from 'react-slick';
import { facultyMessage } from "../assets/qcmData.json"

const settings = {
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    className: "w-full",
    autoplay: true,
    responsive: [
        {
            breakpoint: 1300,
            settings: { slidesToShow: 2 }
        },
        {
            breakpoint: 815,
            settings: { arrows: false, slidesToShow: 1 }
        }
    ]
}
function FacultyMessage() {
    return (
        <div className='flex flex-col items-center
        bg-gradient-to-br from-[#22718c] to-[rgba(29,164,195,0.47)]'>

            <SectionHead label="Faculty Feedback" className="text-white bg-red" />
            <Slider {...settings}>
                {facultyMessage.map((dets, index) => (
                    <MessageCard dets={dets} key={index} />
                ))}
            </Slider>
            
        </div>
    )
}

export default FacultyMessage