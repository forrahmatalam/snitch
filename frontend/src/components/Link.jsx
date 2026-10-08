export const Link = ({ to, children, ...props }) => {
  const handleClick = (event) => {
    props.onClick?.(event)
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  return <a href={to} {...props} onClick={handleClick}>{children}</a>
}
