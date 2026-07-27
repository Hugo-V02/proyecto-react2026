#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const SRC_DIR = path.join(process.cwd(), 'src')
const warnings = []
const errors = []

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(jsx?|js)$/.test(e.name)) check(p)
  }
}

function check(file) {
  const src = fs.readFileSync(file, 'utf8')
  const lines = src.split(/\r?\n/)

  lines.forEach((line, idx) => {
    const lineNo = idx + 1
    if (/console\.log\(/.test(line)) {
      warnings.push(`${file}:${lineNo}  console.log detectado`)
    }
  })
}

walk(SRC_DIR)

if (warnings.length === 0 && errors.length === 0) {
  console.log('✓ Sin advertencias ni errores.')
  process.exit(0)
}

if (errors.length) {
  console.error('Errores:')
  errors.forEach(e => console.error('  ' + e))
}
if (warnings.length) {
  console.warn('Advertencias:')
  warnings.forEach(w => console.warn('  ' + w))
}

process.exit(errors.length ? 1 : 0)