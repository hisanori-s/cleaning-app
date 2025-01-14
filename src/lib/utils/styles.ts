/**
 * スタイリングユーティリティ
 * Tailwind CSSとclsxを組み合わせたクラス名の生成を行います
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 複数のクラス名を結合し、Tailwindのクラスの衝突を解決します
 * @param inputs - 結合したいクラス名の配列
 * @returns 最適化された結合済みクラス名
 * @example
 * cn('px-2 py-1', 'bg-blue-500', condition && 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 