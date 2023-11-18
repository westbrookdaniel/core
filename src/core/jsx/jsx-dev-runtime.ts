/**
 * This code is from Hono
 *
 * https://github.com/honojs/hono
 * MIT License
 * Copyright (c) 2021 - present, Yusuke Wada and Hono contributors
 */
import type { HtmlEscapedString } from './utils'
import { jsx } from '.'
import type { JSXNode } from '.'
export { Fragment } from '.'

export function jsxDEV(tag: string | Function, props: Record<string, unknown>): JSXNode {
  if (!props?.children) {
    return jsx(tag, props)
  }
  const children = props.children as string | HtmlEscapedString
  delete props['children']
  return Array.isArray(children) ? jsx(tag, props, ...children) : jsx(tag, props, children)
}
