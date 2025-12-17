import { createElement, forwardRef } from "react"

const Container = forwardRef(
  ({ element = "div", children, className = "", ...props }, ref) => {
    const container = createElement(element, {
      children: children,
      className: className,
      ref: ref,
      ...props
    })

    return container
  }
)

export default Container
