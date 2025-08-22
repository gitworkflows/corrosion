import React from 'react';
// @ts-ignore
import { describe, it, expect } from 'vitest';
import { parseAnsi } from './ansi';

describe('ANSI Parser Utility', () => {

  it('should return plain text as a single span with no classes', () => {
    const text = 'Hello, world!';
    const result = parseAnsi(text);
    
    expect(result).toHaveLength(1);
    const element = result[0];

    if (!React.isValidElement(element)) {
      throw new Error('Expected a valid React element');
    }
    
    expect((element.props as any).className).toBe('');
    expect((element.props as any).children).toBe('Hello, world!');
  });

  it('should parse a simple color code', () => {
    const text = '\x1b[31mRed Text\x1b[0m';
    const result = parseAnsi(text);

    expect(result).toHaveLength(1);
    const element = result[0];

    if (!React.isValidElement(element)) {
      throw new Error('Expected a valid React element');
    }

    expect((element.props as any).className).toBe('text-red-500');
    expect((element.props as any).children).toBe('Red Text');
  });

  it('should parse a bold style code', () => {
    const text = '\x1b[1mBold Text\x1b[0m';
    const result = parseAnsi(text);

    expect(result).toHaveLength(1);
    const element = result[0];
    
    if (!React.isValidElement(element)) {
      throw new Error('Expected a valid React element');
    }

    expect((element.props as any).className).toBe('font-bold');
    expect((element.props as any).children).toBe('Bold Text');
  });

  it('should combine color and style codes', () => {
    const text = '\x1b[1;34mBold Blue Text\x1b[0m';
    const result = parseAnsi(text);

    expect(result).toHaveLength(1);
    const element = result[0];

    if (!React.isValidElement(element)) {
      throw new Error('Expected a valid React element');
    }

    expect((element.props as any).className).toContain('font-bold');
    expect((element.props as any).className).toContain('text-accent-blue');
    expect((element.props as any).children).toBe('Bold Blue Text');
  });

  it('should handle sequential styles', () => {
    const text = '\x1b[32mGreen text\x1b[0m, then \x1b[34mBlue text\x1b[0m.';
    const result = parseAnsi(text);
    
    expect(result).toHaveLength(4);

    const green = result[0];
    if (React.isValidElement(green)) {
      expect((green.props as any).children).toBe('Green text');
      expect((green.props as any).className).toBe('text-accent-green');
    } else {
      throw new Error('Expected a valid React element for "green"');
    }

    const normal = result[1];
    if (React.isValidElement(normal)) {
      expect((normal.props as any).children).toBe(', then ');
      expect((normal.props as any).className).toBe('');
    } else {
      throw new Error('Expected a valid React element for "normal"');
    }
    
    const blue = result[2];
    if (React.isValidElement(blue)) {
      expect((blue.props as any).children).toBe('Blue text');
      expect((blue.props as any).className).toBe('text-accent-blue');
    } else {
      throw new Error('Expected a valid React element for "blue"');
    }

    const end = result[3];
    if (React.isValidElement(end)) {
      expect((end.props as any).children).toBe('.');
      expect((end.props as any).className).toBe('');
    } else {
      throw new Error('Expected a valid React element for "end"');
    }
  });

  it('should handle multiple codes in one escape sequence correctly', () => {
    const text = '\x1b[1;4;31mImportant Message\x1b[0m';
    const result = parseAnsi(text);
    
    expect(result).toHaveLength(1);
    const element = result[0];

    if (!React.isValidElement(element)) {
      throw new Error('Expected a valid React element');
    }

    expect((element.props as any).children).toBe('Important Message');
    expect((element.props as any).className).toContain('font-bold');
    expect((element.props as any).className).toContain('underline');
    expect((element.props as any).className).toContain('text-red-500');
  });

  it('should reset styles correctly with [0m', () => {
    const text = '\x1b[31mRed\x1b[0m then normal.';
    const result = parseAnsi(text);

    expect(result).toHaveLength(2);
    
    const part1 = result[0];
    if (React.isValidElement(part1)) {
      expect((part1.props as any).className).toBe('text-red-500');
      expect((part1.props as any).children).toBe('Red');
    } else {
      throw new Error('Expected a valid React element for "part1"');
    }

    const part2 = result[1];
    if (React.isValidElement(part2)) {
      expect((part2.props as any).className).toBe('');
      expect((part2.props as any).children).toBe(' then normal.');
    } else {
      throw new Error('Expected a valid React element for "part2"');
    }
  });
});