import { promisify as _p } from "util";
import crypto from "crypto";

/**
 * Generate a secure random number between 0 and 1. Asynchronous.
 * @param {Number} bytes Optional: The amount of bytes to use in generation. Default: 8
 */
export async function srand(bytes: number = 8): Promise<number> {
    return parseInt((await _p(crypto.randomBytes)(bytes)).toString("hex"), 16) / Math.pow(256, bytes);
}

/**
 * Generate a secure random number between 0 and 1. Synchronous.
 * @param {Number} bytes Optional: The amount of bytes to use in generation. Default: 8
 */
export function srandSync(bytes: number = 8): number {
    return parseInt(crypto.randomBytes(bytes).toString("hex"), 16) / Math.pow(256, bytes);
}

/**
 * Generate a random integer in a range. Asynchronous.
 * @param {Number} max The upper value of the range.
 * @param {Number} min Optional: The lower value of the range. Default: 0
 * @param {Number} bytes Optional: The byte length used for the generator. Default: 8
 */
export async function inRange(max: number, min: number = 0, bytes?: number): Promise<number> {
    return Math.round((await srand(bytes)) * (max - min) + min);
}

/**
 * Generate a random integer in a range. Synchronous.
 * @param {Number} max The upper value of the range.
 * @param {Number} min Optional: The lower value of the range. Default: 0
 * @param {Number} bytes Optional: The byte length used for the generator. Default: 8
 */
export function inRangeSync(max: number, min: number = 0, bytes?: number): number {
    return Math.round(srandSync(bytes) * (max - min) + min);
}
