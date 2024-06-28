import { Container } from "./components"

const Map = () => {
  return (
    <Container
      style={{
        position: "relative",
        width: "100vw",
        height: "75vh",
        overflow: "hidden"
      }}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.7262770360508!2d77.4093298!3d23.216644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43accb2f81f9%3A0x603cfa000db72484!2sLRC%20MANIT!5e0!3m2!1sen!2sin!4v1719604203172!5m2!1sen!2sin"
        width="600"
        height="450"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: 0.9
        }}
      ></iframe>
    </Container>
  )
}

export default Map
