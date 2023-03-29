import { ActionIcon, ActionIconProps } from '@mantine/core'
import { AnchorHTMLAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export default function HeaderIconLink(props: ActionIconProps & (
  AnchorHTMLAttributes<HTMLAnchorElement> | LinkProps
)) {
  return (props as LinkProps).to
  ? <ActionIcon
    {...props}
    component={Link}
    to={(props as LinkProps).to} />
  : <ActionIcon
    {...props}
    component="a"
    target="_blank"
    rel="noopener noreferrer"
    href={(props as AnchorHTMLAttributes<HTMLAnchorElement>).href} />
}