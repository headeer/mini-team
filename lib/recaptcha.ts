interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

export async function verifyRecaptcha(token: string, expectedAction?: string): Promise<{
  success: boolean;
  score: number;
  error?: string;
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not found in environment variables');
    return { success: false, score: 0, error: 'reCAPTCHA not configured' };
  }

  if (!token) {
    return { success: false, score: 0, error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return { 
        success: false, 
        score: 0, 
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}` 
      };
    }

    // Check if the action matches (if provided)
    if (expectedAction && data.action !== expectedAction) {
      console.error(`reCAPTCHA action mismatch. Expected: ${expectedAction}, Got: ${data.action}`);
      return { 
        success: false, 
        score: data.score, 
        error: 'Action mismatch' 
      };
    }

    // Check score threshold (0.5 is a reasonable threshold for most use cases)
    const minScore = 0.5;
    if (data.score < minScore) {
      console.warn(`reCAPTCHA score too low: ${data.score} (minimum: ${minScore})`);
      return { 
        success: false, 
        score: data.score, 
        error: 'Score too low' 
      };
    }

    return { 
      success: true, 
      score: data.score 
    };

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return { 
      success: false, 
      score: 0, 
      error: 'Verification request failed' 
    };
  }
}

