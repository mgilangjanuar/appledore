import { Button, ButtonProps } from '@mantine/core'
import { AnchorHTMLAttributes } from 'react'
import { Link, LinkProps, useLocation } from 'react-router-dom'

export default function HeaderButtonLink(props: ButtonProps & (
  AnchorHTMLAttributes<HTMLAnchorElement> | LinkProps
)) {
  const location = useLocation()
  return (props as LinkProps).to
  ? <Button
    {...props}
    variant="subtle"
    color={location.pathname.split('/').slice(0, 2).join('/') === (props as LinkProps).to ? 'blue' : 'gray'}
    component={Link}
    to={(props as LinkProps).to} />
  : <Button
    {...props}
    component="a"
    target="_blank"
    rel="noopener noreferrer"
    href={(props as AnchorHTMLAttributes<HTMLAnchorElement>).href} />
}