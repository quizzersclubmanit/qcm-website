import { createElement } from "react"

const Container = ({ element = "div", children, className = "", ...props }) => {
  const container = createElement(element, {
    children: children,
    className: className,
    ...props
  })

  return container
}

export default Container
