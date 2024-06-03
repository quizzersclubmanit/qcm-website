import {Container, SectionHead} from "./components"

const About = () => {
  return (
    <div id="about">
      <Container className="sm:min-h-[70vh] min-h-1/2 flex flex-col gap-5 londrina-solid-regular justify-center sm:justify-start items-center sm:items-start">
        <SectionHead label="About" />
        <p className="w-2/3 text-lg">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores corporis nobis perspiciatis, delectus vel nulla. Maiores, recusandae corporis. Consequuntur, blanditiis ipsam eligendi autem laudantium hic totam, maxime suscipit nihil repellendus soluta numquam explicabo quod libero quidem iusto odit nesciunt fugiat quis esse ad ipsum, perspiciatis neque! Obcaecati sapiente fugiat asperiores.</p>
      </Container>
    </div>
  )
}

export default About