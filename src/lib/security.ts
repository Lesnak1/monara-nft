/**
 * Security utilities for MONARA frontend
 * Includes input validation, sanitization, and rate limiting
 */

import DOMPurify from 'isomorphic-dompurify';
import { isAddress } from 'viem';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

export interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

class SecurityUtils {
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  /**
   * Sanitize HTML content to prevent XSS
   */
  sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  /**
   * Validate and sanitize user input
   */
  validateInput(input: string, maxLength: number = 100): ValidationResult {
    if (!input || input.length === 0) {
      return { isValid: false, error: 'Input cannot be empty' };
    }

    if (input.length > maxLength) {
      return { isValid: false, error: `Input too long (max ${maxLength} characters)` };
    }

    // Remove dangerous characters
    const sanitized = input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim();

    if (sanitized.length === 0) {
      return { isValid: false, error: 'Input contains only invalid characters' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate Ethereum address
   */
  validateAddress(address: string): ValidationResult {
    if (!address) {
      return { isValid: false, error: 'Address cannot be empty' };
    }

    if (!isAddress(address)) {
      return { isValid: false, error: 'Invalid Ethereum address format' };
    }

    return { isValid: true, sanitized: address.toLowerCase() };
  }

  /**
   * Validate token amount
   */
  validateTokenAmount(amount: string): ValidationResult {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      return { isValid: false, error: 'Amount must be a valid number' };
    }

    if (numAmount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (numAmount > 1000) {
      return { isValid: false, error: 'Amount too large' };
    }

    // Check for reasonable decimal places
    const decimalPlaces = (amount.split('.')[1] || '').length;
    if (decimalPlaces > 18) {
      return { isValid: false, error: 'Too many decimal places' };
    }

    return { isValid: true, sanitized: numAmount.toString() };
  }

  /**
   * Rate limiting implementation
   */
  checkRateLimit(identifier: string, options: RateLimitOptions): boolean {
    const key = options.keyGenerator ? options.keyGenerator(identifier) : identifier;
    const now = Date.now();
    const record = this.rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs
      });
      return true;
    }

    if (record.count >= options.maxAttempts) {
      return false; // Rate limit exceeded
    }

    // Increment count
    record.count++;
    this.rateLimitStore.set(key, record);
    return true;
  }

  /**
   * Get remaining attempts for rate limiting
   */
  getRemainingAttempts(identifier: string, options: RateLimitOptions): number {
    const key = options.keyGenerator ? options.keyGenerator(identifier) : identifier;
    const record = this.rateLimitStore.get(key);
    
    if (!record || Date.now() > record.resetTime) {
      return options.maxAttempts;
    }

    return Math.max(0, options.maxAttempts - record.count);
  }

  /**
   * Validate transaction parameters
   */
  validateMintParams(params: {
    type: 'neural' | 'quantum';
    recipient?: string;
  }): ValidationResult {
    const { type, recipient } = params;

    // Validate mint type
    if (!['neural', 'quantum'].includes(type)) {
      return { isValid: false, error: 'Invalid mint type' };
    }

    // Validate recipient if provided
    if (recipient) {
      const addressValidation = this.validateAddress(recipient);
      if (!addressValidation.isValid) {
        return addressValidation;
      }
    }

    return { isValid: true };
  }

  /**
   * Sanitize contract interaction data
   */
  sanitizeContractData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeHtml(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeContractData(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Sanitize key
        const cleanKey = key.replace(/[^\w\-_]/g, '');
        if (cleanKey.length > 0) {
          sanitized[cleanKey] = this.sanitizeContractData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Generate nonce for preventing replay attacks
   */
  generateNonce(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}`;
  }

  /**
   * Validate URL to prevent open redirects
   */
  validateUrl(url: string, allowedDomains: string[] = []): ValidationResult {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS or HTTP for localhost
      if (urlObj.protocol !== 'https:' && 
          !(urlObj.protocol === 'http:' && urlObj.hostname === 'localhost')) {
        return { isValid: false, error: 'Only HTTPS URLs are allowed' };
      }

      // Check allowed domains if specified
      if (allowedDomains.length > 0) {
        const isAllowed = allowedDomains.some(domain => 
          urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
        );
        
        if (!isAllowed) {
          return { isValid: false, error: 'Domain not allowed' };
        }
      }

      return { isValid: true, sanitized: url };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  /**
   * Clean up rate limit store (call periodically)
   */
  cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}

// Export singleton instance
export const securityUtils = new SecurityUtils();

// Export error types
export class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export class RateLimitError extends SecurityError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT_EXCEEDED');
  }
}

export class ValidationError extends SecurityError {
  constructor(message: string) {
    super(message, 'VALIDATION_FAILED');
  }
}

// Rate limiting presets
export const RATE_LIMITS = {
  MINT: { maxAttempts: 5, windowMs: 60 * 1000 }, // 5 mints per minute
  WALLET_CONNECT: { maxAttempts: 10, windowMs: 5 * 60 * 1000 }, // 10 attempts per 5 minutes
  API_CALLS: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 calls per minute
} as const; 