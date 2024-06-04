import { Container, SectionHead, EventCard } from "../components/components"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"

const Events = () => {
  const eventDetails = [
    {
      title: "Something-1",
      desc: "Random stuff, kuch toh likhna hi tha",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi cumque molestiae? Voluptatem ipsam at, cum beatae nam magni, voluptas saepe reiciendis, veniam deleniti alias quia nihil. Maxime, ratione sint.",
      image: "https://picsum.photos/270/300",
      insta: "https://www.instagram.com"
    },
    {
      title: "Something-2",
      desc: "Random stuff, kuch toh likhna hi tha",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi cumque molestiae? Voluptatem ipsam at, cum beatae nam magni, voluptas saepe reiciendis, veniam deleniti alias quia nihil. Maxime, ratione sint.",
      image: "https://picsum.photos/270/300",
      insta: "https://www.instagram.com"
    },
    {
      title: "Something-3",
      desc: "Random stuff, kuch toh likhna hi tha",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi cumque molestiae? Voluptatem ipsam at, cum beatae nam magni, voluptas saepe reiciendis, veniam deleniti alias quia nihil. Maxime, ratione sint.",
      image: "https://picsum.photos/270/300",
      insta: "https://www.instagram.com"
    },
    {
      title: "Something-4",
      desc: "Random stuff, kuch toh likhna hi tha",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi cumque molestiae? Voluptatem ipsam at, cum beatae nam magni, voluptas saepe reiciendis, veniam deleniti alias quia nihil. Maxime, ratione sint.",
      image: "https://picsum.photos/270/300",
      insta: "https://www.instagram.com"
    },
    {
      title: "Something-5",
      desc: "Random stuff, kuch toh likhna hi tha",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi cumque molestiae? Voluptatem ipsam at, cum beatae nam magni, voluptas saepe reiciendis, veniam deleniti alias quia nihil. Maxime, ratione sint.",
      image: "https://picsum.photos/270/300",
      insta: "https://www.instagram.com"
    },
    {
      title: "Something-6",
      desc: "Random stuff, kuch toh likhna hi tha",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro sequi cumque molestiae? Voluptatem ipsam at, cum beatae nam magni, voluptas saepe reiciendis, veniam deleniti alias quia nihil. Maxime, ratione sint.",
      image: "https://picsum.photos/270/300",
      insta: "https://www.instagram.com"
    }
  ]
  
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  return (
    <div id="events">
      <Container className="min-h-[75vh] sm:min-h-screen flex flex-col gap-8 londrina-solid-regular sm:justify-start justify-center items-center sm:items-start">
        <SectionHead label="Events" className="text-white" />
        <div className="w-full">
          <Slider {...settings}>
            {eventDetails.map((dets, index) => (
              <EventCard dets={dets} key={index} />
            ))}
          </Slider>
        </div>
      </Container>
    </div>
  )
}

export default Events
