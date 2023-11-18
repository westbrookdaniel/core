/**
 * This code is from Hono
 *
 * https://github.com/honojs/hono
 * MIT License
 * Copyright (c) 2021 - present, Yusuke Wada and Hono contributors
 */
export { jsxDEV as jsx, Fragment } from './jsx-dev-runtime'
export { jsxDEV as jsxs } from './jsx-dev-runtime'

import { raw, html } from './helper'
export { html as jsxTemplate }
export const jsxAttr = (name: string, value: string) => raw(name + '="' + html`${value}` + '"')
export const jsxEscape = (value: string) => value
